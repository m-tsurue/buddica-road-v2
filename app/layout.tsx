import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpotSelectionProvider } from "@/contexts/SpotSelectionContext";

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ 
          height: '100vh',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          position: 'relative'
        }}
      >
        <SpotSelectionProvider>
          {children}
        </SpotSelectionProvider>
      </body>
    </html>
  );
}
