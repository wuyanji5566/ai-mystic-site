import Link from "next/link";
import { FourDimensionalEngine } from "@/components/four-dimensional-engine";
import { MysticReportForm } from "@/components/mystic-report-form";
import { siteConfig } from "@/lib/site-config";

const dimensions = [
  ["八字", "底层节律", "理解行动节奏、能量起伏、财富倾向与长期积累方式。"],
  ["紫微", "人生结构", "理解事业位置、阶段课题、资源流动与关系中的角色。"],
  ["星座", "情绪能量", "理解安全感、亲密关系需求、外在呈现与压力反应。"],
  ["MBTI", "行为模式", "理解决策偏好、沟通方式、执行习惯与适合环境。"],
];

const testimonials = [
  "我一开始以为只是普通测试，但免费摘要第一段就说到我了，尤其是“想很多、启动慢、又不甘心低质量生活”这句。",
  "我买完整版主要是想看事业方向，30 天计划比我预期实用，至少知道接下来该先做什么。",
  "它不是直接告诉我会不会发财，而是把我的性格、关系和赚钱方式拆得比较清楚。",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080b0a] text-[#f6eddc]">
      <section className="relative min-h-[92vh] border-b border-[#d7aa55]/18">
        <div className="xj-nebula absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(215,170,85,.18),transparent_28%),radial-gradient(circle_at_78%_22%,rgba(113,64,210,.25),transparent_30%),linear-gradient(180deg,#080b0a,#0b0a13)]" />
        <div className="xj-particle-field absolute inset-0 opacity-25" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col px-4 py-5 sm:px-8 lg:px-10">
          <nav className="flex items-center justify-between border-b border-white/8 pb-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-[#d7aa55]/45 text-[#d7aa55]">
                ◇
              </span>
              <span>
                <strong className="block text-lg">{siteConfig.name}</strong>
                <small className="text-[10px] uppercase tracking-[0.22em] text-[#d7aa55]">
                  AI Destiny OS
                </small>
              </span>
            </Link>
            <div className="hidden items-center gap-5 text-sm text-[#c8c0b4] md:flex">
              <a href="#system">四维系统</a>
              <a href="#sample">报告样例</a>
              <a href="#report-form">开始生成</a>
              <a href="#pricing">完整报告</a>
            </div>
            <a
              href="#report-form"
              className="bg-[#d7aa55] px-4 py-2 text-xs font-black text-[#17130c] sm:px-6"
            >
              立即解码
            </a>
          </nav>

          <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1fr_.92fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.26em] text-[#d7aa55]">
                AI Personal Destiny Operating System
              </p>
              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.12] text-[#fff8ec] sm:text-6xl lg:text-7xl">
                你不是缺努力，
                <span className="mt-2 block bg-[linear-gradient(90deg,#fff8ec,#e4bd66,#b18aff)] bg-clip-text text-transparent">
                  你只是一直没看清自己的底层模式。
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#cdc4b7] sm:text-lg">
                融合八字底层节律、紫微人生结构、星座情绪能量、MBTI 行为模式，生成一份关于性格底色、事业路径、财富节奏、关系模式和未来 30 天行动方案的人生底层说明书。
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#99938a]">
                这不是传统算命，也不是普通性格测试，而是一套将东方命理、西方人格模型与 AI 推理结合的个人认知系统。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#report-form"
                  className="xj-cta flex h-14 items-center justify-center bg-[linear-gradient(100deg,#8a5a18,#e7c46c,#9a671e)] px-9 font-black text-[#17130c]"
                >
                  立即生成免费摘要 →
                </a>
                <a
                  href="#sample"
                  className="flex h-14 items-center justify-center border border-[#d7aa55]/30 px-8 font-bold text-[#f2d99a]"
                >
                  先看报告样例
                </a>
              </div>
              <p className="mt-4 text-xs leading-6 text-[#8d887f]">
                免费生成核心摘要，完整版解锁事业、财富、关系、未来一年节奏与 30 天行动计划。
              </p>
            </div>
            <FourDimensionalEngine />
          </div>
        </div>
      </section>

      <section id="system" className="border-b border-[#d7aa55]/16 px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d7aa55]">
              Four-Lens System
            </p>
            <h2 className="mt-4 text-4xl font-black">四套系统，不是简单叠加，而是交叉验证</h2>
          </header>
          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dimensions.map(([title, subtitle, description]) => (
              <article
                key={title}
                className="xj-card-hover border border-[#d7aa55]/24 bg-[#111513] p-6"
              >
                <span className="text-xs font-black uppercase tracking-[0.18em] text-[#d7aa55]">
                  {subtitle}
                </span>
                <h3 className="mt-3 text-3xl font-black">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#b9b2a7]">{description}</p>
              </article>
            ))}
          </div>
          <article className="mt-4 border border-[#8f66dd]/35 bg-[radial-gradient(circle_at_top_right,rgba(143,102,221,.18),transparent_40%),#111513] p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b996ff]">
              AI 融合推理
            </p>
            <h3 className="mt-3 text-2xl font-black">真正重要的，是四个维度如何共同形成你的现实困惑</h3>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-[#b9b2a7]">
              系统会区分“你适合怎样发力”“你适合站在什么位置”“你真正需要怎样的情绪回应”“你习惯如何做决定”，再把相互印证和相互拉扯的部分合并成现实建议。
            </p>
          </article>
        </div>
      </section>

      <section id="sample" className="border-b border-[#d7aa55]/16 bg-[#0b0e0c] px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d7aa55]">
              Sample Report
            </p>
            <h2 className="mt-4 text-4xl font-black">先看一个样例：它为什么不像普通测评？</h2>
          </header>
          <article className="mt-8 border border-[#d7aa55]/35 bg-[#111513] p-6 sm:p-8">
            <p className="text-base leading-9 text-[#e0d8cb]">
              你不是没有能力，而是长期卡在“想得很深”和“现实反馈太慢”之间。你适合处理复杂信息、长期判断、系统搭建与深度表达，但不适合长期待在低自主权、强消耗、重复执行的环境里。你真正需要的不是更多建议，而是一套能让你稳定输出、稳定变现、稳定建立关系反馈的现实系统。
            </p>
            <div className="mt-6 border border-[#d7aa55]/45 bg-black/25 p-5">
              <p className="font-black text-[#d7aa55]">完整版将继续展开</p>
              <div className="mt-4 grid gap-2 text-sm text-[#c7c0b5] sm:grid-cols-2">
                {["事业最佳路径", "财富增长模式", "亲密关系隐藏模式", "未来一年关键阶段", "未来 30 天行动计划"].map(
                  (item) => <p key={item}>锁定 · {item}</p>,
                )}
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="border-b border-[#d7aa55]/16 px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <MysticReportForm />
        </div>
      </section>

      <section id="pricing" className="border-b border-[#d7aa55]/16 bg-[#0b0e0c] px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d7aa55]">
              Full Report
            </p>
            <h2 className="mt-4 text-4xl font-black">
              完整报告的价值，不是告诉你命运，而是帮你看懂下一步
            </h2>
          </header>
          <div className="mt-9 grid gap-4 lg:grid-cols-2">
            <article className="border border-white/10 bg-[#111513] p-6">
              <h3 className="text-xl font-black">免费摘要</h3>
              <ul className="mt-4 grid gap-3 text-sm text-[#b9b2a7]">
                {["核心人格画像", "四维系统初步判断", "事业大方向", "关系提醒", "一个初步建议"].map(
                  (item) => <li key={item}>✓ {item}</li>,
                )}
              </ul>
            </article>
            <article className="border border-[#d7aa55]/55 bg-[radial-gradient(circle_at_top_right,rgba(215,170,85,.18),transparent_38%),#111513] p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d7aa55]">
                MVP 内测体验价
              </p>
              <h3 className="mt-3 text-3xl font-black">完整深度报告 · {siteConfig.fullReportPriceLabel}</h3>
              <ul className="mt-4 grid gap-3 text-sm text-[#e0d8cb] sm:grid-cols-2">
                {["四维交叉深度分析", "事业定位", "财富模式", "关系风险", "未来一年节奏", "30 天行动计划", "截图保存版", "继续追问入口"].map(
                  (item) => <li key={item}>✓ {item}</li>,
                )}
              </ul>
              <a
                href="#report-form"
                className="xj-cta mt-6 flex h-13 items-center justify-center bg-[#d7aa55] px-6 font-black text-[#17130c]"
              >
                先生成免费摘要，再决定是否解锁
              </a>
              <p className="mt-3 text-xs leading-6 text-[#8f8a82]">
                当前为 MVP 内测体验价，后续价格会根据报告深度和追问次数调整。
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="testimonials" className="px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-4xl font-black">用户如何理解这份报告</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote key={item} className="border border-[#d7aa55]/22 bg-[#111513] p-5 text-sm leading-8 text-[#c7c0b5]">
                “{item}”
              </blockquote>
            ))}
          </div>
          <footer className="mt-12 border-t border-[#d7aa55]/18 pt-8 text-center text-xs leading-7 text-[#817c74]">
            <p>本报告用于自我探索、认知复盘与成长参考，不替代医疗、法律、投资、婚恋等专业决策。</p>
            <p className="mt-2">客服微信：{siteConfig.contactWeChat} · 联系邮箱：{siteConfig.contactEmail}</p>
            <Link href="/admin-orders" className="mt-3 inline-block text-[#d7aa55]">订单后台</Link>
          </footer>
        </div>
      </section>
    </main>
  );
}
