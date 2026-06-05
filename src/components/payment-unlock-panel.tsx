"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
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
  const [orderMode, setOrderMode] = useState<
    "preview" | "creating" | "tracked" | "contact"
  >(reportId ? "creating" : "preview");
  const [copiedWechat, setCopiedWechat] = useState(false);

  useEffect(() => {
    if (!reportId) {
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
          mode?: "manual" | "contact_only";
          message?: string;
          error?: string;
        };

        if (!isMounted) return;

        if (response.ok && data.orderId) {
          setOrderId(data.orderId);
          setOrderMode("tracked");
        } else {
          setOrderId("");
          setOrderMode("contact");
        }
        setOrderMessage(data.message || data.error || "");
      } catch {
        if (isMounted) {
          setOrderMode("contact");
          setOrderId("");
          setOrderMessage("自动订单暂时不可用，付款前请先联系客服确认。");
        }
      } finally {
        if (isMounted) setIsCreatingOrder(false);
      }
    }

    createOrder();

    return () => {
      isMounted = false;
    };
  }, [priceLabel, productName, productType, reportId]);

  async function copyOrderId() {
    await navigator.clipboard.writeText(orderId);
    setCopied(true);
  }

  async function copyWechat() {
    await navigator.clipboard.writeText(siteConfig.contactWeChat);
    setCopiedWechat(true);
  }

  const verifyOrder = useCallback(async (silent = false) => {
    if (!reportId || !orderId || orderId === "生成中") {
      if (!silent) setOrderMessage("订单还没有创建完成，请稍后再试。");
      return;
    }

    if (!silent) {
      setIsVerifyingOrder(true);
      setOrderMessage("");
    }

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

      if (!silent) {
        setOrderMessage(data.message || data.error || "订单尚未确认付款，请联系站长核对。");
      }
    } catch {
      if (!silent) setOrderMessage("订单核对失败，请稍后重试或联系客服。");
    } finally {
      if (!silent) setIsVerifyingOrder(false);
    }
  }, [onUnlock, orderId, productType, reportId]);

  useEffect(() => {
    if (
      orderMode !== "tracked" ||
      !reportId ||
      !orderId ||
      !onUnlock
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      void verifyOrder(true);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [onUnlock, orderId, orderMode, reportId, verifyOrder]);

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
        {orderMode === "contact" ? (
          <div className="grid min-h-64 place-items-center border border-[#9a563f]/35 bg-[#fff6df] p-5 text-center">
            <div>
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#9a563f]/35 text-xl text-[#9a563f]">
                暂停
              </span>
              <p className="mt-4 text-sm font-bold text-[#9a563f]">暂不建议直接付款</p>
              <p className="mt-2 text-xs leading-6 text-[#7c6650]">
                自动订单核对恢复后，页面会重新显示收款码与订单号。
              </p>
            </div>
          </div>
        ) : (
          <div className="border border-[#e5d7c5] bg-white p-3">
            <Image
              src={siteConfig.wechatPayQrPath}
              alt={`${siteConfig.name} 微信收款码`}
              width={320}
              height={436}
              className="mx-auto h-auto w-full max-w-[210px]"
            />
          </div>
        )}
        <div className="grid content-start gap-3 text-sm leading-7 text-[#62584b]">
          {orderMode === "creating" || orderMode === "tracked" ? (
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
          ) : orderMode === "contact" ? (
            <div className="border border-[#9a563f]/35 bg-[#fff6df] p-4">
              <p className="text-sm font-bold text-[#9a563f]">付款前请先联系客服确认</p>
              <p className="mt-2 text-xs leading-6">
                当前自动订单核对正在维护。请先添加客服微信，确认可以及时开通后再扫码付款。
              </p>
              <button
                type="button"
                onClick={copyWechat}
                className="mt-3 h-10 w-full border border-[#9a563f]/35 bg-white px-3 text-xs font-bold text-[#9a563f]"
              >
                {copiedWechat ? "微信号已复制" : `复制客服微信：${siteConfig.contactWeChat}`}
              </button>
            </div>
          ) : (
            <div className="border border-[#d7aa55]/35 bg-white p-4">
              <p className="text-sm font-bold text-[#121714]">生成报告后创建专属订单</p>
              <p className="mt-2 text-xs leading-6">
                这里仅展示付款流程。实际解锁时，系统会先生成与你报告绑定的订单号。
              </p>
            </div>
          )}
          <p>
            {productName}，体验价：
            <strong className="text-[#121714]">{priceLabel}</strong>
          </p>
          {orderMode === "tracked" ? (
            <p>
              付款方式：扫码支付后，请在付款备注里填写订单号{" "}
              <strong className="text-[#121714]">{orderId}</strong>。后台确认后，本页面会自动解锁，无需重复点击。
            </p>
          ) : null}
          <p>{paymentNotice}</p>
          <p>
            <strong className="text-[#121714]">售后说明：</strong>
            {refundNotice}
          </p>
          <p>
            <strong className="text-[#121714]">内容边界：</strong>
            {boundaryNotice}
          </p>

          {onUnlock && orderMode === "tracked" ? (
            <div className="mt-2 grid gap-2">
              {showSelfServiceHint ? (
                <p className="border border-[#d7aa55]/35 bg-[#fff6df] px-3 py-2 text-xs font-bold leading-5 text-[#9a563f]">
                  付款后请保留此页面。后台确认订单后，完整报告会自动展开；下方按钮仅用于手动刷新状态。
                </p>
              ) : null}
              {orderMessage ? (
                <p className="border border-[#d7aa55]/25 bg-white px-3 py-2 text-xs font-bold leading-5 text-[#9a563f]">
                  {orderMessage}
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => void verifyOrder(false)}
                disabled={isCreatingOrder || isVerifyingOrder || !reportId}
                className="xj-cta h-12 bg-[#1d1a16] px-5 text-sm font-bold text-[#fff8ec] transition hover:bg-[#9a563f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isVerifyingOrder ? "正在刷新订单状态..." : "手动刷新订单状态"}
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
