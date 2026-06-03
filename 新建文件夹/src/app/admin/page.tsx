import { AdminOrderPanel } from "@/components/admin-order-panel";
import { siteConfig } from "@/lib/site-config";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#f5efe2] text-[#121714]">
      <section className="border-b border-[#d7aa55]/22 bg-[#101713] px-5 py-8 text-[#fff8ec]">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7aa55]">
            {siteConfig.shortName} Admin
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight">
            站长后台
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#d8cdb9]">
            这里用于 MVP 阶段人工收款、订单备注和解锁回复。正式商业化后，应升级为登录保护、数据库台账和支付自动回调。
          </p>
        </div>
      </section>

      <AdminOrderPanel />
    </main>
  );
}
