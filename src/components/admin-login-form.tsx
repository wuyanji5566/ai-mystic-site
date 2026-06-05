"use client";

import { FormEvent, useState } from "react";

export function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "登录失败，请检查管理员密码。");
      }

      window.location.reload();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "登录失败，请稍后再试。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-5 py-12">
      <form onSubmit={handleSubmit} className="border border-[#d7aa55]/25 bg-white p-6">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9a563f]">
          Admin Login
        </p>
        <h2 className="mt-3 text-2xl font-bold">站长后台登录</h2>
        <label className="mt-5 grid gap-2 text-sm font-semibold">
          管理员密码
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 border border-[#d9c7b2] px-3 outline-none transition focus:border-[#9a563f]"
            autoComplete="current-password"
            required
          />
        </label>
        {error ? (
          <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 h-11 w-full bg-[#1d1a16] px-5 text-sm font-bold text-[#fff8ec] transition hover:bg-[#9a563f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "正在登录..." : "进入后台"}
        </button>
      </form>
    </section>
  );
}
