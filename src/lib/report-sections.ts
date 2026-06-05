export type ReportSection = {
  title: string;
  body: string;
};

const expectedSectionTitles: Record<number, RegExp> = {
  1: /底层人格|四维综合|人格总论/,
  2: /八字/,
  3: /紫微/,
  4: /星座/,
  5: /MBTI/i,
  6: /四维交叉|事业定位|优势与卡点/,
  7: /优势|卡点|财富/,
  8: /锁定|尚未解锁|亲密关系|边界/,
  9: /未来一年|阶段提醒/,
  10: /未来\s*30\s*天|行动计划/,
  11: /继续追问/,
  12: /截图|保存版|总结/,
};

function cleanMarkdown(value: string) {
  return value
    .replace(/^#{1,6}\s*/, "")
    .replace(/\*\*/g, "")
    .replace(/^[-*]\s+/, "• ");
}

function getSectionTitle(line: string) {
  const cleaned = cleanMarkdown(line).trim();
  const numbered = cleaned.match(/^(\d{1,2})[.、]\s*(.+)$/);

  if (!numbered) return null;

  const number = Number(numbered[1]);
  const title = numbered[2].trim();
  const expected = expectedSectionTitles[number];

  return expected?.test(title) ? `${number}. ${title}` : null;
}

export function parseReportSections(report: string, limit?: number): ReportSection[] {
  const lines = report
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const sections: ReportSection[] = [];
  let current: ReportSection | null = null;

  for (const rawLine of lines) {
    const title = getSectionTitle(rawLine);

    if (title) {
      if (current) sections.push(current);
      current = { title, body: "" };
      continue;
    }

    const line = cleanMarkdown(rawLine);
    if (!current) {
      current = { title: "核心摘要", body: line };
    } else {
      current.body = current.body ? `${current.body}\n${line}` : line;
    }
  }

  if (current) sections.push(current);
  return typeof limit === "number" ? sections.slice(0, limit) : sections;
}
