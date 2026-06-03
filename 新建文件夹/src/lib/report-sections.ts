export type ReportSection = {
  title: string;
  body: string;
};

const sectionTitlePattern = /^(?:\d{1,2}\.\s*.+|【.+】)$/;

export function parseReportSections(report: string, limit?: number): ReportSection[] {
  const lines = report
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sections: ReportSection[] = [];
  let current: ReportSection | null = null;

  for (const line of lines) {
    if (sectionTitlePattern.test(line)) {
      if (current) sections.push(current);
      current = { title: line, body: "" };
      continue;
    }

    if (!current) {
      current = { title: "摘要", body: line };
      continue;
    }

    current.body = current.body ? `${current.body}\n${line}` : line;
  }

  if (current) sections.push(current);

  return typeof limit === "number" ? sections.slice(0, limit) : sections;
}
