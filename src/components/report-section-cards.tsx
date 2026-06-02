import { parseReportSections } from "@/lib/report-sections";

type ReportSectionCardsProps = {
  report: string;
  limit?: number;
  locked?: boolean;
  variant?: "light" | "warm";
};

export function ReportSectionCards({
  report,
  limit,
  locked = false,
  variant = "light",
}: ReportSectionCardsProps) {
  const sections = parseReportSections(report, limit);
  const cardClass =
    variant === "warm"
      ? "border-[#dfd2c1] bg-white text-[#1d1a16]"
      : "border-[#121714]/12 bg-white text-[#121714]";

  return (
    <div className="grid gap-4">
      {sections.map((section, index) => (
        <article key={`${section.title}-${index}`} className={`border p-5 ${cardClass}`}>
          <div className="flex items-start gap-3">
            <span className="mt-1 flex h-7 min-w-7 items-center justify-center border border-[#d7aa55]/45 bg-[#fffaf2] text-xs font-bold text-[#9a563f]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h4 className="text-lg font-bold leading-7">{section.title}</h4>
              {section.body ? (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#52615b]">
                  {section.body}
                </p>
              ) : null}
            </div>
          </div>
        </article>
      ))}

      {locked ? (
        <article className="border border-[#d7aa55]/35 bg-[#fffaf2] p-5 text-[#121714]">
          <p className="text-sm font-bold text-[#9a563f]">完整版内容已隐藏</p>
          <h4 className="mt-2 text-xl font-bold">解锁后继续查看完整深度报告</h4>
          <p className="mt-3 text-sm leading-7 text-[#62584b]">
            完整版包含事业定位、关系模式、财富节奏、未来一年行动清单，以及后续可追问的深度解析入口。
          </p>
        </article>
      ) : null}
    </div>
  );
}
