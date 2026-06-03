import type { MysticInput, MysticProfile } from "@/lib/mystic";
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

function getDimensionInsights(input: MysticInput, profile: MysticProfile) {
  const isCareer = /事业|财富|副业|转型|人生方向|30天|未来/.test(input.focus);
  const isRelation = /感情|婚姻|关系|家庭|人际/.test(input.focus);
  const isIntrovertThinker = /INTJ|INTP|INFJ|INFP/.test(input.mbtiType);

  return [
    {
      title: "八字看到的是你的底层节律",
      badge: profile.yearPillar,
      diagnosis: isCareer
        ? "你更像是先观察、再蓄力、最后集中发力的人。真正适合你的不是频繁换方向，而是在一个能长期积累的主题里，把判断力、经验和作品慢慢沉淀出来。"
        : "你的节律不是一直向外冲，而是需要先把内在秩序稳住。越是在压力大的阶段，越不能靠情绪化决定方向，而要用固定节奏恢复掌控感。",
      paidHook: "完整版会继续拆你的年度发力窗口、容易消耗的阶段，以及财富节奏如何跟行动计划配合。",
    },
    {
      title: "紫微看到的是你的人生结构",
      badge: "结构倾向",
      diagnosis: isCareer
        ? "你适合站在能做判断、能整合资源、能逐步建立个人影响力的位置上。长期只做被动执行，会让你的优势被压住，也会让你越来越怀疑自己的价值。"
        : "你的人生结构里，真正重要的是找到一个能承接你判断力的位置。你不适合一直被外界节奏推着走，更适合建立自己的选择标准。",
      paidHook: "完整版会继续展开你的事业位置、适合环境、资源流动方式，以及当前阶段最该处理的课题。",
    },
    {
      title: "星座看到的是你的情绪能量",
      badge: profile.westernSign,
      diagnosis: isRelation
        ? "你表面可能理性、克制，但内在对安全感、尊重感和被理解感要求很高。你不怕关系慢一点，怕的是长期沟通不到同一层级。"
        : "你对外可以表现得稳定，但真正影响你状态的是内在安全感。一旦现实反馈太慢、关系回应太弱，你就容易进入自我消耗。你需要的是被看见，也需要更早表达边界。",
      paidHook: "完整版会继续拆你的亲密关系隐藏模式、沟通风险点，以及适合你的关系修复方式。",
    },
    {
      title: "MBTI看到的是你的行为模式",
      badge: input.mbtiType === "不确定" ? "待推测" : input.mbtiType,
      diagnosis: isIntrovertThinker
        ? "你习惯先把逻辑想清楚，再决定要不要行动。优势是判断深，风险是启动慢；一旦没有外部反馈，你容易把大量能量消耗在推演里。"
        : "你的行为模式更需要清晰目标和即时反馈。你不是不能行动，而是当目标模糊、价值不确定时，很难持续投入。你需要的是一个能快速验证的小闭环。",
      paidHook: "完整版会继续给出你的执行策略、合作沟通边界，以及未来30天如何把想法变成稳定输出。",
    },
  ];
}

export function FreeSummaryReport({ input, profile, onUnlock }: FreeSummaryReportProps) {
  const coreLabel = getCoreLabel(input);
  const coreStrength = getCoreStrength(input);
  const coreStuck = getCoreStuck(input);
  const dimensionInsights = getDimensionInsights(input, profile);

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

      <div className="report-grid premium-summary-grid">
        {dimensionInsights.map((item, index) => (
          <article key={item.title} className="report-card premium-summary-card">
            <div className="summary-card-topline">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.badge}</strong>
            </div>
            <h3>{item.title}</h3>
            <p>{item.diagnosis}</p>
            <div className="paid-tease">
              <span>完整版继续展开</span>
              <p>{item.paidHook}</p>
            </div>
          </article>
        ))}
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
        <h3>你的完整版报告已生成，真正影响决策的部分在这里</h3>
        <p className="premium-lock-lead">
          免费摘要已经让你看到“为什么像你”。完整版会继续回答更关键的问题：你应该往哪里走，哪些坑要避开，接下来30天具体怎么做。
        </p>
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
