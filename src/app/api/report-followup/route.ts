import OpenAI from "openai";
import { z } from "zod";
import { getStoredOrder, getStoredReport, isPaidOrderForReport } from "@/lib/mvp-store";
import { buildFollowupPrompt } from "@/lib/prompts";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

const followupSchema = z.object({
  reportId: z.string().trim().min(6),
  orderId: z.string().trim().min(6),
  question: z.string().trim().min(2, "请先输入想深入的问题").max(300),
});

function buildDemoFollowup(question: string) {
  return [
    "【直接结论】",
    `你这次真正想解决的是“${question}”。先不要急着寻找唯一答案，更有效的做法是把问题变成一个能在 30 天内验证的现实选择。`,
    "",
    "【四维交叉依据】",
    "八字节律提醒你关注发力节奏，紫微结构关注你所在的位置与资源，星座视角揭示你的情绪需求，MBTI 则解释你如何判断和执行。四者放在一起时，最常见的卡点不是能力不够，而是想法、位置、情绪反馈和行动周期没有对齐。",
    "",
    "【现实场景】",
    "你可能会在信息还不完整时继续观察，也可能因为现实反馈太慢而临时换方向。短期看是在寻找更好答案，长期看却会打断积累。",
    "",
    "【行动建议】",
    "1. 把问题缩小成一个 30 天内能验证的目标。\n2. 写清楚成功标准，不用情绪判断进度。\n3. 每周只保留一个主动作。\n4. 找三位真实对象获得反馈。\n5. 第 30 天根据结果决定继续、调整或停止。",
    "",
    "【未来 30 天小计划】",
    "第 1 周定义问题；第 2 周完成最小成果；第 3 周获得真实反馈；第 4 周整理结论并确定下一步。",
    "",
    "【边界提醒】",
    "本内容用于自我探索与成长复盘，不替代医疗、法律、投资或其他专业判断。",
  ].join("\n");
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`report-followup:${ip}`, 10, 60 * 60 * 1000);
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  try {
    const input = followupSchema.parse(await request.json());
    const [report, order] = await Promise.all([
      getStoredReport(input.reportId),
      getStoredOrder(input.orderId),
    ]);

    if (!report) {
      return Response.json({ error: "报告不存在。" }, { status: 404 });
    }
    if (!isPaidOrderForReport(order, input.reportId, "followup_room")) {
      return Response.json(
        { error: "追问订单尚未完成付款核验。" },
        { status: 403 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey || apiKey.includes("你的")) {
      return Response.json({
        answer: buildDemoFollowup(input.question),
        mode: "demo",
        statusMessage: "当前使用结构化备用解析。",
      });
    }

    try {
      const client = new OpenAI({
        apiKey,
        baseURL: process.env.OPENAI_BASE_URL?.trim() || undefined,
        timeout: 45000,
        maxRetries: 1,
      });
      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL?.trim() || "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "你是严谨、有温度的中文个人成长咨询顾问。",
          },
          {
            role: "user",
            content: buildFollowupPrompt({
              question: input.question,
              reportTitle: report.title,
              report: report.fullReport,
              profile: report.profile,
            }),
          },
        ],
        temperature: 0.7,
        max_tokens: 2200,
      });
      const answer = completion.choices[0]?.message?.content?.trim();
      if (answer) {
        return Response.json({
          answer,
          mode: "ai",
          statusMessage: "专属追问解析已生成。",
        });
      }
    } catch (error) {
      console.error("Follow-up generation failed:", error);
    }

    return Response.json({
      answer: buildDemoFollowup(input.question),
      mode: "demo",
      statusMessage: "AI 服务暂时繁忙，已使用结构化备用解析。",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues[0]?.message }, { status: 400 });
    }
    console.error("Report follow-up failed:", error);
    return Response.json({ error: "追问生成失败，请稍后重试。" }, { status: 500 });
  }
}
