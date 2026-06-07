"use client";

import { useMemo, useState } from "react";
import { parseReportSections, type ReportSection } from "@/lib/report-sections";

type ReportReaderProps = {
  report: string;
  locked?: boolean;
};

type ReportGroup = {
  id: string;
  label: string;
  description: string;
  sectionNumbers: number[];
};

const reportGroups: ReportGroup[] = [
  {
    id: "overview",
    label: "核心总览",
    description: "先读结论，快速看懂这份报告最重要的判断。",
    sectionNumbers: [1, 12],
  },
  {
    id: "dimensions",
    label: "四维画像",
    description: "分别查看八字、紫微、星座与 MBTI 的交叉依据。",
    sectionNumbers: [2, 3, 4, 5],
  },
  {
    id: "career",
    label: "事业财富",
    description: "聚焦适合环境、事业定位、资源与财富节奏。",
    sectionNumbers: [6, 7],
  },
  {
    id: "action",
    label: "关系行动",
    description: "查看关系模式、阶段提醒与接下来的行动顺序。",
    sectionNumbers: [8, 9, 10, 11],
  },
];

function getSectionNumber(section: ReportSection) {
  const match = section.title.match(/^(\d{1,2})[.\s、]/);
  return match ? Number(match[1]) : 0;
}

export function ReportReader({ report, locked = false }: ReportReaderProps) {
  const sections = useMemo(() => parseReportSections(report), [report]);
  const availableGroups = useMemo(
    () =>
      reportGroups
        .map((group) => ({
          ...group,
          sections: sections.filter((section) =>
            group.sectionNumbers.includes(getSectionNumber(section)),
          ),
        }))
        .filter((group) => group.sections.length > 0),
    [sections],
  );
  const [activeGroupId, setActiveGroupId] = useState(
    availableGroups[0]?.id ?? "overview",
  );
  const activeGroup =
    availableGroups.find((group) => group.id === activeGroupId) ??
    availableGroups[0];

  if (!activeGroup) return null;

  return (
    <section className="overflow-hidden border border-[#d7aa55]/35 bg-[#0e1311]">
      <header className="border-b border-[#d7aa55]/20 p-4 sm:p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d7aa55]">
              Guided Reading
            </p>
            <h2 className="mt-2 text-xl font-black text-[#fff8ec] sm:text-2xl">
              按主题阅读，不必一次翻完整份报告
            </h2>
          </div>
          <span className="hidden text-xs text-[#8e958e] sm:block">
            共 {sections.length} 个分析章节
          </span>
        </div>
      </header>

      <nav
        aria-label="报告主题"
        className="flex gap-2 overflow-x-auto border-b border-[#d7aa55]/18 p-3 [scrollbar-width:none]"
      >
        {availableGroups.map((group) => {
          const active = group.id === activeGroup.id;
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => setActiveGroupId(group.id)}
              className={
                active
                  ? "min-w-max border border-[#d7aa55] bg-[#d7aa55] px-4 py-2.5 text-sm font-black text-[#17130c]"
                  : "min-w-max border border-[#d7aa55]/20 bg-[#151a17] px-4 py-2.5 text-sm font-bold text-[#cfc7ba]"
              }
            >
              {group.label}
            </button>
          );
        })}
      </nav>

      <div className="p-3 sm:p-5">
        <p className="mb-4 text-sm leading-7 text-[#aaa397]">
          {activeGroup.description}
        </p>
        <div className="grid gap-3">
          {activeGroup.sections.map((section, index) => (
            <details
              key={section.title}
              open={index === 0}
              className="group border border-[#d7aa55]/22 bg-[#fffaf2] text-[#201c17]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 font-black marker:content-none sm:px-5">
                <span className="min-w-0 leading-7">{section.title}</span>
                <span className="grid h-7 w-7 shrink-0 place-items-center border border-[#9a742d]/35 text-[#8a641d] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="border-t border-[#9a742d]/18 px-4 py-4 sm:px-5">
                <p className="whitespace-pre-wrap text-[15px] leading-8 text-[#554b3f]">
                  {section.body}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>

      {locked ? (
        <footer className="border-t border-[#d7aa55]/30 bg-[radial-gradient(circle_at_top_right,rgba(215,170,85,.16),transparent_45%)] p-4 sm:p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d7aa55]">
            深度内容已生成 · 待解锁
          </p>
          <p className="mt-2 text-sm leading-7 text-[#d7d0c3]">
            事业定位、财富方式、关系风险、年度节奏和 30 天行动计划将在完整版继续展开。
          </p>
        </footer>
      ) : null}
    </section>
  );
}
