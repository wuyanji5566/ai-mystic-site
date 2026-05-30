"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import type { MysticInput } from "@/lib/mystic";
import {
  getFreeReportUsage,
  markFreeReportGenerated,
} from "@/lib/account-storage";
import {
  saveReportWithCloudFallback,
  type ReportStorageMode,
  type SavedMysticReport,
} from "@/lib/report-storage";
import { siteConfig } from "@/lib/site-config";

type ReportResponse = {
  profile: {
    zodiac: string;
    westernSign: string;
    yearPillar: string;
    birthSummary: string;
  };
  report: string;
  mode: "ai" | "demo";
  statusMessage: string;
};

const initialForm: MysticInput = {
  name: "",
  gender: "未透露",
  birthDate: "",
  birthTime: "",
  birthPlace: "",
  calendarType: "solar",
  mbtiType: "不确定",
  mbtiCertainty: "unknown",
  focus: "事业方向和未来一年建议",
};

const focusPresets = ["事业方向", "亲密关系", "财富习惯", "人生定位", "MBTI 调整"];

const mbtiTypes = [
  "不确定",
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];

const inputClass =
  "h-12 border border-[#d7aa55]/26 bg-[#0f1412] px-4 text-[#fff8ec] outline-none transition placeholder:text-[#8b948d] focus:border-[#d7aa55] focus:bg-[#121a17]";

const labelClass = "grid gap-2 text-sm font-semibold text-[#f1e6d2]";

export function MysticReportForm() {
  const [form, setForm] = useState(initialForm);
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [savedReport, setSavedReport] = useState<SavedMysticReport | null>(null);
  const [storageMode, setStorageMode] = useState<ReportStorageMode>("local");
  const [copyMessage, setCopyMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [freeUsedCount, setFreeUsedCount] = useState(0);
  const reportRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFreeUsedCount(getFreeReportUsage().count);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setReport(null);
    setSavedReport(null);
    setCopyMessage("");

    if (getFreeReportUsage().count >= siteConfig.freeReportsPerUser) {
      setError(
        `免费生成次数已用完。完整版报告 ${siteConfig.fullReportPriceLabel}，请添加客服微信 ${siteConfig.contactWeChat} 人工付款后解锁。`,
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/mystic-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as unknown;

      if (!response.ok) {
        const errorData = data as { error?: string };
        throw new Error(errorData.error || "生成失败，请稍后再试。");
      }

      const reportData = data as ReportResponse;
      const saved = await saveReportWithCloudFallback({
        input: form,
        profile: reportData.profile,
        report: reportData.report,
        mode: reportData.mode,
        statusMessage: reportData.statusMessage,
      });

      setReport(reportData);
      setSavedReport(saved.report);
      setStorageMode(saved.storage);
      setFreeUsedCount(markFreeReportGenerated().count);
      window.setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请稍后再试。");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyReportLink() {
    if (!savedReport) return;
    const url = `${window.location.origin}/report/${savedReport.id}`;
    await navigator.clipboard.writeText(url);
    setCopyMessage(
      storageMode === "cloud"
        ? "云端详情链接已复制，可以在其他设备访问。"
        : "本地详情链接已复制。当前还没配置 Supabase，跨设备分享需要先接数据库。",
    );
  }

  async function copyReportText() {
    if (!report) return;
    await navigator.clipboard.writeText(report.report);
    setCopyMessage("报告正文已复制，可以直接发给用户或粘贴到文档。");
  }

  const statusClass =
    report?.mode === "ai"
      ? "border-[#2f9c89]/35 bg-[#13302b] text-[#aef2dd]"
      : "border-[#d7aa55]/35 bg-[#342817] text-[#f4d795]";

  return (
    <section
      id="report-form"
      className="w-full border border-[#d7aa55]/24 bg-[#101713]/94 p-5 text-[#f5efe2] shadow-2xl shadow-black/45 sm:p-6"
    >
      <div className="flex flex-col gap-4 border-b border-[#f5efe2]/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d7aa55]">
            Self Insight Console
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[#fff8ec]">
            构建你的多维画像
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-[#cfc2ae]">
            输入出生信息与 MBTI 倾向，系统会融合紫微、八字、星座、MBTI 四个维度，生成可继续追问的自我理解报告。
          </p>
        </div>
        <Link
          href="/reports"
          className="w-fit border border-[#d7aa55]/30 px-3 py-2 text-xs font-bold text-[#d7aa55] transition hover:bg-[#d7aa55] hover:text-[#121714]"
        >
          历史报告
        </Link>
      </div>

      <div className="mt-5 grid gap-3 border border-[#d7aa55]/18 bg-[#0f1412] p-4 text-sm text-[#d8cdb9] sm:grid-cols-3">
        <p>
          <span className="block text-xs font-bold uppercase tracking-[0.18em] text-[#d7aa55]">
            Free Quota
          </span>
          <strong className="mt-2 block text-[#fff8ec]">
            已用 {freeUsedCount} / {siteConfig.freeReportsPerUser}
          </strong>
        </p>
        <p>
          <span className="block text-xs font-bold uppercase tracking-[0.18em] text-[#d7aa55]">
            Analysis Stack
          </span>
          <strong className="mt-2 block text-[#fff8ec]">紫微 / 八字 / 星座 / MBTI</strong>
        </p>
        <p>
          <span className="block text-xs font-bold uppercase tracking-[0.18em] text-[#d7aa55]">
            WeChat
          </span>
          <strong className="mt-2 block text-[#fff8ec]">{siteConfig.contactWeChat}</strong>
        </p>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <label className={labelClass}>
          昵称
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className={inputClass}
            placeholder="例如：小林"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            性别
            <select
              value={form.gender}
              onChange={(event) => setForm({ ...form, gender: event.target.value })}
              className={inputClass}
            >
              <option>未透露</option>
              <option>女</option>
              <option>男</option>
            </select>
          </label>

          <label className={labelClass}>
            历法
            <select
              value={form.calendarType}
              onChange={(event) =>
                setForm({ ...form, calendarType: event.target.value as "solar" | "lunar" })
              }
              className={inputClass}
            >
              <option value="solar">公历</option>
              <option value="lunar">农历</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            出生日期
            <input
              required
              type="date"
              value={form.birthDate}
              onChange={(event) => setForm({ ...form, birthDate: event.target.value })}
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            出生时间
            <input
              required
              type="time"
              value={form.birthTime}
              onChange={(event) => setForm({ ...form, birthTime: event.target.value })}
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_0.9fr]">
          <label className={labelClass}>
            出生地点
            <input
              required
              value={form.birthPlace}
              onChange={(event) => setForm({ ...form, birthPlace: event.target.value })}
              className={inputClass}
              placeholder="例如：杭州"
            />
          </label>

          <label className={labelClass}>
            MBTI 类型
            <select
              value={form.mbtiType}
              onChange={(event) => {
                const mbtiType = event.target.value;
                setForm({
                  ...form,
                  mbtiType,
                  mbtiCertainty: mbtiType === "不确定" ? "unknown" : form.mbtiCertainty === "unknown" ? "estimated" : form.mbtiCertainty,
                });
              }}
              className={inputClass}
            >
              {mbtiTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-2">
          <span className="text-sm font-semibold text-[#f1e6d2]">MBTI 确认度</span>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              ["known", "做过测试，很确定"],
              ["estimated", "大概判断，不完全确定"],
              ["unknown", "不确定，交给 AI 推断"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    mbtiCertainty: value as MysticInput["mbtiCertainty"],
                    mbtiType: value === "unknown" ? "不确定" : form.mbtiType,
                  })
                }
                className={`border px-3 py-3 text-left text-xs font-semibold leading-5 transition ${
                  form.mbtiCertainty === value
                    ? "border-[#d7aa55] bg-[#d7aa55] text-[#121714]"
                    : "border-[#f5efe2]/12 text-[#cfc2ae] hover:border-[#2f9c89] hover:text-[#aef2dd]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <label className={labelClass}>
          你最想看的方向
          <textarea
            required
            rows={4}
            value={form.focus}
            onChange={(event) => setForm({ ...form, focus: event.target.value })}
            className="resize-none border border-[#d7aa55]/26 bg-[#0f1412] px-4 py-3 text-[#fff8ec] outline-none transition placeholder:text-[#8b948d] focus:border-[#d7aa55] focus:bg-[#121a17]"
            placeholder="例如：我想知道事业定位、感情模式、财富习惯，以及未来 30 天怎么调整。"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {focusPresets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setForm({ ...form, focus: `${preset}与未来 30 天行动建议` })}
              className="border border-[#f5efe2]/12 px-3 py-2 text-xs font-semibold text-[#cfc2ae] transition hover:border-[#2f9c89] hover:text-[#aef2dd]"
            >
              {preset}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-1 h-13 bg-[#d7aa55] px-5 text-sm font-bold text-[#121714] transition hover:bg-[#f0c86c] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "正在生成并保存报告，请稍等..." : "生成四维融合分析报告"}
        </button>
      </form>

      {isLoading ? (
        <p className="mt-4 border border-[#d7aa55]/20 bg-[#171f1b] px-4 py-3 text-sm leading-6 text-[#d8cdb9]">
          已提交信息，DeepSeek 正在生成报告。第一次真实 AI 调用可能需要几秒钟。
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 border border-[#8b2732]/45 bg-[#2a1418] px-4 py-3 text-sm text-[#ffd6db]">
          {error}
        </p>
      ) : null}

      {report ? (
        <article ref={reportRef} className="mt-6 scroll-mt-6 border border-[#d7aa55]/24 bg-[#f5efe2] p-5 text-[#121714]">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b2732]">
                Result
              </p>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-3xl">
                你的四维融合报告已生成并保存
              </h3>
            </div>
            <span className="w-fit border border-[#121714]/15 px-3 py-1 text-xs font-bold">
              {report.mode === "ai" ? "真实 AI" : "演示回退"}
            </span>
          </div>

          <p className={`mb-4 border px-4 py-3 text-sm font-bold ${statusClass}`}>
            {report.statusMessage}
          </p>

          <p className="mb-4 border border-[#121714]/10 bg-white px-4 py-3 text-sm text-[#52615b]">
            保存位置：{storageMode === "cloud" ? "Supabase 云端，可跨设备分享" : "浏览器本地，仅当前设备可复看"}
          </p>

          <div className="mb-5 grid gap-2 sm:grid-cols-3">
            {savedReport ? (
              <Link
                href={`/report/${savedReport.id}`}
                className="flex h-11 items-center justify-center bg-[#121714] px-4 text-sm font-bold text-[#f5efe2] transition hover:bg-[#8b2732]"
              >
                查看详情页
              </Link>
            ) : null}
            <button
              type="button"
              onClick={copyReportLink}
              disabled={!savedReport}
              className="h-11 border border-[#121714]/18 bg-white px-4 text-sm font-bold transition hover:border-[#8b2732] disabled:cursor-not-allowed disabled:opacity-50"
            >
              复制详情链接
            </button>
            <button
              type="button"
              onClick={copyReportText}
              className="h-11 border border-[#121714]/18 bg-white px-4 text-sm font-bold transition hover:border-[#8b2732]"
            >
              复制报告正文
            </button>
          </div>

          {copyMessage ? (
            <p className="mb-4 border border-[#121714]/10 bg-white px-4 py-3 text-sm text-[#52615b]">
              {copyMessage}
            </p>
          ) : null}

          <div className="grid gap-3 border-y border-[#121714]/10 py-4 text-sm sm:grid-cols-4">
            <p>
              <span className="block text-[#69756f]">生肖</span>
              <strong>{report.profile.zodiac}</strong>
            </p>
            <p>
              <span className="block text-[#69756f]">星座</span>
              <strong>{report.profile.westernSign}</strong>
            </p>
            <p>
              <span className="block text-[#69756f]">年柱</span>
              <strong>{report.profile.yearPillar}</strong>
            </p>
            <p>
              <span className="block text-[#69756f]">MBTI</span>
              <strong>{form.mbtiType}</strong>
            </p>
          </div>
          <p className="mt-4 text-sm leading-7 text-[#52615b]">{report.profile.birthSummary}</p>
          <div className="mt-5 whitespace-pre-wrap text-sm leading-7">{report.report}</div>
          <p className="mt-5 text-xs text-[#69756f]">
            当前模式：{report.mode === "ai" ? "DeepSeek 真实 AI 生成" : "演示报告"}
          </p>
        </article>
      ) : null}
    </section>
  );
}
