import { getStoredOrder, updateStoredOrder } from "@/lib/mvp-store";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  if (process.env.SELF_SERVICE_UNLOCK?.trim().toLowerCase() === "false") {
    return Response.json(
      { error: "自助确认功能当前已关闭。" },
      { status: 403 },
    );
  }

  const { orderId } = await params;
  const order = await getStoredOrder(orderId);

  if (!order) {
    return Response.json({ error: "订单不存在。" }, { status: 404 });
  }

  if (order.status === "paid") {
    return Response.json({ order, unlocked: true });
  }

  if (order.status !== "pending") {
    return Response.json(
      { error: "当前订单状态无法自助确认，请重新创建订单。" },
      { status: 409 },
    );
  }

  const now = new Date().toISOString();
  const updated = await updateStoredOrder(orderId, {
    status: "paid",
    paidAt: now,
    paymentProvider: "self_service_confirmation",
    paymentTransactionId: `SELF-${orderId}`,
  });

  return Response.json({ order: updated, unlocked: true });
}
