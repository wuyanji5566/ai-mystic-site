import { z } from "zod";
import {
  getManualOrder,
  updateManualOrder,
  isOrderStoreConfigured,
} from "@/lib/supabase-orders";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

const verifySchema = z.object({
  orderId: z.string().trim().min(6).max(40),
  reportId: z.string().trim().min(1).max(120),
  productType: z.enum(["full_report", "followup_room"]),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`payment-verify:${ip}`, 20, 60 * 60 * 1000);

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfterSeconds);
  }

  if (!isOrderStoreConfigured()) {
    return Response.json(
      { unlocked: false, error: "订单系统未配置 Supabase，暂时只能联系客服人工核对。" },
      { status: 503 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ unlocked: false, error: "请求 JSON 格式不正确。" }, { status: 400 });
  }

  const parsed = verifySchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ unlocked: false, error: "订单信息不完整。" }, { status: 400 });
  }

  const order = await getManualOrder(parsed.data.orderId);

  if (
    !order ||
    order.reportId !== parsed.data.reportId ||
    order.productType !== parsed.data.productType
  ) {
    return Response.json({ unlocked: false, error: "未找到匹配的订单。" }, { status: 404 });
  }

  if (order.status !== "paid" && order.status !== "unlocked") {
    return Response.json({
      unlocked: false,
      status: order.status,
      message: "订单还未被后台确认付款，请付款后联系站长核对。",
    });
  }

  if (order.status === "paid") {
    await updateManualOrder(order.orderId, { status: "unlocked" });
  }

  return Response.json({ unlocked: true, status: "unlocked" });
}
