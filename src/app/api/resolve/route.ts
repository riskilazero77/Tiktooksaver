import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type TikwmData = {
  id?: string;
  title?: string;
  cover?: string;
  play?: string;
  hdplay?: string;
  music?: string;
  author?: { unique_id?: string };
};

function isTikTokUrl(input: string) {
  try {
    const url = new URL(input);
    return url.protocol === "https:" && /(^|\.)(tiktok\.com)$/.test(url.hostname.toLowerCase()) && !url.username && !url.password;
  } catch { return false; }
}

export async function POST(request: NextRequest) {
  let input: string;
  try {
    const body = await request.json();
    input = typeof body.url === "string" ? body.url.trim() : "";
  } catch { return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 }); }
  if (input.length > 1200 || !isTikTokUrl(input)) return NextResponse.json({ error: "Masukkan tautan TikTok yang valid, misalnya https://www.tiktok.com/@nama/video/... atau https://vt.tiktok.com/..." }, { status: 400 });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 16000);
    let response: Response;
    try {
      const endpoint = new URL("https://www.tikwm.com/api/");
      endpoint.searchParams.set("url", input);
      endpoint.searchParams.set("hd", "1");
      response = await fetch(endpoint.toString(), { headers: { Accept: "application/json" }, signal: controller.signal, cache: "no-store" });
    } finally { clearTimeout(timeout); }
    if (!response.ok) throw new Error("upstream");
    const payload: { code?: number; data?: TikwmData } = await response.json();
    const data = payload.data;
    if (payload.code !== 0 || !data?.id || !/^\d{10,24}$/.test(data.id) || !data.play) {
      return NextResponse.json({ error: "Video tidak ditemukan. Pastikan tautannya menuju video publik, lalu coba lagi." }, { status: 422 });
    }
    return NextResponse.json({
      id: data.id,
      title: (data.title || "Video TikTok").slice(0, 180),
      author: (data.author?.unique_id || "").slice(0, 60),
      cover: data.cover || "",
      videoUrl: data.play,
      hdUrl: data.hdplay || "",
      audioUrl: data.music || "",
      hasHd: Boolean(data.hdplay),
      hasAudio: Boolean(data.music),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Layanan video sedang tidak tersedia. Silakan coba lagi beberapa saat." }, { status: 502 });
  }
}
