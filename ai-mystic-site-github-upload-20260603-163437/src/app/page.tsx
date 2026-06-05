import Link from "next/link";
import { FourDimensionalEngine } from "@/components/four-dimensional-engine";
import { MysticReportForm } from "@/components/mystic-report-form";
import {
  boundaryNotice,
  heroTrustLine,
  legalLinks,
  paymentNotice,
  refundNotice,
  standardDisclaimer,
} from "@/lib/legal-copy";
import { siteConfig } from "@/lib/site-config";

const navLinks = [
  ["首页", "/"],
  ["报告样例", "/examples"],
  ["解锁流程", "/service"],
  ["用户评价", "#testimonials"],
  ["免责声明", "/disclaimer"],
];

const dimensions = [
  ["八字", "看你的底层能量、行动节奏、财富倾向、长期运势节律。"],
  ["紫微", "看你的事业结构、人生阶段、关系位置、资源流动与关键课题。"],
  ["星座", "看你的情绪表达、亲密关系需求、外在吸引力与压力反应。"],
  ["MBTI", "看你的决策偏好、沟通方式、执行模式、适合环境与成长路径。"],
];

const decodeCards = [
  ["看清性格底层", "人格画像", "从 MBTI、星座与 AI 推理中提取你的思维方式、情绪模式和行为习惯。"],
  ["理解人生节奏", "阶段复盘", "结合八字与紫微结构，分析你在事业、财富、关系中的阶段性倾向。"],
  ["定位现实卡点", "问题诊断", "不是告诉你命好不好，而是帮你看见为什么反复卡在同一种问题里。"],
  ["生成行动方案", "落地建议", "输出未来30天可执行建议，让报告不止停留在分析，而能真正帮助行动。"],
];

const reportModules = [
  ["01 核心人格画像", "你的底层性格模式、思维方式、情绪反应、长期优势与隐藏消耗。"],
  ["02 事业路径分析", "适合你的工作环境、能力方向、当前事业卡点与突破建议。"],
  ["03 财富节奏分析", "赚钱阻力来源、消费与决策模式、副业与变现节奏建议。"],
  ["04 关系模式分析", "亲密关系惯性、人际合作优势与风险、关系沟通建议。"],
  ["05 未来一年提醒", "接下来阶段的关注重点、压力来源和应避免的决策误区。"],
  ["06 未来30天行动计划", "3个核心行动建议、每周复盘方向和可执行小任务。"],
  ["07 继续追问方向", "基于报告继续深化事业、财富、关系、成长方向。"],
];

const heroFeatures = ["AI智能解读", "四维融合分析", "个性化报告", "隐私安全保障"];

const metrics = [
  ["MVP", "持续优化报告模型"],
  ["4", "4套系统融合"],
  ["30+", "30+维度解析"],
];

const creationSteps = [
  ["基础信息", "用于建立你的出生节律与人生阶段参考。"],
  ["人格关注", "用于识别你的行为模式、关系需求与现实困惑。"],
  ["生成摘要", "AI 将融合四维模型，输出你的免费核心画像。"],
];

const exampleLockedItems = [
  "你的事业最佳路径",
  "你的财富增长模式",
  "你的亲密关系隐藏模式",
  "你未来一年最关键的阶段",
  "未来 30 天行动计划",
];

const valueComparison = [
  {
    title: "免费摘要",
    items: ["核心人格画像", "四维系统初步判断", "事业大方向", "关系提醒", "一个初步建议"],
  },
  {
    title: "完整版报告",
    items: [
      "四维交叉深度分析",
      "事业定位",
      "财富模式",
      "关系风险",
      "未来一年节奏",
      "30 天行动计划",
      "截图保存版",
      "继续追问示例",
    ],
  },
];

const unlockSteps = [
  ["01", "点击解锁，保存订单号"],
  ["02", "微信付款 19.9 元，并备注订单号"],
  ["03", "人工核对后，为你开放完整版报告"],
];

const followupQuestions = [
  "我适合做什么副业？",
  "我现在的事业卡点是什么？",
  "我的亲密关系最大问题是什么？",
  "未来30天我应该先做哪三件事？",
];

const testimonials = [
  ["免费摘要第一段就说到我了", "我一开始以为只是普通测试，但免费摘要第一段就说到我了，尤其是“想很多、启动慢、又不甘心低质量生活”这句。"],
  ["30天计划比预期实用", "我买完整版主要是想看事业方向，30天计划比我预期实用，至少知道接下来该先做什么。"],
  ["不是直接告诉我会不会发财", "它不是直接告诉我会不会发财，而是把我的性格、关系和赚钱方式拆得比较清楚。"],
];

const trustItems = [
  ["隐私说明", "当前 MVP 不强制注册；报告会优先保存在你的浏览器或已配置的云端存储中。"],
  ["内容边界", "本报告用于自我探索、认知复盘与成长参考，不替代医疗、法律、投资、婚恋等专业决策。"],
  ["付款方式", `完整版 ${siteConfig.fullReportPriceLabel}，当前先用微信收款码和订单号人工核对。`],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#090b10] text-[#f5efe2]">
      <section className="relative min-h-screen border-b border-[#d7aa55]/20">
        <div className="xj-nebula absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(215,170,85,0.20),transparent_25%),radial-gradient(circle_at_78%_18%,rgba(124,72,214,0.22),transparent_24%),linear-gradient(180deg,rgba(9,11,16,0.15),#090b10_92%)]" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(90deg,rgba(215,170,85,0.16)_1px,transparent_1px),linear-gradient(180deg,rgba(155,124,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="xj-hero-planet absolute inset-0" />
        <div className="xj-particle-field absolute inset-0 opacity-25" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
          <nav className="flex flex-col gap-4 border-b border-[#f5efe2]/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="flex w-fit items-center gap-3">
              <span className="xj-logo-sigil" />
              <span>
                <span className="block font-[family-name:var(--font-display)] text-xl text-[#fff8ec]">
                  AI人生解码系统
                </span>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d7aa55]">
                  AI Destiny OS
                </span>
              </span>
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              {navLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-2 text-xs font-semibold text-[#f5efe2]/78 transition hover:-translate-y-0.5 hover:text-[#d7aa55]"
                >
                  {label}
                </Link>
              ))}
              <a
                href="#report-form"
                className="xj-cta ml-0 inline-flex h-10 items-center justify-center rounded-full bg-[#d7aa55] px-6 text-xs font-bold text-[#121714] transition hover:bg-[#f0c86c] sm:ml-4"
              >
                立即解码人生
              </a>
            </div>
          </nav>

          <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <div className="mb-6 inline-flex border border-[#d7aa55]/35 bg-[#17121f]/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#d7aa55]">
                AI Self Insight Report
              </div>
              <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[1.04] text-[#fff8ec] sm:text-6xl lg:text-7xl">
                输入出生信息 + 当前困惑，
                <span className="mt-2 block bg-[linear-gradient(90deg,#fff8ec,#d7aa55,#ffe7a8)] bg-clip-text text-transparent">
                  生成你的事业、财富、关系与未来30天行动报告
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#d8cdb9] sm:text-lg">
                融合八字、紫微、星座、MBTI 与 AI 分析，帮你看清性格底层、人生节奏和下一步行动。内容仅供自我认知与成长参考，不作迷信预测。
              </p>
              <div className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-4">
                {heroFeatures.map((item) => (
                  <p key={item} className="flex items-center gap-2 text-xs font-semibold text-[#d8cdb9]">
                    <span className="grid h-6 w-6 place-items-center border border-[#d7aa55]/35 bg-[#d7aa55]/10 text-[#d7aa55]">
                      ◈
                    </span>
                    {item}
                  </p>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#report-form"
                  className="xj-cta inline-flex h-14 items-center justify-center rounded-full bg-[#d7aa55] px-10 text-base font-bold text-[#121714] transition hover:-translate-y-0.5 hover:bg-[#f0c86c]"
                >
                  立即生成免费摘要
                </a>
                <Link
                  href="#full-report"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-[#d7aa55]/30 bg-[#d7aa55]/10 px-8 text-sm font-bold text-[#f2ddae] transition hover:-translate-y-0.5 hover:border-[#d7aa55]"
                >
                  查看完整版报告包含什么
                </Link>
              </div>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#cfc2ae]">
                {heroTrustLine}
              </p>
            </div>

            <div className="grid gap-5">
              <FourDimensionalEngine />
              <article className="xj-report-preview p-5">
                <div className="flex items-start gap-4 border-b border-[#d7aa55]/18 pb-4">
                  <div className="grid h-16 w-16 place-items-center rounded-full border border-[#9b7cff]/45 bg-[#251445] text-2xl">
                    ◐
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d7aa55]">
                      先看一个样例
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-[#fff8ec]">
                      它为什么不像普通测评？
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {["INTJ", "32岁", "男性"].map((tag) => (
                        <span key={tag} className="border border-[#9b7cff]/35 px-2 py-1 text-xs text-[#d9ccff]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#d8cdb9]">
                  你不是没有能力，而是长期卡在“想得很深”和“现实反馈太慢”之间。你适合处理复杂信息、长期判断、系统搭建与深度表达，但不适合长期待在低自主权、强消耗、重复执行的环境里。你真正需要的不是更多建议，而是一套能让你稳定输出、稳定变现、稳定建立关系反馈的现实系统。
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-[0.9fr_1.1fr]">
                  <div className="grid place-items-center border border-[#d7aa55]/22 bg-[#d7aa55]/10 p-5 text-center">
                    <div className="grid h-14 w-14 place-items-center rounded-full border border-[#d7aa55]/40 text-2xl text-[#d7aa55]">
                      锁
                    </div>
                    <p className="mt-3 text-sm font-bold text-[#fff8ec]">完整版将继续展开</p>
                  </div>
                  <div className="grid gap-2">
                    {exampleLockedItems.map((item) => (
                      <p key={item} className="text-sm font-semibold text-[#f2ddae]">⊙ {item}</p>
                    ))}
                  </div>
                </div>
                <a
                  href="#report-form"
                  className="xj-cta mt-5 flex h-12 items-center justify-center rounded-full bg-[#d7aa55] text-sm font-bold text-[#121714]"
                >
                  解锁完整报告 ¥19.9
                </a>
                <p className="mt-3 text-center text-xs text-[#cfc2ae]">一次解锁，适合截图保存、反复复盘、继续追问</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#d7aa55]/18 bg-[#0b0b12]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="xj-section-heading mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7aa55]">
              Four-Lens Engine
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight text-[#fff8ec]">
              四维融合系统
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#cfc2ae]">
              四套系统，不是简单叠加，而是交叉验证
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {dimensions.map(([title, desc], index) => (
              <article key={title} className="xj-system-card xj-card-hover p-6">
                <div className="xj-card-orbit mb-6 grid h-16 w-16 place-items-center text-2xl text-[#d7aa55]">
                  {["◎", "✦", "☾", "◌"][index]}
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-3xl text-[#fff8ec]">{title}</h3>
                <p className="mt-2 text-sm font-bold text-[#d7aa55]">
                  {["底层节律", "人生结构", "情绪能量", "行为模式"][index]}
                </p>
                <p className="mt-4 text-sm leading-7 text-[#cfc2ae]">{desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    ["节律", "能量", "趋势"],
                    ["结构", "阶段", "课题"],
                    ["情绪", "关系", "安全感"],
                    ["思维", "行为", "成长"],
                  ][index].map((tag) => (
                    <span key={tag} className="border border-[#d7aa55]/22 bg-[#d7aa55]/8 px-2 py-1 text-xs text-[#d7aa55]">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 grid border-y border-[#d7aa55]/16 py-7 sm:grid-cols-3">
            {metrics.map(([value, label]) => (
              <p key={label} className="border-[#d7aa55]/16 py-4 text-center sm:border-r sm:last:border-r-0">
                <span className="block font-[family-name:var(--font-display)] text-4xl text-[#d7aa55]">{value}</span>
                <span className="mt-2 block text-sm text-[#cfc2ae]">{label}</span>
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#d7aa55]/18 bg-[#090b10]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-10">
          <div className="xj-reveal">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7aa55]">
              Decode System
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight text-[#fff8ec]">
              这不是传统算命，而是一份 AI 人生复盘报告
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#cfc2ae]">
              系统不会告诉你“命中注定”，而是把传统文化符号、人格模型和现实行动放在同一张图里交叉验证。
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {decodeCards.map(([title, tag, desc], index) => (
              <article key={title} className="xj-glass xj-card-hover p-5" style={{ animationDelay: `${index * 90}ms` }}>
                <p className="text-xs font-bold text-[#d7aa55]">{tag}</p>
                <h3 className="mt-4 text-xl font-bold text-[#fff8ec]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#cfc2ae]">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#d7aa55]/18 bg-[#07080d]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="xj-section-heading mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7aa55]">
              Create In 3 Steps
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight text-[#fff8ec]">
              三步生成你的AI人生说明书
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {creationSteps.map(([title, desc], index) => (
              <article key={title} className="xj-step-card p-6 text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-[#d7aa55]/35 bg-[#d7aa55]/10 text-3xl text-[#d7aa55]">
                  {index + 1}
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#fff8ec]">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#cfc2ae]">{desc}</p>
              </article>
            ))}
          </div>
          <div className="mt-10">
            <MysticReportForm />
          </div>
        </div>
      </section>

      <section id="full-report" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7aa55]">
              Full Report Preview
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight text-[#fff8ec]">
              完整版报告包含什么？
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#d8cdb9]">
              付费解锁后，你将获得一份结构化、可复盘、可继续追问的个人 AI 人生报告。
            </p>
            <div className="mt-6 border border-[#d7aa55]/35 bg-[#121714] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d7aa55]">
                解锁完整版 AI 人生报告 · ¥19.9
              </p>
              <a
                href="#report-form"
                className="xj-cta mt-4 inline-flex h-12 w-full items-center justify-center bg-[#d7aa55] px-5 text-sm font-bold text-[#121714] transition hover:bg-[#f0c86c]"
              >
                解锁完整版报告
              </a>
              <p className="mt-3 text-center text-xs leading-5 text-[#cfc2ae]">
                你将获得一份包含人格画像、事业路径、财富节奏、关系模式、未来一年提醒和未来30天行动计划的完整报告。
              </p>
              <p className="mt-3 border border-[#d7aa55]/18 bg-black/20 px-3 py-2 text-xs leading-5 text-[#f2ddae]">
                {paymentNotice}
              </p>
              <div className="mt-4 border border-[#d7aa55]/22 bg-black/25 p-4">
                <p className="text-sm font-bold text-[#fff8ec]">解锁流程：</p>
                <div className="mt-3 grid gap-2">
                  {unlockSteps.map(([step, text]) => (
                    <p key={step} className="flex gap-3 text-xs leading-5 text-[#f2ddae]">
                      <span className="font-bold text-[#d7aa55]">{step}</span>
                      <span>{text}</span>
                    </p>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-5 text-[#cfc2ae]">
                  {refundNotice}
                </p>
                <p className="mt-3 text-xs leading-5 text-[#cfc2ae]">{boundaryNotice}</p>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {reportModules.map(([title, desc]) => (
              <article key={title} className="xj-glass p-5 transition hover:-translate-y-1 hover:border-[#9b7cff]/60">
                <p className="text-xs font-bold text-[#d7aa55]">{title.slice(0, 2)}</p>
                <h3 className="mt-5 text-base font-bold leading-7 text-[#fff8ec]">{title.slice(3)}</h3>
                <p className="mt-3 text-xs leading-6 text-[#cfc2ae]">{desc}</p>
              </article>
            ))}
          </div>
          <div className="lg:col-start-2">
            <div className="border border-[#9b7cff]/24 bg-[#111020] p-5">
              <p className="text-sm font-bold text-[#d9ccff]">完整版可继续追问，例如：</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {followupQuestions.map((question) => (
                  <p key={question} className="border border-[#9b7cff]/20 bg-black/20 px-3 py-2 text-xs font-semibold text-[#f5efe2]">
                    {question}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#d7aa55]/18 bg-[#07080d]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7aa55]">
              Demo Fragment
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight text-[#fff8ec]">
              样例报告片段
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#cfc2ae]">
              以下为模拟样例，展示完整版报告的表达风格与分析深度。实际报告会根据用户输入信息生成。
            </p>
          </div>
          <article className="border border-[#d7aa55]/28 bg-[#111714] p-5 shadow-2xl shadow-black/30">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#d7aa55]/16 pb-4">
              <span className="rounded-full border border-[#9b7cff]/35 px-3 py-1 text-xs font-bold text-[#d9ccff]">
                32岁男性
              </span>
              <span className="rounded-full border border-[#9b7cff]/35 px-3 py-1 text-xs font-bold text-[#d9ccff]">
                INTJ
              </span>
              <span className="rounded-full border border-[#9b7cff]/35 px-3 py-1 text-xs font-bold text-[#d9ccff]">
                事业转型期
              </span>
            </div>
            <div className="mt-5 grid gap-4 text-sm leading-7 text-[#d8cdb9]">
              <p>
                <strong className="text-[#f2ddae]">核心洞察：</strong>
                你不是执行力差，而是你的大脑一直在做复杂推演。你习惯先判断全局，再决定是否行动，所以当现实反馈太慢时，你容易陷入“想得很深，但启动很慢”的状态。
              </p>
              <p>
                <strong className="text-[#f2ddae]">事业建议：</strong>
                你的突破点不是再学一个工具，而是把你的判断力、经验和认知产品化。你适合做深度内容、咨询型服务、AI工作流产品或高价值小众解决方案。
              </p>
              <p>
                <strong className="text-[#f2ddae]">财富提醒：</strong>
                你当前的财富卡点不是没有机会，而是容易在多个方向之间消耗注意力。未来30天，最重要的动作不是扩张，而是选定一个最小变现闭环并持续推进。
              </p>
              <p>
                <strong className="text-[#f2ddae]">关系模式：</strong>
                你在人际关系中更重视深度、忠诚和价值观一致。一旦感受到敷衍或低质量沟通，你会迅速抽离。建议在关系中减少过度推演，增加直接表达。
              </p>
              <p>
                <strong className="text-[#f2ddae]">30天行动建议：</strong>
                第一周确定一个可变现主题；第二周做出一个可展示样品；第三周发布并收集反馈；第四周根据反馈优化，并尝试第一次收费。
              </p>
            </div>
            <p className="mt-5 border border-[#d7aa55]/20 bg-[#d7aa55]/10 p-3 text-xs leading-6 text-[#f2ddae]">
              以上内容为示例，不代表任何确定性预测。实际报告会根据用户输入信息生成。
            </p>
          </article>
        </div>
      </section>

      <section className="border-y border-[#d7aa55]/18 bg-[#0c0b12]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:px-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7aa55]">
              Free VS Full
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight text-[#fff8ec]">
              免费版让你确认方向，完整版帮你拆到行动。
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#d8cdb9]">
              当前为 MVP 内测体验价 ¥19.9，后续完整系统上线后价格可能调整。你买到的不是一句判断，而是一份可保存、可复盘、可继续追问的人生底层说明书。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {valueComparison.map((column, index) => (
              <article
                key={column.title}
                className={`border p-5 ${
                  index === 0
                    ? "border-[#f5efe2]/12 bg-[#10131a]"
                    : "border-[#d7aa55]/45 bg-[linear-gradient(135deg,rgba(215,170,85,0.18),rgba(17,16,24,0.96))] shadow-2xl shadow-[#d7aa55]/10"
                }`}
              >
                <h3 className="font-[family-name:var(--font-display)] text-3xl text-[#fff8ec]">
                  {column.title}
                </h3>
                <div className="mt-5 grid gap-3">
                  {column.items.map((item) => (
                    <p
                      key={item}
                      className="border border-[#d7aa55]/16 bg-black/22 px-4 py-3 text-sm font-semibold text-[#f5efe2]"
                    >
                      {item}
                    </p>
                  ))}
                </div>
                {index === 1 ? (
                  <a
                    href="#report-form"
                    className="xj-cta mt-5 flex h-12 items-center justify-center bg-[#d7aa55] text-sm font-bold text-[#121714] transition hover:bg-[#f0c86c]"
                  >
                    解锁我的完整人生报告 ¥19.9
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="border-y border-[#f5efe2]/10 bg-[#111018]">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-14 sm:px-8 md:grid-cols-3 lg:px-10">
          {testimonials.map(([title, body]) => (
            <article key={title} className="border border-[#d7aa55]/18 bg-[#090b10] p-5 shadow-xl shadow-black/20">
              <p className="text-lg font-bold text-[#fff8ec]">{title}</p>
              <p className="mt-4 text-sm leading-7 text-[#cfc2ae]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="trust" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7aa55]">
              Trust & Privacy
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[#fff8ec]">
              付款前，用户要知道边界在哪里。
            </h2>
            <a
              href={`https://weixin.qq.com/`}
              className="mt-6 inline-flex h-11 items-center justify-center border border-[#2f9c89]/55 px-5 text-sm font-bold text-[#aef2dd] transition hover:bg-[#2f9c89] hover:text-[#08100e]"
            >
              客服微信：{siteConfig.contactWeChat}
            </a>
          </div>
          <div className="grid gap-3">
            {trustItems.map(([title, body]) => (
              <details key={title} className="group border border-[#d7aa55]/18 bg-[#141018] p-5">
                <summary className="cursor-pointer text-base font-bold text-[#fff8ec] marker:text-[#d7aa55]">
                  {title}
                </summary>
                <p className="mt-3 text-sm leading-7 text-[#cfc2ae]">{body}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <a
        href="#report-form"
        className="fixed bottom-5 right-5 z-40 hidden border border-[#d7aa55]/40 bg-[#d7aa55] px-5 py-3 text-sm font-bold text-[#121714] shadow-2xl shadow-black/40 transition hover:-translate-y-1 hover:bg-[#f0c86c] sm:inline-flex"
      >
        生成我的报告 →
      </a>

      <section className="px-5 py-8 text-center text-sm leading-7 text-[#bdb19f] sm:px-8">
        <p>客服微信：{siteConfig.contactWeChat} ｜ 联系邮箱：{siteConfig.contactEmail}</p>
        <p className="mx-auto mt-3 max-w-4xl">{standardDisclaimer}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-[#d7aa55] underline-offset-4 hover:underline">
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
