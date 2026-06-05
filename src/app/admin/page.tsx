import { cookies } from "next/headers";
import { AdminLoginForm } from "@/components/admin-login-form";
import { AdminOrderPanel } from "@/components/admin-order-panel";
import {
  adminSessionCookieName,
  isAdminAuthConfigured,
  isValidAdminSession,
} from "@/lib/admin-auth";
import { siteConfig } from "@/lib/site-config";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated = isValidAdminSession(cookieStore.get(adminSessionCookieName)?.value);

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

      {!isAdminAuthConfigured() ? (
        <section className="mx-auto max-w-3xl px-5 py-10">
          <div className="border border-[#8b2732]/25 bg-white p-6">
            <p className="text-sm font-bold text-[#8b2732]">后台暂未启用</p>
            <h2 className="mt-3 text-2xl font-bold">请先配置 ADMIN_PASSWORD</h2>
            <p className="mt-3 text-sm leading-7 text-[#62584b]">
              为了避免订单后台公开访问，生产环境必须在环境变量中设置管理员密码。
            </p>
          </div>
        </section>
      ) : isAuthenticated ? (
        <AdminOrderPanel />
      ) : (
        <AdminLoginForm />
      )}
    </main>
  );
}
