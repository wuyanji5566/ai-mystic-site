"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FollowupArchive } from "@/components/followup-archive";
import { PaymentUnlockPanel } from "@/components/payment-unlock-panel";
import { PremiumReportOverview } from "@/components/premium-report-overview";
import { ReportReader } from "@/components/report-reader";
import {
  clearReportFollowups,
  getReportFollowups,
  saveReportFollowup,
  type FollowupMessage,
} from "@/lib/followup-storage";
import type { MysticInput, MysticProfile } from "@/lib/mystic";
import { siteConfig } from "@/lib/site-config";

type ServerReport = {
  id: string;
  reportId: string;
  title: string;
  createdAt: string;
  input: MysticInput;
  profile: MysticProfile;
  report: string;
  freeReport: string;
  fullReport?: string;
  mode: "ai" | "demo";
  statusMessage: string;
  unlocked: boolean;
  orderId?: string;
};

type FollowupResponse = {
  answer: string;
  mode: "ai" | "demo";
  statusMessage: string;
};

const followupPresets = [
  "我最适合做什么副业？",
  "我现在的事业卡点是什么？",
  "我的亲密关系最大问题是什么？",
  "未来 30 天我应该先做哪三件事？",
];

export function ReportDetail({
  reportId,
  initialOrderId = "",
}: {
  reportId: string;
  initialOrderId?: string;
}) {
  const [report, setReport] = useState<ServerReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [showFollowupPayment, setShowFollowupPayment] = useState(false);
  const [followupOrderId, setFollowupOrderId] = useState("");
  const [question, setQuestion] = useState(followupPresets[0]);
  const [followupHistory, setFollowupHistory] = useState<FollowupMessage[]>(() =>
    getReportFollowups(reportId),
  );
  const [followupLoading, setFollowupLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadReport = useCallback(
    async (paidOrderId = "") => {
      setLoading(true);
      setError("");
      try {
        const query = paidOrderId
          ? `?orderId=${encodeURIComponent(paidOrderId)}`
          : "";
        const response = await fetch(`/api/reports/${encodeURIComponent(reportId)}${query}`, {
          cache: "no-store",
        });
        const data = (await response.json()) as {
          report?: ServerReport;
          error?: string;
        };

        if (!response.ok || !data.report) {
          throw new Error(data.error || "报告读取失败");
        }
        setReport(data.report);
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "报告读取失败");
      } finally {
        setLoading(false);
      }
    },
    [reportId],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadReport(initialOrderId);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [initialOrderId, loadReport]);

  function handleFullReportPaid(paidOrderId: string) {
    setShowPayment(false);
    const url = `/report/${reportId}?orderId=${encodeURIComponent(paidOrderId)}`;
    window.location.assign(url);
  }

  function handleFollowupPaid(paidOrderId: string) {
    setFollowupOrderId(paidOrderId);
    setShowFollowupPayment(false);
    setMessage("付款已确认，正在生成你的专属追问解析。");
    void askFollowup(question, paidOrderId);
  }

  async function copyReport() {
    if (!report) return;
    await navigator.clipboard.writeText(report.report);
    setMessage(report.unlocked ? "完整报告已复制。" : "免费摘要已复制。");
  }

  async function askFollowup(
    selectedQuestion = question,
    verifiedOrderId = followupOrderId,
  ) {
    if (!report?.unlocked) {
      setShowPayment(true);
      setMessage("请先解锁完整报告，再进入四维追问室。");
      return;
    }
    if (!verifiedOrderId) {
      setShowFollowupPayment(true);
      setMessage(`四维追问室需单独解锁 ${siteConfig.followupPriceLabel}。`);
      return;
    }

    setQuestion(selectedQuestion);
    setFollowupLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/report-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId,
          orderId: verifiedOrderId,
          question: selectedQuestion,
        }),
      });
      const data = (await response.json()) as FollowupResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || "追问生成失败");
      const saved = saveReportFollowup({
        reportId,
        question: selectedQuestion,
        answer: data.answer,
        mode: data.mode,
        statusMessage: data.statusMessage,
      });
      setFollowupHistory((items) => [...items, saved].slice(-12));
      setMessage("专属追问解析已生成，并保存在当前设备。");
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "追问生成失败");
    } finally {
      setFollowupLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#080b0a] px-5 text-[#f6eddc]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[#d7aa55]/20 border-t-[#d7aa55]" />
          <p className="mt-4 text-sm tracking-[0.18em] text-[#d7aa55]">正在读取专属报告</p>
        </div>
      </main>
    );
  }

  if (!report || error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#080b0a] px-5 text-[#f6eddc]">
        <section className="w-full max-w-xl border border-[#d7aa55]/35 bg-[#111513] p-6">
          <p className="text-sm font-bold text-[#d7aa55]">报告暂时无法打开</p>
          <h1 className="mt-2 text-2xl font-black">{error || "未找到这份报告"}</h1>
          <Link href="/" className="mt-6 inline-flex bg-[#d7aa55] px-5 py-3 font-black text-[#17130c]">
            返回首页重新生成
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080b0a] text-[#f6eddc]">
      <header className="border-b border-[#d7aa55]/20 bg-[#0d1110] px-4 py-7">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#d7aa55]">
            AI Personal Destiny OS
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">{report.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#c9c0b1]">
            {[report.profile.zodiac, report.profile.westernSign, report.profile.yearPillar, report.input.mbtiType].map(
              (item) => (
                <span key={item} className="border border-[#d7aa55]/25 px-3 py-2">
                  {item}
                </span>
              ),
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-5 sm:py-9">
        <section className="mb-5 grid gap-3 border border-[#d7aa55]/25 bg-[#111513] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="text-sm font-bold text-[#d7aa55]">
              {report.unlocked ? "完整深度报告已解锁" : "免费核心摘要"}
            </p>
            <p className="mt-2 text-sm leading-7 text-[#bdb5a8]">
              {report.unlocked
                ? "这份报告已通过服务器订单核验，可保存、复盘并继续追问。"
                : "你已经看到核心画像，事业、财富、关系和行动方案仍需解锁。"}
            </p>
          </div>
          <button
            type="button"
            onClick={copyReport}
            className="h-11 border border-[#d7aa55]/35 px-4 text-sm font-bold text-[#f2d99a]"
          >
            复制当前报告
          </button>
        </section>

        {message ? (
          <p className="mb-5 border border-[#d7aa55]/30 bg-[#d7aa55]/8 px-4 py-3 text-sm text-[#f2d99a]">
            {message}
          </p>
        ) : null}

        {report.unlocked ? (
          <PremiumReportOverview input={report.input} profile={report.profile} />
        ) : null}

        <ReportReader
          report={report.report}
          input={report.input}
          profile={report.profile}
          locked={!report.unlocked}
        />

        {!report.unlocked ? (
          <section className="mt-6 border border-[#d7aa55]/45 bg-[#101412] p-5 sm:p-7">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d7aa55]">
              Deep Report
            </p>
            <h2 className="mt-3 text-2xl font-black">
              完整报告的价值，不是告诉你命运，而是帮你看懂下一步
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#c9c0b1]">
              如果你只是随便测一测，免费摘要已经够了。如果你正处在事业选择、关系困惑、自我重建或财富转型阶段，完整版更像一份给自己的深度复盘报告。
            </p>
            <button
              type="button"
              onClick={() => setShowPayment(true)}
              className="mt-5 h-13 w-full bg-[linear-gradient(100deg,#8a5a18,#e7c46c,#9a671e)] px-5 font-black text-[#17130c] sm:w-auto"
            >
              解锁我的完整人生报告 {siteConfig.fullReportPriceLabel}
            </button>
          </section>
        ) : (
          <section className="mt-6 border border-[#d7aa55]/35 bg-[#101412] p-5 sm:p-7">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d7aa55]">
              Four-Dimensional Follow-up
            </p>
            <h2 className="mt-3 text-2xl font-black">四维追问室</h2>
            <p className="mt-3 text-sm leading-7 text-[#c9c0b1]">
              围绕当前报告继续追问事业、财富、关系或行动计划。追问室单独解锁 {siteConfig.followupPriceLabel}，付款确认后会自动生成当前问题的详细解析。
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#d9cda8]">
              {["四维交叉依据", "真实场景拆解", "行动优先级", "30 天计划"].map((item) => (
                <span key={item} className="border border-[#d7aa55]/25 px-3 py-2">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {followupPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => void askFollowup(preset)}
                  disabled={followupLoading}
                  className="border border-[#d7aa55]/25 bg-[#161b18] px-4 py-3 text-left text-sm font-bold leading-6"
                >
                  {preset}
                </button>
              ))}
            </div>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={3}
              className="mt-4 w-full resize-none border border-[#d7aa55]/25 bg-[#0b0f0d] px-4 py-3 text-sm outline-none focus:border-[#d7aa55]"
              placeholder="输入你现在最想解决的具体问题"
            />
            <button
              type="button"
              onClick={() => void askFollowup()}
              disabled={followupLoading}
              className="mt-3 h-12 w-full bg-[#d7aa55] px-5 font-black text-[#17130c] disabled:opacity-50 sm:w-auto"
            >
              {followupLoading ? "正在生成专属解析..." : `继续深度追问 ${siteConfig.followupPriceLabel}`}
            </button>
            <FollowupArchive
              items={followupHistory}
              reportTitle={report.title}
              onClear={() => {
                clearReportFollowups(reportId);
                setFollowupHistory([]);
              }}
            />
          </section>
        )}

        <p className="mt-6 text-center text-xs leading-6 text-[#817a70]">
          本报告用于自我探索、认知复盘与成长参考，不替代医疗、法律、投资、婚恋等专业决策。
        </p>
      </div>

      {showPayment ? (
        <PaymentUnlockPanel
          reportId={reportId}
          productType="full_report"
          onUnlock={handleFullReportPaid}
          onClose={() => setShowPayment(false)}
        />
      ) : null}

      {showFollowupPayment ? (
        <PaymentUnlockPanel
          title="解锁四维追问室"
          description="付款核验后，可以基于当前完整报告继续生成一次专属深度解析。"
          reportId={reportId}
          productType="followup_room"
          productName="四维追问室"
          priceLabel={siteConfig.followupPriceLabel}
          onUnlock={handleFollowupPaid}
          onClose={() => setShowFollowupPayment(false)}
        />
      ) : null}
    </main>
  );
}
