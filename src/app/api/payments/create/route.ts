import { z } from "zod";
import {
  createManualOrder,
  createOrderId,
  isOrderStoreConfigured,
} from "@/lib/supabase-orders";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

const paymentOrderSchema = z.object({
  reportId: z.string().trim().min(1).max(120),
  productType: z.enum(["full_report", "followup_room"]),
  productName: z.string().trim().min(1).max(80),
  amount: z.string().trim().min(1).max(20),
  reportLink: z.string().trim().max(500).optional(),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`payment-create:${ip}`, 20, 60 * 60 * 1000);

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfterSeconds);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "请求 JSON 格式不正确。" }, { status: 400 });
  }

  const parsed = paymentOrderSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "订单信息不完整。" }, { status: 400 });
  }

  if (!isOrderStoreConfigured()) {
    return Response.json(
      {
        mode: "manual",
        unlockMode: "admin_confirmed",
        orderId: createOrderId(),
        status: "pending",
        message: "Supabase 未配置，订单无法保存。请联系客服人工核对付款截图。",
        requiredKeys: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
      },
      { status: 503 },
    );
  }

  const order = await createManualOrder({
    ...parsed.data,
    orderId: createOrderId(),
    status: "pending",
  });

  return Response.json({
    mode: "manual",
    unlockMode: "admin_confirmed",
    orderId: order.orderId,
    status: order.status,
    message: "订单已创建。用户付款备注填写订单号，后台确认已付款后才能解锁对应服务。",
  });
}
