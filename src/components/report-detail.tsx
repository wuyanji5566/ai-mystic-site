"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import {
  isReportUnlocked,
  getReportWithCloudFallback,
  unlockReport,
  type ReportStorageMode,
  type SavedMysticReport,
} from "@/lib/report-storage";

export function ReportDetail({ reportId }: { reportId: string }) {
  const [report, setReport] = useState<SavedMysticReport | null>(null);
  const [storageMode, setStorageMode] = useState<ReportStorageMode>("local");
  const [unlockCode, setUnlockCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      getReportWithCloudFallback(reportId).then((result) => {
        setReport(result?.report || null);
        setStorageMode(result?.storage || "local");
        setIsUnlocked(result?.report ? isReportUnlocked(result.report.id) : false);
        setIsLoading(false);
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [reportId]);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopyMessage(
      storageMode === "cloud"
        ? "云端详情链接已复制，可以跨设备访问。"
        : "本地详情链接已复制。当前还没配置 Supabase，跨设备分享需要先接数据库。",
    );
  }

  async function copyText() {
    if (!report) return;
    await navigator.clipboard.writeText(report.report);
    setCopyMessage("报告正文已复制。");
  }

  function handleUnlock() {
    if (!report) return;

    if (unlockCode.trim() === siteConfig.unlockCode) {
      unlockReport(report.id);
      setIsUnlocked(true);
      setCopyMessage("完整版已解锁。真实上线后这里会升级为微信支付或支付宝自动回调。");
      return;
    }

    setCopyMessage(`解锁码不正确。请添加客服微信 ${siteConfig.contactWeChat} 处理人工解锁。`);
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f8f3ea] px-5 py-10 text-[#1d1a16]">
        <p>正在读取报告...</p>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="min-h-screen bg-[#f8f3ea] px-5 py-10 text-[#1d1a16]">
        <section className="mx-auto max-w-3xl border border-[#dfd2c1] bg-white p-6">
          <p className="text-sm font-semibold text-[#9a563f]">未找到报告</p>
          <h1 className="mt-2 text-3xl font-semibold">这个报告只保存在生成它的浏览器里</h1>
          <p className="mt-4 leading-7 text-[#6f6254]">
            系统已尝试读取 Supabase 云端报告和本地浏览器报告，但都没有找到。请确认报告没有被删除，或者先回到首页重新生成一份。
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex h-11 items-center bg-[#1d1a16] px-5 text-sm font-semibold text-[#fff8ec] transition hover:bg-[#9a563f]"
          >
            返回重新生成
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3ea] text-[#1d1a16]">
      <section className="border-b border-[#e4d8c7] bg-[#211c18] px-5 py-8 text-[#fff8ec]">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f1c66d]">
              AI Mystic Report
            </p>
            <h1 className="mt-3 text-4xl font-semibold">{report.title}</h1>
            <p className="mt-3 text-sm text-[#ddccb5]">
              生成时间：{new Date(report.createdAt).toLocaleString("zh-CN")}
            </p>
          </div>
          <Link
            href="/reports"
            className="w-fit border border-[#fff8ec]/25 px-4 py-2 text-sm font-medium transition hover:bg-[#fff8ec] hover:text-[#211c18]"
          >
            查看历史报告
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-8">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={copyLink}
            className="h-10 bg-[#1d1a16] px-4 text-sm font-semibold text-[#fff8ec] transition hover:bg-[#9a563f]"
          >
            复制详情链接
          </button>
          <button
            type="button"
            onClick={copyText}
            className="h-10 border border-[#d9c7b2] bg-white px-4 text-sm font-semibold transition hover:border-[#9a563f]"
          >
            复制报告正文
          </button>
          <Link
            href="/"
            className="flex h-10 items-center justify-center border border-[#d9c7b2] bg-white px-4 text-sm font-semibold transition hover:border-[#9a563f]"
          >
            生成新报告
          </Link>
        </div>

        {copyMessage ? (
          <p className="mb-5 border border-[#e5d7c5] bg-white px-3 py-2 text-sm text-[#6f6254]">
            {copyMessage}
          </p>
        ) : null}

        <p className="mb-5 border border-[#e5d7c5] bg-white px-3 py-2 text-sm text-[#6f6254]">
          保存位置：{storageMode === "cloud" ? "Supabase 云端，可跨设备分享" : "浏览器本地，仅当前设备可复看"}
        </p>

        {!isUnlocked ? (
          <section className="mb-5 border border-[#dfd2c1] bg-white p-5">
            <p className="text-sm font-semibold text-[#9a563f]">付费解锁演示</p>
            <h2 className="mt-2 text-2xl font-semibold">当前只展示免费摘要</h2>
            <p className="mt-3 text-sm leading-7 text-[#6f6254]">
              完整版报告价格为 <strong className="text-[#1d1a16]">{siteConfig.fullReportPriceLabel}</strong>。
              当前先使用人工微信收款：添加客服微信 <strong className="text-[#1d1a16]">{siteConfig.contactWeChat}</strong>，
              付款后发送报告链接，由客服协助解锁。
            </p>
            <div className="mt-4 grid gap-4 lg:grid-cols-[240px_1fr]">
              <div className="border border-[#e5d7c5] bg-[#fffaf2] p-3">
                <Image
                  src={siteConfig.wechatPayQrPath}
                  alt={`${siteConfig.name} 微信收款码`}
                  width={320}
                  height={436}
                  className="mx-auto h-auto w-full max-w-[210px]"
                />
              </div>
              <div>
                <p className="text-sm leading-7 text-[#6f6254]">
                  人工收款步骤：扫码付款 {siteConfig.fullReportPriceLabel}，把付款截图和当前报告链接发送给客服微信 {siteConfig.contactWeChat}。
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                value={unlockCode}
                onChange={(event) => setUnlockCode(event.target.value)}
                className="h-10 border border-[#d9c7b2] bg-white px-3 outline-none transition focus:border-[#9a563f]"
                placeholder="输入解锁码"
              />
              <button
                type="button"
                onClick={handleUnlock}
                className="h-10 bg-[#1d1a16] px-4 text-sm font-semibold text-[#fff8ec] transition hover:bg-[#9a563f]"
              >
                解锁完整版
              </button>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <article className="border border-[#dfd2c1] bg-[#fffaf2] p-5">
          <div className="grid gap-3 border-b border-[#e5d7c5] pb-4 text-sm sm:grid-cols-3">
            <p>
              <span className="block text-[#8a7560]">生肖</span>
              <strong>{report.profile.zodiac}</strong>
            </p>
            <p>
              <span className="block text-[#8a7560]">星座</span>
              <strong>{report.profile.westernSign}</strong>
            </p>
            <p>
              <span className="block text-[#8a7560]">年柱</span>
              <strong>{report.profile.yearPillar}</strong>
            </p>
          </div>

          <p className="mt-4 text-sm leading-7 text-[#6f6254]">{report.profile.birthSummary}</p>
          <div className="mt-6 whitespace-pre-wrap text-sm leading-7">
            {isUnlocked
              ? report.report
              : report.report.split("\n").slice(0, 8).join("\n") +
                "\n\n【完整版内容已隐藏】\n解锁后可查看事业、感情、财富、未来一年行动清单和完整总结。"}
          </div>
          <p className="mt-6 text-xs text-[#8a7560]">
            当前模式：{report.mode === "ai" ? "真实 AI 生成" : "演示报告"}。内容仅供娱乐和自我探索。
          </p>
        </article>
      </section>
    </main>
  );
}
