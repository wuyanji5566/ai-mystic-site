export type MysticInput = {
  name: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  birthTimeNote?: string;
  birthPlace: string;
  calendarType: "solar" | "lunar";
  lunarLeapMonth?: boolean;
  mbtiType: string;
  mbtiCertainty: "known" | "estimated" | "unknown";
  focus: string;
};

export type MysticProfile = {
  zodiac: string;
  westernSign: string;
  yearPillar: string;
  birthSummary: string;
};

const heavenlyStems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const earthlyBranches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const zodiacAnimals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
const lunarMonthNames = [
  "",
  "正月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "腊月",
];

export function getWesternSign(month: number, day: number) {
  const edge = month * 100 + day;
  if (edge >= 321 && edge <= 419) return "白羊座";
  if (edge >= 420 && edge <= 520) return "金牛座";
  if (edge >= 521 && edge <= 621) return "双子座";
  if (edge >= 622 && edge <= 722) return "巨蟹座";
  if (edge >= 723 && edge <= 822) return "狮子座";
  if (edge >= 823 && edge <= 922) return "处女座";
  if (edge >= 923 && edge <= 1023) return "天秤座";
  if (edge >= 1024 && edge <= 1122) return "天蝎座";
  if (edge >= 1123 && edge <= 1221) return "射手座";
  if (edge >= 1222 || edge <= 119) return "摩羯座";
  if (edge >= 120 && edge <= 218) return "水瓶座";
  return "双鱼座";
}

export function getYearPillar(year: number) {
  const stemIndex = ((year - 4) % 10 + 10) % 10;
  const branchIndex = ((year - 4) % 12 + 12) % 12;
  return {
    pillar: `${heavenlyStems[stemIndex]}${earthlyBranches[branchIndex]}`,
    zodiac: zodiacAnimals[branchIndex],
  };
}

export function lunarToSolarDate(
  year: number,
  month: number,
  day: number,
  leapMonth = false,
) {
  const formatter = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timeZone: "Asia/Shanghai",
  });
  const expectedMonth = `${leapMonth ? "闰" : ""}${lunarMonthNames[month]}`;
  const start = Date.UTC(year, 0, 1, 4);
  const end = Date.UTC(year + 1, 2, 1, 4);

  for (let timestamp = start; timestamp <= end; timestamp += 86_400_000) {
    const date = new Date(timestamp);
    const parts = formatter.formatToParts(date);
    const relatedYear = Number(
      parts.find((part) => String(part.type) === "relatedYear")?.value,
    );
    const lunarMonth = parts.find((part) => part.type === "month")?.value;
    const lunarDay = Number(parts.find((part) => part.type === "day")?.value);

    if (
      relatedYear === year &&
      lunarMonth === expectedMonth &&
      lunarDay === day
    ) {
      return date.toISOString().slice(0, 10);
    }
  }

  return null;
}

export function buildMysticProfile(input: MysticInput): MysticProfile {
  const [yearText, monthText, dayText] = input.birthDate.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const { pillar, zodiac } = getYearPillar(year);
  const convertedSolarDate =
    input.calendarType === "lunar"
      ? lunarToSolarDate(year, month, day, input.lunarLeapMonth)
      : input.birthDate;
  const [, solarMonthText, solarDayText] = (
    convertedSolarDate || input.birthDate
  ).split("-");
  const westernSign = convertedSolarDate
    ? getWesternSign(Number(solarMonthText), Number(solarDayText))
    : "星座待确认";
  const calendarLabel = input.calendarType === "solar" ? "公历" : "农历";
  const leapLabel =
    input.calendarType === "lunar" && input.lunarLeapMonth ? "（闰月）" : "";
  const conversionLabel =
    input.calendarType === "lunar" && convertedSolarDate
      ? `，对应公历 ${convertedSolarDate}`
      : "";
  const timeLabel = input.birthTimeNote
    ? `${input.birthTime}（${input.birthTimeNote}）`
    : input.birthTime;
  const mbtiLabel =
    input.mbtiType === "不确定"
      ? "MBTI 暂不确定，由系统结合描述作倾向分析"
      : `MBTI 倾向为 ${input.mbtiType}`;

  return {
    zodiac,
    westernSign,
    yearPillar: pillar,
    birthSummary: `${input.name || "匿名用户"}，${input.gender}，${calendarLabel} ${input.birthDate}${leapLabel}${conversionLabel} ${timeLabel} 出生于 ${input.birthPlace}；${mbtiLabel}。当前版本对八字采用出生信息节律分析，对紫微采用人生结构倾向分析，不冒充专业精确排盘。`,
  };
}

export function buildDemoReport(input: MysticInput, profile: MysticProfile) {
  const focus = input.focus || "当前人生方向";
  const mbti = input.mbtiType === "不确定" ? "待观察的人格倾向" : input.mbtiType;

  return [
    "1. 四维综合人格总论",
    `结论：你不是缺能力，而是容易在高标准、深思考和现实反馈偏慢之间消耗自己。${mbti} 的决策偏好与 ${profile.westernSign} 的情绪需求交叉后，使你外表可以独立处理问题，内在却很在意回应质量、尊重感和确定性。结合出生节律与人生结构倾向来看，你真正适合的不是长期被动执行，而是在一个能积累判断权、作品和资源的位置持续发力。围绕“${focus}”，现在最重要的不是增加更多选择，而是建立一个能连续验证 30 天的现实闭环。`,
    "",
    "2. 八字节律深度分析",
    "结论：基于出生信息的节律型分析，你更适合先建立稳定结构，再集中发力。为什么：你的优势更容易在持续积累后显现，而不是依靠短期情绪和临时冲刺。现实场景：频繁换方向、同时启动多个计划，会让你觉得一直很忙，却没有形成可复用成果。风险：急于见效时容易否定已经形成的积累。行动：固定一个主目标，用每周可见成果衡量进度。此处不是完整四柱精确排盘，不作吉凶断言。",
    "",
    "3. 紫微人生结构分析",
    "结论：你更适合站在需要判断、整合信息和逐步建立影响力的位置。为什么：结构倾向显示，单纯重复执行难以长期承接你的能力。现实场景：当你只负责完成别人拆好的任务时，容易越来越怀疑自己的价值。风险：还没建立可信成果就急着追求更高位置。行动：先通过案例、作品或稳定交付获得判断权。此处是结构化倾向分析，不编造具体星曜落宫。",
    "",
    "4. 星座情绪与关系表达分析",
    `结论：${profile.westernSign} 的情绪视角提示，你表面理性，但内在对安全感、尊重感和被理解感要求很高。为什么：你不一定会立刻表达失望，更可能先观察、忍耐，再逐渐降低投入。现实场景：工作合作和亲密关系中，模糊回应会比明确拒绝更消耗你。风险：期待别人自行理解你的边界。行动：更早说清楚需求、时间和底线。`,
    "",
    "5. MBTI 行为模式分析",
    `结论：以 ${mbti} 作为偏好参考，你更习惯先理解问题、形成判断，再投入行动。为什么：你需要逻辑完整和方向可信，才愿意长期投入。现实场景：面对信息不完整的项目，你可能继续搜集资料，却迟迟没有形成外部作品。风险：把“准备充分”当作启动条件。行动：把任务拆成七天可验证的小版本，用反馈替代空想。`,
    "",
    "6. 事业定位与适合赛道",
    "结论：你更适合内容研究、咨询策划、技术方案或资源整合中的一到两个方向，而不是高重复、低自主权的岗位。为什么：这些方向能同时使用你的深度判断与结构能力。现实场景：你需要有问题可研究、有成果可沉淀、有空间改进方法。风险：方向太多导致没有一项形成商业证明。行动：先选一个最接近现有能力的切口，完成三个真实案例。",
    "",
    "7. 财富节奏与赚钱方式",
    "结论：你更适合靠专业能力、可信案例和可复用服务赚钱。为什么：稳定收入来自重复交付，而不是不断追逐新机会。现实场景：可以从诊断、方案、内容、工具或流程优化切入。风险：每个机会都想试，最后没有一个形成复利。行动：定义一个明确人群、一个具体问题和一个可交付结果。",
    "",
    "8. 亲密关系与边界模式",
    "结论：你需要的不是高频黏连，而是稳定回应、真实尊重和可以讨论问题的关系。为什么：你表面能独立处理，但长期缺少确认会让你悄悄撤退。现实场景：你可能在冲突前忍耐很久，爆发时对方却不理解原因。风险：用沉默测试对方。行动：在不满累积前，用事实、感受和请求三句话表达。",
    "",
    "9. 未来一年阶段提醒",
    "第 1-3 个月：收窄方向，停止同时增加新项目；完成一个可展示成果。第 4-6 个月：形成稳定交付流程，每月至少沉淀两个案例。第 7-9 个月：测试报价、合作边界和获客渠道。第 10-12 个月：复盘高价值动作，保留有效路径并减少低回报消耗。",
    "",
    "10. 未来 30 天行动计划",
    "第 1 周：选定一个主问题；不要继续搜集无关方向；复盘问题是“我本周留下了什么可见成果？”第 2 周：做出一个最小作品；不要追求一次完美；复盘问题是“真实反馈推翻了我的哪个假设？”第 3 周：找三位真实对象验证；不要只问熟人是否喜欢；复盘问题是“谁愿意为哪个结果付费？”第 4 周：整理流程和报价；不要无条件增加服务；复盘问题是“哪些动作值得下月重复？”",
    "",
    "11. 三个继续追问建议",
    "我最适合把哪项能力发展成副业？\n我当前的事业卡点到底是能力、环境还是执行节奏？\n未来 30 天，我最应该停止做哪三件事？",
    "",
    "12. 截图分享版总结",
    "你真正需要的不是更多答案，而是一套能稳定承接能力的现实系统。先收窄方向，再用作品获得反馈；先形成重复交付，再谈放大收入。你的优势需要时间积累，但不需要等到完全准备好才开始。接下来的 30 天，用一个可见成果重新建立对自己的信任。",
  ].join("\n");
}

export function buildLegacyFreeReport(
  input: MysticInput,
  profile: MysticProfile,
) {
  const mbti =
    input.mbtiType === "不确定" ? "仍在观察中的行为倾向" : input.mbtiType;

  return [
    "1. 你的底层人格模式",
    `你不是简单的 ${mbti}，也不是某一个命理标签可以概括的人。四维交叉后，你更像一个需要先看懂结构、确认意义，再愿意长期投入的人。你的优势是能把复杂问题想深、看远；真正容易卡住你的，不是能力不足，而是内在标准走得太快，现实反馈却跟不上。围绕“${input.focus}”，你现在更需要一个能持续验证的小闭环，而不是继续增加新方向。`,
    "",
    "2. 八字看到的底层节律",
    `以 ${profile.yearPillar} 作为出生年份的节律参考，你更适合先建立稳定框架，再集中发力。你可能不太适合长期依靠情绪冲刺，真正能形成成果的方式，是把能力、作品和客户反馈持续沉淀。压力大时，你容易因为急于看到结果而频繁换方向；这会打断原本已经形成的积累。此处是基于出生信息的节律型分析，不是完整四柱精确排盘。`,
    "",
    "3. 紫微看到的人生结构",
    "从结构化倾向看，你更适合站在能参与判断、整合信息、优化方法的位置，而不是长期只完成别人拆好的重复任务。当环境只要求服从、不允许你改进系统时，你会逐渐失去价值感。你当前阶段的课题，是先用真实作品和稳定交付获得判断权，而不是在尚未形成成果前急着证明自己。此处不编造具体星曜与宫位。",
    "",
    "4. 星座看到的情绪能量",
    `${profile.westernSign} 的视角提醒：你表面可以很理性，内在却很重视回应质量、尊重感和被理解感。你未必会第一时间表达失望，更可能先观察和忍耐，直到投入明显下降。无论在合作还是亲密关系中，你真正需要练习的不是更懂事，而是更早说清楚期待、时间和边界，减少让别人猜测你的成本。`,
    "",
    "5. MBTI 看到的行为模式",
    `以 ${mbti} 作为行为偏好参考，你更习惯先理解问题、形成判断，再投入行动。这让你在复杂任务中更有深度，却也容易把“准备充分”当成启动条件。你适合有自主空间、能沉淀方法和成果的环境；不适合高频打断、目标反复变化、只看表面忙碌的工作方式。把任务拆成七天可验证的小版本，会比逼自己突然自律更有效。`,
    "",
    "6. 四维交叉后的真正结论",
    `八字节律回答“你适合怎样发力”，紫微结构回答“你适合站在什么位置”，星座揭示“你真正需要怎样的情绪回应”，MBTI 解释“你习惯如何做决定”。它们共同指向：你在“${input.focus}”上的反复卡点，不只是执行力问题，而是节奏、位置、情绪反馈与行动方式没有对齐。你需要的不是更用力，而是让四个部分朝同一个现实目标工作。`,
    "",
    "7. 你身上最容易被低估的优势",
    "你能处理复杂信息，也愿意为长期质量负责。别人容易只看到你启动较慢，却忽略了你一旦建立结构，通常比单纯依靠热情的人更稳定。真正值得发展的，是把判断力转化成别人看得见的作品、方案、服务或结果，而不是只留在脑内完成。",
    "",
    "8. 已生成但尚未解锁的完整版内容",
    "你已经看到了自己的核心画像，但最关键的事业、财富、关系和行动计划仍在完整版中。已锁定内容包括：事业定位与适合赛道、财富增长方式与副业方向、亲密关系风险点、未来一年关键阶段提醒、未来 30 天最该做的三件事，以及针对你的继续追问入口。",
  ].join("\n");
}

export function buildFreeReport(
  input: MysticInput,
  profile: MysticProfile,
) {
  const name = input.name || "你";
  const mbtiKnown = input.mbtiType !== "不确定";
  const mbti = mbtiKnown ? input.mbtiType : "待观察的人格倾向";
  const introversion = mbtiKnown && input.mbtiType.startsWith("I");
  const intuitive = mbtiKnown && input.mbtiType.includes("N");
  const judging = mbtiKnown && input.mbtiType.endsWith("J");
  const hour = Number(input.birthTime.split(":")[0] || 12);
  const rhythm =
    hour < 7
      ? "更容易在安静、低干扰的时段形成深度判断"
      : hour < 13
        ? "行动状态往往需要清晰目标来启动"
        : hour < 19
          ? "更擅长在现实反馈中不断校准方向"
          : "内在思考通常比外部表达更早、更深";
  const decisionStyle = !mbtiKnown
    ? "当前资料不足以固定 MBTI 标签，因此更适合观察你在压力、冲突和选择中的真实行为"
    : `${input.mbtiType} 的偏好显示，你${introversion ? "通常先在内部形成判断，再选择表达对象" : "更容易在交流和外部反馈中整理判断"}，${intuitive ? "会优先寻找趋势、可能性与整体意义" : "会优先确认事实、步骤与可落地细节"}，${judging ? "对确定的计划和完成感要求较高" : "倾向保留调整空间，但也可能延后最终决定"}`;
  const focus = input.focus.trim();
  const focusScene = /感情|婚姻|关系/.test(focus)
    ? "关系中的回应质量、边界和安全感"
    : /财富|赚钱|收入/.test(focus)
      ? "能力如何形成稳定收入，而不是只增加忙碌"
      : /事业|工作|转型|副业/.test(focus)
        ? "方向选择、现实验证和长期积累"
        : "当前最消耗你的现实问题";
  const focusAction = /感情|婚姻|关系/.test(focus)
    ? "写下一个具体事实、你的感受和一个清晰请求，并在情绪平稳时表达"
    : /财富|赚钱|收入/.test(focus)
      ? "列出一项别人愿意付费的具体结果，并找三位真实对象验证"
      : /事业|工作|转型|副业/.test(focus)
        ? "只保留一个方向，用七天做出一个能被别人看见的最小成果"
        : "把问题改写成一个七天内可以验证、有完成标准的小任务";

  return [
    "1. 你的底层人格模式",
    `${name}，这份画像最先呈现出的不是单一的 ${mbti} 或 ${profile.westernSign} 标签，而是一组同时存在的力量：你希望事情有逻辑、有质量，也需要现实给出可信反馈。${rhythm}。当外部节奏过快、目标反复变化，或者别人只要求你执行却不给判断空间时，你的消耗会明显上升。围绕“${focus}”，当前真正需要处理的是${focusScene}，而不是继续收集更多互相冲突的答案。`,
    "",
    "2. 八字看到的底层节律",
    `以 ${profile.yearPillar} 作为出生年份节律参考，再结合${input.birthTimeNote ? "出生时间尚不完全确定" : `${input.birthTime} 的时间信息`}，你的优势更容易通过“建立节奏—持续积累—阶段复盘”显现，而不是依赖临时冲刺。压力上来时，你可能会同时启动多个补救动作，表面很努力，实际让主线被打断。未来七天可以做的不是加任务，而是固定一个每天都能完成的最小动作，并记录完成次数。本段属于出生信息的节律型分析，不冒充完整四柱精确排盘。`,
    "",
    "3. 紫微看到的人生结构",
    `从结构化倾向看，你更需要一个能逐步获得判断权、形成作品或沉淀资源的位置。如果长期处在低自主权、只接收零散指令的环境里，你会先怀疑环境，随后也可能怀疑自己。出生地“${input.birthPlace}”不会直接决定职业，但它提醒我们：成长资源、家庭期待和现实机会始终构成你的选择背景。当前阶段最重要的结构调整，是把“我能做什么”变成一项别人可以看见、评价和复用的成果。本段不编造具体星曜与宫位。`,
    "",
    "4. 星座看到的情绪能量",
    `${profile.westernSign} 的情绪视角显示，你对${focusScene}的判断，不只依赖道理，也依赖互动是否让你感到被尊重和被认真回应。你可能不会立刻说出失望，而是先观察细节、降低期待，直到某个时刻突然不想再解释。这样的保护方式能避免即时冲突，却也可能让对方错过理解你的机会。七天内可以观察一次：当你想沉默时，先说清楚“发生了什么、我在意什么、我希望怎样”，不要让别人猜。`,
    "",
    "5. MBTI 看到的行为模式",
    `${decisionStyle}。这套模式的价值在于能提高判断质量，风险则是把“再想清楚一点”当作行动前提。尤其面对“${focus}”时，你要区分两类问题：需要继续思考的问题，以及必须通过现实反馈才能回答的问题。下一次犹豫时，给自己设一个 30 分钟判断期限；期限结束后，只决定最小下一步，不要求一次决定整条人生路径。`,
    "",
    "6. 四维交叉后的真正结论",
    `四个维度在你身上形成了一组很具体的拉扯：出生节律要求稳定积累，人生结构需要逐步获得判断权，${profile.westernSign} 在意回应质量，而 ${mbti} 又影响你处理信息和做决定的方式。因此，你卡住时未必是执行力差，更可能是目标、位置、反馈和行动方法没有对齐。对“${focus}”最有效的突破，不是再证明自己能想得多深，而是让一个真实结果尽快出现。建议现在就做：${focusAction}。`,
    "",
    "7. 你身上最容易被低估的优势",
    `你容易被低估的不是聪明程度，而是把复杂问题整理成结构的能力。只要环境允许你持续观察、改进方法并留下成果，你通常会越做越稳。问题在于，这种优势如果只停留在脑内，别人很难识别它的价值。接下来请把一次判断写成方案、把一次经验整理成模板，或把一次沟通沉淀成可复用规则；这会比继续解释“我其实能做好”更有说服力。`,
    "",
    "8. 已生成但尚未解锁的完整版内容",
    `你已经看到核心画像，但完整报告还会进一步回答：哪类事业环境最能承接你的能力、收入更适合通过什么方式形成、关系里最需要提前说清楚的边界、未来一年的四个阶段重点，以及围绕“${focus}”设计的 30 天行动计划。完整版的价值不是增加玄学结论，而是把上述判断拆成现实选择、风险提示和可执行步骤。`,
  ].join("\n");
}
