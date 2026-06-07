import { z } from "zod";
import {
  generateMysticReport,
  generateQuickMysticReport,
  mysticRequestSchema,
} from "@/lib/report-engine";
import {
  createOrderId,
  getStoredReport,
  saveStoredReport,
  saveStoredOrder,
  updateStoredReportContent,
  type OrderProduct,
} from "@/lib/mvp-store";

const orderSchema = z.object({
  reportId: z.string().trim().min(6),
  productType: z.enum(["full_report", "followup_room"]).default("full_report"),
  requestKey: z.string().trim().min(8).max(100).optional(),
  reportInput: mysticRequestSchema.optional(),
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
    let report = await getStoredReport(body.reportId);

    if (!report && body.reportInput) {
      const generated = generateQuickMysticReport(body.reportInput);
      const createdAt = new Date().toISOString();
      report = await saveStoredReport({
        reportId: body.reportId,
        title: `${body.reportInput.name}的四维人生说明书`,
        createdAt,
        input: body.reportInput,
        profile: generated.profile,
        freeReport: generated.freeReport,
        fullReport: generated.fullReport,
        mode: generated.mode,
        statusMessage: generated.statusMessage,
      });
      void generateMysticReport(body.reportInput)
        .then((complete) =>
          updateStoredReportContent(body.reportId, {
            fullReport: complete.fullReport,
            mode: complete.mode,
            statusMessage: complete.statusMessage,
          }),
        )
        .catch((error) => {
          console.error("Recovered report background generation failed:", error);
        });
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
      reportRecovered: Boolean(report),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "订单参数不正确。" }, { status: 400 });
    }
    console.error("Create order failed:", error);
    return Response.json({ error: "订单创建失败，请稍后重试。" }, { status: 500 });
  }
}
