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
  "你的事业定位与适合赛道",
  "你的财富增长方式与副业方向",
  "你的亲密关系风险点",
  "你未来一年最关键的阶段提醒",
  "你未来 30 天最该做的 3 件事",
  "针对你的继续追问入口",
];

const fullReportItems = [
  "你的事业定位与适合赛道",
  "你的财富节奏与赚钱方式",
  "你的亲密关系风险点",
  "你未来一年最该抓住的机会",
  "你未来 30 天最该做的 3 件事",
  "针对你的继续追问入口",
];

const comparison = {
  free: ["核心人格画像", "四维系统初步判断", "事业大方向", "关系提醒", "一个初步建议"],
  paid: [
    "四维交叉深度分析",
    "事业定位",
    "财富模式",
    "关系风险",
    "未来一年节奏",
    "30 天行动计划",
    "截图保存版",
    "继续追问入口",
  ],
};

function compactText(text: string, maxLength = 124) {
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

export function FreeSummaryReport({ input, profile, report, onUnlock }: FreeSummaryReportProps) {
  const profileSection = findSection(report, ["核心", "画像", "性格"]);
  const baziSection = findSection(report, ["八字", "节律"]);
  const ziweiSection = findSection(report, ["紫微", "结构"]);
  const astroSection = findSection(report, ["星座", "情绪"]);
  const mbtiSection = findSection(report, ["MBTI", "行为"]);
  const crossSection = findSection(report, ["四维", "交叉"]);
  const relationSection = findSection(report, ["关系", "感情", "亲密"]);
  const actionSection = findSection(report, ["行动", "30 天", "提醒"]);

  const strengthText =
    profileSection?.body ||
    `${input.name} 不是外放型冲锋的人，更适合在复杂信息、长期判断和系统规划中慢慢建立优势。`;
  const stuckText =
    actionSection?.body ||
    "你最大的问题不是不努力，而是容易想得很深，却迟迟没有形成稳定的外部作品、收入结构或关系反馈。";
  const relationText =
    relationSection?.body ||
    "你表面理性，但内在对安全感、尊重感和被理解感要求很高。";
  const baziText =
    baziSection?.body ||
    "基于出生信息的节律型分析会更关注你的行动节奏、财富倾向、压力模式和长期运势节律。当前版本不假装完整精确排盘，会把它作为现实节奏参考。";
  const ziweiText =
    ziweiSection?.body ||
    "紫微更像一张人生结构图。当前版本不编造具体星曜落宫，而是从事业位置、关系模式、资源流动和阶段课题做结构化倾向分析。";
  const astroText =
    astroSection?.body ||
    "星座看到的是你的情绪表达、亲密关系需求、外在呈现和压力下的反应，它能解释你为什么在某些关系里格外在意被理解。";
  const mbtiText =
    mbtiSection?.body ||
    "MBTI 更像行为说明书，用来观察你的决策方式、信息处理、沟通方式、执行习惯和适合环境。";
  const crossText =
    crossSection?.body ||
    "四维交叉后真正重要的是：你的优势如何形成、卡点为什么反复出现、适合什么事业环境、关系里最需要什么、赚钱时最要避开什么。";

  return (
    <div className="grid gap-4">
      <article className="overflow-hidden border border-[#d7aa55]/35 bg-[#0b0f14] p-5 text-[#f5efe2] shadow-2xl shadow-black/30">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d7aa55]">
              Free Insight Summary
            </p>
            <h4 className="mt-3 font-[family-name:var(--font-display)] text-3xl leading-tight">
              你的免费摘要已经生成
            </h4>
            <p className="mt-3 text-sm leading-7 text-[#cfc2ae]">
              下面先给你 60% 的核心判断：让你知道它是不是说中了你。剩下更具体的事业、财富、关系和行动方案，放在完整版里展开。
            </p>
          </div>
          <span className="w-fit border border-[#2f9c89]/45 bg-[#0f1917] px-3 py-1 text-xs font-bold text-[#aef2dd]">
            {profile.westernSign} · {profile.zodiac} · {input.mbtiType}
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          <section className="border border-[#d7aa55]/24 bg-[#121714] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d7aa55]">
              你的底层人格模式
            </p>
            <p className="mt-3 text-lg font-bold leading-8 text-[#fff8ec]">
              你不是简单的 {input.mbtiType}，也不是单一命理标签。你的四维画像显示：你更像是一个
              <span className="text-[#d7aa55]">“高敏感、重判断、需要系统承接的人”</span>，
              你真正的优势在于深度判断，但最容易被卡住的地方是想得很深、现实反馈太慢。
            </p>
          </section>

          {[
            ["八字看到的是你的底层节律", baziText],
            ["紫微看到的是你的人生结构", ziweiText],
            ["星座看到的是你的情绪能量", astroText],
            ["MBTI看到的是你的行为模式", mbtiText],
          ].map(([title, body]) => (
            <section key={title} className="border border-[#f5efe2]/10 bg-[#10151b] p-4">
              <h5 className="text-base font-bold text-[#fff8ec]">{title}</h5>
              <p className="mt-3 text-sm leading-7 text-[#cfc2ae]">{compactText(body, 176)}</p>
            </section>
          ))}

          <div className="grid gap-3 md:grid-cols-2">
            <section className="border border-[#d7aa55]/18 bg-[#111018] p-4">
              <h5 className="text-base font-bold text-[#fff8ec]">你身上最容易被低估的优势</h5>
              <p className="mt-3 text-sm leading-7 text-[#cfc2ae]">{compactText(strengthText, 154)}</p>
            </section>
            <section className="border border-[#8b2732]/28 bg-[#1a1015] p-4">
              <h5 className="text-base font-bold text-[#fff8ec]">你真正卡住的地方</h5>
              <p className="mt-3 text-sm leading-7 text-[#d8cdb9]">{compactText(stuckText, 154)}</p>
            </section>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <section className="border border-[#d7aa55]/18 bg-[#111018] p-4">
              <h5 className="text-base font-bold text-[#fff8ec]">四维交叉后，真正重要的是这一点</h5>
              <p className="mt-3 text-sm leading-7 text-[#cfc2ae]">
                {compactText(crossText, 170)}
                <span className="mt-3 block font-bold text-[#d7aa55]">
                  但你具体适合走内容型、咨询型、管理型、技术型，还是资源整合型，需要结合完整命盘和人格组合继续判断。
                </span>
              </p>
            </section>
            <section className="border border-[#9b7cff]/24 bg-[#111020] p-4">
              <h5 className="text-base font-bold text-[#fff8ec]">你在关系里的隐藏模式</h5>
              <p className="mt-3 text-sm leading-7 text-[#cfc2ae]">
                {compactText(relationText, 144)}
                <span className="mt-3 block text-[#d9ccff]">
                  你表面理性，但内在对安全感、尊重感和被理解感要求很高。
                </span>
              </p>
            </section>
          </div>
        </div>
      </article>

      <article className="relative overflow-hidden border border-[#d7aa55]/45 bg-[#090b10] p-5 text-[#f5efe2] shadow-2xl shadow-black/35">
        <div className="absolute inset-0 opacity-35 blur-[1px] [background-image:linear-gradient(90deg,rgba(215,170,85,0.22)_1px,transparent_1px),linear-gradient(180deg,rgba(155,124,255,0.13)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d7aa55]">
            LOCKED FULL REPORT
          </p>
          <h4 className="mt-3 text-2xl font-bold">你的完整版报告已生成，但以下关键内容尚未解锁</h4>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {fullReportItems.map((item) => (
              <p key={item} className="border border-[#d7aa55]/18 bg-black/30 px-4 py-3 text-sm font-bold text-[#fff8ec]">
                <span className="mr-2 text-[#d7aa55]">LOCK</span>
                {item}
              </p>
            ))}
          </div>
        </div>
      </article>

      <article className="border border-[#d7aa55]/35 bg-[#121714] p-5 text-[#f5efe2]">
        <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d7aa55]">
              完整深度报告 · 限时体验价 {siteConfig.fullReportPriceLabel}
            </p>
            <h4 className="mt-3 text-2xl font-bold">这不是算命结论，更像一份给自己的深度复盘报告。</h4>
            <p className="mt-3 text-sm leading-7 text-[#d8cdb9]">
              如果你只是想随便测一测，免费摘要已经够了。但如果你正处在人生选择、事业转型、关系困惑或自我重建阶段，完整版更像是一份给自己的复盘报告。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border border-[#f5efe2]/10 bg-[#0f1412] p-4">
              <p className="text-sm font-bold text-[#cfc2ae]">免费版</p>
              <ul className="mt-3 grid gap-2 text-xs leading-5 text-[#aeb8b1]">
                {comparison.free.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
            <div className="border border-[#d7aa55]/35 bg-[#1a1510] p-4">
              <p className="text-sm font-bold text-[#d7aa55]">完整版</p>
              <ul className="mt-3 grid gap-2 text-xs leading-5 text-[#f2ddae]">
                {comparison.paid.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onUnlock}
          className="xj-cta mt-5 h-12 w-full bg-[#d7aa55] px-6 text-sm font-bold text-[#121714] transition hover:bg-[#f0c86c]"
        >
          解锁我的完整人生报告 ¥{siteConfig.fullReportPrice}
        </button>
        <p className="mt-3 text-center text-xs leading-5 text-[#cfc2ae]">
          一次解锁，适合截图保存、反复复盘。
        </p>
      </article>

      <article className="border border-[#d7aa55]/35 bg-[#fffaf2] p-5 text-[#121714]">
        <p className="text-sm font-bold text-[#9a563f]">以下内容已生成，但需要解锁完整版查看：</p>
        <div className="mt-4 grid gap-2">
          {lockedItems.map((item, index) => (
            <div key={item} className="flex items-center gap-3 border border-[#121714]/10 bg-white px-4 py-3">
              <span className="flex h-7 min-w-7 items-center justify-center border border-[#d7aa55]/45 bg-[#fffaf2] text-xs font-bold text-[#9a563f]">
                {index + 1}
              </span>
              <span className="text-sm font-bold blur-[1.2px]">{item}</span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onUnlock}
          className="mt-5 h-11 w-full bg-[#121714] px-5 text-sm font-bold text-[#fff8ec] transition hover:bg-[#9a563f]"
        >
          解锁完整版，继续查看 →
        </button>
      </article>
    </div>
  );
}
