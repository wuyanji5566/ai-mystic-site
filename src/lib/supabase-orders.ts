export type ManualOrderStatus = "pending" | "paid" | "unlocked" | "exception";
export type ManualOrderProduct = "full_report" | "followup_room";

export type ManualOrder = {
  orderId: string;
  reportId: string;
  productType: ManualOrderProduct;
  productName: string;
  amount: string;
  status: ManualOrderStatus;
  customerName: string;
  wechat: string;
  reportLink: string;
  note: string;
  createdAt: string;
  updatedAt: string;
};

type ManualOrderRow = {
  order_id: string;
  report_id: string;
  product_type: ManualOrderProduct;
  product_name: string;
  amount: string;
  status: ManualOrderStatus;
  customer_name: string | null;
  wechat: string | null;
  report_link: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type ManualOrderInput = {
  orderId: string;
  reportId: string;
  productType: ManualOrderProduct;
  productName: string;
  amount: string;
  customerName?: string;
  wechat?: string;
  reportLink?: string;
  note?: string;
  status?: ManualOrderStatus;
};

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isOrderStoreConfigured() {
  return Boolean(supabaseUrl && serviceRoleKey);
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

function getRestUrl(path: string) {
  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL is not configured");
  }

  return `${supabaseUrl}/rest/v1/${path}`;
}

function getHeaders(extra?: HeadersInit) {
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }

  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

function toManualOrder(row: ManualOrderRow): ManualOrder {
  return {
    orderId: row.order_id,
    reportId: row.report_id,
    productType: row.product_type,
    productName: row.product_name,
    amount: row.amount,
    status: row.status,
    customerName: row.customer_name || "",
    wechat: row.wechat || "",
    reportLink: row.report_link || "",
    note: row.note || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createManualOrder(input: ManualOrderInput) {
  const response = await fetch(getRestUrl("manual_orders"), {
    method: "POST",
    headers: getHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify({
      order_id: input.orderId,
      report_id: input.reportId,
      product_type: input.productType,
      product_name: input.productName,
      amount: input.amount,
      status: input.status || "pending",
      customer_name: input.customerName || "",
      wechat: input.wechat || "",
      report_link: input.reportLink || "",
      note: input.note || "",
    }),
  });

  if (!response.ok) {
    throw new Error(`Supabase create order failed: ${response.status}`);
  }

  const rows = (await response.json()) as ManualOrderRow[];
  return toManualOrder(rows[0]);
}

export async function listManualOrders() {
  const response = await fetch(
    getRestUrl("manual_orders?select=*&order=created_at.desc&limit=100"),
    { headers: getHeaders() },
  );

  if (!response.ok) {
    throw new Error(`Supabase list orders failed: ${response.status}`);
  }

  const rows = (await response.json()) as ManualOrderRow[];
  return rows.map(toManualOrder);
}

export async function getManualOrder(orderId: string) {
  const response = await fetch(
    getRestUrl(`manual_orders?select=*&order_id=eq.${encodeURIComponent(orderId)}&limit=1`),
    { headers: getHeaders() },
  );

  if (!response.ok) {
    throw new Error(`Supabase get order failed: ${response.status}`);
  }

  const rows = (await response.json()) as ManualOrderRow[];
  return rows[0] ? toManualOrder(rows[0]) : null;
}

export async function updateManualOrder(
  orderId: string,
  patch: Partial<Omit<ManualOrderInput, "orderId">>,
) {
  const body: Record<string, string> = {
    updated_at: new Date().toISOString(),
  };

  if (patch.reportId !== undefined) body.report_id = patch.reportId;
  if (patch.productType !== undefined) body.product_type = patch.productType;
  if (patch.productName !== undefined) body.product_name = patch.productName;
  if (patch.amount !== undefined) body.amount = patch.amount;
  if (patch.status !== undefined) body.status = patch.status;
  if (patch.customerName !== undefined) body.customer_name = patch.customerName;
  if (patch.wechat !== undefined) body.wechat = patch.wechat;
  if (patch.reportLink !== undefined) body.report_link = patch.reportLink;
  if (patch.note !== undefined) body.note = patch.note;

  const response = await fetch(
    getRestUrl(`manual_orders?order_id=eq.${encodeURIComponent(orderId)}`),
    {
      method: "PATCH",
      headers: getHeaders({ Prefer: "return=representation" }),
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase update order failed: ${response.status}`);
  }

  const rows = (await response.json()) as ManualOrderRow[];
  return rows[0] ? toManualOrder(rows[0]) : null;
}
