import "server-only";

import OpenAI from "openai";
import { z } from "zod";
import {
  buildDemoReport,
  buildFreeReport,
  buildMysticProfile,
  lunarToSolarDate,
  type MysticInput,
} from "@/lib/mystic";
import { buildMysticPrompt } from "@/lib/prompts";

export const mysticRequestSchema = z.object({
  name: z.string().trim().max(30, "称呼不要超过 30 个字").transform((value) => value || "匿名用户"),
  gender: z.string().trim().min(1, "请选择性别").max(20),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "出生日期格式不正确"),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, "出生时间格式不正确"),
  birthTimeNote: z.string().trim().max(80).optional(),
  birthPlace: z.string().trim().min(1, "请填写出生地点").max(60),
  calendarType: z.enum(["solar", "lunar"]),
  lunarLeapMonth: z.boolean().optional(),
  mbtiType: z.string().trim().min(1).max(20),
  mbtiCertainty: z.enum(["known", "estimated", "unknown"]),
  focus: z.string().trim().min(4, "请写下你最想了解的方向").max(300),
}).superRefine((input, context) => {
  if (input.calendarType !== "lunar") return;

  const [year, month, day] = input.birthDate.split("-").map(Number);
  if (!lunarToSolarDate(year, month, day, input.lunarLeapMonth)) {
    context.addIssue({
      code: "custom",
      path: ["birthDate"],
      message: input.lunarLeapMonth
        ? "该年份没有这个闰月，请取消“闰月”或重新选择。"
        : "该农历日期不存在，请重新选择日期。",
    });
  }
});

export type GeneratedReport = Awaited<ReturnType<typeof generateMysticReport>>;

export async function generateMysticReport(input: MysticInput) {
  const profile = buildMysticProfile(input);
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  let fullReport = buildDemoReport(input, profile);
  let mode: "ai" | "demo" = "demo";
  let statusMessage = "当前使用结构化演示报告，内容仍可完整体验。";

  if (apiKey && !apiKey.includes("你的")) {
    const client = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL?.trim() || undefined,
      maxRetries: 1,
      timeout: 60000,
    });

    try {
      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL?.trim() || "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "你是严谨、有温度的中文个人成长报告顾问。严格遵守用户要求的 12 模块结构，避免重复和绝对化判断。",
          },
          { role: "user", content: buildMysticPrompt(input, profile) },
        ],
        temperature: 0.72,
        max_tokens: 5200,
      });
      const content = completion.choices[0]?.message?.content?.trim();

      if (content) {
        fullReport = content;
        mode = "ai";
        statusMessage = "四维人生画像已生成。";
      }
    } catch (error) {
      console.error("AI report generation failed, using demo report:", error);
      statusMessage = "AI 服务暂时繁忙，已使用结构化备用报告。";
    }
  }

  return {
    profile,
    freeReport: buildFreeReport(input, profile),
    fullReport,
    mode,
    statusMessage,
  };
}
