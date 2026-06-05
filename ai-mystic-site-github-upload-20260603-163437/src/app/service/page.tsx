import Link from "next/link";
import { PaymentUnlockPanel } from "@/components/payment-unlock-panel";
import { siteConfig } from "@/lib/site-config";

const steps = [
  ["01", "生成免费摘要", "先填写基础信息，获得一份四维融合摘要，判断报告方向是否适合你。"],
  ["02", "复制订单编号", "点击解锁完整版后，系统会生成订单编号。付款备注里填写订单编号，方便人工核对。"],
  ["03", "扫码付款", `当前完整版价格 ${siteConfig.fullReportPriceLabel}，先使用微信收款码完成 MVP 阶段收款。`],
  ["04", "人工核对解锁", `如需加速处理，把付款截图和报告链接发给客服微信 ${siteConfig.contactWeChat}。`],
];

const unlockBenefits = [
  "查看完整报告结构，而不是只看免费摘要",
  "继续围绕事业、关系、财富和 30 天计划深度追问",
  "获得更适合截图保存和复盘的结构化内容",
  "后续升级账号系统后，可继续沉淀历史报告",
];

export default function ServicePage() {
  return (
    <main className="min-h-screen bg-[#f5efe2] text-[#121714]">
      <section className="border-b border-[#d7aa55]/22 bg-[#101713] px-5 py-10 text-[#fff8ec]">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7aa55]">
            Unlock Service
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl leading-tight">
            解锁、付款、核对流程
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#d8cdb9]">
            当前阶段先用人工收款验证需求。页面会提供订单编号和收款码，后续有商户资质后再升级为微信支付、支付宝自动回调。
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-10 md:grid-cols-4">
        {steps.map(([step, title, desc]) => (
          <article key={step} className="border border-[#121714]/12 bg-white p-5">
            <p className="text-sm font-bold text-[#8b2732]">{step}</p>
            <h2 className="mt-5 text-xl font-bold">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-[#52615b]">{desc}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 pb-10 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="border border-[#121714]/12 bg-white p-5">
          <h2 className="text-2xl font-bold">完整版包含什么</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-7 text-[#52615b]">
            {unlockBenefits.map((benefit) => (
              <li key={benefit} className="border border-[#121714]/10 bg-[#fffaf2] px-4 py-3">
                {benefit}
              </li>
            ))}
          </ul>
          <Link
            href="/#report-form"
            className="mt-5 inline-flex h-11 items-center bg-[#121714] px-5 text-sm font-bold text-[#f5efe2] transition hover:bg-[#8b2732]"
          >
            返回生成报告
          </Link>
        </article>

        <PaymentUnlockPanel compact title="付款信息预览" description="实际解锁时，请以报告页弹出的订单编号为准。这里用于提前了解付款流程。" />
      </section>
    </main>
  );
}
