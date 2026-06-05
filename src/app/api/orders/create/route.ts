import { z } from "zod";
import {
  createOrderId,
  getStoredReport,
  saveStoredOrder,
  type OrderProduct,
} from "@/lib/mvp-store";

const orderSchema = z.object({
  reportId: z.string().trim().min(6),
  productType: z.enum(["full_report", "followup_room"]).default("full_report"),
  requestKey: z.string().trim().min(8).max(100).optional(),
});

const productConfig: Record<
  OrderProduct,
  { productName: string; amount: string }
> = {
  full_report: { productName: "完整深度报告", amount: "19.9" },
  followup_room: { productName: "四维追问室", amount: "9.9" },
};

export async function POST(request: Request) {
  try {
    const body = orderSchema.parse(await request.json());
    const report = await getStoredReport(body.reportId);

    if (!report) {
      return Response.json({ error: "报告不存在，请重新生成。" }, { status: 404 });
    }

    const now = new Date().toISOString();
    const product = productConfig[body.productType];
    const order = await saveStoredOrder({
      orderId: createOrderId(),
      requestKey: body.requestKey,
      reportId: body.reportId,
      productType: body.productType,
      productName: product.productName,
      amount: product.amount,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    return Response.json({
      order,
      payment: {
        method: "wechat_manual",
        amount: order.amount,
        qrPath: "/payments/wechat-pay.jpg",
        instruction: `微信付款时请备注订单号 ${order.orderId}`,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "订单参数不正确。" }, { status: 400 });
    }
    console.error("Create order failed:", error);
    return Response.json({ error: "订单创建失败，请稍后重试。" }, { status: 500 });
  }
}
