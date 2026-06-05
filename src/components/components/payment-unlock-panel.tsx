"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { boundaryNotice, paymentNotice, refundNotice } from "@/lib/legal-copy";
import { siteConfig } from "@/lib/site-config";

type PaymentUnlockPanelProps = {
  title?: string;
  description?: string;
  onUnlock?: () => void;
  onClose?: () => void;
  compact?: boolean;
  showSelfServiceHint?: boolean;
  priceLabel?: string;
  productName?: string;
};

export function PaymentUnlockPanel({
  title = "解锁完整版 AI 人生报告",
  description = "一次解锁，继续查看人格画像、事业路径、财富节奏、关系模式、未来一年提醒和 30 天行动计划。当前页面会在付款确认后展开完整版体验。",
  onUnlock,
  onClose,
  compact = false,
  showSelfServiceHint = true,
  priceLabel = siteConfig.fullReportPriceLabel,
  productName = "完整深度报告",
}: PaymentUnlockPanelProps) {
  const [copied, setCopied] = useState(false);
  const [orderId, setOrderId] = useState("生成中");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const date = new Date();
      const stamp = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
        String(date.getHours()).padStart(2, "0"),
        String(date.getMinutes()).padStart(2, "0"),
      ].join("");
      setOrderId(`XJ${stamp}${Math.random().toString(36).slice(2, 6).toUpperCase()}`);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function copyOrderId() {
    await navigator.clipboard.writeText(orderId);
    setCopied(true);
  }

  return (
    <section
      className={
        compact
          ? "border border-[#d7aa55]/28 bg-[#fffaf2] p-4 text-[#121714]"
          : "fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-6"
      }
    >
      <div
        className={
          compact
            ? ""
            : "max-h-[92vh] w-full max-w-3xl overflow-y-auto border border-[#d7aa55]/35 bg-[#fffaf2] p-5 text-[#121714] shadow-2xl"
        }
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a563f]">
              Unlock
            </p>
            <h2 className="mt-2 text-2xl font-bold">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-[#62584b]">{description}</p>
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="h-9 min-w-9 border border-[#d9c7b2] bg-white px-3 text-sm font-bold transition hover:border-[#9a563f]"
              aria-label="关闭支付弹窗"
            >
              ×
            </button>
          ) : null}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[230px_1fr]">
          <div className="border border-[#e5d7c5] bg-white p-3">
            <Image
              src={siteConfig.wechatPayQrPath}
              alt={`${siteConfig.name} 微信收款码`}
              width={320}
              height={436}
              className="mx-auto h-auto w-full max-w-[210px]"
            />
          </div>
          <div className="grid content-start gap-3 text-sm leading-7 text-[#62584b]">
            <div className="border border-[#d7aa55]/35 bg-white p-3">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a563f]">
                Order No.
              </p>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <strong className="text-lg text-[#121714]">{orderId}</strong>
                <button
                  type="button"
                  onClick={copyOrderId}
                  className="h-9 border border-[#d9c7b2] bg-[#fffaf2] px-3 text-xs font-bold text-[#9a563f] transition hover:border-[#9a563f]"
                >
                  {copied ? "已复制" : "复制订单号"}
                </button>
              </div>
            </div>
            <p>
              {productName} · 限时体验价：
              <strong className="text-[#121714]">{priceLabel}</strong>
            </p>
            <p>
              免费摘要适合随便测一测；完整版更适合正在经历事业转型、关系困惑、自我重建或需要行动计划的人。
            </p>
            <p>
              付款方式：扫码支付后，请在付款备注里填写订单号{" "}
              <strong className="text-[#121714]">{orderId}</strong>；如需人工核对，把付款截图发送给客服微信{" "}
              <strong className="text-[#121714]">{siteConfig.contactWeChat}</strong>。
            </p>
            <p>
              {paymentNotice}
            </p>
            <p>
              <strong className="text-[#121714]">售后说明：</strong>
              {refundNotice}
            </p>
            <p>
              <strong className="text-[#121714]">内容边界：</strong>
              {boundaryNotice}
            </p>

            {onUnlock ? (
              <div className="mt-2 grid gap-2">
                {showSelfServiceHint ? (
                  <p className="border border-[#d7aa55]/35 bg-[#fff6df] px-3 py-2 text-xs font-bold leading-5 text-[#9a563f]">
                    请先完成付款再点击。点击后系统会在当前浏览器记录本次解锁状态，并自动展开完整深度报告。
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={onUnlock}
                  className="xj-cta h-12 bg-[#1d1a16] px-5 text-sm font-bold text-[#fff8ec] transition hover:bg-[#9a563f]"
                >
                  我已完成支付，自动展开完整报告
                </button>
                <p className="text-xs leading-5 text-[#8a7560]">
                  如果误点或付款备注遗漏订单号，可联系微信客服 {siteConfig.contactWeChat} 处理。
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
