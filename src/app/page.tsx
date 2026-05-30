import Link from "next/link";
import { MysticReportForm } from "@/components/mystic-report-form";
import { siteConfig } from "@/lib/site-config";

const dimensions = [
  ["紫微斗数", "观察人生课题、关系位置与长期节奏。"],
  ["生辰八字", "用出生时间建立基础五行与年柱视角。"],
  ["西方星座", "补充性格能量、表达方式与情绪节律。"],
  ["MBTI", "理解决策风格、压力反应和沟通偏好。"],
];

const interactionFlow = [
  ["01", "生成画像", "输入出生信息与 MBTI，得到四维融合报告。"],
  ["02", "继续追问", "围绕事业、关系、财富、30 天计划继续深化。"],
  ["03", "转化服务", "免费摘要后引导完整版报告和人工咨询。"],
];

const deepQuestions = [
  "我适合什么事业定位？",
  "我在亲密关系里最容易卡在哪里？",
  "我如何调整财富和消费模式？",
  "未来 30 天我应该先做什么？",
  "我的 MBTI 和命盘冲突时该听谁？",
  "怎么把报告变成可执行计划？",
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
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(37,95,85,0.38),transparent_36%),linear-gradient(70deg,transparent_48%,rgba(136,35,50,0.24)_72%),linear-gradient(180deg,rgba(15,20,18,0.1),#0f1412_86%)]" />
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
                用四种系统，看见更完整的自己
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#d8cdb9] sm:text-lg">
                把紫微、八字、星座和 MBTI 融合成一份可追问、可复看、可转化的自我理解报告。用户不只是“测一测”，还能继续深挖自己的事业、关系、财富和行动节奏。
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <a
                  href="#report-form"
                  className="inline-flex h-12 items-center justify-center bg-[#d7aa55] px-6 text-sm font-bold text-[#121714] transition hover:bg-[#f0c86c]"
                >
                  开始四维分析
                </a>
                <Link
                  href="/pricing"
                  className="inline-flex h-12 items-center justify-center border border-[#f5efe2]/18 px-6 text-sm font-bold text-[#f5efe2] transition hover:border-[#d7aa55] hover:text-[#d7aa55]"
                >
                  查看完整版报告
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              {dimensions.map(([title, desc]) => (
                <article key={title} className="border border-[#f5efe2]/12 bg-[#0f1412]/62 p-4">
                  <p className="text-sm font-bold text-[#fff8ec]">{title}</p>
                  <p className="mt-2 text-xs leading-5 text-[#c7baa6]">{desc}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid content-center gap-6 py-4">
            <div className="relative hidden min-h-[260px] border border-[#d7aa55]/22 bg-[#0b100e]/60 p-6 lg:block">
              <div className="absolute left-8 top-8 h-44 w-44 rounded-full border border-[#d7aa55]/35" />
              <div className="absolute left-14 top-14 h-32 w-32 rounded-full border border-[#2f9c89]/45" />
              <div className="absolute left-[6.4rem] top-[6.4rem] h-8 w-8 rotate-45 border border-[#d7aa55]/70" />
              <div className="ml-60 max-w-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2f9c89]">
                  Self Insight Engine
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[#fff8ec]">
                  从命盘、性格、关系和行动四条线，生成可继续对话的个人画像。
                </h2>
              </div>
            </div>
            <MysticReportForm />
          </div>
        </div>
      </section>

      <section className="border-y border-[#d7aa55]/18 bg-[#f5efe2] text-[#121714]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:px-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8b2732]">
              Product Loop
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight">
              让用户从一次测试，进入连续探索。
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#52615b]">
              这类产品的核心不是“算完就走”，而是每次报告都能继续追问，逐步沉淀用户的自我画像和付费需求。
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {interactionFlow.map(([step, title, desc]) => (
              <article key={step} className="border border-[#121714]/12 bg-white p-5">
                <p className="text-sm font-bold text-[#8b2732]">{step}</p>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#52615b]">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7aa55]">
              Deep Interaction
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight text-[#fff8ec]">
              报告之后，继续问真正关心的问题。
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#d8cdb9]">
              详情页已经加入继续深化模块，用户可以围绕具体困惑继续生成行动建议。这也是后续做会员、咨询、复购的入口。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {deepQuestions.map((question) => (
              <div key={question} className="border border-[#d7aa55]/18 bg-[#141b18] p-5">
                <p className="text-sm font-semibold leading-7 text-[#fff8ec]">{question}</p>
              </div>
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
