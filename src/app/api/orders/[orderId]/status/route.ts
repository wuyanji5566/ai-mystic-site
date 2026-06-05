import { getStoredOrder } from "@/lib/mvp-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const order = await getStoredOrder(orderId);

  if (!order) {
    return Response.json({ error: "订单不存在。" }, { status: 404 });
  }

  return Response.json({
    orderId: order.orderId,
    reportId: order.reportId,
    productType: order.productType,
    status: order.status,
    paidAt: order.paidAt || null,
    unlocked: order.status === "paid",
  });
}
