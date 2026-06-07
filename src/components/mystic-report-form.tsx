"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { PaymentUnlockPanel } from "@/components/payment-unlock-panel";
import { ReportReader } from "@/components/report-reader";
import type { MysticInput, MysticProfile } from "@/lib/mystic";
import { siteConfig } from "@/lib/site-config";

type ReportResponse = {
  reportId: string;
  createdAt: string;
  profile: MysticProfile;
  report: string;
  freeReport: string;
  lockedSections: string[];
  mode: "ai" | "demo";
  statusMessage: string;
};

const initialForm: MysticInput = {
  name: "",
  gender: "未透露",
  birthDate: "",
  birthTime: "12:00",
  birthTimeNote: "",
  birthPlace: "",
  calendarType: "solar",
  lunarLeapMonth: false,
  mbtiType: "不确定",
  mbtiCertainty: "unknown",
  focus: "",
};

const focusOptions = [
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

const ritualSteps = [
  "正在读取出生节律",
  "正在融合四维画像",
  "正在生成核心摘要",
];

const fieldClass =
  "h-12 w-full border border-[#d7aa55]/25 bg-[#0b100e] px-4 text-[#fff8ec] outline-none transition placeholder:text-[#777f78] focus:border-[#d7aa55]";

export function MysticReportForm() {
  const [form, setForm] = useState(initialForm);
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [unknownTime, setUnknownTime] = useState(false);
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);
  const [accepted, setAccepted] = useState(false);
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [ritualIndex, setRitualIndex] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const reportRef = useRef<HTMLElement | null>(null);

  const focusText = useMemo(() => {
    const custom = form.focus.trim();
    return [selectedFocus.join("、"), custom].filter(Boolean).join("；");
  }, [form.focus, selectedFocus]);

  const birthYears = useMemo(
    () =>
      Array.from(
        { length: new Date().getFullYear() - 1919 },
        (_, index) => String(new Date().getFullYear() - index),
      ),
    [],
  );
  const daysInSelectedMonth = useMemo(() => {
    if (form.calendarType === "lunar") return 30;
    if (!birthYear || !birthMonth) return 31;
    return new Date(Number(birthYear), Number(birthMonth), 0).getDate();
  }, [birthMonth, birthYear, form.calendarType]);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setInterval(() => {
      setRitualIndex((current) => Math.min(current + 1, ritualSteps.length - 1));
    }, 420);
    return () => window.clearInterval(timer);
  }, [loading]);

  function update<K extends keyof MysticInput>(key: K, value: MysticInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateBirthDate(year: string, month: string, day: string) {
    const maxDay =
      form.calendarType === "lunar"
        ? 30
        : year && month
          ? new Date(Number(year), Number(month), 0).getDate()
          : 31;
    const safeDay = day ? String(Math.min(Number(day), maxDay)) : "";
    setBirthYear(year);
    setBirthMonth(month);
    setBirthDay(safeDay);
    update(
      "birthDate",
      year && month && safeDay
        ? `${year}-${month.padStart(2, "0")}-${safeDay.padStart(2, "0")}`
        : "",
    );
  }

  function changeCalendarType(calendarType: "solar" | "lunar") {
    setForm((current) => ({
      ...current,
      calendarType,
      lunarLeapMonth: false,
      birthDate: "",
    }));
    setBirthYear("");
    setBirthMonth("");
    setBirthDay("");
    setError("");
  }

  function validate(targetStep: 1 | 2) {
    if (targetStep >= 1) {
      if (!form.birthDate) return "请选择完整出生日期。";
      if (!form.birthPlace.trim()) return "请填写出生地点。";
    }
    if (targetStep >= 2 && focusText.length < 4) {
      return "请选择关注方向，或补充你现在最困惑的问题。";
    }
    if (targetStep >= 2 && !accepted) {
      return "请先确认已阅读隐私与内容边界说明。";
    }
    return "";
  }

  function nextStep() {
    const issue = validate(step);
    if (issue) {
      setError(issue);
      return;
    }
    setError("");
    setStep(2);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const issue = validate(2);
    if (issue) {
      setError(issue);
      return;
    }

    setLoading(true);
    setRitualIndex(0);
    setError("");
    setMessage("");
    setReport(null);
    try {
      const response = await fetch("/api/reports/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          name: form.name.trim() || "匿名用户",
          birthTime: unknownTime ? "12:00" : form.birthTime,
          birthTimeNote: unknownTime ? "出生时间不确定，精度会降低" : form.birthTimeNote,
          focus: focusText,
          mbtiCertainty: form.mbtiType === "不确定" ? "unknown" : form.mbtiCertainty,
        }),
      });
      const data = (await response.json()) as ReportResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || "报告生成失败");
      setReport(data);
      window.setTimeout(
        () => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        80,
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "报告生成失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  function handlePaid(orderId: string) {
    if (!report) return;
    window.location.href = `/report/${report.reportId}?orderId=${encodeURIComponent(orderId)}`;
  }

  return (
    <section id="report-form" className="scroll-mt-4">
      <header className="mb-6 text-center">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#d7aa55]">
          Build Your Profile
        </p>
        <h2 className="mt-3 text-3xl font-black text-[#fff8ec] sm:text-4xl">
          开始生成你的四维人生画像
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#bbb4a8]">
          信息越具体，报告越像一次一对一咨询；不知道出生时间也可以生成，但八字与紫微精度会降低。
        </p>
      </header>

      <div className="mb-5 grid grid-cols-2 gap-2">
        {[
          ["01", "出生信息"],
          ["02", "关注与生成"],
        ].map(([number, label], index) => {
          const active = index + 1 === step;
          const completed = index + 1 < step;
          return (
            <div
              key={number}
              className={`border px-3 py-3 text-center ${
                active
                  ? "border-[#d7aa55] bg-[#d7aa55]/12"
                  : "border-[#d7aa55]/18 bg-[#111513]"
              }`}
            >
              <span className="block text-xs font-black text-[#d7aa55]">{number}</span>
              <strong className={`mt-1 block text-xs sm:text-sm ${completed ? "text-[#d7aa55]" : ""}`}>
                {label}
              </strong>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="border border-[#d7aa55]/28 bg-[#101412] p-4 sm:p-6">
        {step === 1 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              姓名或昵称
              <input
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                className={fieldClass}
                placeholder="不填写将使用匿名用户"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              性别
              <select
                value={form.gender}
                onChange={(event) => update("gender", event.target.value)}
                className={fieldClass}
              >
                <option>未透露</option>
                <option>女性</option>
                <option>男性</option>
                <option>其他</option>
              </select>
            </label>
            <fieldset className="grid gap-2 text-sm font-bold sm:col-span-2">
              <legend>出生日期</legend>
              <div className="grid grid-cols-2 gap-2">
                {([
                  ["solar", "公历日期"],
                  ["lunar", "农历日期"],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => changeCalendarType(value)}
                    className={
                      form.calendarType === value
                        ? "h-11 border border-[#d7aa55] bg-[#d7aa55] font-black text-[#17130c]"
                        : "h-11 border border-[#d7aa55]/25 bg-[#0b100e] font-bold text-[#c9c0b1]"
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-xs font-normal leading-6 text-[#9f988e]">
                {form.calendarType === "solar"
                  ? "请选择身份证或常用记录中的公历出生日期。"
                  : "请选择农历出生年月日；系统会换算公历后计算星座。"}
              </p>
              <div className="grid grid-cols-3 gap-2">
                <select
                  aria-label="出生年份"
                  value={birthYear}
                  onChange={(event) =>
                    updateBirthDate(event.target.value, birthMonth, birthDay)
                  }
                  className={fieldClass}
                >
                  <option value="">年份</option>
                  {birthYears.map((year) => <option key={year}>{year}</option>)}
                </select>
                <select
                  aria-label="出生月份"
                  value={birthMonth}
                  onChange={(event) =>
                    updateBirthDate(birthYear, event.target.value, birthDay)
                  }
                  className={fieldClass}
                >
                  <option value="">
                    {form.calendarType === "lunar" ? "农历月" : "月份"}
                  </option>
                  {Array.from({ length: 12 }, (_, index) => String(index + 1)).map((month) => (
                    <option key={month} value={month}>
                      {form.calendarType === "lunar"
                        ? ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "腊月"][Number(month) - 1]
                        : `${month} 月`}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="出生日期"
                  value={birthDay}
                  onChange={(event) =>
                    updateBirthDate(birthYear, birthMonth, event.target.value)
                  }
                  className={fieldClass}
                >
                  <option value="">日期</option>
                  {Array.from({ length: daysInSelectedMonth }, (_, index) => String(index + 1)).map((day) => (
                    <option key={day} value={day}>{day} 日</option>
                  ))}
                </select>
              </div>
              {form.calendarType === "lunar" ? (
                <label className="flex items-start gap-3 border border-[#d7aa55]/18 bg-black/15 p-3 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(form.lunarLeapMonth)}
                    onChange={(event) =>
                      update("lunarLeapMonth", event.target.checked)
                    }
                    className="mt-1 accent-[#d7aa55]"
                  />
                  <span>
                    <strong className="block">这是闰月</strong>
                    <span className="mt-1 block text-xs font-normal leading-6 text-[#9f988e]">
                      只有明确知道出生月份是“闰某月”时才勾选。
                    </span>
                  </span>
                </label>
              ) : null}
            </fieldset>
            <label className="grid gap-2 text-sm font-bold sm:col-span-2">
              出生时间
              <input
                type="time"
                value={form.birthTime}
                onChange={(event) => update("birthTime", event.target.value)}
                disabled={unknownTime}
                className={`${fieldClass} [color-scheme:dark] disabled:opacity-45`}
              />
            </label>
            <label className="flex items-start gap-3 border border-[#d7aa55]/18 bg-black/15 p-3 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={unknownTime}
                onChange={(event) => setUnknownTime(event.target.checked)}
                className="mt-1 accent-[#d7aa55]"
              />
              <span>
                <strong className="block">不知道出生时间</strong>
                <span className="mt-1 block text-xs leading-6 text-[#9f988e]">
                  仍可生成报告，系统会使用中午作为占位时间，并明确降低八字与紫微分析精度。
                </span>
              </span>
            </label>
            <label className="grid gap-2 text-sm font-bold sm:col-span-2">
              出生地
              <input
                value={form.birthPlace}
                onChange={(event) => update("birthPlace", event.target.value)}
                className={fieldClass}
                placeholder="例如：四川成都"
              />
            </label>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-5">
            <label className="grid gap-2 text-sm font-bold">
              MBTI
              <select
                value={form.mbtiType}
                onChange={(event) => {
                  update("mbtiType", event.target.value);
                  update("mbtiCertainty", event.target.value === "不确定" ? "unknown" : "known");
                }}
                className={fieldClass}
              >
                {mbtiTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
              <span className="text-xs font-normal leading-6 text-[#9f988e]">
                不知道可选择“不确定”，系统会减少 MBTI 标签权重。
              </span>
            </label>

            <div>
              <p className="text-sm font-bold">关注方向（可多选）</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {focusOptions.map((item) => {
                  const selected = selectedFocus.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setSelectedFocus((current) =>
                          selected ? current.filter((value) => value !== item) : [...current, item],
                        )
                      }
                      className={`h-11 border text-sm font-bold ${
                        selected
                          ? "border-[#d7aa55] bg-[#d7aa55] text-[#17130c]"
                          : "border-[#d7aa55]/22 bg-[#0b100e] text-[#d7d0c5]"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="grid gap-2 text-sm font-bold">
              你现在最困惑的具体问题
              <textarea
                rows={4}
                value={form.focus}
                onChange={(event) => update("focus", event.target.value)}
                className="w-full resize-none border border-[#d7aa55]/25 bg-[#0b100e] px-4 py-3 text-[#fff8ec] outline-none placeholder:text-[#777f78] focus:border-[#d7aa55]"
                placeholder="例如：我想转型做副业，但方向很多、执行不稳定，应该先从哪里开始？"
              />
            </label>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="mt-5 grid gap-4">
            <div className="border border-[#d7aa55]/22 bg-[#0b100e] px-4 py-3 text-sm leading-7 text-[#c9c0b1]">
              将为 <strong className="text-[#fff8ec]">{form.name || "匿名用户"}</strong>
              {" "}融合出生节律、紫微结构、星座能量与 {form.mbtiType} 行为模式。
            </div>
            <label className="flex items-start gap-3 border border-[#d7aa55]/18 p-4 text-sm leading-7">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
                className="mt-1 accent-[#d7aa55]"
              />
              <span>
                我理解本报告用于自我探索、认知复盘与成长参考，不替代医疗、法律、投资、婚恋等专业决策。
              </span>
            </label>
          </div>
        ) : null}

        {error ? (
          <p className="mt-4 border border-red-500/35 bg-red-950/25 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="h-12 border border-[#d7aa55]/25 px-6 font-bold"
            >
              返回上一步
            </button>
          ) : <span />}
          {step === 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="h-12 bg-[#d7aa55] px-7 font-black text-[#17130c]"
            >
              继续填写 →
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="xj-cta h-13 bg-[linear-gradient(100deg,#8a5a18,#e7c46c,#9a671e)] px-8 font-black text-[#17130c] disabled:opacity-55"
            >
              {loading ? "正在构建四维画像..." : "生成我的免费摘要 →"}
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <section className="mt-6 border border-[#d7aa55]/35 bg-[#0c100e] p-5 sm:p-7">
          <div className="mx-auto max-w-xl">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#d7aa55]/20 border-t-[#d7aa55]" />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d7aa55]">
                  AI Fusion Engine
                </p>
                <h3 className="mt-1 text-xl font-black">{ritualSteps[ritualIndex]}</h3>
              </div>
            </div>
            <div className="mt-6 h-1 overflow-hidden bg-[#202620]">
              <div
                className="h-full bg-[#d7aa55] transition-all duration-700"
                style={{ width: `${((ritualIndex + 1) / ritualSteps.length) * 100}%` }}
              />
            </div>
            <div className="mt-5 grid gap-2">
              {ritualSteps.map((item, index) => (
                <p
                  key={item}
                  className={`text-sm ${index <= ritualIndex ? "text-[#f2d99a]" : "text-[#5f655f]"}`}
                >
                  {index < ritualIndex ? "✓" : index === ritualIndex ? "●" : "○"} {item}
                </p>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {report ? (
        <section ref={reportRef} className="mt-8 scroll-mt-4">
          <header className="border border-[#d7aa55]/35 bg-[#111513] p-5 sm:p-7">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d7aa55]">
              Free Core Diagnosis
            </p>
            <h2 className="mt-3 text-3xl font-black">
              {form.name || "你"}的四维核心画像
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#bdb5a8]">
              这不是四份测评的简单拼接，而是从节律、结构、情绪和行为四个角度交叉解释你当前的现实问题。
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {[report.profile.yearPillar, report.profile.westernSign, form.mbtiType, report.profile.zodiac].map((item) => (
                <span key={item} className="border border-[#d7aa55]/25 px-3 py-2 text-[#f2d99a]">
                  {item}
                </span>
              ))}
            </div>
          </header>

          <div className="mt-4">
            <ReportReader report={report.freeReport} locked />
          </div>

          <section className="mt-5 border border-[#d7aa55]/45 bg-[#101412] p-5 sm:p-7">
            <p className="text-sm font-black text-[#d7aa55]">
              你已经看到了自己的核心画像，但最关键的事业、财富、关系和行动计划仍在完整版中。
            </p>
            <p className="mt-3 text-sm leading-7 text-[#bdb5a8]">
              如果你只是随便测一测，免费摘要已经够了。如果你正在经历事业选择、关系困惑、自我重建、财富转型或人生方向混乱，完整版更像一份给自己的深度复盘报告。
            </p>
            <button
              type="button"
              onClick={() => setShowPayment(true)}
              className="xj-cta mt-5 h-13 w-full bg-[linear-gradient(100deg,#8a5a18,#e7c46c,#9a671e)] px-7 font-black text-[#17130c] sm:w-auto"
            >
              解锁我的完整人生报告 {siteConfig.fullReportPriceLabel}
            </button>
            <p className="mt-3 text-xs text-[#8d928d]">
              一次解锁，适合截图保存、反复复盘。当前为 MVP 内测体验价。
            </p>
          </section>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/report/${report.reportId}`}
              className="flex h-12 items-center justify-center border border-[#d7aa55]/30 px-5 text-sm font-bold text-[#f2d99a]"
            >
              打开独立报告页
            </Link>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(report.freeReport);
                setMessage("免费摘要已复制。");
              }}
              className="h-12 border border-[#d7aa55]/30 px-5 text-sm font-bold"
            >
              复制免费摘要
            </button>
          </div>
          {message ? <p className="mt-3 text-sm text-[#f2d99a]">{message}</p> : null}
        </section>
      ) : null}

      {showPayment && report ? (
        <PaymentUnlockPanel
          reportId={report.reportId}
          productType="full_report"
          reportInput={{
            ...form,
            name: form.name.trim() || "匿名用户",
            birthTime: unknownTime ? "12:00" : form.birthTime,
            birthTimeNote: unknownTime
              ? "出生时间不确定，精度会降低"
              : form.birthTimeNote,
            focus: focusText,
            mbtiCertainty:
              form.mbtiType === "不确定" ? "unknown" : form.mbtiCertainty,
          }}
          onUnlock={handlePaid}
          onClose={() => setShowPayment(false)}
        />
      ) : null}
    </section>
  );
}
