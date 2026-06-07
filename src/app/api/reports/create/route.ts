import { z } from "zod";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import {
  generateMysticReport,
  generateQuickMysticReport,
  mysticRequestSchema,
} from "@/lib/report-engine";
import {
  createReportId,
  saveStoredReport,
  updateStoredReportContent,
} from "@/lib/mvp-store";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`create-report:${ip}`, 6, 60 * 60 * 1000);

  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  try {
    const input = mysticRequestSchema.parse(await request.json());
    const generated = generateQuickMysticReport(input);
    const reportId = createReportId();
    const createdAt = new Date().toISOString();

    await saveStoredReport({
      reportId,
      title: `${input.name}的四维人生说明书`,
      createdAt,
      input,
      profile: generated.profile,
      freeReport: generated.freeReport,
      fullReport: generated.fullReport,
      mode: generated.mode,
      statusMessage: generated.statusMessage,
    });

    void generateMysticReport(input)
      .then((complete) =>
        updateStoredReportContent(reportId, {
          fullReport: complete.fullReport,
          mode: complete.mode,
          statusMessage: complete.statusMessage,
        }),
      )
      .catch((error) => {
        console.error("Background report generation failed:", error);
      });

    return Response.json({
      reportId,
      createdAt,
      profile: generated.profile,
      report: generated.freeReport,
      freeReport: generated.freeReport,
      lockedSections: [
        "事业定位与适合赛道",
        "财富增长方式与副业方向",
        "亲密关系风险点",
        "未来一年关键阶段",
        "未来 30 天行动计划",
        "专属继续追问入口",
      ],
      mode: generated.mode,
      statusMessage: generated.statusMessage,
      unlockRequired: true,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: error.issues[0]?.message || "提交信息不完整" },
        { status: 400 },
      );
    }

    console.error("Create report failed:", error);
    return Response.json(
      { error: "报告生成失败，请稍后重试。" },
      { status: 500 },
    );
  }
}
