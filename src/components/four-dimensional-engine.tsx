"use client";

import { PointerEvent, useState } from "react";

const orbitItems = [
  ["八字", "底层节律"],
  ["紫微", "人生结构"],
  ["星座", "情绪能量"],
  ["MBTI", "行为模式"],
] as const;

export function FourDimensionalEngine() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setOffset({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 14,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 14,
    });
  }

  const positions = [
    "left-1/2 top-2 -translate-x-1/2",
    "right-0 top-1/2 -translate-y-1/2",
    "bottom-2 left-1/2 -translate-x-1/2",
    "left-0 top-1/2 -translate-y-1/2",
  ];

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      className="relative min-h-[390px] overflow-hidden border border-[#d7aa55]/28 bg-[#07090f]/85 p-4 shadow-2xl shadow-black/40"
    >
      <div className="xj-particle-field absolute inset-0 opacity-35" />
      <div
        className="relative z-10 mx-auto flex h-[350px] max-w-[430px] items-center justify-center transition-transform duration-200"
        style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
      >
        <div className="xj-orbit absolute h-[318px] w-[318px] rounded-full border border-[#d7aa55]/32" />
        <div className="absolute h-[242px] w-[242px] rounded-full border border-[#8f66dd]/34" />
        <div className="absolute h-[160px] w-[160px] rounded-full border border-[#d7aa55]/24" />
        <div className="relative z-20 grid h-32 w-32 place-items-center rounded-full border border-[#b489ff]/60 bg-[#121019] text-center shadow-[0_0_70px_rgba(139,82,255,.34)]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d7aa55]">
              AI Core
            </p>
            <h2 className="mt-2 text-xl font-black text-[#fff8ec]">人生解码核心</h2>
          </div>
        </div>
        {orbitItems.map(([title, subtitle], index) => (
          <article
            key={title}
            className={`absolute ${positions[index]} w-28 border border-[#d7aa55]/35 bg-black/60 px-3 py-3 text-center backdrop-blur-sm`}
          >
            <p className="text-lg font-black text-[#fff8ec]">{title}</p>
            <p className="mt-1 text-xs font-bold text-[#d7aa55]">{subtitle}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
