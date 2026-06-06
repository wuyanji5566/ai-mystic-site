"use client";

import { useEffect, useRef, useState } from "react";
import {
  FollowupAnalysis,
  parseFollowupSections,
} from "@/components/followup-analysis";
import type { FollowupMessage } from "@/lib/followup-storage";

type FollowupArchiveProps = {
  items: FollowupMessage[];
  reportTitle: string;
  onClear: () => void;
};

function wrapCanvasText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const lines: string[] = [];

  for (const paragraph of text.split("\n")) {
    if (!paragraph) {
      lines.push("");
      continue;
    }

    let line = "";
    for (const character of paragraph) {
      const candidate = `${line}${character}`;
      if (line && context.measureText(candidate).width > maxWidth) {
        lines.push(line);
        line = character;
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

function downloadFollowupImage(item: FollowupMessage, reportTitle: string) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return;

  const width = 1080;
  const padding = 78;
  const contentWidth = width - padding * 2;
  const sections = parseFollowupSections(item.answer);

  context.font = '34px "Microsoft YaHei", sans-serif';
  const questionLines = wrapCanvasText(context, item.question, contentWidth);
  const measuredSections = sections.map((section) => {
    context.font = '26px "Microsoft YaHei", sans-serif';
    const bodyLines = wrapCanvasText(context, section.body, contentWidth - 44);
    return { ...section, bodyLines };
  });
  const height = Math.min(
    16000,
    420 +
      questionLines.length * 52 +
      measuredSections.reduce(
        (total, section) => total + 128 + section.bodyLines.length * 43,
        0,
      ),
  );

  canvas.width = width;
  canvas.height = height;
  context.fillStyle = "#f7efe0";
  context.fillRect(0, 0, width, height);

  const gradient = context.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, "#17130c");
  gradient.addColorStop(0.6, "#3b2912");
  gradient.addColorStop(1, "#17130c");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, 210);

  context.fillStyle = "#e6bd65";
  context.font = '700 25px "Microsoft YaHei", sans-serif';
  context.fillText("玄机命理会馆 · 四维专属咨询档案", padding, 72);
  context.fillStyle = "#fff8e9";
  context.font = '700 36px "Microsoft YaHei", sans-serif';
  context.fillText(reportTitle, padding, 132);
  context.fillStyle = "#c7b99f";
  context.font = '22px "Microsoft YaHei", sans-serif';
  context.fillText(
    new Date(item.createdAt).toLocaleString("zh-CN"),
    padding,
    174,
  );

  let y = 270;
  context.fillStyle = "#9a671e";
  context.font = '700 22px "Microsoft YaHei", sans-serif';
  context.fillText("本次咨询问题", padding, y);
  y += 48;
  context.fillStyle = "#211a12";
  context.font = '700 34px "Microsoft YaHei", sans-serif';
  for (const line of questionLines) {
    context.fillText(line, padding, y);
    y += 52;
  }

  y += 18;
  measuredSections.forEach((section, index) => {
    context.fillStyle = index === 0 ? "#fff2ce" : "#ffffff";
    context.strokeStyle = index === 0 ? "#b17a25" : "#d8c8ab";
    const cardHeight = 94 + section.bodyLines.length * 43;
    context.fillRect(padding, y, contentWidth, cardHeight);
    context.strokeRect(padding, y, contentWidth, cardHeight);

    context.fillStyle = "#9a671e";
    context.font = '700 25px "Microsoft YaHei", sans-serif';
    context.fillText(
      `${String(index + 1).padStart(2, "0")}  ${section.title}`,
      padding + 24,
      y + 42,
    );
    context.fillStyle = "#554a3d";
    context.font = '24px "Microsoft YaHei", sans-serif';
    let bodyY = y + 82;
    for (const line of section.bodyLines) {
      context.fillText(line, padding + 24, bodyY);
      bodyY += 43;
    }
    y += cardHeight + 24;
  });

  context.fillStyle = "#756a59";
  context.font = '20px "Microsoft YaHei", sans-serif';
  context.fillText(
    "用于自我探索与成长复盘，不替代医疗、法律或投资等专业判断。",
    padding,
    Math.min(height - 48, y + 16),
  );

  const link = document.createElement("a");
  link.download = `玄机四维解析-${item.id}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export function FollowupArchive({
  items,
  reportTitle,
  onClear,
}: FollowupArchiveProps) {
  const previousCount = useRef(items.length);
  const [notice, setNotice] = useState("");
  const latest = items[items.length - 1];
  const [activeId, setActiveId] = useState(latest?.id || "");

  useEffect(() => {
    if (items.length > previousCount.current && latest) {
      setActiveId(latest.id);
      window.setTimeout(() => {
        document
          .getElementById(`followup-${latest.id}`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
    previousCount.current = items.length;
  }, [items.length, latest]);

  async function copyItem(item: FollowupMessage) {
    await navigator.clipboard.writeText(
      `咨询问题：${item.question}\n\n${item.answer}`,
    );
    setNotice("本次解析已复制。");
  }

  if (!items.length) return null;

  return (
    <section className="mt-6 border-t border-[#d7aa55]/25 pt-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-[#d7aa55]">我的咨询档案</p>
          <p className="mt-1 text-xs text-[#968e82]">
            共 {items.length} 次，默认只展开最新一次
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-[#9d9589] underline underline-offset-4"
        >
          清空本机记录
        </button>
      </div>

      <nav
        className="mt-4 flex snap-x gap-2 overflow-x-auto pb-2"
        aria-label="历史咨询快捷入口"
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setActiveId(item.id);
              window.setTimeout(() => {
                document
                  .getElementById(`followup-${item.id}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 40);
            }}
            className={`min-w-[180px] snap-start border px-3 py-3 text-left text-xs leading-5 ${
              activeId === item.id
                ? "border-[#d7aa55] bg-[#2a2114] text-[#f2e7d1]"
                : "border-[#d7aa55]/25 bg-[#171c19] text-[#d8d0c2]"
            }`}
          >
            <strong className="block text-[#e2bd68]">
              第 {index + 1} 次咨询
            </strong>
            <span className="mt-1 line-clamp-2 block">{item.question}</span>
          </button>
        ))}
      </nav>

      {notice ? (
        <p className="mt-3 border border-[#d7aa55]/25 px-3 py-2 text-xs text-[#f2d99a]">
          {notice}
        </p>
      ) : null}

      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <details
            id={`followup-${item.id}`}
            key={item.id}
            open={activeId === item.id}
            onToggle={(event) => {
              if (event.currentTarget.open) {
                setActiveId(item.id);
              } else if (activeId === item.id) {
                setActiveId("");
              }
            }}
            className="scroll-mt-4 border border-[#d7aa55]/35 bg-[#f7efe0] text-[#2c271f]"
          >
            <summary className="cursor-pointer list-none p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#9a671e]">
                    第 {index + 1} 次咨询
                    {item.id === latest.id ? " · 最新" : ""}
                  </p>
                  <h3 className="mt-2 break-words text-base font-black leading-7 sm:text-lg">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-xs text-[#887966]">
                    {new Date(item.createdAt).toLocaleString("zh-CN")}
                  </p>
                </div>
                <span className="shrink-0 border border-[#b58a43] px-2 py-1 text-[11px] font-bold text-[#79551d]">
                  展开 / 收起
                </span>
              </div>
            </summary>

            <div className="border-t border-[#d9c7aa] px-4 pb-5 sm:px-5">
              <FollowupAnalysis answer={item.answer} />
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => void copyItem(item)}
                  className="h-11 border border-[#9a671e]/35 bg-white text-sm font-bold text-[#6f4a13]"
                >
                  复制文字
                </button>
                <button
                  type="button"
                  onClick={() => downloadFollowupImage(item, reportTitle)}
                  className="h-11 bg-[#211a11] text-sm font-bold text-[#f2d99a]"
                >
                  保存长图
                </button>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
