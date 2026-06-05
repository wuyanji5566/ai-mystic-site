import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { MysticInput, MysticProfile } from "@/lib/mystic";

export type ReportMode = "ai" | "demo";
export type OrderStatus = "pending" | "paid" | "failed" | "cancelled" | "expired";
export type OrderProduct = "full_report" | "followup_room";

export type StoredReport = {
  reportId: string;
  title: string;
  createdAt: string;
  input: MysticInput;
  profile: MysticProfile;
  freeReport: string;
  fullReport: string;
  mode: ReportMode;
  statusMessage: string;
};

export type StoredOrder = {
  orderId: string;
  requestKey?: string;
  reportId: string;
  productType: OrderProduct;
  productName: string;
  amount: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
};

type ReportDatabase = Record<string, StoredReport>;
type OrderDatabase = Record<string, StoredOrder>;

const dataDirectory = path.join(process.cwd(), "data");
const reportsPath = path.join(dataDirectory, "reports.json");
const ordersPath = path.join(dataDirectory, "orders.json");

let mutationQueue: Promise<void> = Promise.resolve();

async function ensureStore() {
  await mkdir(dataDirectory, { recursive: true });
  await Promise.all([
    ensureJsonFile(reportsPath),
    ensureJsonFile(ordersPath),
  ]);
}

async function ensureJsonFile(filePath: string) {
  try {
    await readFile(filePath, "utf8");
  } catch {
    await writeFile(filePath, "{}\n", "utf8");
  }
}

async function readDatabase<T extends object>(filePath: string): Promise<T> {
  await ensureStore();

  try {
    return JSON.parse(await readFile(filePath, "utf8")) as T;
  } catch (error) {
    console.error(`Failed to read ${filePath}:`, error);
    return {} as T;
  }
}

async function writeDatabase(filePath: string, value: object) {
  await ensureStore();
  const temporaryPath = `${filePath}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporaryPath, filePath);
}

async function withMutationLock<T>(task: () => Promise<T>) {
  const result = mutationQueue.then(task, task);
  mutationQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

export function createReportId() {
  return `RPT-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 6).toUpperCase()}`;
}

export function createOrderId() {
  return `XJ-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 6).toUpperCase()}`;
}

export async function saveStoredReport(report: StoredReport) {
  return withMutationLock(async () => {
    const reports = await readDatabase<ReportDatabase>(reportsPath);
    reports[report.reportId] = report;
    await writeDatabase(reportsPath, reports);
    return report;
  });
}

export async function getStoredReport(reportId: string) {
  const reports = await readDatabase<ReportDatabase>(reportsPath);
  return reports[reportId] ?? null;
}

export async function listStoredReports() {
  const reports = await readDatabase<ReportDatabase>(reportsPath);
  return Object.values(reports).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveStoredOrder(order: StoredOrder) {
  return withMutationLock(async () => {
    const orders = await readDatabase<OrderDatabase>(ordersPath);
    const existing = order.requestKey
      ? Object.values(orders).find(
          (candidate) =>
            candidate.requestKey === order.requestKey &&
            candidate.reportId === order.reportId &&
            candidate.productType === order.productType,
        )
      : null;

    if (existing) return existing;

    orders[order.orderId] = order;
    await writeDatabase(ordersPath, orders);
    return order;
  });
}

export async function getStoredOrder(orderId: string) {
  const orders = await readDatabase<OrderDatabase>(ordersPath);
  return orders[orderId] ?? null;
}

export async function listStoredOrders() {
  const orders = await readDatabase<OrderDatabase>(ordersPath);
  return Object.values(orders).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateStoredOrder(
  orderId: string,
  patch: Partial<Pick<StoredOrder, "status" | "paidAt">>,
) {
  return withMutationLock(async () => {
    const orders = await readDatabase<OrderDatabase>(ordersPath);
    const current = orders[orderId];

    if (!current) return null;

    const updated: StoredOrder = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    orders[orderId] = updated;
    await writeDatabase(ordersPath, orders);
    return updated;
  });
}

export function isPaidOrderForReport(
  order: StoredOrder | null,
  reportId: string,
  productType: OrderProduct = "full_report",
) {
  return Boolean(
    order &&
      order.reportId === reportId &&
      order.productType === productType &&
      order.status === "paid",
  );
}
