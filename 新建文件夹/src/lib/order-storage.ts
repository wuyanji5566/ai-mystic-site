"use client";

export type ManualOrderStatus = "待核对" | "已付款" | "已解锁" | "异常";

export type ManualOrder = {
  id: string;
  customerName: string;
  wechat: string;
  amount: string;
  reportLink: string;
  status: ManualOrderStatus;
  note: string;
  createdAt: string;
  updatedAt: string;
};

const ORDER_STORAGE_KEY = "ai-mystic-site:manual-orders";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function createOrderId() {
  const date = new Date();
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
    String(date.getHours()).padStart(2, "0"),
    String(date.getMinutes()).padStart(2, "0"),
  ].join("");

  return `XJ${stamp}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function getManualOrders() {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(ORDER_STORAGE_KEY);
    if (!raw) return [];
    const orders = JSON.parse(raw) as ManualOrder[];
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

export function saveManualOrder(order: Omit<ManualOrder, "createdAt" | "updatedAt">) {
  const now = new Date().toISOString();
  const current = getManualOrders();
  const previous = current.find((item) => item.id === order.id);
  const nextOrder: ManualOrder = {
    ...order,
    createdAt: previous?.createdAt || now,
    updatedAt: now,
  };

  const nextOrders = [nextOrder, ...current.filter((item) => item.id !== order.id)].slice(0, 100);
  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(nextOrders));
  return nextOrder;
}

export function deleteManualOrder(id: string) {
  const nextOrders = getManualOrders().filter((order) => order.id !== id);
  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(nextOrders));
}
