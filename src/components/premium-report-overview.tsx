import type { MysticInput } from "@/lib/mystic";
import { buildReportPersonalization } from "@/lib/report-personalization";
import type { MysticProfile } from "@/lib/mystic";

const deliverables = [
  {
    number: "01",
    title: "核心矛盾诊断",
    description: "不是贴标签，而是解释你的优势为何会在某些场景变成阻力。",
  },
  {
    number: "02",
    title: "事业与财富路径",
    description: "给出适合方向、不适合环境、验证动作和收入形成方式。",
  },
  {
    number: "03",
    title: "关系与边界脚本",
    description: "识别触发点、真实需求，并提供可以直接使用的沟通表达。",
  },
  {
    number: "04",
    title: "年度与 30 天计划",
    description: "把判断拆成阶段重点、完成标准、阻力预案和复盘问题。",
  },
];

export function PremiumReportOverview({
  input,
  profile,
}: {
  input: MysticInput;
  profile: MysticProfile;
}) {
  const insight = buildReportPersonalization(input, profile);

  return (
    <section className="mb-5 border border-[#d7aa55]/45 bg-[linear-gradient(135deg,#121713,#090c0a)] p-5 sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d7aa55]">
            Private Consulting Edition
          </p>
          <h2 className="mt-3 text-2xl font-black leading-tight text-[#fff8ec] sm:text-3xl">
            这不是加长版摘要，
            <br />
            而是你的个人决策底稿。
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#bdb6aa]">
            本报告围绕“{input.focus}”展开，以 {insight.archetype}
            为主线，把四维判断落到现实选择、风险信号和下一步行动。
          </p>
          <div className="mt-5 border-l-2 border-[#d7aa55] bg-[#d7aa55]/8 px-4 py-3">
            <span className="text-xs font-black text-[#d7aa55]">阅读建议</span>
            <p className="mt-1 text-sm leading-6 text-[#eee4d3]">
              先看核心总览，再根据你当前最急的问题进入事业财富或关系行动。
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {deliverables.map((item) => (
            <article
              key={item.number}
              className="border border-[#d7aa55]/20 bg-[#151a17] p-4"
            >
              <span className="font-mono text-xs font-black text-[#d7aa55]">
                {item.number}
              </span>
              <h3 className="mt-2 font-black text-[#f8f0df]">{item.title}</h3>
              <p className="mt-2 text-xs leading-6 text-[#969c96]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
