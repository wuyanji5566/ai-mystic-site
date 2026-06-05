import { createHash } from "crypto";

export const adminSessionCookieName = "mystic_admin_session";

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() || "";
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || getAdminPassword();
}

export function isAdminAuthConfigured() {
  return Boolean(getAdminPassword());
}

export function getAdminSessionValue() {
  const password = getAdminPassword();
  const secret = getSessionSecret();

  if (!password || !secret) return "";

  return createHash("sha256")
    .update(`${password}:${secret}`)
    .digest("hex");
}

export function isValidAdminPassword(password: string) {
  return Boolean(getAdminPassword()) && password === getAdminPassword();
}

export function isValidAdminSession(sessionValue?: string) {
  const expected = getAdminSessionValue();
  return Boolean(expected && sessionValue && sessionValue === expected);
}
