import Link from "next/link";
import { MysticReportForm } from "@/components/mystic-report-form";
import { siteConfig } from "@/lib/site-config";

const dimensions = [
  ["紫微斗数", "看长期课题", "适合观察人生阶段、关系位置、事业节奏与内在驱动力。"],
  ["生辰八字", "看底层节律", "用出生时间建立基础五行、年柱与行动节奏的入门视角。"],
  ["西方星座", "看表达能量", "补充性格气质、情绪反应、关系表达和外在呈现方式。"],
  ["MBTI", "看行为模式", "理解决策偏好、压力反应、沟通风格和能量来源。"],
];

const reportModules = [
  "核心人格画像",
  "事业定位与适合环境",
  "关系边界与情绪触发点",
  "财富习惯与副业节奏",
  "未来 30 天行动计划",
  "未来一年阶段提醒",
  "截图分享版总结",
  "继续深度追问入口",
];

const sampleCards = [
  {
    title: "四维交叉画像",
    body: "把命盘倾向、星座表达和 MBTI 行为模式合在一起，提炼你的稳定优势、隐藏冲突和容易消耗自己的地方。",
  },
  {
    title: "事业与副业建议",
    body: "不是只说“适合创业”或“适合稳定”，而是拆成适合环境、不适合环境、能力补齐点和下一步可执行动作。",
  },
  {
    title: "关系与沟通模式",
    body: "分析你在亲密关系、人际合作里容易被触发的位置，以及更适合你的表达、边界和修复方式。",
  },
];

const testimonials = [
  ["很像一份个人咨询报告", "不是简单说性格，而是能看到我为什么总在某类关系里反复。"],
  ["行动建议比普通测评实用", "报告后面的 30 天计划最有用，能直接照着做。"],
  ["适合发给朋友一起讨论", "免费摘要就能看出一些东西，完整版更像一次深度梳理。"],
];

const faqs = [
  [
    "这是算命还是心理测评？",
    "它是娱乐和自我探索产品，把紫微、八字、星座和 MBTI 做融合表达，不替代现实中的专业咨询或决策。",
  ],
  [
    "为什么免费版只展示摘要？",
    "免费版用于体验方向感；完整版会展开事业、关系、财富、行动计划和继续追问，适合深度阅读。",
  ],
  [
    "支付后怎么解锁？",
    "当前阶段使用页面内收款码和订单编号人工核对。后续会升级为微信支付、支付宝自动解锁。",
  ],
  [
    "出生信息安全吗？",
    "当前未接账号系统时主要保存在浏览器本地。后续接云端保存时会继续补充更完整的隐私和删除机制。",
  ],
];

const links = [
  ["用户中心", "/account"],
  ["历史报告", "/reports"],
  ["价格方案", "/pricing"],
  ["隐私政策", "/privacy"],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0f1412] text-[#f5efe2]">
      <section className="relative border-b border-[#d7aa55]/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(215,170,85,0.18),transparent_28%),linear-gradient(120deg,rgba(37,95,85,0.36),transparent_36%),linear-gradient(70deg,transparent_48%,rgba(136,35,50,0.24)_72%),linear-gradient(180deg,rgba(15,20,18,0.06),#0f1412_88%)]" />
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(90deg,rgba(215,170,85,0.13)_1px,transparent_1px),linear-gradient(180deg,rgba(215,170,85,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />

        <div className="relative mx-auto grid min-h-screen max-w-7xl gap-10 px-5 py-6 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div className="flex flex-col justify-between gap-10 py-4">
            <nav className="flex flex-col gap-4 border-b border-[#f5efe2]/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/" className="w-fit">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d7aa55]">
                  Four-Lens Self Lab
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
                Zi Wei · Ba Zi · Astrology · MBTI
              </div>
              <h1 className="font-[family-name:var(--font-display)] text-5xl leading-[1.03] text-[#fbf3e4] sm:text-6xl lg:text-7xl">
                不止测一测，而是生成你的多维人生报告
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#d8cdb9] sm:text-lg">
                玄机命理会馆把紫微、八字、星座和 MBTI 融合成一份可阅读、可追问、可解锁的自我探索报告。免费先看核心摘要，完整版继续拆解事业、关系、财富和行动节奏。
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <a
                  href="#report-form"
                  className="inline-flex h-12 items-center justify-center bg-[#d7aa55] px-6 text-sm font-bold text-[#121714] transition hover:bg-[#f0c86c]"
                >
                  生成免费摘要
                </a>
                <Link
                  href="/pricing"
                  className="inline-flex h-12 items-center justify-center border border-[#f5efe2]/18 px-6 text-sm font-bold text-[#f5efe2] transition hover:border-[#d7aa55] hover:text-[#d7aa55]"
                >
                  查看完整版内容
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              {dimensions.map(([title, tag, desc]) => (
                <article key={title} className="border border-[#f5efe2]/12 bg-[#0f1412]/62 p-4">
                  <p className="text-xs font-bold text-[#d7aa55]">{tag}</p>
                  <p className="mt-2 text-sm font-bold text-[#fff8ec]">{title}</p>
                  <p className="mt-2 text-xs leading-5 text-[#c7baa6]">{desc}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid content-center gap-6 py-4">
            <div className="relative hidden min-h-[300px] border border-[#d7aa55]/22 bg-[#0b100e]/60 p-6 lg:block">
              <div className="absolute left-8 top-8 h-48 w-48 rounded-full border border-[#d7aa55]/35" />
              <div className="absolute left-16 top-16 h-32 w-32 rounded-full border border-[#2f9c89]/45" />
              <div className="absolute left-[7rem] top-[7rem] h-8 w-8 rotate-45 border border-[#d7aa55]/70" />
              <div className="ml-64 max-w-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2f9c89]">
                  Report System
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[#fff8ec]">
                  一份报告，拆出人格、关系、事业、财富和行动计划。
                </h2>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {reportModules.slice(0, 6).map((item) => (
                    <p key={item} className="border border-[#f5efe2]/12 px-3 py-2 text-xs text-[#d8cdb9]">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <MysticReportForm />
          </div>
        </div>
      </section>

      <section className="border-y border-[#d7aa55]/18 bg-[#f5efe2] text-[#121714]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8b2732]">
              Report Preview
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight">
              免费摘要给方向，完整版给结构和行动。
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#52615b]">
              用户第一次进来不能只看到一段泛泛而谈的 AI 文字。报告要像产品一样分区，先建立信任，再引导解锁。
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {sampleCards.map((card) => (
              <article key={card.title} className="border border-[#121714]/12 bg-white p-5">
                <p className="text-sm font-bold text-[#8b2732]">{card.title}</p>
                <p className="mt-4 text-sm leading-7 text-[#52615b]">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7aa55]">
              Paid Value
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight text-[#fff8ec]">
              完整版不是更多字，而是更完整的拆解路径。
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#d8cdb9]">
              付费内容要让用户觉得“我知道下一步怎么做”。所以完整版围绕自我理解、现实行动和继续互动来设计。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {reportModules.map((item, index) => (
              <article key={item} className="border border-[#d7aa55]/18 bg-[#141b18] p-5">
                <p className="text-xs font-bold text-[#d7aa55]">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-5 text-sm font-bold leading-7 text-[#fff8ec]">{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#f5efe2]/10 bg-[#121714]">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-14 sm:px-8 md:grid-cols-3 lg:px-10">
          {testimonials.map(([title, body]) => (
            <article key={title} className="border border-[#d7aa55]/18 bg-[#0f1412] p-5">
              <p className="text-lg font-bold text-[#fff8ec]">{title}</p>
              <p className="mt-4 text-sm leading-7 text-[#cfc2ae]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7aa55]">FAQ</p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[#fff8ec]">
              用户付款前最关心的问题
            </h2>
          </div>
          <div className="grid gap-3">
            {faqs.map(([question, answer]) => (
              <article key={question} className="border border-[#d7aa55]/18 bg-[#141b18] p-5">
                <h3 className="text-base font-bold text-[#fff8ec]">{question}</h3>
                <p className="mt-3 text-sm leading-7 text-[#cfc2ae]">{answer}</p>
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
