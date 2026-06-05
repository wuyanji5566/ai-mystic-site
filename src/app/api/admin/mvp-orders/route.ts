import { timingSafeEqual } from "node:crypto";
import { listStoredOrders } from "@/lib/mvp-store";

function authorized(request: Request) {
  const configured =
    process.env.ADMIN_KEY?.trim() || process.env.ADMIN_PASSWORD?.trim() || "";
  const provided = request.headers.get("x-admin-key")?.trim() || "";
  if (!configured || !provided) return false;
  const left = Buffer.from(configured);
  const right = Buffer.from(provided);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: "管理员密钥不正确。" }, { status: 401 });
  }
  return Response.json({ orders: await listStoredOrders() });
}
