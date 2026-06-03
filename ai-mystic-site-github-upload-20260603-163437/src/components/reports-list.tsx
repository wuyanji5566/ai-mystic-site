"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  deleteReportWithCloudFallback,
  getReportsWithCloudFallback,
  type ReportStorageMode,
  type SavedMysticReport,
} from "@/lib/report-storage";

export function ReportsList() {
  const [reports, setReports] = useState<SavedMysticReport[]>([]);
  const [storageMode, setStorageMode] = useState<ReportStorageMode>("local");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      getReportsWithCloudFallback().then((result) => {
        setReports(result.reports);
        setStorageMode(result.storage);
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function removeReport(id: string) {
    await deleteReportWithCloudFallback(id, storageMode);
    const result = await getReportsWithCloudFallback();
    setReports(result.reports);
    setStorageMode(result.storage);
  }

  return (
    <main className="min-h-screen bg-[#f8f3ea] text-[#1d1a16]">
      <section className="border-b border-[#e4d8c7] bg-[#211c18] px-5 py-8 text-[#fff8ec]">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f1c66d]">
              Saved Reports
            </p>
            <h1 className="mt-3 text-4xl font-semibold">历史报告</h1>
            <p className="mt-3 text-sm text-[#ddccb5]">
              当前来源：{storageMode === "cloud" ? "Supabase 云端报告" : "本机浏览器报告"}，最多显示最近 20 份。
            </p>
          </div>
          <Link
            href="/"
            className="w-fit border border-[#fff8ec]/25 px-4 py-2 text-sm font-medium transition hover:bg-[#fff8ec] hover:text-[#211c18]"
          >
            生成新报告
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-8">
        {reports.length === 0 ? (
          <div className="border border-[#dfd2c1] bg-white p-6">
            <h2 className="text-2xl font-semibold">还没有保存报告</h2>
            <p className="mt-3 leading-7 text-[#6f6254]">
              回到首页填写出生信息并生成报告，系统会自动保存到这里。
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex h-11 items-center bg-[#1d1a16] px-5 text-sm font-semibold text-[#fff8ec] transition hover:bg-[#9a563f]"
            >
              去生成第一份报告
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => (
              <article key={report.id} className="border border-[#dfd2c1] bg-white p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#9a563f]">{report.input.name}</p>
                    <h2 className="mt-1 text-2xl font-semibold">{report.title}</h2>
                    <p className="mt-2 text-sm text-[#6f6254]">
                      {new Date(report.createdAt).toLocaleString("zh-CN")} · {report.profile.westernSign} · 生肖
                      {report.profile.zodiac}
                    </p>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#6f6254]">
                      {report.profile.birthSummary}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/report/${report.id}`}
                      className="flex h-10 items-center bg-[#1d1a16] px-4 text-sm font-semibold text-[#fff8ec] transition hover:bg-[#9a563f]"
                    >
                      查看
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeReport(report.id)}
                      className="h-10 border border-[#d9c7b2] px-4 text-sm font-semibold transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
