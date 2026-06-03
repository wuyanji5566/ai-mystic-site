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
  const isWarm = variant === "warm";

  return (
    <div className="grid gap-4">
      {isWarm && !locked ? (
        <div className="border border-[#d7aa55]/45 bg-[#121714] p-5 text-[#f5efe2]">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#d7aa55]">
            Premium Consulting Report
          </p>
          <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[#fff8ec]">
            完整版不是更长，而是更具体、更能落地
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {["优势", "风险", "场景", "行动"].map((item) => (
              <span
                key={item}
                className="border border-[#d7aa55]/24 bg-[#d7aa55]/10 px-3 py-2 text-center text-xs font-bold text-[#f2ddae]"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm leading-7 text-[#cfc2ae]">
            以下内容会围绕你的事业、财富、关系和未来 30 天行动展开。建议截图保存，后续可以回到报告详情页继续追问。
          </p>
        </div>
      ) : null}

      {sections.map((section, index) => (
        <article
          key={`${section.title}-${index}`}
          className={
            isWarm
              ? "relative overflow-hidden border border-[#d7aa55]/32 bg-[#fffaf2] p-5 text-[#1d1a16] shadow-xl shadow-[#d7aa55]/10"
              : "border border-[#121714]/12 bg-white p-5 text-[#121714]"
          }
        >
          {isWarm ? (
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#9a563f] via-[#d7aa55] to-[#f5df9b]" />
          ) : null}
          <div className="flex items-start gap-3">
            <span
              className={
                isWarm
                  ? "mt-1 flex h-9 min-w-9 items-center justify-center border border-[#d7aa55]/55 bg-[#121714] text-xs font-black text-[#d7aa55]"
                  : "mt-1 flex h-7 min-w-7 items-center justify-center border border-[#d7aa55]/45 bg-[#fffaf2] text-xs font-bold text-[#9a563f]"
              }
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <h4 className={isWarm ? "text-xl font-black leading-8" : "text-lg font-bold leading-7"}>
                  {section.title}
                </h4>
                {isWarm ? (
                  <span className="w-fit border border-[#d7aa55]/25 bg-white px-2 py-1 text-[11px] font-bold text-[#9a563f]">
                    深度模块
                  </span>
                ) : null}
              </div>
              {section.body ? (
                <p className={isWarm ? "mt-3 whitespace-pre-wrap text-[15px] leading-8 text-[#4f463b]" : "mt-3 whitespace-pre-wrap text-sm leading-7 text-[#52615b]"}>
                  {section.body}
                </p>
              ) : null}
              {isWarm && index >= 5 ? (
                <div className="mt-4 border border-[#d7aa55]/22 bg-white px-4 py-3 text-xs font-bold leading-5 text-[#9a563f]">
                  复盘提示：这一段建议截图保存，并结合你接下来 7 天的真实行动验证。
                </div>
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
