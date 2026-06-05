import {
  getStoredOrder,
  getStoredReport,
  isPaidOrderForReport,
} from "@/lib/mvp-store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const report = await getStoredReport(id);

  if (!report) {
    return Response.json({ error: "未找到报告。" }, { status: 404 });
  }

  const orderId = new URL(request.url).searchParams.get("orderId")?.trim() || "";
  const order = orderId ? await getStoredOrder(orderId) : null;
  const unlocked = isPaidOrderForReport(order, id, "full_report");

  return Response.json({
    report: {
      id: report.reportId,
      reportId: report.reportId,
      title: report.title,
      createdAt: report.createdAt,
      input: report.input,
      profile: report.profile,
      report: unlocked ? report.fullReport : report.freeReport,
      freeReport: report.freeReport,
      fullReport: unlocked ? report.fullReport : undefined,
      mode: report.mode,
      statusMessage: report.statusMessage,
      unlocked,
      orderId: unlocked ? orderId : undefined,
    },
    storage: "server",
  });
}
