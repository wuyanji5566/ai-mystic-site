import { cookies } from "next/headers";
import { z } from "zod";
import {
  adminSessionCookieName,
  getAdminSessionValue,
  isAdminAuthConfigured,
  isValidAdminPassword,
} from "@/lib/admin-auth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

const loginSchema = z.object({
  password: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`admin-login:${ip}`, 8, 15 * 60 * 1000);

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfterSeconds);
  }

  if (!isAdminAuthConfigured()) {
    return Response.json(
      { error: "ADMIN_PASSWORD is not configured on the server." },
      { status: 503 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "请求 JSON 格式不正确。" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);

  if (!parsed.success || !isValidAdminPassword(parsed.data.password)) {
    return Response.json({ error: "管理员密码不正确。" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(adminSessionCookieName, getAdminSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return Response.json({ ok: true });
}
