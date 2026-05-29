import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const envKeys = [
  "OPENAI_API_KEY",
  "OPENAI_BASE_URL",
  "OPENAI_MODEL",
  "NEXT_PUBLIC_APP_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const chinaSteps = [
  "注册腾讯云或阿里云账号，并完成实名。",
  "购买域名，建议和服务器在同一家云厂商。",
  "购买中国大陆服务器，推荐 2 核 2G Ubuntu 起步。",
  "提交 ICP 备案，备案通过前正式域名通常不能直接上线大陆服务器。",
  "服务器安装 Node.js 20、PM2、Nginx。",
  "部署项目，配置 DeepSeek 环境变量。",
  "备案通过后绑定域名、配置 HTTPS。",
  "上线后继续做公安联网备案。",
];

export default function DeployPage() {
  return (
    <main className="min-h-screen bg-[#f8f3ea] text-[#1d1a16]">
      <section className="border-b border-[#e4d8c7] bg-[#211c18] px-5 py-8 text-[#fff8ec]">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f1c66d]">
            China Deploy
          </p>
          <h1 className="mt-3 text-4xl font-semibold">{siteConfig.name} 国内上线清单</h1>
          <p className="mt-3 text-sm leading-7 text-[#ddccb5]">
            目标客户在中国境内时，优先使用腾讯云或阿里云服务器，不再依赖 Vercel。当前项目已准备 PM2、Docker 和 Nginx 部署说明。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-8">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="border border-[#dfd2c1] bg-white p-5">
            <h2 className="text-2xl font-semibold">国内上线步骤</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-[#6f6254]">
              {chinaSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
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
              当前可以先不接 Supabase。DeepSeek Key 必须放服务器环境变量，不能写到前端页面。
            </p>
          </article>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <article className="border border-[#dfd2c1] bg-[#fffaf2] p-5">
            <h2 className="text-xl font-semibold">最短上线</h2>
            <p className="mt-3 text-sm leading-7 text-[#6f6254]">
              腾讯云轻量服务器 + 临时公网 IP 访问，用来内部测试和给熟人演示。
            </p>
          </article>
          <article className="border border-[#dfd2c1] bg-[#fffaf2] p-5">
            <h2 className="text-xl font-semibold">正式上线</h2>
            <p className="mt-3 text-sm leading-7 text-[#6f6254]">
              域名实名 + ICP 备案 + HTTPS + 公安备案，适合长期服务中国境内客户。
            </p>
          </article>
          <article className="border border-[#dfd2c1] bg-[#fffaf2] p-5">
            <h2 className="text-xl font-semibold">收款策略</h2>
            <p className="mt-3 text-sm leading-7 text-[#6f6254]">
              先用人工微信收款验证 {siteConfig.fullReportPriceLabel} 是否有人买，再升级微信支付或支付宝。
            </p>
          </article>
        </div>

        <div className="mt-6 border border-[#dfd2c1] bg-white p-5">
          <h2 className="text-2xl font-semibold">下一步我需要你准备</h2>
          <p className="mt-3 text-sm leading-7 text-[#6f6254]">
            腾讯云或阿里云账号、一个域名、服务器登录方式、新 DeepSeek Key。你买好服务器后，把服务器公网 IP 和系统版本发给我，我继续带你部署。
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
