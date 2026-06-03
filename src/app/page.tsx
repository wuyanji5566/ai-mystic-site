import Link from "next/link";
import { MysticReportForm } from "@/components/mystic-report-form";
import { siteConfig } from "@/lib/site-config";

const navLinks = [
  ["报告样例", "/examples"],
  ["解锁流程", "/service"],
  ["价格方案", "/pricing"],
  ["用户中心", "/account"],
];

const dimensions = [
  ["紫微", "看长期课题", "人生阶段、关系位置、事业节奏"],
  ["八字", "看底层节律", "出生时间、年份气质、行动节奏"],
  ["星座", "看表达能量", "情绪反应、关系表达、外在呈现"],
  ["MBTI", "看行为模式", "决策偏好、压力反应、沟通风格"],
];

const reportModules = [
  "核心人格画像",
  "事业定位与适合环境",
  "财富习惯与副业节奏",
  "亲密关系与边界提醒",
  "未来一年阶段提醒",
  "未来 30 天行动方案",
  "继续追问入口",
  "截图分享版总结",
];

const previewSections = [
  ["免费摘要", "先给你核心性格、事业大方向、关系提醒，判断这份报告是否值得继续看。"],
  ["完整版", "展开事业、财富、关系、30 天计划和继续追问，适合认真复盘的人。"],
  ["可分享", "报告页保留截图友好的卡片结构，方便保存、复盘或发给朋友讨论。"],
];

const exampleLockedItems = ["适合的事业环境", "赚钱方式", "关系风险点", "30 天行动方案"];

const testimonials = [
  ["像老师在帮我拆自己", "不是只说我是什么性格，而是说出了我为什么总是想太多、落地慢。"],
  ["事业建议更实用", "报告没有夸张承诺，反而告诉我哪些环境不适合我，这点很有用。"],
  ["30 天计划能照着做", "完整版后面的行动清单很直接，比普通测评更像一次咨询。"],
];

const trustItems = [
  ["隐私说明", "当前 MVP 不强制注册；报告会优先保存在你的浏览器或已配置的云端存储中。"],
  ["内容边界", "报告用于娱乐、自我探索和复盘，不替代医疗、法律、投资、婚恋等现实决策。"],
  ["付款方式", `完整版 ${siteConfig.fullReportPriceLabel}，当前先用微信收款码和订单号人工核对。`],
];

function AstroScene() {
  return (
    <div className="relative min-h-[360px] overflow-hidden border border-[#d7aa55]/24 bg-[#080b10]/72 p-5 shadow-2xl shadow-black/40">
      <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle,rgba(215,170,85,0.32)_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="xj-scan absolute inset-0 opacity-70" />
      <div className="xj-orbit absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d7aa55]/35">
        <div className="absolute -right-2 top-1/2 h-4 w-4 rounded-full bg-[#d7aa55] shadow-[0_0_30px_rgba(215,170,85,0.9)]" />
        <div className="absolute left-8 top-7 h-2 w-2 rounded-full bg-[#9b7cff] shadow-[0_0_20px_rgba(155,124,255,0.8)]" />
      </div>
      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7c48d6]/38" />
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[#2f9c89]/48" />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="ml-auto w-fit border border-[#d7aa55]/28 bg-black/35 px-3 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#d7aa55]">
          Live Report Engine
        </div>
        <div className="mt-48 max-w-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b7cff]">
            Zi Wei · Ba Zi · Star · MBTI
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl leading-tight text-[#fff8ec]">
            从命理符号里，提炼能落地的人生说明书。
          </h2>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#090b10] text-[#f5efe2]">
      <section className="relative min-h-screen border-b border-[#d7aa55]/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(215,170,85,0.20),transparent_25%),radial-gradient(circle_at_78%_18%,rgba(124,72,214,0.22),transparent_24%),linear-gradient(180deg,rgba(9,11,16,0.15),#090b10_92%)]" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(90deg,rgba(215,170,85,0.16)_1px,transparent_1px),linear-gradient(180deg,rgba(155,124,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
          <nav className="flex flex-col gap-4 border-b border-[#f5efe2]/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="w-fit">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d7aa55]">
                AI Mystic Personality Report
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[#fff8ec]">
                {siteConfig.name}
              </p>
            </Link>
            <div className="flex flex-wrap gap-2">
              {navLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="border border-[#f5efe2]/14 bg-black/10 px-3 py-2 text-xs font-semibold text-[#f5efe2]/78 transition hover:-translate-y-0.5 hover:border-[#d7aa55] hover:text-[#d7aa55]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <div className="mb-6 inline-flex border border-[#d7aa55]/35 bg-[#17121f]/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#d7aa55]">
                免费摘要 · 完整版解锁 · 深度追问
              </div>
              <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[1.02] text-[#fff8ec] sm:text-6xl lg:text-7xl">
                你不是缺答案，你是缺一份看懂自己的底层说明书。
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#d8cdb9] sm:text-lg">
                输入出生信息、MBTI 和当前关注方向，系统会融合紫微、八字、星座与人格模型，生成一份关于你性格底色、事业方向、财富节奏、关系模式和未来行动的个人报告。免费先看核心摘要，完整版解锁深度分析与30天行动方案。
              </p>
              <p className="mt-4 max-w-2xl border-l-2 border-[#d7aa55] pl-4 text-sm leading-7 text-[#f2ddae]">
                这不是“神秘预言”，而是一次把传统命理、人格模型和现实行动结合起来的自我复盘。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#report-form"
                  className="xj-cta inline-flex h-13 items-center justify-center bg-[#d7aa55] px-7 text-sm font-bold text-[#121714] transition hover:-translate-y-0.5 hover:bg-[#f0c86c]"
                >
                  生成我的报告 →
                </a>
                <Link
                  href="/examples"
                  className="inline-flex h-13 items-center justify-center border border-[#f5efe2]/18 bg-white/5 px-7 text-sm font-bold text-[#fff8ec] transition hover:-translate-y-0.5 hover:border-[#9b7cff] hover:text-[#d9ccff]"
                >
                  查看示例报告
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-4">
                {dimensions.map(([title, tag, desc]) => (
                  <article key={title} className="xj-glass p-4">
                    <p className="text-xs font-bold text-[#d7aa55]">{tag}</p>
                    <p className="mt-2 text-sm font-bold text-[#fff8ec]">{title}</p>
                    <p className="mt-2 text-xs leading-5 text-[#c7baa6]">{desc}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="grid gap-5">
              <AstroScene />
              <MysticReportForm />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#d7aa55]/18 bg-[#f5efe2] text-[#121714]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8b2732]">
              Sample Screenshot
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight">
              示例：一个 INTJ 型用户的四维画像
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#52615b]">
              “你不是缺想法，而是缺一个能长期承接你想法的现实系统。你适合在复杂信息、长期判断和系统构建中建立优势，但不适合长期做重复、低自主权、强情绪消耗的工作。”
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="border border-[#121714]/12 bg-white p-5 shadow-xl shadow-[#121714]/10">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8b2732]">
                示例报告截图
              </p>
              <h3 className="mt-3 text-2xl font-bold">INTJ 四维交叉画像</h3>
              <p className="mt-3 border border-[#121714]/10 bg-[#fffaf2] p-4 text-sm leading-7 text-[#52615b]">
                你不是缺想法，而是缺一个能长期承接你想法的现实系统。你适合在复杂信息、长期判断和系统构建中建立优势，但不适合长期做重复、低自主权、强情绪消耗的工作。
              </p>
              <div className="mt-5 grid gap-3">
                {previewSections.map(([title, body]) => (
                  <div key={title} className="border border-[#121714]/10 bg-[#fffaf2] p-4">
                    <p className="text-sm font-bold text-[#9a563f]">{title}</p>
                    <p className="mt-2 text-sm leading-7 text-[#52615b]">{body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 border border-[#d7aa55]/35 bg-[#121714] p-4 text-[#fff8ec]">
                <p className="text-sm font-bold text-[#d7aa55]">完整报告中将继续展开：</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {exampleLockedItems.map((item) => (
                    <p key={item} className="border border-[#d7aa55]/16 bg-black/25 px-3 py-2 text-xs font-bold">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </article>
            <div className="grid gap-3">
              {reportModules.slice(0, 6).map((item, index) => (
                <article key={item} className="border border-[#121714]/12 bg-white p-4">
                  <p className="text-xs font-bold text-[#8b2732]">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 text-sm font-bold">{item}</h3>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7aa55]">
              Unlock Value
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight text-[#fff8ec]">
              完整深度报告 · 限时体验价 19.9 元
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#d8cdb9]">
              如果你只是想随便测一测，免费摘要已经够了。但如果你正处在人生选择、事业转型、关系困惑或自我重建阶段，完整版更像是一份给自己的复盘报告。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {reportModules.map((item, index) => (
              <article key={item} className="xj-glass p-5 transition hover:-translate-y-1 hover:border-[#9b7cff]/60">
                <p className="text-xs font-bold text-[#d7aa55]">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-5 text-sm font-bold leading-7 text-[#fff8ec]">{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#f5efe2]/10 bg-[#111018]">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-14 sm:px-8 md:grid-cols-3 lg:px-10">
          {testimonials.map(([title, body]) => (
            <article key={title} className="border border-[#d7aa55]/18 bg-[#090b10] p-5 shadow-xl shadow-black/20">
              <p className="text-lg font-bold text-[#fff8ec]">{title}</p>
              <p className="mt-4 text-sm leading-7 text-[#cfc2ae]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
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
        客服微信：{siteConfig.contactWeChat} ｜ 联系邮箱：{siteConfig.contactEmail}。本站内容仅用于娱乐、自我探索和产品演示，不构成医疗、法律、投资、婚恋等现实决策建议。
      </section>
    </main>
  );
}
