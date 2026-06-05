import { timingSafeEqual } from "node:crypto";
import { getStoredOrder, updateStoredOrder } from "@/lib/mvp-store";

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const configuredKey =
    process.env.ADMIN_KEY?.trim() || process.env.ADMIN_PASSWORD?.trim();

  if (!configuredKey) {
    return Response.json(
      { error: "服务器尚未配置 ADMIN_KEY。" },
      { status: 503 },
    );
  }

  const providedKey =
    request.headers.get("x-admin-key")?.trim() ||
    ((await request.json().catch(() => ({}))) as { adminKey?: string }).adminKey?.trim() ||
    "";

  if (!providedKey || !safeEqual(providedKey, configuredKey)) {
    return Response.json({ error: "管理员密钥不正确。" }, { status: 401 });
  }

  const { orderId } = await params;
  const order = await getStoredOrder(orderId);

  if (!order) {
    return Response.json({ error: "订单不存在。" }, { status: 404 });
  }

  const now = new Date().toISOString();
  const updated = await updateStoredOrder(orderId, {
    status: "paid",
    paidAt: now,
  });

  return Response.json({ order: updated });
}
