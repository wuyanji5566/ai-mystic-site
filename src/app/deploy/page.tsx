import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const envKeys = [
  "OPENAI_API_KEY",
  "OPENAI_BASE_URL",
  "OPENAI_MODEL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_APP_URL",
];

export default function DeployPage() {
  return (
    <main className="min-h-screen bg-[#f8f3ea] text-[#1d1a16]">
      <section className="border-b border-[#e4d8c7] bg-[#211c18] px-5 py-8 text-[#fff8ec]">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f1c66d]">Deploy</p>
          <h1 className="mt-3 text-4xl font-semibold">{siteConfig.name} 上线清单</h1>
          <p className="mt-3 text-sm text-[#ddccb5]">把本地 MVP 发布成客户可访问、可注册、可保存报告的网站。</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-8">
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="border border-[#dfd2c1] bg-white p-5">
            <h2 className="text-2xl font-semibold">部署步骤</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-[#6f6254]">
              <li>把项目上传到 GitHub。</li>
              <li>GitHub 账号使用：{siteConfig.githubOwner}。</li>
              <li>打开 Vercel，导入这个 GitHub 项目。</li>
              <li>在 Vercel 的 Environment Variables 里填写右侧变量。</li>
              <li>点击 Deploy。</li>
              <li>部署成功后，把域名填到 NEXT_PUBLIC_APP_URL。</li>
            </ol>
          </article>

          <article className="border border-[#dfd2c1] bg-white p-5">
            <h2 className="text-2xl font-semibold">需要配置的变量</h2>
            <ul className="mt-4 space-y-2 text-sm text-[#6f6254]">
              {envKeys.map((key) => (
                <li key={key}>
                  <code>{key}</code>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-7 text-[#6f6254]">
              如果还没有 Vercel 和 Supabase 账号，需要你先用浏览器注册并登录。账号授权完成后，我可以继续帮你配置项目。
            </p>
          </article>
        </div>

        <div className="mt-6 border border-[#dfd2c1] bg-[#fffaf2] p-5">
          <h2 className="text-2xl font-semibold">我能帮你做什么</h2>
          <p className="mt-3 text-sm leading-7 text-[#6f6254]">
            你创建 Vercel 和 Supabase 账号后，我可以继续帮你接真实注册登录、报告云端归档、免费次数按账号限制，以及上线后的环境变量检查。
          </p>
          <p className="mt-3 text-sm leading-7 text-[#6f6254]">
            当前人工收款信息：完整版 {siteConfig.fullReportPriceLabel}，客服微信 {siteConfig.contactWeChat}。
          </p>
        </div>

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
