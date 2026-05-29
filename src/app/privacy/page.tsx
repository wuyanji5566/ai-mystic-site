import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f8f3ea] text-[#1d1a16]">
      <section className="border-b border-[#e4d8c7] bg-[#211c18] px-5 py-8 text-[#fff8ec]">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f1c66d]">Privacy</p>
          <h1 className="mt-3 text-4xl font-semibold">隐私政策</h1>
          <p className="mt-3 text-sm text-[#ddccb5]">适用于 {siteConfig.name} MVP。</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-8">
        <article className="space-y-6 border border-[#dfd2c1] bg-white p-6 text-sm leading-7 text-[#6f6254]">
          <section>
            <h2 className="text-xl font-semibold text-[#1d1a16]">我们收集什么</h2>
            <p className="mt-2">
              为了生成报告，网站会收集你主动填写的昵称、性别、出生日期、出生时间、出生地点和关注方向。
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-[#1d1a16]">数据保存在哪里</h2>
            <p className="mt-2">
              未配置 Supabase 时，报告只保存在你的浏览器本地。配置 Supabase 后，报告会保存到云端数据库。
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-[#1d1a16]">数据如何使用</h2>
            <p className="mt-2">
              数据仅用于生成和展示 AI 命理报告，不用于医疗、法律、投资等专业决策。
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-[#1d1a16]">如何删除</h2>
            <p className="mt-2">
              本地报告可以在历史报告页删除。云端报告目前通过历史页删除接口处理，正式上线后建议增加账号注销和数据导出能力。
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-[#1d1a16]">联系我们</h2>
            <p className="mt-2">
              客服微信：{siteConfig.contactWeChat}。联系邮箱：{siteConfig.contactEmail}。
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-[#1d1a16]">重要免责声明</h2>
            <p className="mt-2">
              网站内容仅供娱乐和自我探索，不构成医疗、法律、投资、婚恋等现实决策建议。
            </p>
          </section>
        </article>

        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center bg-[#1d1a16] px-5 text-sm font-semibold text-[#fff8ec] transition hover:bg-[#9a563f]"
        >
          返回首页
        </Link>
      </section>
    </main>
  );
}
