import { NextRequest } from "next/server";

export const runtime = "nodejs";

type MediaData = { play?: string; hdplay?: string; music?: string };

function safeMediaUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value, "https://www.tikwm.com");
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || url.username || url.password) return null;
    if (!/(^|\.)(tiktokcdn(?:-[a-z]+)?\.com|tikwm\.com)$/.test(host)) return null;
    return url.toString();
  } catch { return null; }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || "";
  const type = request.nextUrl.searchParams.get("type") || "";
  if (!/^\d{10,24}$/.test(id) || !["video", "hd", "audio"].includes(type)) return new Response("Permintaan unduhan tidak valid.", { status: 400 });

  try {
    const endpoint = new URL("https://www.tikwm.com/api/");
    endpoint.searchParams.set("url", id);
    if (type === "hd") endpoint.searchParams.set("hd", "1");
    const info = await fetch(endpoint, { cache: "no-store", signal: AbortSignal.timeout(16000) });
    if (!info.ok) throw new Error("info unavailable");
    const payload: { code?: number; data?: MediaData } = await info.json();
    if (payload.code !== 0 || !payload.data) throw new Error("video unavailable");
    const media = type === "audio" ? payload.data.music : type === "hd" ? payload.data.hdplay : payload.data.play;
    const mediaUrl = safeMediaUrl(media);
    if (!mediaUrl) return new Response("Format ini tidak tersedia untuk video tersebut.", { status: 404 });

    const file = await fetch(mediaUrl, { signal: AbortSignal.timeout(90000), headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.tikwm.com/" }, cache: "no-store" });
    if (!file.ok || !file.body) throw new Error("media unavailable");
    const audio = type === "audio";
    return new Response(file.body, {
      headers: {
        "Content-Type": audio ? "audio/mpeg" : "video/mp4",
        "Content-Disposition": `attachment; filename="tiktooksaver-${id}.${audio ? "mp3" : "mp4"}"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Gagal mengunduh. Video mungkin tidak tersedia atau tautan media sudah kedaluwarsa. Silakan coba lagi.", { status: 502, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
}
