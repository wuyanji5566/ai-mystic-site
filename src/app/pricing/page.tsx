import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

const plans = [
  {
    name: "免费体验版",
    price: "0 元",
    desc: `每位用户免费生成 ${siteConfig.freeReportsPerUser} 次，用来体验基础报告流程。`,
    features: ["基础命盘概览", "星座/生肖/年柱", "报告摘要", "付费后继续解析"],
  },
  {
    name: "完整版报告",
    price: siteConfig.fullReportPriceLabel,
    desc: "当前主售产品，适合用来验证用户是否愿意付费。",
    features: ["四维完整报告", "未来行动清单", "继续深度追问", "详情页复看"],
  },
  {
    name: "深度咨询版",
    price: "99 元起",
    desc: "后续做高客单价咨询、社群转化和一对一服务。",
    features: ["AI 完整报告", "人工补充解读", "一对一问题梳理", "后续行动建议"],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f5efe2] text-[#121714]">
      <section className="border-b border-[#d7aa55]/22 bg-[#101713] px-5 py-8 text-[#fff8ec]">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7aa55]">Pricing</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl">
            {siteConfig.name} 价格与收款
          </h1>
          <p className="mt-3 text-sm leading-7 text-[#d8cdb9]">
            当前先使用页面内收款码，跑通从生成报告到付费解锁的商业闭环。后续有商户资质后再接微信支付或支付宝自动回调。
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-5 py-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.name} className="border border-[#121714]/12 bg-white p-5">
            <h2 className="text-2xl font-bold">{plan.name}</h2>
            <p className="mt-3 text-3xl font-bold text-[#8b2732]">{plan.price}</p>
            <p className="mt-3 text-sm leading-7 text-[#52615b]">{plan.desc}</p>
            <ul className="mt-5 space-y-2 text-sm text-[#52615b]">
              {plan.features.map((feature) => (
                <li key={feature}>- {feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-5 pb-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border border-[#121714]/12 bg-[#101713] p-5 text-[#f5efe2]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d7aa55]">
            Manual Payment
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl">
            当前收款流程
          </h2>
          <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm leading-7 text-[#d8cdb9]">
            <li>用户生成免费摘要报告。</li>
            <li>用户在页面内扫码支付 {siteConfig.fullReportPriceLabel}。</li>
            <li>用户备注昵称，必要时发送付款截图和报告链接。</li>
            <li>客服确认后发送演示解锁码或人工标记订单。</li>
          </ol>
        </div>

        <div className="border border-[#121714]/12 bg-white p-5">
          <h2 className="text-2xl font-bold">微信收款码</h2>
          <div className="mt-4 overflow-hidden border border-[#121714]/10 bg-[#f5efe2] p-3">
            <Image
              src={siteConfig.wechatPayQrPath}
              alt={`${siteConfig.name} 微信收款码`}
              width={320}
              height={436}
              className="mx-auto h-auto w-full max-w-[260px]"
              priority
            />
          </div>
          <p className="mt-3 text-sm leading-7 text-[#52615b]">
            用户付款 {siteConfig.fullReportPriceLabel} 后，备注昵称；如需人工核对，再把付款截图和报告链接发给客服微信 {siteConfig.contactWeChat}。
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex h-11 items-center bg-[#121714] px-5 text-sm font-bold text-[#f5efe2] transition hover:bg-[#8b2732]"
          >
            返回生成报告
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-10">
        <div className="border border-[#121714]/12 bg-white p-5">
          <h2 className="text-2xl font-bold">正式自动支付还缺什么</h2>
          <p className="mt-3 text-sm leading-7 text-[#52615b]">
            微信支付和支付宝通常需要个体户或公司主体、商户号、应用 AppID、密钥和证书。你现在可以先用人工收款验证需求，等有人付费后再接自动支付。
          </p>
        </div>
      </section>
    </main>
  );
}
