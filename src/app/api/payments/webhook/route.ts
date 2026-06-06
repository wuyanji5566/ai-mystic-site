import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { getStoredOrder, updateStoredOrder } from "@/lib/mvp-store";

const webhookSchema = z.object({
  orderId: z.string().trim().min(6),
  status: z.literal("paid"),
  amount: z.union([z.string(), z.number()]).transform(String),
  transactionId: z.string().trim().min(4).max(160),
  provider: z.string().trim().min(2).max(40).default("payment_provider"),
});

function signaturesMatch(received: string, expected: string) {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  return (
    receivedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(receivedBuffer, expectedBuffer)
  );
}

export async function POST(request: Request) {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return Response.json({ error: "支付回调尚未配置。" }, { status: 503 });
  }

  const rawBody = await request.text();
  const receivedSignature =
    request.headers.get("x-payment-signature")?.trim() || "";
  const expectedSignature = createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (!receivedSignature || !signaturesMatch(receivedSignature, expectedSignature)) {
    return Response.json({ error: "支付回调签名无效。" }, { status: 401 });
  }

  try {
    const payload = webhookSchema.parse(JSON.parse(rawBody));
    const order = await getStoredOrder(payload.orderId);

    if (!order) {
      return Response.json({ error: "订单不存在。" }, { status: 404 });
    }
    if (Number(payload.amount).toFixed(2) !== Number(order.amount).toFixed(2)) {
      return Response.json({ error: "订单金额不匹配。" }, { status: 400 });
    }

    if (order.status === "paid") {
      return Response.json({ ok: true, order });
    }

    const paidAt = new Date().toISOString();
    const updated = await updateStoredOrder(order.orderId, {
      status: "paid",
      paidAt,
      paymentProvider: payload.provider,
      paymentTransactionId: payload.transactionId,
    });

    return Response.json({ ok: true, order: updated });
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      return Response.json({ error: "支付回调参数不正确。" }, { status: 400 });
    }
    console.error("Payment webhook failed:", error);
    return Response.json({ error: "支付回调处理失败。" }, { status: 500 });
  }
}
