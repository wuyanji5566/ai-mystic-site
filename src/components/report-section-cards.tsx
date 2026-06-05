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
  const premium = variant === "warm";

  return (
    <div className="grid gap-4">
      {premium && !locked ? (
        <header className="border border-[#d7aa55]/45 bg-[#101412] p-5 text-[#f8f0df]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d7aa55]">
            Personal Consulting Report
          </p>
          <h3 className="mt-3 text-2xl font-black sm:text-3xl">
            完整版不是简单加长，而是把判断落实到现实选择
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {["明确结论", "形成原因", "现实风险", "行动方案"].map((item) => (
              <span
                key={item}
                className="border border-[#d7aa55]/25 bg-[#d7aa55]/10 px-3 py-2 text-center text-xs font-bold text-[#f2ddae]"
              >
                {item}
              </span>
            ))}
          </div>
        </header>
      ) : null}

      {sections.map((section, index) => (
        <article
          key={`${section.title}-${index}`}
          className={
            premium
              ? "relative overflow-hidden border border-[#d7aa55]/32 bg-[#fffaf2] p-5 text-[#1d1a16] shadow-xl shadow-[#d7aa55]/10"
              : "border border-[#d7aa55]/22 bg-[#111715] p-5 text-[#f5efe2]"
          }
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <div className="flex items-start gap-3">
            <span className="grid h-9 min-w-9 place-items-center border border-[#d7aa55]/55 bg-[#171a17] text-xs font-black text-[#d7aa55]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="text-lg font-black leading-8 sm:text-xl">{section.title}</h4>
              <p
                className={
                  premium
                    ? "mt-3 whitespace-pre-wrap text-[15px] leading-8 text-[#4f463b]"
                    : "mt-3 whitespace-pre-wrap text-sm leading-7 text-[#c9c2b6]"
                }
              >
                {section.body}
              </p>
            </div>
          </div>
        </article>
      ))}

      {locked ? (
        <article className="relative overflow-hidden border border-[#d7aa55]/55 bg-[#0f1311] p-5 text-[#f5efe2]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,170,85,.16),transparent_42%)]" />
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d7aa55]">
              已生成 · 待解锁
            </p>
            <h4 className="mt-2 text-xl font-black">你的关键答案仍在完整版中</h4>
            <ul className="mt-4 grid gap-2 text-sm leading-6 text-[#d8d0c2] sm:grid-cols-2">
              {[
                "事业定位与适合赛道",
                "财富增长方式与副业方向",
                "亲密关系风险点",
                "未来一年关键阶段",
                "未来 30 天最该做的三件事",
                "针对你的继续追问入口",
              ].map((item) => (
                <li key={item} className="border border-[#d7aa55]/18 bg-black/20 px-3 py-2">
                  锁定 · {item}
                </li>
              ))}
            </ul>
          </div>
        </article>
      ) : null}
    </div>
  );
}
