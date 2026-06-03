import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const sampleSections = [
  {
    title: "核心人格画像",
    excerpt:
      "你不是单纯的外向或内向，而是容易在“想被看见”和“需要安全感”之间摆动。适合你的成长方式不是强迫自己变得高调，而是找到稳定输出的场域，让你的判断力、审美和洞察慢慢积累成个人标签。",
  },
  {
    title: "事业定位建议",
    excerpt:
      "你的事业更适合从“可沉淀作品”的方向切入，例如内容、咨询、产品化服务、项目制交付或长期复利型技能。短期不要频繁换赛道，先用 30 天做出一个可展示案例，再根据反馈调整定位。",
  },
  {
    title: "亲密关系模式",
    excerpt:
      "你在关系里容易先观察、后表达，表面冷静，内在却已经反复消化很多情绪。适合你的关系不是强烈拉扯，而是能尊重边界、稳定沟通、愿意一起复盘的人。",
  },
  {
    title: "财富与消费节奏",
    excerpt:
      "财富部分不建议直接追逐高风险机会。更适合先建立现金流意识：固定记录支出、区分情绪消费和成长投入，把钱优先投向能提升长期生产力的工具、学习和作品包装。",
  },
  {
    title: "未来 30 天行动计划",
    excerpt:
      "第 1 周整理当前最想解决的问题；第 2 周建立一个可执行目标；第 3 周完成一个小作品或一次关键沟通；第 4 周复盘反馈，决定下一阶段继续、暂停或调整。",
  },
  {
    title: "继续追问示例",
    excerpt:
      "报告不是一次性结束。你可以继续问：我适合什么副业？我该不该换工作？我的关系卡点在哪里？未来三个月要先做什么？完整版会围绕你的原始报告继续深化。",
  },
];

const comparison = [
  ["普通测试", "给出性格标签，读完容易觉得有点像，但不知道下一步做什么。"],
  ["玄机报告", "把四个系统融合成画像、冲突点、行动清单和继续追问示例。"],
  ["人工咨询", "后续可把 AI 报告作为基础，再做人工补充解读和一对一梳理。"],
];

export default function ExamplesPage() {
  return (
    <main className="min-h-screen bg-[#0f1412] text-[#f5efe2]">
      <section className="border-b border-[#d7aa55]/18 bg-[#101713] px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7aa55]">
            Report Examples
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl leading-tight">
            先看样例，再决定是否解锁完整版
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#d8cdb9]">
            完整版报告不是简单多写几段，而是把紫微、八字、星座、MBTI 融合成可阅读、可复盘、可继续追问的个人分析。
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#report-form"
              className="inline-flex h-11 items-center justify-center bg-[#d7aa55] px-5 text-sm font-bold text-[#121714] transition hover:bg-[#f0c86c]"
            >
              生成我的免费摘要
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-11 items-center justify-center border border-[#f5efe2]/18 px-5 text-sm font-bold text-[#f5efe2] transition hover:border-[#d7aa55] hover:text-[#d7aa55]"
            >
              查看价格
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-10 md:grid-cols-2 lg:grid-cols-3">
        {sampleSections.map((section, index) => (
          <article key={section.title} className="border border-[#d7aa55]/18 bg-[#141b18] p-5">
            <p className="text-xs font-bold text-[#d7aa55]">{String(index + 1).padStart(2, "0")}</p>
            <h2 className="mt-4 text-xl font-bold text-[#fff8ec]">{section.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[#cfc2ae]">{section.excerpt}</p>
          </article>
        ))}
      </section>

      <section className="border-y border-[#d7aa55]/18 bg-[#f5efe2] px-5 py-10 text-[#121714]">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-[family-name:var(--font-display)] text-4xl">它和普通测试有什么区别</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {comparison.map(([title, desc]) => (
              <article key={title} className="border border-[#121714]/12 bg-white p-5">
                <h3 className="text-xl font-bold text-[#8b2732]">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#52615b]">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-8 text-center text-sm leading-7 text-[#bdb19f]">
        客服微信：{siteConfig.contactWeChat} ｜ 内容仅用于娱乐和自我探索，不构成现实决策建议。
      </section>
    </main>
  );
}
