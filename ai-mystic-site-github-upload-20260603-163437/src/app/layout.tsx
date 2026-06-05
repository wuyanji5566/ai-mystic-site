import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${siteConfig.name}｜AI人生解码报告`,
  description:
    "输入出生信息与当前困惑，生成融合八字、紫微、星座、MBTI 与 AI 分析的人生复盘报告，包含事业、财富、关系与未来30天行动建议。仅供自我探索与成长参考。",
  openGraph: {
    title: "AI人生解码报告｜看清你的性格底层与下一步行动",
    description:
      "融合传统文化符号系统、人格模型与 AI 分析，生成你的个人成长复盘报告。",
    siteName: siteConfig.name,
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
