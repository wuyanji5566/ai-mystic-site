import type { MysticInput, MysticProfile } from "@/lib/mystic";
import { parseReportSections } from "@/lib/report-sections";
import { siteConfig } from "@/lib/site-config";

type FreeSummaryReportProps = {
  input: MysticInput;
  profile: MysticProfile;
  report: string;
  onUnlock: () => void;
};

const lockedItems = [
  "事业定位：更适合内容、咨询、技术、管理还是资源整合",
  "财富路径：适合依靠什么能力变现，哪些模式最容易白忙",
  "关系深层模式：真实需求、风险点与沟通边界",
  "未来一年节奏：什么阶段适合推进，什么阶段需要调整",
  "未来 30 天计划：每周任务、停止事项与复盘问题",
  "专属追问：围绕事业、财富、关系继续深入分析",
];

export const fullReportModules = [
  "四维合参总诊断",
  "八字节律深度分析",
  "紫微人生结构分析",
  "星座情绪与关系表达分析",
  "MBTI行为模式分析",
  "事业定位与适合赛道",
  "财富节奏与赚钱方式",
  "亲密关系与边界模式",
  "未来一年阶段提醒",
  "未来30天行动计划",
  "三个继续追问建议",
  "截图保存版总结",
];

function getCoreLabel(input: MysticInput) {
  const text = `${input.mbtiType} ${input.focus}`;
  if (/事业|财富|副业|转型/.test(text)) return "需要长期积累才能真正起势的策略型人格";
  if (/感情|婚姻|关系|家庭/.test(text)) return "重视理解与边界、但不轻易表达失望的人";
  if (/人生方向|自我|成长/.test(text)) return "需要意义感和现实反馈同时驱动的人";
  if (/INTJ|INTP|INFJ|INFP/.test(text)) return "判断很深、但容易把启动时间拉长的人";
  return "敏感、重判断，也需要现实系统承接想法的人";
}

function getImmediateAction(input: MysticInput) {
  if (/事业|财富|副业|转型/.test(input.focus)) {
    return "今天先不要继续增加方向。写下你最想长期积累的一项能力，并完成一个能被别人看见的小成果，例如一页方案、一篇内容或一个服务样品。";
  }
  if (/感情|婚姻|关系|家庭/.test(input.focus)) {
    return "今天选一段最重要的关系，只表达一个真实需要，不解释过多，也不要求对方立刻给答案。先让沟通从猜测回到事实。";
  }
  return "今天把最困扰你的问题分成三栏：我能控制、我能影响、我暂时需要放下。只从第一栏选一件 30 分钟内能完成的事。";
}

function getFreeSections(report: string) {
  const sections = parseReportSections(report);
  const synthesis = sections.find((section) =>
    /四维合参总诊断|四维综合人格总论/.test(section.title),
  );
  const dimensions = sections
    .filter((section) =>
      /八字.*底层节律|紫微.*人生结构|星座.*情绪能量|MBTI.*行为模式/.test(
        section.title,
      ),
    )
    .slice(0, 4);
  const crossConclusion = sections.find((section) =>
    /四维交叉后的现实结论/.test(section.title),
  );

  return {
    synthesis,
    dimensions,
    crossConclusion,
    fallback: sections
      .filter((section) => !/报告说明|摘要/.test(section.title))
      .slice(0, 5),
  };
}

export function FreeSummaryReport({
  input,
  profile,
  report,
  onUnlock,
}: FreeSummaryReportProps) {
  const freeSections = getFreeSections(report);
  const dimensionMeta = [
    {
      key: "八字",
      label: "底层节律",
      value: profile.yearPillar,
      question: "你适合怎样发力",
    },
    {
      key: "紫微",
      label: "人生结构",
      value: "结构倾向",
      question: "你适合站在什么位置",
    },
    {
      key: "星座",
      label: "情绪能量",
      value: profile.westernSign,
      question: "你真正需要什么",
    },
    {
      key: "MBTI",
      label: "行为模式",
      value: input.mbtiType,
      question: "你习惯怎样判断与行动",
    },
  ];

  return (
    <section className="report-result">
      <div className="report-hero-card">
        <span className="report-kicker">免费核心诊断</span>
        <h2>{input.name || "你"}的四维人生画像</h2>
        <p>
          这份摘要先回答三个问题：你最稳定的优势是什么、你为什么容易反复卡住、现在可以从哪里开始改变。先读完并结合真实经历验证，不需要急着接受任何结论。
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[profile.westernSign, input.mbtiType, input.focus.slice(0, 14)].map((tag) => (
            <span
              key={tag}
              className="border border-[#d7aa55]/25 bg-[#d7aa55]/8 px-3 py-1 text-xs font-bold text-[#f2ddae]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="report-section highlight-section">
        <span className="report-kicker">四维合参引擎</span>
        <h3>不是四份测评相加，而是四个角度互相验证</h3>
        <div className="fusion-lens-grid">
          {dimensionMeta.map((item) => (
            <article key={item.key} className="fusion-lens-card">
              <span>{item.key}</span>
              <strong>{item.label}</strong>
              <b>{item.value}</b>
              <p>{item.question}</p>
            </article>
          ))}
        </div>
        <div className="fusion-equation">
          <span>行为方式</span>
          <i>×</i>
          <span>情绪需求</span>
          <i>+</i>
          <span>发力节奏</span>
          <i>×</i>
          <span>人生位置</span>
          <strong>＝ 你的现实模式</strong>
        </div>
      </div>

      <div className="report-section fusion-diagnosis">
        <span className="report-kicker">交叉后的第一结论</span>
        <h3>你不是缺能力，而是需要更适合自己的发力方式</h3>
        <p className="report-lead">
          {freeSections.synthesis?.body ||
            `从你本次填写的信息看，你更像是一个「${getCoreLabel(input)}」。真正的问题往往不是你做不到，而是你习惯先把事情想清楚、确认值得，再允许自己投入；当现实反馈太慢时，这种谨慎就容易变成消耗。`}
        </p>
      </div>

      {freeSections.dimensions.length > 0 ? (
        <div className="report-grid premium-summary-grid">
          {freeSections.dimensions.map((section, index) => (
            <article key={`${section.title}-${index}`} className="report-card premium-summary-card">
              <div className="summary-card-topline">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{dimensionMeta[index]?.question || "交叉视角"}</strong>
              </div>
              <h3>{section.title.replace(/^\d{1,2}\.\s*/, "")}</h3>
              <p className="whitespace-pre-wrap">{section.body}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="report-grid premium-summary-grid">
          {freeSections.fallback.slice(0, 4).map((section, index) => (
            <article key={`${section.title}-${index}`} className="report-card premium-summary-card">
              <div className="summary-card-topline">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{dimensionMeta[index]?.label || "分析视角"}</strong>
              </div>
              <h3>{section.title.replace(/^\d{1,2}\.\s*/, "")}</h3>
              <p className="whitespace-pre-wrap">{section.body}</p>
            </article>
          ))}
        </div>
      )}

      <div className="report-section conclusion-section">
        <span className="report-kicker">四维交叉后的现实判断</span>
        <h3>真正重要的不是标签，而是它们如何共同影响你的选择</h3>
        <p className="report-lead">
          {freeSections.crossConclusion?.body ||
            `你的行为偏好让你更愿意先判断再行动，情绪层面又需要确定感和高质量反馈；与此同时，节律与结构倾向更支持长期积累，而不是频繁切换。围绕“${input.focus}”，你当前最值得优先解决的，是建立一个连续 30 天都能获得现实反馈的小闭环。`}
        </p>
      </div>

      <div className="report-section action-section">
        <span className="report-kicker">不付费也可以先做</span>
        <h3>给你一个今天就能开始的动作</h3>
        <p className="report-lead">{getImmediateAction(input)}</p>
        <p>
          先连续执行 7 天，再回来判断这份报告有没有帮助。好的分析不应该只让人觉得“说得像”，还应该让你更容易行动。
        </p>
      </div>

      <div className="locked-report-card">
        <div className="lock-icon" aria-hidden="true">深度</div>
        <span className="report-kicker">当你需要更具体的答案时</span>
        <h3>免费版解释“为什么”，完整版继续回答“具体怎么选”</h3>
        <p className="premium-lock-lead">
          免费诊断到这里已经完整结束。下面不是重复扩写，而是围绕你的事业、财富、关系和行动计划继续给出更具体的判断。
        </p>
        <ul>
          {lockedItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>
          如果你只是想认识自己，免费内容已经可以保存。如果你正处在转型、关系困惑或方向选择阶段，再考虑解锁完整版。
        </p>
        <button type="button" className="unlock-report-btn" onClick={onUnlock}>
          查看完整版包含什么 · ¥{siteConfig.fullReportPrice}
        </button>
        <span className="unlock-note">点击后先查看内容与付款说明，不会直接扣款。</span>
      </div>
    </section>
  );
}
