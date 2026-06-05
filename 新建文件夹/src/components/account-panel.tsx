"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import {
  clearLocalAccount,
  getLocalAccount,
  saveLocalAccount,
  type LocalAccount,
} from "@/lib/account-storage";

export function AccountPanel() {
  const [account, setAccount] = useState<LocalAccount | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = getLocalAccount();
      setAccount(saved);
      setName(saved?.name || "");
      setEmail(saved?.email || "");
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAccount(saveLocalAccount({ name, email }));
  }

  function handleLogout() {
    clearLocalAccount();
    setAccount(null);
    setName("");
    setEmail("");
  }

  return (
    <main className="min-h-screen bg-[#f8f3ea] text-[#1d1a16]">
      <section className="border-b border-[#e4d8c7] bg-[#211c18] px-5 py-8 text-[#fff8ec]">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f1c66d]">Account</p>
          <h1 className="mt-3 text-4xl font-semibold">{siteConfig.name} 用户中心</h1>
          <p className="mt-3 text-sm text-[#ddccb5]">
            当前是 MVP 本地身份，用于演示“登录后保存报告”的产品流程。正式上线需要先创建 Supabase 账号，再接邮箱注册登录。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-8">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="border border-[#dfd2c1] bg-white p-5">
            <h2 className="text-2xl font-semibold">当前身份</h2>
            {account ? (
              <div className="mt-4 space-y-3 text-sm leading-7 text-[#6f6254]">
                <p>
                  昵称：<strong className="text-[#1d1a16]">{account.name}</strong>
                </p>
                <p>
                  邮箱：<strong className="text-[#1d1a16]">{account.email}</strong>
                </p>
                <p>创建时间：{new Date(account.createdAt).toLocaleString("zh-CN")}</p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 h-10 border border-[#d9c7b2] px-4 text-sm font-semibold transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                >
                  退出本地身份
                </button>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-7 text-[#6f6254]">
                还没有保存身份。填写右侧表单后，后续可以把报告和这个邮箱关联起来。真实上线后会升级为 Supabase 邮箱注册。
              </p>
            )}
          </article>

          <form className="border border-[#dfd2c1] bg-[#fffaf2] p-5" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold">保存本地身份</h2>
            <label className="mt-5 grid gap-2 text-sm font-medium">
              昵称
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-11 border border-[#d9c7b2] bg-white px-3 outline-none transition focus:border-[#9a563f]"
                placeholder="例如：小林"
              />
            </label>
            <label className="mt-4 grid gap-2 text-sm font-medium">
              邮箱
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 border border-[#d9c7b2] bg-white px-3 outline-none transition focus:border-[#9a563f]"
                placeholder="you@example.com"
              />
            </label>
            <button
              type="submit"
              className="mt-5 h-11 bg-[#1d1a16] px-5 text-sm font-semibold text-[#fff8ec] transition hover:bg-[#9a563f]"
            >
              保存身份
            </button>
          </form>
        </div>

        <div className="mt-6 border border-[#dfd2c1] bg-white p-5">
          <h2 className="text-2xl font-semibold">正式注册通道计划</h2>
          <p className="mt-3 text-sm leading-7 text-[#6f6254]">
            推荐第一版只做邮箱注册/登录。你创建 Supabase 账号后，我会把这里升级为真实账号系统：注册、登录、退出、我的报告、免费次数和付费解锁都绑定到用户账号。
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/" className="border border-[#d9c7b2] bg-white px-4 py-2 text-sm font-semibold">
            返回首页
          </Link>
          <Link href="/reports" className="border border-[#d9c7b2] bg-white px-4 py-2 text-sm font-semibold">
            查看历史报告
          </Link>
        </div>
      </section>
    </main>
  );
}
