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
import { PaymentUnlockPanel } from "@/components/payment-unlock-panel";
import { FreeSummaryReport } from "@/components/free-summary-report";
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

const focusPresets = [
  "事业",
  "财富",
  "感情",
  "婚姻",
  "健康",
  "人生方向",
  "副业",
  "转型",
  "亲子",
  "家庭",
];

const reportIntentPresets = [
  {
    title: "自我探索",
    desc: "适合想看懂性格底色、内在优势和反复卡住的模式。",
    focus:
      "请按自我探索方式分析我，重点拆解核心人格、底层模式、长期优势、反复卡点和未来 30 天调整建议。",
  },
  {
    title: "事业规划",
    desc: "适合重点看职业定位、适合环境、转型方向和副业路径。",
    focus:
      "请重点分析我的事业定位、适合赛道、工作环境、转型方向、副业路径，以及未来 30 天可执行动作。",
  },
  {
    title: "感情分析",
    desc: "适合看亲密关系、沟通模式、安全感和关系风险点。",
    focus:
      "请重点分析我的亲密关系模式、沟通方式、安全感需求、边界感、关系风险点和未来 30 天关系调整建议。",
  },
  {
    title: "年度复盘",
    desc: "适合看未来一年节奏、阶段机会、风险提醒和行动重点。",
    focus:
      "请重点分析我未来一年的阶段节奏、关键机会、容易错过的风险、财富与关系提醒，以及每个阶段的行动重点。",
  },
  {
    title: "咨询预览",
    desc: "适合付费咨询前，先快速看自己最值得深入的问题。",
    focus:
      "请按付费咨询前预览方式分析我，指出我当前最值得深入的问题、最核心的卡点、适合追问的方向和 30 天初步行动。",
  },
];

const generationHighlights = [
  ["01", "资料建模", "出生信息、地点、时间、MBTI 与当前关注点"],
  ["02", "四维融合", "紫微视角、八字节律、星座能量、行为模式"],
  ["03", "报告输出", "免费摘要、完整版解锁、继续深度追问"],
];

const currentYear = new Date().getFullYear();
const birthMonths = Array.from({ length: 12 }, (_, index) => index + 1);
const hours = Array.from({ length: 24 }, (_, index) => index);
const minutes = Array.from({ length: 12 }, (_, index) => index * 5);

const formSteps = [
  ["01", "基础信息", "昵称、性别、出生日期、出生时间、出生地"],
  ["02", "人格关注", "MBTI、关注方向、报告用途"],
  ["03", "确认生成", "检查信息并生成免费摘要"],
] as const;

type FormStep = 1 | 2 | 3;

const birthTimeModes = [
  ["precise", "精确时间"],
  ["period", "按时辰选"],
  ["unknown", "不知道时间"],
] as const;

const timePeriodPresets = [
  ["子时", "00:00", "23:00-00:59"],
  ["丑时", "01:00", "01:00-02:59"],
  ["寅时", "03:00", "03:00-04:59"],
  ["卯时", "05:00", "05:00-06:59"],
  ["辰时", "07:00", "07:00-08:59"],
  ["巳时", "09:00", "09:00-10:59"],
  ["午时", "11:00", "11:00-12:59"],
  ["未时", "13:00", "13:00-14:59"],
  ["申时", "15:00", "15:00-16:59"],
  ["酉时", "17:00", "17:00-18:59"],
  ["戌时", "19:00", "19:00-20:59"],
  ["亥时", "21:00", "21:00-22:59"],
] as const;

function getDaysInMonth(year: string, month: string) {
  const parsedYear = Number(year || currentYear);
  const parsedMonth = Number(month || 1);
  return new Date(parsedYear, parsedMonth, 0).getDate();
}

function splitBirthDate(date: string) {
  const [year = "", month = "", day = ""] = date.split("-");
  return { year, month, day };
}

function buildBirthDate(year: string, month: string, day: string) {
  if (!year || !month || !day) return "";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function splitBirthTime(time: string) {
  const [hour = "", minute = ""] = time.split(":");
  return { hour, minute };
}

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
  const [activeStep, setActiveStep] = useState<FormStep>(1);
  const [selectedIntent, setSelectedIntent] = useState(reportIntentPresets[0].title);
  const [selectedFocusTags, setSelectedFocusTags] = useState<string[]>([]);
  const [birthDateDraft, setBirthDateDraft] = useState(() => splitBirthDate(initialForm.birthDate));
  const [birthTimeDraft, setBirthTimeDraft] = useState(() => splitBirthTime(initialForm.birthTime));
  const [birthTimeMode, setBirthTimeMode] =
    useState<(typeof birthTimeModes)[number][0]>("precise");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [savedReport, setSavedReport] = useState<SavedMysticReport | null>(null);
  const [storageMode, setStorageMode] = useState<ReportStorageMode>("local");
  const [copyMessage, setCopyMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [freeUsedCount, setFreeUsedCount] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [unlockSeconds, setUnlockSeconds] = useState(15 * 60);
  const reportRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFreeUsedCount(getFreeReportUsage().count);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setUnlockSeconds((seconds) => (seconds > 0 ? seconds - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setReport(null);
    setSavedReport(null);
    setCopyMessage("");

    const stepError = getStepError(3);
    if (stepError) {
      setError(stepError);
      setActiveStep(stepError.includes("MBTI") || stepError.includes("方向") ? 2 : 1);
      return;
    }

    if (!form.birthTime) {
      setError("请选择出生时间。如果不确定，可以选择“不知道时间”。");
      return;
    }

    const hasUsedFreeReport = getFreeReportUsage().count >= siteConfig.freeReportsPerUser;

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
      setReport(reportData);

      try {
        const saved = await saveReportWithCloudFallback({
          input: form,
          profile: reportData.profile,
          report: reportData.report,
          mode: reportData.mode,
          statusMessage: reportData.statusMessage,
        });
        setSavedReport(saved.report);
        setStorageMode(saved.storage);
      } catch (storageError) {
        console.error("Report generated but local save failed:", storageError);
        setSavedReport(null);
        setStorageMode("local");
        setCopyMessage("报告已生成，但当前浏览器阻止了本地保存；请先截图或复制摘要。");
      }

      try {
        setFreeUsedCount(markFreeReportGenerated().count);
      } catch (usageError) {
        console.error("Report generated but usage counter failed:", usageError);
      }

      if (hasUsedFreeReport) {
        setCopyMessage(
          `已为你生成新的免费摘要。完整版深度解析 ${siteConfig.fullReportPriceLabel} 可扫码解锁。`,
        );
      }
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
    const preview = report.report.split("\n").slice(0, 12).join("\n");
    await navigator.clipboard.writeText(
      `${preview}\n\n【完整版内容已隐藏】\n解锁后可查看完整深度分析、继续追问和行动计划。`,
    );
    setCopyMessage("免费摘要已复制。完整版内容需要解锁后查看。");
  }

  const birthDays = Array.from(
    { length: getDaysInMonth(birthDateDraft.year, birthDateDraft.month) },
    (_, index) => index + 1,
  );

  const unlockCountdown = `${String(Math.floor(unlockSeconds / 60)).padStart(2, "0")}:${String(
    unlockSeconds % 60,
  ).padStart(2, "0")}`;

  function getStepError(step: FormStep) {
    if (step >= 1) {
      if (!form.name.trim()) return "请先填写昵称。";
      if (!form.birthDate) return "请选择完整的出生日期。";
      if (!form.birthTime) return "请选择出生时间。如果不确定，可以选择“不知道时间”。";
      if (!form.birthPlace.trim()) return "请填写出生地点。";
    }

    if (step >= 2) {
      if (!form.mbtiType) return "请选择 MBTI 类型；如果不确定，可以选择“不确定”。";
      if (form.focus.trim().length < 4) return "请写下你最想看的方向。";
    }

    return "";
  }

  function goNextStep() {
    const errorMessage = getStepError(activeStep);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setError("");
    setActiveStep((step) => (step === 1 ? 2 : 3));
  }

  function goPrevStep() {
    setError("");
    setActiveStep((step) => (step === 3 ? 2 : 1));
  }

  function updateBirthDate(part: "year" | "month" | "day", value: string) {
    const next = { ...birthDateDraft, [part]: value };
    const maxDay = getDaysInMonth(next.year, next.month);
    const nextDay = next.day && Number(next.day) > maxDay ? String(maxDay) : next.day;
    const nextDraft = { ...next, day: nextDay };
    setBirthDateDraft(nextDraft);
    setForm({
      ...form,
      birthDate: buildBirthDate(nextDraft.year, nextDraft.month, nextDraft.day),
    });
  }

  function updatePreciseBirthTime(part: "hour" | "minute", value: string) {
    const next = { ...birthTimeDraft, [part]: value };
    setBirthTimeDraft(next);
    setForm({
      ...form,
      birthTime: next.hour && next.minute ? `${next.hour.padStart(2, "0")}:${next.minute.padStart(2, "0")}` : "",
      birthTimeNote: "用户提供了具体出生时间",
    });
  }

  function selectBirthTimeMode(mode: (typeof birthTimeModes)[number][0]) {
    setBirthTimeMode(mode);
    if (mode === "unknown") {
      setSelectedPeriod("");
      setBirthTimeDraft({ hour: "12", minute: "00" });
      setForm({
        ...form,
        birthTime: "12:00",
        birthTimeNote: "用户不确定具体出生时间，仍可生成报告，但紫微和八字精度会降低",
      });
      return;
    }

    if (mode === "period") {
      setSelectedPeriod("");
      setBirthTimeDraft({ hour: "", minute: "" });
      setForm({
        ...form,
        birthTime: "",
        birthTimeNote: "用户准备按传统时辰选择出生时间",
      });
      return;
    }

    if (mode === "precise") {
      setSelectedPeriod("");
      setBirthTimeDraft({ hour: "", minute: "" });
      setForm({
        ...form,
        birthTime: "",
        birthTimeNote: "用户提供了具体出生时间",
      });
    }
  }

  function selectTimePeriod(label: string, time: string, range: string) {
    setSelectedPeriod(label);
    setBirthTimeDraft(splitBirthTime(time));
    setForm({
      ...form,
      birthTime: time,
      birthTimeNote: `用户按传统时辰选择了${label}（${range}），系统取该时辰代表时间做参考`,
    });
  }

  function toggleFocusTag(tag: string) {
    const nextTags = selectedFocusTags.includes(tag)
      ? selectedFocusTags.filter((item) => item !== tag)
      : [...selectedFocusTags, tag];
    setSelectedFocusTags(nextTags);

    if (nextTags.length) {
      setForm({
        ...form,
        focus: `我想重点看：${nextTags.join("、")}。请结合我的出生信息、MBTI 和当前状态，生成具体分析与行动建议。`,
      });
    }
  }

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

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {generationHighlights.map(([step, title, desc]) => (
          <article key={step} className="border border-[#f5efe2]/10 bg-[#121a17] p-4">
            <p className="text-xs font-bold text-[#d7aa55]">{step}</p>
            <h3 className="mt-3 text-sm font-bold text-[#fff8ec]">{title}</h3>
            <p className="mt-2 text-xs leading-5 text-[#c7baa6]">{desc}</p>
          </article>
        ))}
      </div>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-2 sm:grid-cols-3">
          {formSteps.map(([number, title, desc], index) => {
            const step = (index + 1) as FormStep;
            return (
              <button
                key={number}
                type="button"
                onClick={() => {
                  if (step < activeStep) setActiveStep(step);
                }}
                className={`border p-3 text-left transition ${
                  activeStep === step
                    ? "border-[#d7aa55] bg-[#d7aa55] text-[#121714]"
                    : activeStep > step
                      ? "border-[#2f9c89]/35 bg-[#0f1917] text-[#aef2dd]"
                      : "border-[#f5efe2]/12 bg-[#0f1412] text-[#cfc2ae]"
                }`}
              >
                <span className="text-xs font-bold">{number}</span>
                <span className="mt-2 block text-sm font-bold">{title}</span>
                <span className="mt-1 block text-xs leading-5 opacity-80">{desc}</span>
              </button>
            );
          })}
        </div>

        {activeStep === 1 ? (
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_0.7fr]">
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
            </div>

            <div className="grid gap-4 sm:grid-cols-[0.7fr_1.3fr]">
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

              <div className={labelClass}>
                <div className="flex items-center justify-between gap-3">
                  <span>出生日期</span>
                  <span className="text-xs font-normal text-[#9fa89f]">
                    {form.birthDate || "请选择年月日"}
                  </span>
                </div>
                <div className="grid grid-cols-[1.15fr_0.85fr_0.85fr] gap-2">
                  <input
                    required
                    type="number"
                    inputMode="numeric"
                    min={1940}
                    max={currentYear}
                    aria-label="出生年份"
                    value={birthDateDraft.year}
                    onChange={(event) => updateBirthDate("year", event.target.value)}
                    className={inputClass}
                    placeholder="年份"
                  />
                  <select
                    required
                    aria-label="出生月份"
                    value={birthDateDraft.month ? String(Number(birthDateDraft.month)) : ""}
                    onChange={(event) => updateBirthDate("month", event.target.value)}
                    className={inputClass}
                  >
                    <option value="">月</option>
                    {birthMonths.map((month) => (
                      <option key={month} value={month}>
                        {month} 月
                      </option>
                    ))}
                  </select>
                  <select
                    required
                    aria-label="出生日期"
                    value={birthDateDraft.day ? String(Number(birthDateDraft.day)) : ""}
                    onChange={(event) => updateBirthDate("day", event.target.value)}
                    className={inputClass}
                  >
                    <option value="">日</option>
                    {birthDays.map((day) => (
                      <option key={day} value={day}>
                        {day} 日
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
              <div className={labelClass}>
                <div className="flex items-center justify-between gap-3">
                  <span>出生时间</span>
                  <span className="text-xs font-normal text-[#9fa89f]">
                    {form.birthTimeNote || form.birthTime || "请选择时间"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {birthTimeModes.map(([mode, label]) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => selectBirthTimeMode(mode)}
                      className={`h-11 border px-2 text-xs font-bold transition ${
                        birthTimeMode === mode
                          ? "border-[#d7aa55] bg-[#d7aa55] text-[#121714]"
                          : "border-[#f5efe2]/12 bg-[#0f1412] text-[#cfc2ae] hover:border-[#d7aa55]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {birthTimeMode === "precise" ? (
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      required
                      aria-label="出生小时"
                      value={birthTimeDraft.hour ? String(Number(birthTimeDraft.hour)) : ""}
                      onChange={(event) => updatePreciseBirthTime("hour", event.target.value)}
                      className={inputClass}
                    >
                      <option value="">小时</option>
                      {hours.map((hour) => (
                        <option key={hour} value={hour}>
                          {String(hour).padStart(2, "0")} 点
                        </option>
                      ))}
                    </select>
                    <select
                      required
                      aria-label="出生分钟"
                      value={birthTimeDraft.minute ? String(Number(birthTimeDraft.minute)) : ""}
                      onChange={(event) => updatePreciseBirthTime("minute", event.target.value)}
                      className={inputClass}
                    >
                      <option value="">分钟</option>
                      {minutes.map((minute) => (
                        <option key={minute} value={minute}>
                          {String(minute).padStart(2, "0")} 分
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {birthTimeMode === "period" ? (
                  <div className="grid grid-cols-3 gap-2">
                    {timePeriodPresets.map(([label, time, range]) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => selectTimePeriod(label, time, range)}
                        className={`border px-2 py-2 text-left text-xs leading-5 transition ${
                          selectedPeriod === label
                            ? "border-[#d7aa55] bg-[#d7aa55] text-[#121714]"
                            : "border-[#f5efe2]/12 bg-[#0f1412] text-[#cfc2ae] hover:border-[#d7aa55]"
                        }`}
                      >
                        <strong className="block">{label}</strong>
                        <span>{range}</span>
                      </button>
                    ))}
                  </div>
                ) : null}

                {birthTimeMode === "unknown" ? (
                  <p className="border border-[#d7aa55]/18 bg-[#0f1412] px-3 py-2 text-xs font-normal leading-5 text-[#cfc2ae]">
                    不知道具体时间仍可生成报告，但紫微和八字精度会降低；系统会更多结合生日、年份、星座和 MBTI 做结构化分析。
                  </p>
                ) : null}
              </div>

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
            </div>
          </div>
        ) : null}

        {activeStep === 2 ? (
          <div className="grid gap-4">
            <div className="border border-[#d7aa55]/18 bg-[#0b100e] p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d7aa55]">
                    Report Mode
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-[#fff8ec]">选择报告用途</h3>
                </div>
                <p className="max-w-sm text-xs leading-5 text-[#c7baa6]">
                  用途越具体，生成结果越像咨询报告，而不是泛泛的性格描述。
                </p>
              </div>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {reportIntentPresets.map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => {
                      setSelectedIntent(preset.title);
                      setForm({ ...form, focus: preset.focus });
                    }}
                    className={`border p-4 text-left transition ${
                      selectedIntent === preset.title
                        ? "border-[#d7aa55] bg-[#d7aa55] text-[#121714]"
                        : "border-[#f5efe2]/12 bg-[#101713] text-[#f5efe2] hover:border-[#d7aa55]"
                    }`}
                  >
                    <span className="text-sm font-bold">{preset.title}</span>
                    <span
                      className={`mt-2 block text-xs leading-5 ${
                        selectedIntent === preset.title ? "text-[#2b261c]" : "text-[#c7baa6]"
                      }`}
                    >
                      {preset.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[0.8fr_1.2fr]">
              <label className={labelClass}>
                MBTI 类型
                <select
                  value={form.mbtiType}
                  onChange={(event) => {
                    const mbtiType = event.target.value;
                    setForm({
                      ...form,
                      mbtiType,
                      mbtiCertainty:
                        mbtiType === "不确定"
                          ? "unknown"
                          : form.mbtiCertainty === "unknown"
                            ? "estimated"
                            : form.mbtiCertainty,
                    });
                  }}
                  className={inputClass}
                >
                  {mbtiTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "不确定" ? "不知道，系统根据描述推测" : type}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-2">
                <span className="text-sm font-semibold text-[#f1e6d2]">MBTI 确认度</span>
                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    ["known", "做过测试，很确定"],
                    ["estimated", "大概判断"],
                    ["unknown", "不确定"],
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
                  onClick={() => toggleFocusTag(preset)}
                  className={`border px-3 py-2 text-xs font-semibold transition ${
                    selectedFocusTags.includes(preset)
                      ? "border-[#d7aa55] bg-[#d7aa55] text-[#121714]"
                      : "border-[#f5efe2]/12 text-[#cfc2ae] hover:border-[#2f9c89] hover:text-[#aef2dd]"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {activeStep === 3 ? (
          <div className="grid gap-4">
            <div className="border border-[#d7aa55]/22 bg-[#0b100e] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d7aa55]">
                Confirm
              </p>
              <h3 className="mt-2 text-xl font-bold text-[#fff8ec]">确认信息并生成免费摘要</h3>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                {[
                  ["姓名/性别", `${form.name || "未填"} / ${form.gender}`],
                  ["出生信息", `${form.calendarType === "solar" ? "公历" : "农历"} ${form.birthDate || "未填"} ${form.birthTime || "未填"}`],
                  ["出生地点", form.birthPlace || "未填"],
                  ["MBTI", `${form.mbtiType} / ${form.mbtiCertainty}`],
                ].map(([label, value]) => (
                  <p key={label} className="border border-[#f5efe2]/10 bg-[#101713] px-4 py-3">
                    <span className="block text-xs font-bold text-[#d7aa55]">{label}</span>
                    <strong className="mt-2 block text-[#fff8ec]">{value}</strong>
                  </p>
                ))}
              </div>
              <p className="mt-4 border border-[#2f9c89]/22 bg-[#0e1917] px-4 py-3 text-sm leading-7 text-[#c8efe4]">
                免费摘要会展示核心性格、事业方向和关系提醒。完整版可继续解锁详细分析、30 天行动方案和后续追问。
              </p>
            </div>
          </div>
        ) : null}

        {error ? (
          <p className="border border-[#8b2732]/45 bg-[#2a1418] px-4 py-3 text-sm text-[#ffd6db]">
            {error}
          </p>
        ) : null}

        <div className="grid gap-2 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <button
            type="button"
            onClick={goPrevStep}
            disabled={activeStep === 1 || isLoading}
            className="h-12 border border-[#f5efe2]/14 px-5 text-sm font-bold text-[#cfc2ae] transition hover:border-[#d7aa55] hover:text-[#d7aa55] disabled:cursor-not-allowed disabled:opacity-40"
          >
            上一步
          </button>
          <p className="text-center text-xs leading-5 text-[#9fa89f]">
            第 {activeStep} / 3 步 · 信息越具体，报告越像一对一咨询。
          </p>
          {activeStep < 3 ? (
            <button
              type="button"
              onClick={goNextStep}
              disabled={isLoading}
              className="xj-cta h-12 bg-[#d7aa55] px-6 text-sm font-bold text-[#121714] transition hover:bg-[#f0c86c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              下一步 →
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="xj-cta h-12 bg-[#d7aa55] px-6 text-sm font-bold text-[#121714] transition hover:bg-[#f0c86c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "正在生成..." : "生成我的报告 →"}
            </button>
          )}
        </div>
      </form>

      {isLoading ? (
        <div className="mt-4 border border-[#d7aa55]/20 bg-[#171f1b] p-4 text-sm leading-6 text-[#d8cdb9]">
          <p className="font-bold text-[#fff8ec]">正在生成你的四维报告</p>
          <p className="mt-2">内容较长时可能需要 10-30 秒，请不要重复点击。系统正在完成资料建模、四维融合和报告整理。</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {["建模中", "融合中", "整理中"].map((step) => (
              <div key={step} className="border border-[#d7aa55]/16 bg-[#0f1412] px-3 py-2 text-xs font-bold text-[#d7aa55]">
                {step}
              </div>
            ))}
          </div>
        </div>
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
              {report.mode === "ai" ? "玄机 AI" : "演示回退"}
            </span>
          </div>

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
              复制摘要
            </button>
            <Link
              href="/service"
              className="flex h-11 items-center justify-center border border-[#121714]/18 bg-white px-4 text-sm font-bold transition hover:border-[#8b2732]"
            >
              解锁流程
            </Link>
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
          <div className="mt-5">
            <FreeSummaryReport
              input={form}
              profile={report.profile}
              report={report.report}
              onUnlock={() => setShowPayment(true)}
            />
          </div>
          <p className="mt-5 text-xs text-[#69756f]">
            当前模式：{report.mode === "ai" ? "玄机 AI 生成" : "演示报告"} · 完整版倒计时 {unlockCountdown}
          </p>
        </article>
      ) : null}

      {showPayment ? (
        <PaymentUnlockPanel
          title={report ? "完整深度报告 · 限时体验价 19.9 元" : "解锁下一次完整报告"}
          description={
            report
              ? "如果你正处在人生选择、事业转型、关系困惑或自我重建阶段，完整版更像是一份给自己的复盘报告。"
              : "免费生成次数已用完。支付后可继续生成完整版报告，并获得后续深度解析入口。"
          }
          onClose={() => setShowPayment(false)}
        />
      ) : null}
    </section>
  );
}
