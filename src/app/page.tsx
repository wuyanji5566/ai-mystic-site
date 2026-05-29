import Link from "next/link";
import { MysticReportForm } from "@/components/mystic-report-form";
import { siteConfig } from "@/lib/site-config";

const featurePillars = [
  {
    title: "生辰八字",
    desc: "用出生年月日时生成基础四柱观察，适合作为 MVP 的入门解读。",
  },
  {
    title: "紫微斗数",
    desc: "先用 AI 做命盘倾向解读，后续可升级为完整宫位排盘算法。",
  },
  {
    title: "星座与年度节奏",
    desc: "自动识别西方星座，并结合关注方向输出行动建议。",
  },
];

const productStats = [
  ["AI 引擎", "DeepSeek"],
  ["报告链路", "生成 / 保存 / 复看"],
  ["上线阶段", "MVP 商业验证"],
];

const roadmap = [
  {
    step: "01",
    title: "真实 AI",
    desc: "已接入 DeepSeek 兼容接口，失败时自动回退演示报告。",
  },
  {
    step: "02",
    title: "报告资产",
    desc: "支持详情页、历史页和复制，方便演示与交付客户。",
  },
  {
    step: "03",
    title: "商业闭环",
    desc: "价格页、演示解锁和上线清单已具备，下一步接真实支付。",
  },
];

const interactiveLoops = [
  {
    title: "报告追问",
    desc: "生成报告后继续问事业、感情、财富、年度计划等具体问题。",
  },
  {
    title: "30 天计划",
    desc: "把玄学报告转成每周可执行的小计划，适合提高复访率。",
  },
  {
    title: "截图分享",
    desc: "把一句话总结和行动建议整理成更适合分享的表达。",
  },
  {
    title: "人工咨询承接",
    desc: "用户看完 AI 深化后，可通过微信付款进入人工服务。",
  },
];

const links = [
  ["用户中心", "/account"],
  ["历史报告", "/reports"],
  ["价格方案", "/pricing"],
  ["上线清单", "/deploy"],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0f1412] text-[#f5efe2]">
      <section className="relative border-b border-[#d7aa55]/20">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,76,67,0.56),transparent_34%),linear-gradient(25deg,transparent_56%,rgba(122,28,38,0.28)),linear-gradient(180deg,rgba(15,20,18,0.18),#0f1412_88%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[#d7aa55]/60" />

        <div className="relative mx-auto grid min-h-screen max-w-7xl gap-10 px-5 py-6 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-10">
          <div className="flex flex-col justify-between gap-10 py-4">
            <nav className="flex flex-col gap-4 border-b border-[#f5efe2]/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/" className="group w-fit">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d7aa55]">
                  AI Mystic Studio
                </p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[#f8f0df]">
                  {siteConfig.name}
                </p>
              </Link>

              <div className="flex flex-wrap gap-2">
                {links.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="border border-[#f5efe2]/15 px-3 py-2 text-xs font-semibold text-[#f5efe2]/78 transition hover:border-[#d7aa55] hover:text-[#d7aa55]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="max-w-2xl">
              <div className="mb-7 inline-flex border border-[#d7aa55]/35 bg-[#111c19]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#d7aa55]">
                DeepSeek Powered MVP
              </div>
              <h1 className="font-[family-name:var(--font-display)] text-5xl leading-[1.04] text-[#fbf3e4] sm:text-6xl lg:text-7xl">
                把玄学咨询做成可收款的 AI 报告产品
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#d8cdb9] sm:text-lg">
                用户填写出生信息后，系统生成八字、紫微、星座融合报告。每位用户免费体验 {siteConfig.freeReportsPerUser} 次，完整版报告 {siteConfig.fullReportPriceLabel}，先用人工微信收款跑通商业验证。
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#report-form"
                  className="inline-flex h-12 items-center justify-center bg-[#d7aa55] px-6 text-sm font-bold text-[#121714] transition hover:bg-[#f0c86c]"
                >
                  生成第一份报告
                </a>
                <Link
                  href="/pricing"
                  className="inline-flex h-12 items-center justify-center border border-[#f5efe2]/18 px-6 text-sm font-bold text-[#f5efe2] transition hover:border-[#d7aa55] hover:text-[#d7aa55]"
                >
                  查看商业化方案
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {productStats.map(([label, value]) => (
                <div key={label} className="border border-[#f5efe2]/12 bg-[#0f1412]/62 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d7aa55]">
                    {label}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-[#fff8ec]">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid content-center gap-6 py-4">
            <div className="relative hidden min-h-[220px] border border-[#d7aa55]/22 bg-[#0b100e]/55 p-6 lg:block">
              <div className="absolute left-8 top-8 h-36 w-36 rounded-full border border-[#d7aa55]/45" />
              <div className="absolute left-14 top-14 h-24 w-24 rounded-full border border-[#2f9c89]/60" />
              <div className="absolute left-[104px] top-[104px] h-2 w-2 rounded-full bg-[#d7aa55]" />
              <div className="ml-52 max-w-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2f9c89]">
                  Product Signal
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[#fff8ec]">
                  不是玩具页面，而是能演示、能交付、能收款验证的 MVP。
                </h2>
              </div>
            </div>
            <MysticReportForm />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-14 sm:px-8 md:grid-cols-3 lg:px-10">
        {featurePillars.map((item) => (
          <article key={item.title} className="border border-[#d7aa55]/18 bg-[#141b18] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d7aa55]">
              Core Module
            </p>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-3xl text-[#fff8ec]">
              {item.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#d8cdb9]">{item.desc}</p>
          </article>
        ))}
      </section>

      <section className="border-y border-[#d7aa55]/18 bg-[#f5efe2] text-[#121714]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.76fr_1.24fr] lg:px-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8b2732]">
              Next Product Loop
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight">
              下一步重点不是继续堆页面，而是补齐账号、数据库、部署和真实收款资料。
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {roadmap.map((item) => (
              <article key={item.step} className="border border-[#121714]/12 bg-white p-5">
                <p className="text-sm font-bold text-[#8b2732]">{item.step}</p>
                <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#52615b]">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7aa55]">
              Interactive Service
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight text-[#fff8ec]">
              不止生成一次报告，还能继续深化和转化。
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#d8cdb9]">
              用户看完报告后，可以继续追问。这个环节能增加停留时间，也能自然引导到 {siteConfig.fullReportPriceLabel} 完整版和人工咨询。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {interactiveLoops.map((item) => (
              <article key={item.title} className="border border-[#d7aa55]/18 bg-[#141b18] p-5">
                <h3 className="font-[family-name:var(--font-display)] text-2xl text-[#fff8ec]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#d8cdb9]">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-8 text-center text-sm leading-7 text-[#bdb19f] sm:px-8">
        客服微信：{siteConfig.contactWeChat} ｜ 联系邮箱：{siteConfig.contactEmail}。本站内容仅用于娱乐、自我探索和产品演示，不构成医疗、法律、投资、婚恋等现实决策建议。
      </section>
    </main>
  );
}
