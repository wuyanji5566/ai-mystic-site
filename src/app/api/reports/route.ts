import { cookies } from "next/headers";
import { z } from "zod";
import { createCloudReport, isSupabaseConfigured, listCloudReports } from "@/lib/supabase-reports";
import { adminSessionCookieName, isValidAdminSession } from "@/lib/admin-auth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

const reportSchema = z.object({
  input: z.object({
    name: z.string(),
    gender: z.string(),
    birthDate: z.string(),
    birthTime: z.string(),
    birthTimeNote: z.string().optional(),
    birthPlace: z.string(),
    calendarType: z.enum(["solar", "lunar"]),
    mbtiType: z.string().default("不确定"),
    mbtiCertainty: z.enum(["known", "estimated", "unknown"]).default("unknown"),
    focus: z.string(),
  }),
  profile: z.object({
    zodiac: z.string(),
    westernSign: z.string(),
    yearPillar: z.string(),
    birthSummary: z.string(),
  }),
  report: z.string(),
  mode: z.enum(["ai", "demo"]),
  statusMessage: z.string(),
});

export async function GET() {
  const cookieStore = await cookies();

  if (!isValidAdminSession(cookieStore.get(adminSessionCookieName)?.value)) {
    return Response.json({ error: "需要管理员登录后查看云端报告列表。" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return Response.json(
      { error: "Supabase 未配置，当前只能使用浏览器本地保存。" },
      { status: 503 },
    );
  }

  try {
    return Response.json({ reports: await listCloudReports(), storage: "cloud" });
  } catch (error) {
    console.error("List cloud reports failed:", error);
    return Response.json(
      { error: "读取云端报告失败，已回退到本地报告。" },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`save-report:${ip}`, 12, 60 * 60 * 1000);

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfterSeconds);
  }

  if (!isSupabaseConfigured()) {
    return Response.json(
      { error: "Supabase 未配置，当前只能使用浏览器本地保存。" },
      { status: 503 },
    );
  }

  try {
    const body = reportSchema.parse(await request.json());
    return Response.json({
      report: await createCloudReport(body),
      storage: "cloud",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: error.issues[0]?.message || "报告数据格式不正确。" },
        { status: 400 },
      );
    }

    console.error("Create cloud report failed:", error);
    return Response.json(
      { error: "保存云端报告失败，已回退到本地保存。" },
      { status: 502 },
    );
  }
}
