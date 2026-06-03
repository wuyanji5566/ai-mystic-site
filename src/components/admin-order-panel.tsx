"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  createOrderId,
  deleteManualOrder,
  getManualOrders,
  saveManualOrder,
  type ManualOrder,
  type ManualOrderStatus,
} from "@/lib/order-storage";
import { siteConfig } from "@/lib/site-config";

const statusOptions: ManualOrderStatus[] = ["待核对", "已付款", "已解锁", "异常"];

type OrderFormState = {
  id: string;
  customerName: string;
  wechat: string;
  amount: string;
  reportLink: string;
  status: ManualOrderStatus;
  note: string;
};

function createEmptyForm(): OrderFormState {
  return {
    id: createOrderId(),
    customerName: "",
    wechat: "",
    amount: siteConfig.fullReportPrice,
    reportLink: "",
    status: "待核对",
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

export function AdminOrderPanel() {
  const [form, setForm] = useState<OrderFormState>(() => createEmptyForm());
  const [orders, setOrders] = useState<ManualOrder[]>(() => getManualOrders());
  const [message, setMessage] = useState("");

  const paidCount = useMemo(
    () => orders.filter((order) => order.status === "已付款" || order.status === "已解锁").length,
    [orders],
  );

  const totalAmount = useMemo(
    () =>
      orders
        .filter((order) => order.status === "已付款" || order.status === "已解锁")
        .reduce((sum, order) => sum + Number(order.amount || 0), 0),
    [orders],
  );

  function refreshOrders() {
    setOrders(getManualOrders());
  }

  function updateForm<K extends keyof OrderFormState>(key: K, value: OrderFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setForm(createEmptyForm());
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const saved = saveManualOrder(form);
    setForm({
      id: saved.id,
      customerName: saved.customerName,
      wechat: saved.wechat,
      amount: saved.amount,
      reportLink: saved.reportLink,
      status: saved.status,
      note: saved.note,
    });
    refreshOrders();
    setMessage(`订单 ${saved.id} 已保存。`);
  }

  function editOrder(order: ManualOrder) {
    setForm({
      id: order.id,
      customerName: order.customerName,
      wechat: order.wechat,
      amount: order.amount,
      reportLink: order.reportLink,
      status: order.status,
      note: order.note,
    });
    setMessage(`正在编辑订单 ${order.id}`);
  }

  function removeOrder(id: string) {
    deleteManualOrder(id);
    refreshOrders();
    if (form.id === id) resetForm();
    setMessage(`订单 ${id} 已删除。`);
  }

  async function copyText(text: string, successMessage: string) {
    await navigator.clipboard.writeText(text);
    setMessage(successMessage);
  }

  const paymentReminder = `请扫码支付 ${siteConfig.fullReportPriceLabel}，付款备注填写订单号：${form.id}。付款后回到报告页点击“我已完成支付，生成完整报告”即可继续查看；如遇问题，把截图和报告链接发给客服微信 ${siteConfig.contactWeChat}。`;
  const unlockReply = `你好，订单 ${form.id} 已核对。请回到报告页点击“我已完成支付，生成完整报告”，系统会在当前浏览器打开完整版。如遇问题，直接把页面截图发给客服微信 ${siteConfig.contactWeChat}。`;

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
              先用本地台账处理微信收款：记录订单号、付款状态、报告链接，并一键复制回复话术。
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
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <input
                required
                value={form.id}
                onChange={(event) => updateForm("id", event.target.value)}
                className="h-11 border border-[#d7aa55]/26 bg-[#0f1412] px-3 text-[#fff8ec] outline-none focus:border-[#d7aa55]"
              />
              <button
                type="button"
                onClick={() => updateForm("id", createOrderId())}
                className="h-11 border border-[#f5efe2]/12 px-4 text-xs font-bold text-[#cfc2ae] transition hover:border-[#d7aa55] hover:text-[#d7aa55]"
              >
                换一个
              </button>
            </div>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              用户昵称
              <input
                value={form.customerName}
                onChange={(event) => updateForm("customerName", event.target.value)}
                className="h-11 border border-[#d7aa55]/26 bg-[#0f1412] px-3 text-[#fff8ec] outline-none focus:border-[#d7aa55]"
                placeholder="例如：小林"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              用户微信
              <input
                value={form.wechat}
                onChange={(event) => updateForm("wechat", event.target.value)}
                className="h-11 border border-[#d7aa55]/26 bg-[#0f1412] px-3 text-[#fff8ec] outline-none focus:border-[#d7aa55]"
                placeholder="用户发来的微信号"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-[0.7fr_1fr]">
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
              状态
              <select
                value={form.status}
                onChange={(event) => updateForm("status", event.target.value as ManualOrderStatus)}
                className="h-11 border border-[#d7aa55]/26 bg-[#0f1412] px-3 text-[#fff8ec] outline-none focus:border-[#d7aa55]"
              >
                {statusOptions.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-2 text-sm font-semibold">
            报告链接
            <input
              value={form.reportLink}
              onChange={(event) => updateForm("reportLink", event.target.value)}
              className="h-11 border border-[#d7aa55]/26 bg-[#0f1412] px-3 text-[#fff8ec] outline-none focus:border-[#d7aa55]"
              placeholder="用户发来的 /report/xxx 链接"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            备注
            <textarea
              rows={4}
              value={form.note}
              onChange={(event) => updateForm("note", event.target.value)}
              className="resize-none border border-[#d7aa55]/26 bg-[#0f1412] px-3 py-3 text-[#fff8ec] outline-none focus:border-[#d7aa55]"
              placeholder="例如：已收到截图，用户已自助打开完整版"
            />
          </label>

          <div className="grid gap-2 sm:grid-cols-3">
            <button
              type="submit"
              className="h-11 bg-[#d7aa55] px-4 text-sm font-bold text-[#121714] transition hover:bg-[#f0c86c]"
            >
              保存订单
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
              Local Ledger
            </p>
            <h2 className="mt-3 text-2xl font-bold">最近订单</h2>
          </div>
          <p className="text-xs leading-5 text-[#69756f]">
            这个后台先保存在你的浏览器本地。换电脑前请截图或导出台账。
          </p>
        </div>

        <div className="mt-5 grid gap-3">
          {orders.length ? (
            orders.map((order) => (
              <div key={order.id} className="border border-[#121714]/10 bg-[#fffaf2] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#8b2732]">{order.status}</p>
                    <h3 className="mt-2 text-lg font-bold">{order.id}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#52615b]">
                      {order.customerName || "未填昵称"} ｜ 微信：{order.wechat || "未填"} ｜{" "}
                      {order.amount} 元
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
                      onClick={() => removeOrder(order.id)}
                      className="h-9 border border-[#8b2732]/24 bg-white px-3 text-xs font-bold text-[#8b2732] transition hover:bg-[#8b2732] hover:text-white"
                    >
                      删除
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
              暂无订单。用户付款后，把订单号、微信、报告链接录入这里即可。
            </p>
          )}
        </div>
      </article>
    </section>
  );
}
