import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from '@/components/analytics'
import { AdSenseScript } from '@/components/adsense'
import { TawkTo } from '@/components/tawkto'

function getSiteUrl() {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    'https://yourdomain.com'

  return url.startsWith('http') ? url : `https://${url}`
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'AI Nomad Toolkit | 数字游民赚钱路径地图',
    template: '%s | AI Nomad Toolkit',
  },
  description: '精选 AI 工具与变现平台，数字游民、Etsy 卖家、独立开发者一站式资源库',
  metadataBase: new URL(getSiteUrl()),
  openGraph: {
    siteName: 'AI Nomad Toolkit',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

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
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <AdSenseScript />
        <TawkTo />
      </body>
    </html>
  );
}
