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
  "你的事业真正适合走哪条路",
  "你的财富增长方式和容易踩的坑",
  "你在亲密关系中的真实需求",
  "你未来一年最关键的阶段提醒",
  "你接下来 30 天的行动计划",
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
  free: ["核心人格摘要", "事业大方向", "关系提醒", "一个初步行动建议"],
  paid: [
    "四维交叉人格画像",
    "事业定位与适合环境",
    "财富模式与副业方向",
    "亲密关系深层模式",
    "未来一年阶段节奏",
    "未来 30 天行动计划",
    "可截图保存版总结",
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
  const careerSection = findSection(report, ["事业", "副业", "定位"]);
  const relationSection = findSection(report, ["关系", "感情", "亲密"]);
  const actionSection = findSection(report, ["行动", "30 天", "提醒"]);

  const strengthText =
    profileSection?.body ||
    `${input.name} 不是外放型冲锋的人，更适合在复杂信息、长期判断和系统规划中慢慢建立优势。`;
  const stuckText =
    actionSection?.body ||
    "你最大的问题不是不努力，而是容易想得很深，却迟迟没有形成稳定的外部作品、收入结构或关系反馈。";
  const careerText =
    careerSection?.body ||
    "你适合的事业能量更偏向长期积累、系统判断和可复用能力建设。";
  const relationText =
    relationSection?.body ||
    "你表面理性，但内在对安全感、尊重感和被理解感要求很高。";

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
              你最核心的底层模式
            </p>
            <p className="mt-3 text-lg font-bold leading-8 text-[#fff8ec]">
              你不是没有能力，而是经常在
              <span className="text-[#d7aa55]">“想得深、判断细”</span>
              和
              <span className="text-[#d7aa55]">“落地慢、反馈少”</span>
              之间反复拉扯。
            </p>
          </section>

          <div className="grid gap-3 md:grid-cols-2">
            <section className="border border-[#f5efe2]/10 bg-[#10151b] p-4">
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
              <h5 className="text-base font-bold text-[#fff8ec]">你适合的事业能量</h5>
              <p className="mt-3 text-sm leading-7 text-[#cfc2ae]">
                {compactText(careerText, 132)}
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
            Locked Full Report
          </p>
          <h4 className="mt-3 text-2xl font-bold">完整版会继续告诉你什么</h4>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {fullReportItems.map((item) => (
              <p key={item} className="border border-[#d7aa55]/18 bg-black/30 px-4 py-3 text-sm font-bold text-[#fff8ec]">
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
