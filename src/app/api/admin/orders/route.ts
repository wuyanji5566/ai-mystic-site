import { cookies } from "next/headers";
import { z } from "zod";
import { adminSessionCookieName, isValidAdminSession } from "@/lib/admin-auth";
import {
  createManualOrder,
  createOrderId,
  isOrderStoreConfigured,
  listManualOrders,
  updateManualOrder,
} from "@/lib/supabase-orders";

const orderSchema = z.object({
  orderId: z.string().trim().min(1).max(40).optional(),
  reportId: z.string().trim().min(1).max(120),
  productType: z.enum(["full_report", "followup_room"]),
  productName: z.string().trim().min(1).max(80),
  amount: z.string().trim().min(1).max(20),
  status: z.enum(["pending", "paid", "unlocked", "exception"]),
  customerName: z.string().trim().max(80).optional(),
  wechat: z.string().trim().max(80).optional(),
  reportLink: z.string().trim().max(500).optional(),
  note: z.string().trim().max(1000).optional(),
});

async function assertAdmin() {
  const cookieStore = await cookies();
  return isValidAdminSession(cookieStore.get(adminSessionCookieName)?.value);
}

export async function GET() {
  if (!(await assertAdmin())) {
    return Response.json({ error: "需要管理员登录。" }, { status: 401 });
  }

  if (!isOrderStoreConfigured()) {
    return Response.json({ error: "Supabase 未配置，无法读取订单。" }, { status: 503 });
  }

  return Response.json({ orders: await listManualOrders() });
}

export async function POST(request: Request) {
  if (!(await assertAdmin())) {
    return Response.json({ error: "需要管理员登录。" }, { status: 401 });
  }

  if (!isOrderStoreConfigured()) {
    return Response.json({ error: "Supabase 未配置，无法保存订单。" }, { status: 503 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "请求 JSON 格式不正确。" }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "订单信息不完整。" }, { status: 400 });
  }

  const orderId = parsed.data.orderId || createOrderId();
  const saved = parsed.data.orderId
    ? await updateManualOrder(orderId, parsed.data)
    : await createManualOrder({ ...parsed.data, orderId });

  return Response.json({ order: saved });
}
