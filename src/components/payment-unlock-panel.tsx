"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import type { OrderProduct } from "@/lib/mvp-store";

type PaymentUnlockPanelProps = {
  title?: string;
  description?: string;
  onUnlock?: (orderId: string) => void;
  onClose?: () => void;
  compact?: boolean;
  showSelfServiceHint?: boolean;
  priceLabel?: string;
  productName?: string;
  reportId?: string;
  productType?: OrderProduct;
};

type OrderStatus = "pending" | "paid" | "failed" | "cancelled" | "expired";

export function PaymentUnlockPanel({
  title = "解锁完整 AI 人生报告",
  description = "完整报告会进一步展开事业定位、财富方式、关系模式、未来一年阶段提醒与 30 天行动计划。",
  onUnlock,
  onClose,
  compact = false,
  priceLabel = siteConfig.fullReportPriceLabel,
  productName = "完整深度报告",
  reportId,
  productType = "full_report",
}: PaymentUnlockPanelProps) {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(Boolean(reportId));
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(false);
  const requestId = useId();

  useEffect(() => {
    if (!reportId) return;
    let active = true;

    async function createOrder() {
      try {
        const response = await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reportId,
            productType,
            requestKey: `${reportId}-${productType}-${requestId}`,
          }),
        });
        const data = (await response.json()) as {
          order?: { orderId: string; status: OrderStatus };
          error?: string;
        };

        if (!active) return;
        if (!response.ok || !data.order) {
          throw new Error(data.error || "订单创建失败");
        }
        setOrderId(data.order.orderId);
        setStatus(data.order.status);
      } catch (error) {
        if (active) {
          setMessage(error instanceof Error ? error.message : "订单创建失败，请刷新重试。");
        }
      } finally {
        if (active) setCreating(false);
      }
    }

    void createOrder();
    return () => {
      active = false;
    };
  }, [productType, reportId, requestId]);

  const checkStatus = useCallback(
    async (silent = false) => {
      if (!orderId) return;
      if (!silent) setChecking(true);

      try {
        const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
          cache: "no-store",
        });
        const data = (await response.json()) as {
          status?: OrderStatus;
          unlocked?: boolean;
          error?: string;
        };

        if (!response.ok || !data.status) {
          throw new Error(data.error || "订单查询失败");
        }
        setStatus(data.status);

        if (data.unlocked) {
          setMessage("付款已核验，正在打开专属内容。");
          onUnlock?.(orderId);
        } else if (!silent) {
          setMessage("尚未核验到付款。请确认备注了订单号，或稍后再次刷新。");
        }
      } catch (error) {
        if (!silent) {
          setMessage(error instanceof Error ? error.message : "订单查询失败，请稍后重试。");
        }
      } finally {
        if (!silent) setChecking(false);
      }
    },
    [onUnlock, orderId],
  );

  useEffect(() => {
    if (!orderId || status === "paid") return;
    const timer = window.setInterval(() => void checkStatus(true), 5000);
    return () => window.clearInterval(timer);
  }, [checkStatus, orderId, status]);

  async function copyOrderId() {
    if (!orderId) return;
    await navigator.clipboard.writeText(orderId);
    setCopied(true);
  }

  const body = (
    <div
      className={
        compact
          ? "text-[#f7efe0]"
          : "max-h-[92vh] w-full max-w-3xl overflow-y-auto border border-[#d7aa55]/45 bg-[#0d1110] p-5 text-[#f7efe0] shadow-2xl"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d7aa55]">
            Secure Unlock
          </p>
          <h2 className="mt-2 text-2xl font-black">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-[#c9c0b1]">{description}</p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 min-w-10 place-items-center border border-[#d7aa55]/30 text-sm"
            aria-label="关闭支付窗口"
          >
            ×
          </button>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-[210px_1fr]">
        <div className="border border-[#d7aa55]/30 bg-white p-3">
          <Image
            src={siteConfig.wechatPayQrPath}
            alt={`${siteConfig.name}微信收款码`}
            width={320}
            height={436}
            className="mx-auto h-auto w-full max-w-[190px]"
          />
        </div>

        <div className="grid content-start gap-3 text-sm leading-7 text-[#c9c0b1]">
          <div className="border border-[#d7aa55]/28 bg-[#151916] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d7aa55]">
              专属订单号
            </p>
            <strong className="mt-2 block break-all text-lg text-white">
              {creating ? "正在创建订单..." : orderId || "订单创建失败"}
            </strong>
            <button
              type="button"
              onClick={copyOrderId}
              disabled={!orderId}
              className="mt-3 h-10 w-full border border-[#d7aa55]/35 px-3 text-xs font-bold text-[#f2d99a] disabled:opacity-40"
            >
              {copied ? "订单号已复制" : "复制订单号"}
            </button>
          </div>

          <p>
            {productName}：<strong className="text-[#f2d99a]">{priceLabel}</strong>
          </p>
          <ol className="grid gap-2">
            <li>01 保存或复制上方订单号。</li>
            <li>02 微信扫码付款，并在付款备注中填写订单号。</li>
            <li>03 支付平台回调确认后，本页面会自动打开对应内容。</li>
          </ol>
          <p className="border border-[#d7aa55]/25 bg-[#d7aa55]/8 px-3 py-2 text-xs">
            页面每 5 秒自动查询一次。付款确认后无需再次点击，也无需输入解锁码。
          </p>
          {message ? (
            <p className="border border-[#d7aa55]/25 px-3 py-2 text-xs text-[#f2d99a]">
              {message}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => void checkStatus(false)}
            disabled={!orderId || checking}
            className="h-12 bg-[linear-gradient(100deg,#8a5a18,#e7c46c,#9a671e)] px-5 font-black text-[#17130c] shadow-lg shadow-[#d7aa55]/20 disabled:opacity-50"
          >
            {checking ? "正在核验订单..." : "我已支付，立即核验"}
          </button>
          <p className="text-xs text-[#928a7d]">
            个人微信收款码无法向网站发送到账通知，因此在接入商户支付接口前，仍需后台确认到账；确认后页面会自动跳转。
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section
      className={
        compact
          ? "border border-[#d7aa55]/32 bg-[#0d1110] p-4"
          : "fixed inset-0 z-50 grid place-items-center bg-black/75 px-3 py-5"
      }
    >
      {body}
    </section>
  );
}
