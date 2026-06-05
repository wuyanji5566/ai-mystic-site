"use client";

import Link from "next/link";
import { useState } from "react";
import type { StoredOrder } from "@/lib/mvp-store";

export default function AdminOrdersPage() {
  const [adminKey, setAdminKey] = useState("");
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadOrders() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/mvp-orders", {
        headers: { "x-admin-key": adminKey },
        cache: "no-store",
      });
      const data = (await response.json()) as {
        orders?: StoredOrder[];
        error?: string;
      };
      if (!response.ok) throw new Error(data.error || "读取失败");
      setOrders(data.orders || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "读取失败");
    } finally {
      setLoading(false);
    }
  }

  async function markPaid(orderId: string) {
    setMessage("");
    const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}/mark-paid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({ adminKey }),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(data.error || "核验失败");
      return;
    }
    setMessage(`订单 ${orderId} 已确认付款。用户页面将在轮询后自动解锁。`);
    await loadOrders();
  }

  return (
    <main className="min-h-screen bg-[#080b0a] px-4 py-8 text-[#f6eddc]">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d7aa55]">
          Admin Order Console
        </p>
        <h1 className="mt-3 text-3xl font-black">订单核验后台</h1>
        <p className="mt-3 text-sm leading-7 text-[#bdb5a8]">
          输入 Render 环境变量中的 ADMIN_KEY。确认微信到账后，点击“标记已付款”，用户页面会自动解锁，不需要发送解锁码。
        </p>

        <div className="mt-6 grid gap-3 border border-[#d7aa55]/30 bg-[#111513] p-4 sm:grid-cols-[1fr_auto]">
          <input
            type="password"
            value={adminKey}
            onChange={(event) => setAdminKey(event.target.value)}
            placeholder="输入 ADMIN_KEY"
            className="h-12 border border-[#d7aa55]/25 bg-[#080b0a] px-4 outline-none focus:border-[#d7aa55]"
          />
          <button
            type="button"
            onClick={() => void loadOrders()}
            disabled={!adminKey || loading}
            className="h-12 bg-[#d7aa55] px-6 font-black text-[#17130c] disabled:opacity-40"
          >
            {loading ? "正在读取..." : "查询订单"}
          </button>
        </div>

        {message ? (
          <p className="mt-4 border border-[#d7aa55]/25 px-4 py-3 text-sm text-[#f2d99a]">
            {message}
          </p>
        ) : null}

        <div className="mt-5 grid gap-3">
          {orders.map((order) => (
            <article
              key={order.orderId}
              className="grid gap-4 border border-[#d7aa55]/24 bg-[#111513] p-4 lg:grid-cols-[1.2fr_1fr_auto]"
            >
              <div>
                <p className="text-xs text-[#9c9488]">订单号</p>
                <strong className="mt-1 block break-all text-[#f2d99a]">{order.orderId}</strong>
                <p className="mt-2 text-sm text-[#bdb5a8]">
                  {order.productName} · ¥{order.amount} · {order.status}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#9c9488]">报告 ID</p>
                <strong className="mt-1 block break-all text-sm">{order.reportId}</strong>
                <Link
                  href={`/report/${order.reportId}${order.status === "paid" ? `?orderId=${order.orderId}` : ""}`}
                  className="mt-2 inline-block text-sm text-[#d7aa55] underline"
                >
                  查看对应报告
                </Link>
              </div>
              <button
                type="button"
                onClick={() => void markPaid(order.orderId)}
                disabled={order.status === "paid"}
                className="h-11 self-center border border-[#d7aa55]/35 px-4 text-sm font-black text-[#f2d99a] disabled:opacity-40"
              >
                {order.status === "paid" ? "已确认付款" : "标记已付款"}
              </button>
            </article>
          ))}
          {!orders.length && !loading ? (
            <p className="border border-[#d7aa55]/18 bg-[#111513] px-4 py-8 text-center text-sm text-[#928a7d]">
              输入管理员密钥后查询订单。
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
