import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "TikTokSaver — Simpan Video TikTok dengan Mudah",
  description: "Simpan momen favorit dari TikTok dalam beberapa klik. TikTookSaver membantu Anda mengunduh video dan audio dari tautan publik dengan cepat, simpel, dan nyaman di semua perangkat.",
  keywords: ["TikTokSaver", "unduh video TikTok", "TikTok downloader", "simpan video TikTok", "TikTok MP4"],
  openGraph: {
    title: "TikTokSaver — Momen favoritmu, selalu dekat",
    description: "Cara praktis menyimpan video dan audio TikTok favorit dari tautan publik.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
