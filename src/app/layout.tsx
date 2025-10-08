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
  title: "Tokyo AI Community",
  description: "도쿄 AI 커뮤니티 - AI 기술과 혁신을 위한 실험실",
  keywords: ["AI", "도쿄", "커뮤니티", "실험실", "기술", "혁신"],
  authors: [{ name: "Tokyo AI Community" }],
  openGraph: {
    title: "Tokyo AI Community",
    description: "도쿄 AI 커뮤니티 - AI 기술과 혁신을 위한 실험실",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
