export type MysticInput = {
  name: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  birthTimeNote?: string;
  birthPlace: string;
  calendarType: "solar" | "lunar";
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
  const mbtiLabel = input.mbtiType === "不确定" ? "MBTI 暂不确定" : `MBTI 倾向为 ${input.mbtiType}`;
  const timeNote = input.birthTimeNote ? `（${input.birthTimeNote}）` : "";
  const birthSummary = `${input.name}，${input.gender}，${calendarLabel} ${input.birthDate} ${input.birthTime}${timeNote} 出生于 ${input.birthPlace}。当前 MVP 使用公历生日识别星座，并用年份生成基础生肖与年柱信息；${mbtiLabel}。`;

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
    "这是一份 MVP 演示版报告，用于展示网站的完整产品体验。内容仅供自我探索、认知复盘与成长参考，不构成现实决策建议。",
    "",
    "1. 四维合参总诊断",
    `${input.name}，我会先把四个维度放到一起看，而不是分别给你贴标签。${input.mbtiType} 更像是在解释你如何判断和行动，${profile.westernSign} 更接近你在关系和压力中的真实需要；${profile.yearPillar} 提供的是节律型观察，紫微部分则只做人生位置与资源结构的倾向分析。它们交叉后显示：你真正的优势不是单点爆发，而是能把复杂问题看深并形成长期判断；真正的卡点，是内在标准很高，但现实反馈常常跟不上你的思考速度。围绕“${input.focus}”，你当前最需要的不是再增加更多方向，而是建立一个能持续给你反馈的现实闭环。`,
    "",
    "2. 八字看到的是你的底层节律",
    `基于出生信息的节律型观察，你更适合先建立根基、再集中发力。对你来说，真正有价值的不是短期灵感，而是长期可复用的能力、作品和资源；频繁换方向会打断积累，也会放大焦虑。这里不是完整四柱排盘，因此不作具体吉凶断言。`,
    "",
    "3. 紫微看到的是你的人生结构",
    "当前版本按结构化倾向分析，不编造具体星曜落宫。你更适合站在能参与判断、整合信息和逐步建立个人影响力的位置；如果长期只承担重复执行，你会越来越怀疑自己的价值。当前阶段的课题，是把能力放进一个可被看见、可持续积累的位置。",
    "",
    "4. 星座看到的是你的情绪能量",
    `${profile.westernSign} 这一视角更强调安全感、回应质量和情绪节奏。你表面可以很理性，但当关系回应或现实反馈长期不足时，内在会明显消耗。减少误会的关键不是继续猜，而是更早说明需求与边界。`,
    "",
    "5. MBTI看到的是你的行为模式",
    `以 ${input.mbtiType} 作为偏好参考，你更习惯先理解问题、形成判断，再投入行动。优势是思考有深度，风险是容易等到“足够确定”才启动。你需要的不是逼自己冲动，而是把任务拆成更短的验证周期。`,
    "",
    "6. 四维交叉后的现实结论",
    `MBTI 的理性判断与 ${profile.westernSign} 的情绪需求形成了一个拉扯：你外在可能表现得很能独立处理，但内在仍需要高质量回应和确定感。八字节律与紫微结构则共同提醒，你适合长期积累并逐步取得判断权，不适合一边焦虑结果、一边频繁更换位置。四维放在一起后，围绕“${input.focus}”，当前最值得优先解决的是：选定一个可以连续推进 30 天的现实主题，用作品、收入或关系反馈校准自己。`,
    "",
    "7. 事业定位与适合赛道",
    `围绕你关注的“${input.focus}”，建议优先选择能沉淀案例的方向。比如：固定每周完成一个可展示作品、一个客户案例、一个内容选题或一个自动化流程。`,
    "",
    "8. 财富节奏与赚钱方式",
    "第一阶段不要追求复杂投资或高风险机会。更适合把钱花在能提高生产力的地方，例如学习、工具、作品包装、获客渠道和可复用资产。",
    "",
    "9. 亲密关系与边界模式",
    "你在人际关系中需要清晰表达需求。不要只期待别人理解你的暗示，重要关系里更适合提前说清楚边界、节奏和真实想法。",
    "",
    "10. 未来一年阶段提醒",
    "第 1-3 个月：确定一个主方向，减少频繁切换。",
    "第 4-6 个月：每月至少沉淀 2 个可展示案例。",
    "第 7-9 个月：开始整理服务报价、作品集和客户沟通话术。",
    "第 10-12 个月：测试付费产品、咨询服务或自动化工具交付。",
    "",
    "11. 未来 30 天行动计划",
    "第 1 周：选定一个主问题，停止增加新方向。",
    "第 2 周：做出一个可以展示或验证的小成果。",
    "第 3 周：找 3 个真实对象获得反馈。",
    "第 4 周：根据反馈保留有效动作，删除无效消耗。",
    "",
    "12. 三个继续追问建议",
    "我更适合把哪项能力发展成副业？",
    "我在关系里最容易忽略的真实需求是什么？",
    "未来 30 天我应该停止做哪三件事？",
    "",
    "13. 截图分享版总结",
    "先稳定输出，再放大优势；先做出案例，再谈变现。",
  ].join("\n");
}
