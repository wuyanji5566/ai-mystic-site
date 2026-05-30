import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const envKeys = [
  {
    key: "OPENAI_API_KEY",
    note: "DeepSeek 或 OpenAI 的服务端密钥，不能写到页面里",
  },
  {
    key: "OPENAI_BASE_URL",
    note: "当前 DeepSeek 建议填写 https://api.deepseek.com",
  },
  {
    key: "OPENAI_MODEL",
    note: "当前项目默认 deepseek-v4-flash",
  },
  {
    key: "NEXT_PUBLIC_APP_URL",
    note: "部署成功后的正式网址，用于 sitemap 和分享链接",
  },
  {
    key: "SUPABASE_URL",
    note: "后续做真实账号、跨设备报告保存时再配置",
  },
  {
    key: "SUPABASE_SERVICE_ROLE_KEY",
    note: "只放服务端环境变量，不能暴露给前端",
  },
];

const platforms = [
  {
    name: "Netlify",
    tag: "优先推荐",
    description:
      "适合先把 Next.js MVP 放到海外免费网址上。你需要注册 Netlify，并用 GitHub 或邮箱登录。",
  },
  {
    name: "Cloudflare Pages",
    tag: "备用方案",
    description:
      "全球 CDN 很强，适合海外访问。Next.js 动态接口需要额外适配，后续可以作为第二选择。",
  },
  {
    name: "Vercel",
    tag: "技术适配好",
    description:
      "最适合 Next.js，但你当前被手机号验证卡住，所以暂时不作为第一上线方案。",
  },
];

const launchSteps = [
  "注册 Netlify 账号，并用你的 GitHub 账号 wuyanji5566 登录。",
  "把当前项目上传到 GitHub 仓库，Netlify 从 GitHub 导入项目。",
  "在 Netlify 后台填写构建命令 npm run build，发布目录 .next。",
  "在 Netlify 后台配置 DeepSeek 环境变量，不要把密钥写进代码。",
  "首次部署成功后，先使用 Netlify 免费二级域名访问。",
  "把 NEXT_PUBLIC_APP_URL 改成部署后的网址，再重新部署一次。",
  "确认 /robots.txt 和 /sitemap.xml 能打开。",
  "提交 Google Search Console 和 Bing Webmaster，等待搜索引擎收录。",
];

export default function DeployPage() {
  return (
    <main className="min-h-screen bg-[#f8f3ea] text-[#1d1a16]">
      <section className="border-b border-[#e4d8c7] bg-[#211c18] px-5 py-8 text-[#fff8ec]">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f1c66d]">
            Overseas Launch
          </p>
          <h1 className="mt-3 text-4xl font-semibold">{siteConfig.name} 海外上线清单</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#ddccb5]">
            你现在不想先买国内服务器，可以先走海外免费上线。第一选择是 Netlify：
            成本低、步骤少、能先拿到一个公开网址，用来给客户体验和测试转化。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {platforms.map((platform) => (
            <article key={platform.name} className="border border-[#dfd2c1] bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">{platform.name}</h2>
                <span className="border border-[#e5d7c5] bg-[#fffaf2] px-2 py-1 text-xs font-semibold text-[#9a563f]">
                  {platform.tag}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-[#6f6254]">{platform.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="border border-[#dfd2c1] bg-white p-5">
            <h2 className="text-2xl font-semibold">上线步骤</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-[#6f6254]">
              {launchSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>

          <article className="border border-[#dfd2c1] bg-white p-5">
            <h2 className="text-2xl font-semibold">必须配置的变量</h2>
            <div className="mt-4 space-y-3">
              {envKeys.map((item) => (
                <div key={item.key} className="border border-[#eadcca] bg-[#fffaf2] p-3">
                  <code className="text-sm font-semibold">{item.key}</code>
                  <p className="mt-2 text-xs leading-6 text-[#6f6254]">{item.note}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <article className="border border-[#dfd2c1] bg-[#fffaf2] p-5">
            <h2 className="text-xl font-semibold">现在能上线什么</h2>
            <p className="mt-3 text-sm leading-7 text-[#6f6254]">
              首页、报告生成、历史报告、报告详情、继续追问、人工收款解锁、隐私政策和基础 SEO 都已经具备。
            </p>
          </article>
          <article className="border border-[#dfd2c1] bg-[#fffaf2] p-5">
            <h2 className="text-xl font-semibold">上线后还要补什么</h2>
            <p className="mt-3 text-sm leading-7 text-[#6f6254]">
              真实注册登录、Supabase 云端报告库、自动支付回调、管理员后台和正式域名。这些可以等有第一批用户后再做。
            </p>
          </article>
          <article className="border border-[#dfd2c1] bg-[#fffaf2] p-5">
            <h2 className="text-xl font-semibold">搜索收录规则</h2>
            <p className="mt-3 text-sm leading-7 text-[#6f6254]">
              部署成功只是“网站可访问”。要能被搜索到，还需要稳定网址、sitemap、站长平台提交和等待收录。
            </p>
          </article>
        </div>

        <div className="mt-6 border border-[#dfd2c1] bg-white p-5">
          <h2 className="text-2xl font-semibold">当前商业化状态</h2>
          <p className="mt-3 text-sm leading-7 text-[#6f6254]">
            现在先用人工微信收款验证需求：完整版报告 {siteConfig.fullReportPriceLabel}，
            客服微信 {siteConfig.contactWeChat}。等确认有人愿意付费，再接微信支付、支付宝或 Stripe。
          </p>
          <p className="mt-3 text-sm leading-7 text-[#6f6254]">
            如果主要服务中国境内客户，海外部署可以先做测试和展示；正式长期经营时，国内服务器、备案和微信生态仍然更稳。
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center bg-[#1d1a16] px-5 text-sm font-semibold text-[#fff8ec] transition hover:bg-[#9a563f]"
          >
            返回首页
          </Link>
          <Link
            href="/pricing"
            className="inline-flex h-11 items-center justify-center border border-[#d9c7b2] bg-white px-5 text-sm font-semibold transition hover:border-[#9a563f]"
          >
            查看付费方案
          </Link>
        </div>
      </section>
    </main>
  );
}
