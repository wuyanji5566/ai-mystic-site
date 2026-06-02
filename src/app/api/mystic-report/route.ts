import OpenAI from "openai";
import { z } from "zod";
import { buildMysticProfile, buildDemoReport } from "@/lib/mystic";
import { buildMysticPrompt } from "@/lib/prompts";

const mysticRequestSchema = z.object({
  name: z.string().trim().min(1, "请填写昵称").max(30, "昵称不要超过 30 个字"),
  gender: z.string().trim().min(1).max(20),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "出生日期格式不正确"),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, "出生时间格式不正确"),
  birthPlace: z.string().trim().min(1, "请填写出生地点").max(60, "地点不要超过 60 个字"),
  calendarType: z.enum(["solar", "lunar"]),
  mbtiType: z.string().trim().min(1).max(20),
  mbtiCertainty: z.enum(["known", "estimated", "unknown"]),
  focus: z.string().trim().min(4, "请写下你想看的方向").max(160, "关注方向不要超过 160 个字"),
});

function demoResponse(
  input: z.infer<typeof mysticRequestSchema>,
  statusMessage: string,
) {
  const profile = buildMysticProfile(input);

  return Response.json({
    profile,
    report: buildDemoReport(input, profile),
    mode: "demo",
    statusMessage,
  });
}

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: "请求 JSON 格式不正确，请检查提交内容。" },
        { status: 400 },
      );
    }

    const input = mysticRequestSchema.parse(body);
    const profile = buildMysticProfile(input);
    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!apiKey || apiKey === "你的 OpenAI API Key" || apiKey === "你的 DeepSeek API Key") {
      return demoResponse(input, "未配置 AI API Key，已使用演示报告。");
    }

    const client = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL?.trim() || undefined,
      maxRetries: 0,
      timeout: 25000,
    });

    try {
      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL?.trim() || "deepseek-v4-flash",
        messages: [
          {
            role: "system",
            content: "你是一个谨慎、温和、结构化的中文内容生成助手。",
          },
          {
            role: "user",
            content: buildMysticPrompt(input, profile),
          },
        ],
        temperature: 0.7,
        max_tokens: 2200,
      });

      const report = completion.choices[0]?.message?.content?.trim();

      if (report) {
        return Response.json({
          profile,
          report,
          mode: "ai",
          statusMessage: "玄机 AI 深度报告已生成",
        });
      }
    } catch (aiError) {
      console.error("AI provider failed, falling back to demo report:", aiError);
    }

    return demoResponse(input, "AI 调用失败，已使用演示报告。");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: error.issues[0]?.message || "提交信息不完整" },
        { status: 400 },
      );
    }

    console.error("Mystic report error:", error);
    return Response.json(
      { error: "服务器生成报告失败，请稍后再试。" },
      { status: 500 },
    );
  }
}
