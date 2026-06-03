import Link from "next/link";
import { disclaimerSections, legalLinks, standardDisclaimer } from "@/lib/legal-copy";
import { siteConfig } from "@/lib/site-config";

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[#090b10] text-[#f5efe2]">
      <section className="border-b border-[#d7aa55]/20 bg-[#121018] px-5 py-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7aa55]">
            Disclaimer
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[#fff8ec]">
            免责声明
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#cfc2ae]">
            以下内容用于明确「{siteConfig.name}」的服务边界。请在生成或购买报告前阅读。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-10">
        <article className="space-y-5 border border-[#d7aa55]/20 bg-[#111714] p-5 shadow-2xl shadow-black/30 sm:p-7">
          {disclaimerSections.map((section) => (
            <section key={section.title} className="border-b border-[#f5efe2]/10 pb-5 last:border-b-0">
              <h2 className="text-xl font-bold text-[#fff8ec]">{section.title}</h2>
              <div className="mt-3 space-y-3 text-sm leading-7 text-[#cfc2ae]">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
          <p className="border border-[#d7aa55]/24 bg-[#d7aa55]/10 p-4 text-xs leading-6 text-[#f2ddae]">
            {standardDisclaimer}
          </p>
        </article>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center bg-[#d7aa55] px-5 text-sm font-bold text-[#121714] transition hover:bg-[#f0c86c]"
          >
            返回首页
          </Link>
          {legalLinks
            .filter((link) => link.href !== "/disclaimer")
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex h-11 items-center border border-[#d7aa55]/30 px-5 text-sm font-bold text-[#d7aa55] transition hover:bg-[#d7aa55] hover:text-[#121714]"
              >
                {link.label}
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}
