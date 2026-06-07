import type { MysticInput, MysticProfile } from "@/lib/mystic";

export type ReportMetric = {
  label: string;
  value: number;
  note: string;
};

export type ReportPersonalization = {
  fingerprint: string;
  archetype: string;
  headline: string;
  keywords: string[];
  metrics: ReportMetric[];
  dimensions: Array<{
    label: string;
    value: number;
    note: string;
  }>;
  priority: string;
};

function hashText(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function score(seed: number, offset: number) {
  return 52 + ((seed >>> offset) % 39);
}

function includesAny(value: string, words: string[]) {
  return words.some((word) => value.includes(word));
}

export function buildReportPersonalization(
  input: MysticInput,
  profile: MysticProfile,
): ReportPersonalization {
  const source = [
    input.name,
    input.birthDate,
    input.birthTime,
    input.birthPlace,
    input.mbtiType,
    input.focus,
    profile.westernSign,
    profile.yearPillar,
  ].join("|");
  const seed = hashText(source);
  const metrics: ReportMetric[] = [
    { label: "深度判断", value: score(seed, 1), note: "处理复杂信息与长期判断" },
    { label: "行动启动", value: score(seed, 4), note: "把想法转为现实动作" },
    { label: "情绪感知", value: score(seed, 7), note: "识别关系氛围与内在需要" },
    { label: "结构能力", value: score(seed, 10), note: "建立秩序、方法与复用系统" },
    { label: "关系边界", value: score(seed, 13), note: "表达需求并维护合作边界" },
  ];
  const strongest = [...metrics].sort((a, b) => b.value - a.value)[0];
  const developing = [...metrics].sort((a, b) => a.value - b.value)[0];
  const focus = input.focus;
  const priority = includesAny(focus, ["事业", "工作", "转型", "副业"])
    ? "把方向缩小为一个可验证的现实项目"
    : includesAny(focus, ["财富", "赚钱", "收入"])
      ? "先建立可重复交付，再扩大收入目标"
      : includesAny(focus, ["感情", "婚姻", "关系"])
        ? "把猜测改成清晰表达，把消耗改成边界协商"
        : "选择一个最影响现实结果的问题，连续验证 30 天";
  const archetypes = [
    "深思型系统建构者",
    "敏锐型现实校准者",
    "稳定型长期积累者",
    "洞察型资源整合者",
  ];
  const archetype = archetypes[seed % archetypes.length];
  const dimensionsRaw = [
    { label: "八字节律", value: 22 + (seed % 8), note: "行动起伏与积累方式" },
    { label: "紫微结构", value: 22 + ((seed >>> 3) % 8), note: "位置、资源与阶段课题" },
    { label: "星座能量", value: 22 + ((seed >>> 6) % 8), note: "情绪需求与压力反应" },
    { label: "MBTI 行为", value: 22 + ((seed >>> 9) % 8), note: "决策、沟通与执行偏好" },
  ];
  const total = dimensionsRaw.reduce((sum, item) => sum + item.value, 0);
  const dimensions = dimensionsRaw.map((item, index) => ({
    ...item,
    value:
      index === dimensionsRaw.length - 1
        ? 100 -
          dimensionsRaw
            .slice(0, -1)
            .reduce((sum, current) => sum + Math.round((current.value / total) * 100), 0)
        : Math.round((item.value / total) * 100),
  }));

  return {
    fingerprint: `XJ-${seed.toString(16).toUpperCase().padStart(8, "0").slice(0, 8)}`,
    archetype,
    headline: `你的强项是${strongest.label}，当前最值得补齐的是${developing.label}。`,
    keywords: [
      profile.westernSign,
      input.mbtiType === "不确定" ? "人格待观察" : input.mbtiType,
      profile.yearPillar,
      strongest.label,
    ],
    metrics,
    dimensions,
    priority,
  };
}
