"use client";

import { PointerEvent, useState } from "react";

const orbitItems = [
  ["八字", "底层节律", "行动节奏 · 财富倾向"],
  ["紫微", "人生结构", "阶段课题 · 资源流动"],
  ["星座", "情绪能量", "关系需求 · 压力反应"],
  ["MBTI", "行为模式", "决策偏好 · 适合环境"],
] as const;

export function FourDimensionalEngine() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
    setOffset({ x: x * 14, y: y * 14 });
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      className="relative min-h-[380px] overflow-hidden border border-[#d7aa55]/26 bg-[#07090f]/78 p-5 shadow-2xl shadow-black/40"
    >
      <div className="xj-particle-field absolute inset-0 opacity-40" />
      <div className="xj-scan absolute inset-0 opacity-55" />
      <div
        className="relative z-10 mx-auto flex h-[340px] max-w-[420px] items-center justify-center"
        style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
      >
        <div className="xj-orbit absolute h-[310px] w-[310px] rounded-full border border-[#d7aa55]/30" />
        <div className="absolute h-[236px] w-[236px] rounded-full border border-[#7c48d6]/32" />
        <div className="absolute h-[154px] w-[154px] rounded-full border border-[#2f9c89]/34" />

        <div className="relative z-20 grid h-32 w-32 place-items-center rounded-full border border-[#d7aa55]/55 bg-[#101015] text-center shadow-[0_0_70px_rgba(215,170,85,0.18)]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d7aa55]">
              AI Core
            </p>
            <h2 className="mt-2 text-lg font-bold leading-6 text-[#fff8ec]">
              人生解码核心
            </h2>
          </div>
        </div>

        {orbitItems.map(([title, subtitle, desc], index) => {
          const positions = [
            "left-1/2 top-2 -translate-x-1/2",
            "right-0 top-1/2 -translate-y-1/2",
            "bottom-2 left-1/2 -translate-x-1/2",
            "left-0 top-1/2 -translate-y-1/2",
          ];

          return (
            <article
              key={title}
              className={`absolute ${positions[index]} w-32 border border-[#d7aa55]/24 bg-black/45 p-3 text-center backdrop-blur-md`}
            >
              <p className="text-sm font-bold text-[#fff8ec]">{title}</p>
              <p className="mt-1 text-xs font-bold text-[#d7aa55]">{subtitle}</p>
              <p className="mt-2 text-[11px] leading-4 text-[#cfc2ae]">{desc}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
