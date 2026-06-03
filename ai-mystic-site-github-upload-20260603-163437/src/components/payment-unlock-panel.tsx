"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";

type PaymentUnlockPanelProps = {
  title?: string;
  description?: string;
  onUnlock?: () => void;
  onClose?: () => void;
  compact?: boolean;
  showSelfServiceHint?: boolean;
};

export function PaymentUnlockPanel({
  title = "完整深度报告 · 限时体验价 19.9 元",
  description = "一次解锁，继续查看事业定位、财富节奏、关系模式、未来一年阶段提醒和 30 天行动计划，适合截图保存、反复复盘。",
  onUnlock,
  onClose,
  compact = false,
  showSelfServiceHint = true,
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
              完整深度报告 · 限时体验价：
              <strong className="text-[#121714]">{siteConfig.fullReportPriceLabel}</strong>
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
              当前为 MVP 体验版，扫码付款后点击下方按钮即可继续生成完整版。后续接入微信支付或支付宝商户接口后，会升级为真实支付回调自动识别。
            </p>

            {onUnlock ? (
              <div className="mt-2 grid gap-2">
                {showSelfServiceHint ? (
                  <p className="border border-[#d7aa55]/35 bg-[#fff6df] px-3 py-2 text-xs font-bold leading-5 text-[#9a563f]">
                    请先完成付款再点击。系统会在当前浏览器记录本次解锁状态，并立即展开完整深度报告。
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={onUnlock}
                  className="xj-cta h-12 bg-[#1d1a16] px-5 text-sm font-bold text-[#fff8ec] transition hover:bg-[#9a563f]"
                >
                  我已完成支付，生成完整报告
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
