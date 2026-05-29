export type MysticInput = {
  name: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  calendarType: "solar" | "lunar";
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
  const stem = heavenlyStems[(year - 4) % 10];
  const branchIndex = (year - 4) % 12;
  return {
    pillar: `${stem}${earthlyBranches[branchIndex]}`,
    zodiac: zodiacAnimals[branchIndex],
  };
}

export function buildMysticProfile(input: MysticInput): MysticProfile {
  const date = new Date(`${input.birthDate}T${input.birthTime}:00`);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const { pillar, zodiac } = getYearPillar(year);
  const westernSign = getWesternSign(month, day);

  const calendarLabel = input.calendarType === "solar" ? "公历" : "农历";
  const birthSummary = `${input.name}，${input.gender}，${calendarLabel} ${input.birthDate} ${input.birthTime} 出生于 ${input.birthPlace}。当前 MVP 使用公历生日识别星座，并用年份生成基础生肖与年柱信息。`;

  return {
    zodiac,
    westernSign,
    yearPillar: pillar,
    birthSummary,
  };
}

export function buildDemoReport(input: MysticInput, profile: MysticProfile) {
  return [
    "【报告说明】",
    "这是一份 MVP 演示版报告，用于展示网站的完整产品体验。内容仅供娱乐和自我探索，不构成现实决策建议。",
    "",
    "1. 基础命盘概览",
    `${input.name} 的基础资料显示：星座为 ${profile.westernSign}，生肖为 ${profile.zodiac}，八字年柱为 ${profile.yearPillar}。这些信息可以作为入门观察维度，用来组织一份更有结构的自我探索报告。`,
    "",
    "2. 核心性格关键词",
    "你的关键词可以概括为：稳定感、判断力、慢热积累、重视实际反馈。你适合把复杂目标拆成一个个可完成的小步骤，而不是一次性追求完美答案。",
    "",
    "3. 生辰八字入门解读",
    `${profile.yearPillar} 年柱偏向“先建立根基，再逐步发力”的节奏。对你来说，真正有价值的不是短期灵感，而是长期可复用的能力、作品和资源。`,
    "",
    "4. 紫微斗数简版观察",
    "当前版本还没有接入专业紫微排盘，所以这里只做简版 AI 观察：你的优势更适合体现在持续经营、深度学习和稳定输出上。后续如果接入完整排盘，可以继续细分命宫、事业宫、财帛宫和夫妻宫。",
    "",
    "5. 星座能量分析",
    `${profile.westernSign} 的能量更重视安全感、节奏感和可确认的结果。你不一定适合频繁换方向，但很适合在一个方向上慢慢做深，形成个人标签。`,
    "",
    "6. 事业方向建议",
    `围绕你关注的“${input.focus}”，建议优先选择能沉淀案例的方向。比如：固定每周完成一个可展示作品、一个客户案例、一个内容选题或一个自动化流程。`,
    "",
    "7. 感情与人际关系",
    "你在人际关系中需要清晰表达需求。不要只期待别人理解你的暗示，重要关系里更适合提前说清楚边界、节奏和真实想法。",
    "",
    "8. 财富与消费模式",
    "第一阶段不要追求复杂投资或高风险机会。更适合把钱花在能提高生产力的地方，例如学习、工具、作品包装、获客渠道和可复用资产。",
    "",
    "9. 未来一年行动清单",
    "第 1-3 个月：确定一个主方向，减少频繁切换。",
    "第 4-6 个月：每月至少沉淀 2 个可展示案例。",
    "第 7-9 个月：开始整理服务报价、作品集和客户沟通话术。",
    "第 10-12 个月：测试付费产品、咨询服务或自动化工具交付。",
    "",
    "10. 适合你的提醒",
    "你不需要等到所有条件完美才开始。你的好运更像是被行动激活的：先做出一个小成果，再用反馈修正方向。",
    "",
    "11. 一句话总结",
    "先稳定输出，再放大优势；先做出案例，再谈变现。",
  ].join("\n");
}
