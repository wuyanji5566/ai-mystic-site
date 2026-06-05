"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type {
  ManualOrder,
  ManualOrderProduct,
  ManualOrderStatus,
} from "@/lib/supabase-orders";
import { siteConfig } from "@/lib/site-config";

type OrderFormState = {
  orderId: string;
  reportId: string;
  productType: ManualOrderProduct;
  productName: string;
  amount: string;
  status: ManualOrderStatus;
  customerName: string;
  wechat: string;
  reportLink: string;
  note: string;
};

const statusOptions: Array<{ value: ManualOrderStatus; label: string }> = [
  { value: "pending", label: "待核对" },
  { value: "paid", label: "已付款" },
  { value: "unlocked", label: "已解锁" },
  { value: "exception", label: "异常" },
];

const productOptions: Array<{ value: ManualOrderProduct; label: string; amount: string }> = [
  { value: "full_report", label: "完整深度报告", amount: siteConfig.fullReportPrice },
  { value: "followup_room", label: "四维追问室", amount: siteConfig.followupPrice },
];

function createEmptyForm(): OrderFormState {
  return {
    orderId: "",
    reportId: "",
    productType: "full_report",
    productName: "完整深度报告",
    amount: siteConfig.fullReportPrice,
    status: "pending",
    customerName: "",
    wechat: "",
    reportLink: "",
    note: "",
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getStatusLabel(status: ManualOrderStatus) {
  return statusOptions.find((item) => item.value === status)?.label || status;
}

export function AdminOrderPanel() {
  const [form, setForm] = useState<OrderFormState>(() => createEmptyForm());
  const [orders, setOrders] = useState<ManualOrder[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const paidCount = useMemo(
    () => orders.filter((order) => order.status === "paid" || order.status === "unlocked").length,
    [orders],
  );

  const totalAmount = useMemo(
    () =>
      orders
        .filter((order) => order.status === "paid" || order.status === "unlocked")
        .reduce((sum, order) => sum + Number(order.amount || 0), 0),
    [orders],
  );

  async function loadOrders() {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/orders");
      const data = (await response.json()) as { orders?: ManualOrder[]; error?: string };

      if (!response.ok) throw new Error(data.error || "读取订单失败。");

      setOrders(data.orders || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "读取订单失败。");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadOrders();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function updateForm<K extends keyof OrderFormState>(key: K, value: OrderFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setForm(createEmptyForm());
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { order?: ManualOrder; error?: string };

      if (!response.ok || !data.order) throw new Error(data.error || "保存订单失败。");

      setMessage(`订单 ${data.order.orderId} 已保存。`);
      setForm({
        orderId: data.order.orderId,
        reportId: data.order.reportId,
        productType: data.order.productType,
        productName: data.order.productName,
        amount: data.order.amount,
        status: data.order.status,
        customerName: data.order.customerName,
        wechat: data.order.wechat,
        reportLink: data.order.reportLink,
        note: data.order.note,
      });
      await loadOrders();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "保存订单失败。");
    } finally {
      setIsSaving(false);
    }
  }

  function editOrder(order: ManualOrder) {
    setForm({
      orderId: order.orderId,
      reportId: order.reportId,
      productType: order.productType,
      productName: order.productName,
      amount: order.amount,
      status: order.status,
      customerName: order.customerName,
      wechat: order.wechat,
      reportLink: order.reportLink,
      note: order.note,
    });
    setMessage(`正在编辑订单 ${order.orderId}`);
  }

  async function markPaid(order: ManualOrder) {
    setForm({
      orderId: order.orderId,
      reportId: order.reportId,
      productType: order.productType,
      productName: order.productName,
      amount: order.amount,
      status: "paid",
      customerName: order.customerName,
      wechat: order.wechat,
      reportLink: order.reportLink,
      note: order.note,
    });
    setMessage(`已选中订单 ${order.orderId}，点击“保存订单”即可确认已付款。`);
  }

  async function copyText(text: string, successMessage: string) {
    await navigator.clipboard.writeText(text);
    setMessage(successMessage);
  }

  const paymentReminder = `请扫码支付 ${form.amount || siteConfig.fullReportPrice} 元，付款备注填写订单号：${form.orderId || "页面生成的订单号"}。付款后请把截图发给客服微信 ${siteConfig.contactWeChat} 核对。`;
  const unlockReply = `你好，订单 ${form.orderId || "订单号"} 已核对付款。请回到报告页点击“我已付款，核对订单并解锁”。`;

  return (
    <section className="mx-auto grid max-w-7xl gap-5 px-5 py-8 lg:grid-cols-[0.92fr_1.08fr]">
      <article className="border border-[#d7aa55]/22 bg-[#101713] p-5 text-[#f5efe2] shadow-2xl shadow-black/25">
        <div className="flex flex-col gap-3 border-b border-[#f5efe2]/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7aa55]">
              Owner Console
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl">
              人工订单核销台
            </h1>
            <p className="mt-3 text-sm leading-7 text-[#cfc2ae]">
              用户付款后，把对应订单状态改为“已付款”。用户回到报告页核对订单后，系统才会解锁内容。
            </p>
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="h-10 border border-[#d7aa55]/32 px-4 text-xs font-bold text-[#d7aa55] transition hover:bg-[#d7aa55] hover:text-[#121714]"
          >
            新建订单
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            ["订单数", `${orders.length}`],
            ["已付款", `${paidCount}`],
            ["核销金额", `${totalAmount.toFixed(2)} 元`],
          ].map(([label, value]) => (
            <div key={label} className="border border-[#f5efe2]/10 bg-[#0f1412] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d7aa55]">
                {label}
              </p>
              <strong className="mt-2 block text-xl text-[#fff8ec]">{value}</strong>
            </div>
          ))}
        </div>

        <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-semibold">
            订单号
            <input
              value={form.orderId}
              onChange={(event) => updateForm("orderId", event.target.value)}
              className="h-11 border border-[#d7aa55]/26 bg-[#0f1412] px-3 text-[#fff8ec] outline-none focus:border-[#d7aa55]"
              placeholder="编辑已有订单时填写；新建可留空"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            报告 ID
            <input
              required
              value={form.reportId}
              onChange={(event) => updateForm("reportId", event.target.value)}
              className="h-11 border border-[#d7aa55]/26 bg-[#0f1412] px-3 text-[#fff8ec] outline-none focus:border-[#d7aa55]"
              placeholder="例如 /report/ 后面的 id"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              产品
              <select
                value={form.productType}
                onChange={(event) => {
                  const selected = productOptions.find((item) => item.value === event.target.value);
                  if (!selected) return;
                  setForm((current) => ({
                    ...current,
                    productType: selected.value,
                    productName: selected.label,
                    amount: selected.amount,
                  }));
                }}
                className="h-11 border border-[#d7aa55]/26 bg-[#0f1412] px-3 text-[#fff8ec] outline-none focus:border-[#d7aa55]"
              >
                {productOptions.map((product) => (
                  <option key={product.value} value={product.value}>
                    {product.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              状态
              <select
                value={form.status}
                onChange={(event) => updateForm("status", event.target.value as ManualOrderStatus)}
                className="h-11 border border-[#d7aa55]/26 bg-[#0f1412] px-3 text-[#fff8ec] outline-none focus:border-[#d7aa55]"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              金额
              <input
                required
                value={form.amount}
                onChange={(event) => updateForm("amount", event.target.value)}
                className="h-11 border border-[#d7aa55]/26 bg-[#0f1412] px-3 text-[#fff8ec] outline-none focus:border-[#d7aa55]"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              用户微信
              <input
                value={form.wechat}
                onChange={(event) => updateForm("wechat", event.target.value)}
                className="h-11 border border-[#d7aa55]/26 bg-[#0f1412] px-3 text-[#fff8ec] outline-none focus:border-[#d7aa55]"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-semibold">
            报告链接
            <input
              value={form.reportLink}
              onChange={(event) => updateForm("reportLink", event.target.value)}
              className="h-11 border border-[#d7aa55]/26 bg-[#0f1412] px-3 text-[#fff8ec] outline-none focus:border-[#d7aa55]"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            备注
            <textarea
              rows={4}
              value={form.note}
              onChange={(event) => updateForm("note", event.target.value)}
              className="resize-none border border-[#d7aa55]/26 bg-[#0f1412] px-3 py-3 text-[#fff8ec] outline-none focus:border-[#d7aa55]"
            />
          </label>

          <div className="grid gap-2 sm:grid-cols-3">
            <button
              type="submit"
              disabled={isSaving}
              className="h-11 bg-[#d7aa55] px-4 text-sm font-bold text-[#121714] transition hover:bg-[#f0c86c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "保存中..." : "保存订单"}
            </button>
            <button
              type="button"
              onClick={() => copyText(paymentReminder, "付款提醒话术已复制。")}
              className="h-11 border border-[#f5efe2]/12 px-4 text-sm font-bold text-[#cfc2ae] transition hover:border-[#d7aa55] hover:text-[#d7aa55]"
            >
              复制付款话术
            </button>
            <button
              type="button"
              onClick={() => copyText(unlockReply, "解锁回复话术已复制。")}
              className="h-11 border border-[#f5efe2]/12 px-4 text-sm font-bold text-[#cfc2ae] transition hover:border-[#d7aa55] hover:text-[#d7aa55]"
            >
              复制解锁话术
            </button>
          </div>

          {message ? (
            <p className="border border-[#d7aa55]/20 bg-[#0f1412] px-4 py-3 text-sm text-[#d8cdb9]">
              {message}
            </p>
          ) : null}
        </form>
      </article>

      <article className="border border-[#121714]/12 bg-white p-5 text-[#121714]">
        <div className="flex flex-col gap-2 border-b border-[#121714]/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8b2732]">
              Order Ledger
            </p>
            <h2 className="mt-3 text-2xl font-bold">最近订单</h2>
          </div>
          <button
            type="button"
            onClick={loadOrders}
            className="h-10 border border-[#d9c7b2] bg-white px-4 text-xs font-bold transition hover:border-[#8b2732]"
          >
            刷新
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          {isLoading ? (
            <p className="border border-[#121714]/10 bg-[#fffaf2] p-5 text-sm text-[#52615b]">
              正在读取订单...
            </p>
          ) : orders.length ? (
            orders.map((order) => (
              <div key={order.orderId} className="border border-[#121714]/10 bg-[#fffaf2] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#8b2732]">
                      {getStatusLabel(order.status)} · {order.productName}
                    </p>
                    <h3 className="mt-2 text-lg font-bold">{order.orderId}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#52615b]">
                      报告：{order.reportId} ｜ 微信：{order.wechat || "未填"} ｜ {order.amount} 元
                    </p>
                    <p className="mt-1 text-xs text-[#69756f]">
                      更新于 {formatDate(order.updatedAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => editOrder(order)}
                      className="h-9 border border-[#121714]/14 bg-white px-3 text-xs font-bold transition hover:border-[#8b2732]"
                    >
                      编辑
                    </button>
                    <button
                      type="button"
                      onClick={() => markPaid(order)}
                      className="h-9 border border-[#8b2732]/24 bg-white px-3 text-xs font-bold text-[#8b2732] transition hover:bg-[#8b2732] hover:text-white"
                    >
                      设为已付款
                    </button>
                  </div>
                </div>
                {order.reportLink ? (
                  <p className="mt-3 break-all border border-[#121714]/8 bg-white px-3 py-2 text-xs text-[#52615b]">
                    {order.reportLink}
                  </p>
                ) : null}
                {order.note ? (
                  <p className="mt-3 text-sm leading-6 text-[#52615b]">{order.note}</p>
                ) : null}
              </div>
            ))
          ) : (
            <p className="border border-[#121714]/10 bg-[#fffaf2] p-5 text-sm leading-7 text-[#52615b]">
              暂无订单。用户打开付款弹窗后，系统会自动创建待核对订单。
            </p>
          )}
        </div>
      </article>
    </section>
  );
}
