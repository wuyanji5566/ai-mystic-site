"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { boundaryNotice, paymentNotice, refundNotice } from "@/lib/legal-copy";
import { siteConfig } from "@/lib/site-config";
import type { ManualOrderProduct } from "@/lib/supabase-orders";

type PaymentUnlockPanelProps = {
  title?: string;
  description?: string;
  onUnlock?: () => void;
  onClose?: () => void;
  compact?: boolean;
  showSelfServiceHint?: boolean;
  priceLabel?: string;
  productName?: string;
  reportId?: string;
  productType?: ManualOrderProduct;
};

export function PaymentUnlockPanel({
  title = "解锁完整 AI 人生报告",
  description = "一次解锁，继续查看人格画像、事业路径、财富节奏、关系模式、未来一年提醒和 30 天行动计划。",
  onUnlock,
  onClose,
  compact = false,
  showSelfServiceHint = true,
  priceLabel = siteConfig.fullReportPriceLabel,
  productName = "完整深度报告",
  reportId,
  productType = "full_report",
}: PaymentUnlockPanelProps) {
  const [copied, setCopied] = useState(false);
  const [orderId, setOrderId] = useState("生成中");
  const [orderMessage, setOrderMessage] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isVerifyingOrder, setIsVerifyingOrder] = useState(false);

  useEffect(() => {
    if (!reportId || !onUnlock) {
      return;
    }

    let isMounted = true;

    async function createOrder() {
      setIsCreatingOrder(true);
      setOrderMessage("");

      try {
        const response = await fetch("/api/payments/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reportId,
            productType,
            productName,
            amount: priceLabel.replace(/[^\d.]/g, "") || priceLabel,
            reportLink: `${window.location.origin}/report/${reportId}`,
          }),
        });
        const data = (await response.json()) as {
          orderId?: string;
          message?: string;
          error?: string;
        };

        if (!isMounted) return;

        if (data.orderId) setOrderId(data.orderId);
        setOrderMessage(data.message || data.error || "");
      } catch {
        if (isMounted) setOrderMessage("订单创建失败，请稍后重试或联系客服。");
      } finally {
        if (isMounted) setIsCreatingOrder(false);
      }
    }

    createOrder();

    return () => {
      isMounted = false;
    };
  }, [onUnlock, priceLabel, productName, productType, reportId]);

  async function copyOrderId() {
    await navigator.clipboard.writeText(orderId);
    setCopied(true);
  }

  async function verifyOrder() {
    if (!reportId || !orderId || orderId === "生成中") {
      setOrderMessage("订单还没有创建完成，请稍后再试。");
      return;
    }

    setIsVerifyingOrder(true);
    setOrderMessage("");

    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, reportId, productType }),
      });
      const data = (await response.json()) as {
        unlocked?: boolean;
        message?: string;
        error?: string;
      };

      if (data.unlocked) {
        onUnlock?.();
        return;
      }

      setOrderMessage(data.message || data.error || "订单尚未确认付款，请联系站长核对。");
    } catch {
      setOrderMessage("订单核对失败，请稍后重试或联系客服。");
    } finally {
      setIsVerifyingOrder(false);
    }
  }

  const paymentBody = (
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
            X
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
              <strong className="text-lg text-[#121714]">
                {isCreatingOrder ? "订单创建中..." : orderId}
              </strong>
              <button
                type="button"
                onClick={copyOrderId}
                disabled={isCreatingOrder || orderId === "生成中"}
                className="h-9 border border-[#d9c7b2] bg-[#fffaf2] px-3 text-xs font-bold text-[#9a563f] transition hover:border-[#9a563f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copied ? "已复制" : "复制订单号"}
              </button>
            </div>
          </div>
          <p>
            {productName}，体验价：
            <strong className="text-[#121714]">{priceLabel}</strong>
          </p>
          <p>
            付款方式：扫码支付后，请在付款备注里填写订单号{" "}
            <strong className="text-[#121714]">{orderId}</strong>。如需人工核对，把付款截图发送给客服微信{" "}
            <strong className="text-[#121714]">{siteConfig.contactWeChat}</strong>。
          </p>
          <p>{paymentNotice}</p>
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
                  后台确认付款后，再点击下方按钮核对订单状态。订单未确认时不会解锁内容。
                </p>
              ) : null}
              {orderMessage ? (
                <p className="border border-[#d7aa55]/25 bg-white px-3 py-2 text-xs font-bold leading-5 text-[#9a563f]">
                  {orderMessage}
                </p>
              ) : null}
              <button
                type="button"
                onClick={verifyOrder}
                disabled={isCreatingOrder || isVerifyingOrder || !reportId}
                className="xj-cta h-12 bg-[#1d1a16] px-5 text-sm font-bold text-[#fff8ec] transition hover:bg-[#9a563f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isVerifyingOrder ? "正在核对订单..." : "我已付款，核对订单并解锁"}
              </button>
              <p className="text-xs leading-5 text-[#8a7560]">
                如果误点或付款备注遗漏订单号，可联系微信客服 {siteConfig.contactWeChat} 处理。
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <section
      className={
        compact
          ? "border border-[#d7aa55]/28 bg-[#fffaf2] p-4 text-[#121714]"
          : "fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-6"
      }
    >
      {paymentBody}
    </section>
  );
}
