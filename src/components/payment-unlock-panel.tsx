"use client";

import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

type PaymentUnlockPanelProps = {
  title?: string;
  description?: string;
  unlockCode?: string;
  onUnlockCodeChange?: (value: string) => void;
  onUnlock?: () => void;
  onClose?: () => void;
  compact?: boolean;
};

export function PaymentUnlockPanel({
  title = "解锁完整版深度解析",
  description = "支付后可继续查看完整报告、深度追问、行动计划和后续人工协助解锁。",
  unlockCode = "",
  onUnlockCodeChange,
  onUnlock,
  onClose,
  compact = false,
}: PaymentUnlockPanelProps) {
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
            <p>
              价格：<strong className="text-[#121714]">{siteConfig.fullReportPriceLabel}</strong>
            </p>
            <p>
              付款方式：扫码支付后，备注你的昵称；如需人工核对，把付款截图发送给客服微信{" "}
              <strong className="text-[#121714]">{siteConfig.contactWeChat}</strong>。
            </p>
            <p>
              当前阶段采用人工核对，避免用户必须先加微信才能看到付款方式。后续接入微信支付或支付宝后，会升级为自动解锁。
            </p>

            {onUnlock && onUnlockCodeChange ? (
              <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
                <input
                  value={unlockCode}
                  onChange={(event) => onUnlockCodeChange(event.target.value)}
                  className="h-11 border border-[#d9c7b2] bg-white px-3 outline-none transition focus:border-[#9a563f]"
                  placeholder="已付款用户输入解锁码"
                />
                <button
                  type="button"
                  onClick={onUnlock}
                  className="h-11 bg-[#1d1a16] px-5 text-sm font-bold text-[#fff8ec] transition hover:bg-[#9a563f]"
                >
                  解锁
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
