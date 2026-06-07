import {
  buildReportPersonalization,
} from "@/lib/report-personalization";
import type { MysticInput, MysticProfile } from "@/lib/mystic";

export function PersonalizedReportDashboard({
  input,
  profile,
}: {
  input: MysticInput;
  profile: MysticProfile;
}) {
  const insight = buildReportPersonalization(input, profile);

  return (
    <section className="mb-5 overflow-hidden border border-[#d7aa55]/38 bg-[#0d1210]">
      <header className="grid gap-5 border-b border-[#d7aa55]/20 p-5 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d7aa55]">
            Personal Pattern Map
          </p>
          <h2 className="mt-3 text-2xl font-black text-[#fff8ec] sm:text-3xl">
            {input.name || "匿名用户"}的专属四维指纹
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#c8c0b4]">
            {insight.archetype}：{insight.headline}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {insight.keywords.map((keyword) => (
              <span
                key={keyword}
                className="border border-[#d7aa55]/24 bg-[#d7aa55]/7 px-3 py-1.5 text-xs text-[#ead49b]"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
        <div className="border border-[#d7aa55]/30 bg-black/20 px-4 py-3">
          <span className="block text-[10px] uppercase tracking-[0.18em] text-[#888f88]">
            报告画像编号
          </span>
          <strong className="mt-1 block font-mono text-sm text-[#f0d58e]">
            {insight.fingerprint}
          </strong>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1.1fr_.9fr]">
        <div className="border-b border-[#d7aa55]/18 p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-black text-[#f8f0df]">五项现实倾向</h3>
            <span className="text-[11px] text-[#777f78]">用于阅读定位，不是科学测量</span>
          </div>
          <div className="mt-5 grid gap-4">
            {insight.metrics.map((metric) => (
              <div key={metric.label}>
                <div className="mb-2 flex items-end justify-between gap-3">
                  <div>
                    <strong className="text-sm text-[#f5ecdd]">{metric.label}</strong>
                    <span className="ml-2 hidden text-xs text-[#777f78] sm:inline">
                      {metric.note}
                    </span>
                  </div>
                  <span className="font-mono text-sm font-black text-[#d7aa55]">
                    {metric.value}
                  </span>
                </div>
                <div className="h-2 overflow-hidden bg-[#222823]">
                  <div
                    className="h-full bg-[linear-gradient(90deg,#735019,#e1bd62)]"
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-black text-[#f8f0df]">四维解释贡献</h3>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {insight.dimensions.map((dimension) => (
              <article
                key={dimension.label}
                className="border border-[#d7aa55]/20 bg-[#151a17] p-4"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <strong className="text-sm text-[#f3e8d5]">{dimension.label}</strong>
                  <span className="font-mono text-lg font-black text-[#d7aa55]">
                    {dimension.value}%
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-[#898f89]">{dimension.note}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 border-l-2 border-[#d7aa55] bg-[#d7aa55]/8 px-4 py-3">
            <span className="text-xs font-black text-[#d7aa55]">当前行动优先级</span>
            <p className="mt-1 text-sm font-bold leading-6 text-[#f5ecdd]">
              {insight.priority}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
