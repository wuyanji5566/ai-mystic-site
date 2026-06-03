"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PaymentUnlockPanel } from "@/components/payment-unlock-panel";
import { ReportSectionCards } from "@/components/report-section-cards";
import { siteConfig } from "@/lib/site-config";
import {
  clearReportFollowups,
  getReportFollowups,
  saveReportFollowup,
  type FollowupMessage,
} from "@/lib/followup-storage";
import {
  isReportUnlocked,
  getReportWithCloudFallback,
  unlockReport,
  type ReportStorageMode,
  type SavedMysticReport,
} from "@/lib/report-storage";

type FollowupResponse = {
  answer: string;
  mode: "ai" | "demo";
  statusMessage: string;
};

const followupPresets = [
  "把紫微、八字、星座和 MBTI 合起来，帮我提炼我的核心人格画像",
  "帮我深挖事业方向：我适合稳定积累、表达影响力，还是项目型机会？",
  "帮我深挖亲密关系：我的沟通模式、关系边界和情绪触发点是什么？",
  "帮我深挖财富模式：从性格和命盘倾向看，我该如何管理消费和副业？",
  "帮我做未来 30 天行动计划，每周给我一个可执行任务",
  "帮我把这份报告整理成适合截图分享的高级总结",
];

export function ReportDetail({ reportId }: { reportId: string }) {
  const [report, setReport] = useState<SavedMysticReport | null>(null);
  const [storageMode, setStorageMode] = useState<ReportStorageMode>("local");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copyMessage, setCopyMessage] = useState("");
  const [followupQuestion, setFollowupQuestion] = useState(followupPresets[0]);
  const [followup, setFollowup] = useState<FollowupResponse | null>(null);
  const [followupHistory, setFollowupHistory] = useState<FollowupMessage[]>([]);
  const [followupError, setFollowupError] = useState("");
  const [isFollowupLoading, setIsFollowupLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      getReportWithCloudFallback(reportId).then((result) => {
        setReport(result?.report || null);
        setStorageMode(result?.storage || "local");
        setIsUnlocked(result?.report ? isReportUnlocked(result.report.id) : false);
        setFollowupHistory(result?.report ? getReportFollowups(result.report.id) : []);
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
    const visibleText = isUnlocked
      ? report.report
      : `${report.report.split("\n").slice(0, 8).join("\n")}\n\n【完整版内容已隐藏】\n解锁后可查看完整深度分析、继续追问和行动计划。`;
    await navigator.clipboard.writeText(visibleText);
    setCopyMessage(isUnlocked ? "报告正文已复制。" : "免费摘要已复制。完整版内容需要解锁后查看。");
  }

  function handleUnlock() {
    if (!report) return;

    unlockReport(report.id);
    setIsUnlocked(true);
    setCopyMessage("完整版已解锁。完整报告和继续追问入口已打开。");
    setShowPayment(false);
  }

  async function handleFollowup(question = followupQuestion) {
    if (!report) return;

    if (!isUnlocked) {
      setFollowupError(
        `继续深度解析需要解锁完整版报告，价格 ${siteConfig.fullReportPriceLabel}。`,
      );
      setShowPayment(true);
      return;
    }

    setFollowupQuestion(question);
    setFollowupError("");
    setFollowup(null);
    setIsFollowupLoading(true);

    try {
      const response = await fetch("/api/report-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportTitle: report.title,
          report: report.report,
          profile: report.profile,
          question,
        }),
      });
      const data = (await response.json()) as unknown;

      if (!response.ok) {
        const errorData = data as { error?: string };
        throw new Error(errorData.error || "深化失败，请稍后再试。");
      }

      const followupData = data as FollowupResponse;
      setFollowup(followupData);
      const saved = saveReportFollowup({
        reportId: report.id,
        question,
        answer: followupData.answer,
        mode: followupData.mode,
        statusMessage: followupData.statusMessage,
      });
      setFollowupHistory((items) => [...items, saved].slice(-12));
    } catch (error) {
      setFollowupError(error instanceof Error ? error.message : "深化失败，请稍后再试。");
    } finally {
      setIsFollowupLoading(false);
    }
  }

  function handleClearFollowups() {
    if (!report) return;
    clearReportFollowups(report.id);
    setFollowupHistory([]);
    setFollowup(null);
    setFollowupError("");
    setCopyMessage("追问历史已清空。");
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
              Four-Lens Self Report
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
            <p className="text-sm font-semibold text-[#9a563f]">解锁深度解析</p>
            <h2 className="mt-2 text-2xl font-semibold">当前只展示免费摘要</h2>
            <p className="mt-3 text-sm leading-7 text-[#6f6254]">
              完整版报告价格为 <strong className="text-[#1d1a16]">{siteConfig.fullReportPriceLabel}</strong>。
              支付后可查看完整分析、继续追问和未来行动计划。
            </p>
            <div className="mt-4">
              <PaymentUnlockPanel
                compact
                onUnlock={handleUnlock}
              />
            </div>
          </section>
        ) : null}

        <article className="border border-[#dfd2c1] bg-[#fffaf2] p-5">
          <div className="grid gap-3 border-b border-[#e5d7c5] pb-4 text-sm sm:grid-cols-4">
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
            <p>
              <span className="block text-[#8a7560]">MBTI</span>
              <strong>{report.input.mbtiType || "不确定"}</strong>
            </p>
          </div>

          <p className="mt-4 text-sm leading-7 text-[#6f6254]">{report.profile.birthSummary}</p>
          <div className="mt-6">
            <ReportSectionCards
              report={report.report}
              limit={isUnlocked ? undefined : 4}
              locked={!isUnlocked}
              variant="warm"
            />
          </div>
          <p className="mt-6 text-xs text-[#8a7560]">
            当前模式：{report.mode === "ai" ? "玄机 AI 生成" : "演示报告"}。内容仅供娱乐和自我探索。
          </p>
        </article>

        <section className="mt-6 border border-[#dfd2c1] bg-white p-5">
          <div className="flex flex-col gap-3 border-b border-[#e5d7c5] pb-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#9a563f]">四维追问室</p>
              <h2 className="mt-2 text-2xl font-semibold">像聊天一样继续深挖</h2>
              <p className="mt-3 text-sm leading-7 text-[#6f6254]">
                系统会结合紫微、八字、星座和 MBTI，再次生成具体行动建议。继续深度解析需要解锁完整版。
              </p>
            </div>
            <div className="w-fit border border-[#dfd2c1] bg-[#fffaf2] px-3 py-2 text-xs font-semibold text-[#6f6254]">
              已追问 {followupHistory.length} 次
            </div>
          </div>

          {followupHistory.length ? (
            <div className="mt-5 space-y-4">
              {followupHistory.map((item) => (
                <article key={item.id} className="grid gap-3">
                  <div className="ml-auto max-w-[88%] bg-[#1d1a16] px-4 py-3 text-sm leading-7 text-[#fff8ec]">
                    {item.question}
                  </div>
                  <div className="max-w-[92%] border border-[#e5d7c5] bg-[#fffaf2] px-4 py-3">
                    <p className="text-xs font-semibold text-[#9a563f]">
                      {item.mode === "ai" ? "玄机 AI 深度解析" : "演示深化内容"}
                    </p>
                    <div className="mt-3 whitespace-pre-wrap text-sm leading-7">{item.answer}</div>
                    <p className="mt-3 text-xs text-[#8a7560]">
                      {new Date(item.createdAt).toLocaleString("zh-CN")}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-5 border border-[#e5d7c5] bg-[#fffaf2] px-4 py-3 text-sm text-[#6f6254]">
              还没有追问。先从下方选择一个方向，或者输入自己的具体问题。
            </p>
          )}

          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {followupPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleFollowup(preset)}
                disabled={isFollowupLoading}
                className="border border-[#d9c7b2] bg-[#fffaf2] px-4 py-3 text-left text-sm font-semibold leading-6 transition hover:border-[#9a563f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {preset}
              </button>
            ))}
          </div>

          <label className="mt-5 grid gap-2 text-sm font-medium">
            自定义追问
            <textarea
              rows={3}
              value={followupQuestion}
              onChange={(event) => setFollowupQuestion(event.target.value)}
              className="resize-none border border-[#d9c7b2] bg-white px-3 py-3 outline-none transition focus:border-[#9a563f]"
              placeholder="例如：我适合做副业吗？未来三个月怎么行动？"
            />
          </label>
          <button
            type="button"
            onClick={() => handleFollowup()}
            disabled={isFollowupLoading}
            className="mt-3 h-11 bg-[#1d1a16] px-5 text-sm font-semibold text-[#fff8ec] transition hover:bg-[#9a563f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isFollowupLoading ? "正在深化生成..." : "继续深化这个问题"}
          </button>
          {!isUnlocked ? (
            <button
              type="button"
              onClick={() => setShowPayment(true)}
              className="ml-0 mt-3 h-11 border border-[#9a563f] bg-[#fffaf2] px-5 text-sm font-semibold text-[#9a563f] transition hover:bg-[#9a563f] hover:text-white sm:ml-2"
            >
              查看支付信息
            </button>
          ) : null}
          {followupHistory.length ? (
            <button
              type="button"
              onClick={handleClearFollowups}
              className="ml-0 mt-3 h-11 border border-[#d9c7b2] bg-white px-5 text-sm font-semibold transition hover:border-[#9a563f] sm:ml-2"
            >
              清空追问历史
            </button>
          ) : null}

          {followupError ? (
            <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {followupError}
            </p>
          ) : null}

          {followup ? (
            <p className="mt-4 text-xs text-[#8a7560]">
              最新深化模式：{followup.mode === "ai" ? "玄机 AI 深化" : "演示深化"}。内容仅供娱乐和自我探索。
            </p>
          ) : null}
        </section>
      </section>

      {showPayment ? (
        <PaymentUnlockPanel
          onUnlock={handleUnlock}
          onClose={() => setShowPayment(false)}
        />
      ) : null}
    </main>
  );
}
