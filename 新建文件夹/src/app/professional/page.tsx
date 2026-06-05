import Link from "next/link";

const roadmap = [
  "八字：接入完整四柱排盘，计算年柱、月柱、日柱、时柱。",
  "紫微：接入命宫、身宫、十二宫、主星和四化。",
  "星座：增加上升星座和月亮星座，需要出生地点经纬度。",
  "报告：把专业排盘结果作为结构化数据传给 AI，而不是只让 AI 自由发挥。",
];

export default function ProfessionalPage() {
  return (
    <main className="min-h-screen bg-[#f8f3ea] text-[#1d1a16]">
      <section className="border-b border-[#e4d8c7] bg-[#211c18] px-5 py-8 text-[#fff8ec]">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f1c66d]">Pro Engine</p>
          <h1 className="mt-3 text-4xl font-semibold">专业排盘升级路线</h1>
          <p className="mt-3 text-sm text-[#ddccb5]">
            当前是 MVP 解读版，真正专业化需要把排盘算法和 AI 解读分开。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-8">
        <div className="grid gap-4 md:grid-cols-2">
          {roadmap.map((item, index) => (
            <article key={item} className="border border-[#dfd2c1] bg-white p-5">
              <p className="text-sm font-semibold text-[#9a563f]">0{index + 1}</p>
              <p className="mt-4 text-sm leading-7 text-[#6f6254]">{item}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 border border-[#dfd2c1] bg-[#fffaf2] p-5">
          <h2 className="text-2xl font-semibold">为什么不一开始就做专业算法</h2>
          <p className="mt-3 text-sm leading-7 text-[#6f6254]">
            对个人创业 MVP 来说，先验证用户是否愿意生成报告和付费更重要。等有真实用户反馈后，再把专业排盘作为第二阶段升级，投入更划算。
          </p>
        </div>

        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center bg-[#1d1a16] px-5 text-sm font-semibold text-[#fff8ec] transition hover:bg-[#9a563f]"
        >
          返回首页
        </Link>
      </section>
    </main>
  );
}
