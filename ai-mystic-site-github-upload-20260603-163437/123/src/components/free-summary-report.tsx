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
  "你的事业定位：到底更适合内容型、咨询型、技术型、管理型还是资源整合型",
  "你的财富增长方式：适合靠专业、表达、资源、技术还是长期复利赚钱",
  "你的关系风险点：为什么你会反复在同类关系里失望或退回去",
  "你未来一年最关键的阶段提醒：什么时候该发力，什么时候该收缩",
  "你未来 30 天最该做的 3 件事：不是鸡汤，是可以执行的行动清单",
  "针对你的继续追问入口：副业、事业卡点、亲密关系、行动计划都可以继续问",
];

export const fullReportModules = [
  "四维综合人格总论",
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

const strengthBullets = [
  ["深度判断", "你能看到别人忽略的长期趋势，但需要一个现实项目来承接。"],
  ["系统思维", "你适合把混乱信息整理成结构，这会成为你的事业优势。"],
  ["长远规划", "你不是只看眼前收益的人，更适合做能复利的事情。"],
  ["高标准", "你对自己和结果都有要求，完整版会告诉你怎样避免高标准变成拖延。"],
];

const riskBullets = [
  ["启动慢", "不是因为懒，而是因为你想确认更多；但机会不会等你完全想清楚。"],
  ["反馈敏感", "你很在意自己的判断是否被认可，所以需要建立稳定外部反馈。"],
  ["内耗", "想得太深时，行动会被推迟；完整版会拆你的 30 天启动方式。"],
  ["关系撤退", "失望时你不一定争吵，但会慢慢收回信任，这会影响亲密关系稳定。"],
];

function compactText(text: string, maxLength = 150) {
  const value = text.replace(/\s+/g, " ").trim();
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
}

function findSection(report: string, keywords: string[]) {
  const sections = parseReportSections(report);
  return (
    sections.find((section) => keywords.some((keyword) => section.title.includes(keyword))) ||
    sections.find((section) => keywords.some((keyword) => section.body.includes(keyword)))
  );
}

function getCoreLabel(input: MysticInput) {
  const text = `${input.mbtiType} ${input.focus}`;
  if (/事业|财富|副业|转型/.test(text)) return "深度思考型长期主义者";
  if (/感情|婚姻|关系|家庭/.test(text)) return "外冷内热的策略型人格";
  if (/人生方向|自我|成长/.test(text)) return "需要意义感驱动的行动型思考者";
  if (/INTJ|INTP|INFJ|INFP/.test(text)) return "擅长看趋势但容易启动慢的人";
  if (/ENTJ|ENTP|ESTJ|ESTP/.test(text)) return "强自尊、强判断、强成长欲的人";
  return "高敏感、重判断、需要系统承接的人";
}

function getCoreStrength(input: MysticInput) {
  if (/事业|副业|转型|财富/.test(input.focus)) {
    return "你能把复杂信息拆成结构，并在长期积累中形成自己的判断力。";
  }
  if (/感情|婚姻|关系/.test(input.focus)) {
    return "你对关系质量很敏感，能很快看出一段关系是否真正尊重你的边界。";
  }
  return "你不适合靠一时冲动取胜，更适合靠深度判断、系统思维和稳定复盘建立优势。";
}

function getCoreStuck(input: MysticInput) {
  if (/事业|副业|转型|财富/.test(input.focus)) {
    return "你容易在看清方向之前迟迟不启动，导致想法很多，但外部作品和收入反馈偏慢。";
  }
  if (/感情|婚姻|关系/.test(input.focus)) {
    return "你不一定会直接表达失望，但一旦反复不被理解，就会慢慢收回信任。";
  }
  return "你最容易卡在想得很深、标准很高，但现实系统还没有真正搭起来。";
}

export function FreeSummaryReport({ input, profile, report, onUnlock }: FreeSummaryReportProps) {
  const baziSection = findSection(report, ["八字", "节律"]);
  const ziweiSection = findSection(report, ["紫微", "结构"]);
  const astroSection = findSection(report, ["星座", "情绪"]);
  const mbtiSection = findSection(report, ["MBTI", "行为"]);
  const coreLabel = getCoreLabel(input);
  const coreStrength = getCoreStrength(input);
  const coreStuck = getCoreStuck(input);

  const baziText =
    baziSection?.body ||
    "从出生节律看，你更像是先蓄力、再冲刺、再复盘的人。你不适合一直处在高压输出状态，更适合在明确阶段目标后集中爆发。在财富方式上，你更适合靠能力、专业、经验、判断力积累，而不是长期依赖高风险投机或情绪化选择。";
  const ziweiText =
    ziweiSection?.body ||
    "从人生结构倾向看，你更适合在一个能让你独立判断、长期积累、逐步建立影响力的位置上发展。你不太适合长期待在规则过死、空间太小、只能被动执行的环境里。你真正适合的，是能把判断力、资源整合力和长期规划能力慢慢放大的场景。";
  const astroText =
    astroSection?.body ||
    "从情绪能量看，你表面可能理性、克制、能沟通，但内在其实非常在意尊重感、安全感和被理解的感觉。你不一定会直接表达失望，但一旦发现对方长期跟不上你的节奏，或者不能理解你的真实想法，你可能会慢慢撤回信任。";
  const mbtiText =
    mbtiSection?.body ||
    `从行为模式看，${input.mbtiType} 更习惯先理解系统，再决定行动。你不喜欢盲目开始，更希望先看清逻辑、路径和风险。优势是能快速抓住复杂信息背后的结构，风险是如果一直没有明确反馈，你容易反复推演，而不是马上行动。`;

  return (
    <section className="report-result">
      <div className="report-hero-card">
        <span className="report-kicker">你的免费核心摘要</span>
        <h2>你的四维人生画像已生成</h2>
        <p>
          {input.name}，以下内容基于你的出生信息、{profile.westernSign}、MBTI 与关注方向生成。免费版展示核心画像，完整版将继续展开事业、财富、关系与行动计划。
        </p>
      </div>

      <div className="report-section highlight-section">
        <h3>你的底层人格模式</h3>
        <p className="report-lead">
          你不是单一的 MBTI 类型，也不是一个简单的命理标签。你的四维画像显示，你更像是一个「{coreLabel}」。
        </p>
        <div className="mini-insight-grid">
          <div className="mini-insight">
            <span>核心优势</span>
            <strong>{coreStrength}</strong>
          </div>
          <div className="mini-insight danger">
            <span>主要卡点</span>
            <strong>{coreStuck}</strong>
          </div>
        </div>
      </div>

      <div className="report-grid">
        <article className="report-card">
          <h3>八字看到的是你的底层节律</h3>
          <p>{compactText(baziText, 220)}</p>
          <p className="locked-line">完整版本会继续展开你的年度节律、适合发力阶段和财富增长节奏。</p>
        </article>

        <article className="report-card">
          <h3>紫微看到的是你的人生结构</h3>
          <p>{compactText(ziweiText, 220)}</p>
          <p className="locked-line">完整版本会继续展开你的事业位置、资源流动方式和人生阶段重点。</p>
        </article>

        <article className="report-card">
          <h3>星座看到的是你的情绪能量</h3>
          <p>{compactText(astroText, 220)}</p>
          <p className="locked-line">完整版本会继续展开你的亲密关系模式、关系风险点和适合你的相处方式。</p>
        </article>

        <article className="report-card">
          <h3>MBTI看到的是你的行为模式</h3>
          <p>{compactText(mbtiText, 220)}</p>
          <p className="locked-line">完整版本会继续展开你的执行策略、沟通方式和适合的成长路径。</p>
        </article>
      </div>

      <div className="strength-risk-grid">
        <article className="report-card strength-card">
          <h3>你身上最容易被低估的优势</h3>
          <ul>
            {strengthBullets.map(([title, body]) => (
              <li key={title}>
                <strong>{title}：</strong>
                {body}
              </li>
            ))}
          </ul>
        </article>

        <article className="report-card risk-card">
          <h3>你真正卡住的地方</h3>
          <ul>
            {riskBullets.map(([title, body]) => (
              <li key={title}>
                <strong>{title}：</strong>
                {body}
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="report-section conclusion-section">
        <h3>四维交叉后，真正重要的是这一点</h3>
        <p>
          当八字的节律、紫微的结构、星座的情绪能量和 MBTI 的行为模式交叉之后，真正重要的不是你属于哪一种标签，而是你为什么会反复卡在同一个位置。
        </p>
        <p>
          你的优势很清晰：你适合做需要判断力、系统力、长期积累和深度表达的事情。你的风险也很清晰：如果没有一个现实系统承接你的想法，你就容易一直停留在“想清楚、再开始”的阶段。
        </p>
        <p>所以你真正需要的不是更多泛泛的建议，而是一套能落到现实里的行动路径。</p>
        <p className="gold-emphasis">
          免费摘要只能告诉你“你大概为什么卡住”；完整版会继续告诉你“你更适合走哪条路，以及接下来 30 天怎么动起来”。
        </p>
      </div>

      <div className="locked-report-card">
        <div className="lock-icon">LOCK</div>
        <h3>你的完整版报告已生成，真正值钱的部分在这里</h3>
        <ul>
          {lockedItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>你已经看到了自己的核心画像，但最关键的事业、财富、关系和行动计划仍在完整版中。</p>
        <p>
          如果你只是想随便测一测，免费摘要已经够了。但如果你正在经历事业选择、关系困惑、自我重建、财富转型或人生方向混乱，完整版更像是一份给自己的深度复盘报告，而不是一份普通测试结果。
        </p>
        <button type="button" className="unlock-report-btn" onClick={onUnlock}>
          解锁我的完整人生报告 ¥{siteConfig.fullReportPrice}
        </button>
        <span className="unlock-note">一次解锁，适合截图保存、反复复盘、继续追问。</span>
      </div>
    </section>
  );
}
