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
  title: "ARACHNOVA — Global Agricultural Intelligence Platform",
  description: "Connecting Earth Intelligence with Sustainable Agriculture. Satellite observation datasets, soil indicators, and explainable AI crop rotation advisor.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f9f8f5] text-[#1e2420] selection:bg-[#eaf3ee] selection:text-[#18392b]">{children}</body>
    </html>
  );
}
