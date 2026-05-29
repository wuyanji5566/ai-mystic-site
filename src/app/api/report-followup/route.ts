import OpenAI from "openai";
import { z } from "zod";
import { buildFollowupPrompt } from "@/lib/prompts";

const profileSchema = z.object({
  zodiac: z.string().min(1).max(20),
  westernSign: z.string().min(1).max(20),
  yearPillar: z.string().min(1).max(20),
  birthSummary: z.string().min(1).max(500),
});

const followupRequestSchema = z.object({
  reportTitle: z.string().trim().min(1).max(120),
  report: z.string().trim().min(20).max(20000),
  question: z.string().trim().min(2, "请先输入想深化的问题").max(300, "问题不要超过 300 个字"),
  profile: profileSchema,
});

function buildDemoFollowup(question: string) {
  return [
    "【深化结论】",
    `你这次想看的重点是“${question}”。从自我探索角度看，最重要的不是马上得到一个确定答案，而是把问题拆成可观察、可行动、可复盘的步骤。`,
    "",
    "【命盘观察角度】",
    "原报告里的生肖、星座和年柱只能提供入门观察维度，不能替代真实经历和专业判断。你可以把它们当作提醒：看见自己的惯性，再决定下一步怎么调整。",
    "",
    "【现实行动建议】",
    "1. 先写下你现在最纠结的 1 个具体问题，不要一次处理太多方向。",
    "2. 把问题拆成“我能控制”和“我不能控制”两栏。",
    "3. 选一个 7 天内能完成的小动作，先用行动换反馈。",
    "4. 找一个可信的人复盘，而不是只在脑子里反复想。",
    "5. 如果涉及金钱、健康、法律或婚姻重大选择，请咨询对应专业人士。",
    "",
    "【未来 30 天小计划】",
    "第 1 周：整理问题和现状，减少情绪化判断。",
    "第 2 周：完成一个低风险尝试，记录真实反馈。",
    "第 3 周：根据反馈调整方向，不急着下结论。",
    "第 4 周：形成下一阶段计划，并决定是否需要专业帮助。",
    "",
    "【提醒】",
    "这份深化内容用于娱乐和自我探索，不构成现实决策建议。",
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "请求 JSON 格式不正确。" }, { status: 400 });
    }

    const input = followupRequestSchema.parse(body);
    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!apiKey || apiKey === "你的 OpenAI API Key" || apiKey === "你的 DeepSeek API Key") {
      return Response.json({
        answer: buildDemoFollowup(input.question),
        mode: "demo",
        statusMessage: "未配置 AI API Key，已使用演示深化内容。",
      });
    }

    const client = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL?.trim() || undefined,
      maxRetries: 0,
      timeout: 10000,
    });

    try {
      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL?.trim() || "deepseek-v4-flash",
        messages: [
          {
            role: "system",
            content: "你是一个谨慎、温和、结构化的中文追问助手。",
          },
          {
            role: "user",
            content: buildFollowupPrompt(input),
          },
        ],
        temperature: 0.7,
      });

      const answer = completion.choices[0]?.message?.content?.trim();

      if (answer) {
        return Response.json({
          answer,
          mode: "ai",
          statusMessage: "DeepSeek 真实 AI 深化生成",
        });
      }
    } catch (aiError) {
      console.error("AI followup failed, falling back to demo answer:", aiError);
    }

    return Response.json({
      answer: buildDemoFollowup(input.question),
      mode: "demo",
      statusMessage: "AI 深化调用失败，已使用演示内容。",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: error.issues[0]?.message || "提交信息不完整" },
        { status: 400 },
      );
    }

    console.error("Report followup error:", error);
    return Response.json({ error: "服务器生成深化内容失败，请稍后再试。" }, { status: 500 });
  }
}
