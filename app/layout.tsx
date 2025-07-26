import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "BUDDICA ROAD - 最高のドライブ体験を",
  description: "Tinderライクなスワイプ操作でスポットを選び、ドラッグ&ドロップで自由にルートを編集できるドライブプランニングアプリ",
  keywords: ["ドライブ", "ルート", "旅行", "スポット", "地図"],
  openGraph: {
    title: "BUDDICA ROAD",
    description: "最高のドライブ体験を提供するWebアプリ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
