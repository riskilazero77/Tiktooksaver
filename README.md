# TikTookSaver

Website pengunduh video TikTok dengan tampilan responsif, dibuat dengan Next.js App Router. Situs menggunakan layanan TikWM untuk membaca media dari video publik. Tidak berafiliasi dengan TikTok atau TikWM.

## Mulai cepat untuk pemula

Panduan **bergambar dan lebih lengkap** tersedia di `/panduan-cloudflare` pada website ini.

### 1. Persiapan

- Pasang Node.js LTS dari https://nodejs.org/en/download (disarankan Node.js 20+).
- Buat akun gratis di https://dash.cloudflare.com/sign-up.
- Ekstrak ZIP proyek, lalu buka Terminal / PowerShell di folder `tiktooksaver`.

### 2. Jalankan di komputer

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Untuk menghentikan server, tekan `Ctrl+C`.

### 3. Publikasikan ke Cloudflare Workers

```bash
npx wrangler login
npm run deploy
```

Setujui login di browser. Setelah selesai, buka tautan `https://tiktooksaver.<subdomain-anda>.workers.dev` yang tertera di Terminal. `npm run deploy` sudah menjalankan build OpenNext sebelum unggah. Jangan memakai `npx wrangler deploy` langsung.

Untuk menguji runtime Cloudflare secara lokal: `npm run preview`.

### 4. Domain sendiri (opsional)

Tambahkan domain ke akun Cloudflare, lalu buka **Workers & Pages → tiktooksaver → Settings → Domains & Routes → Add → Custom Domain**. Ikuti petunjuk yang tampil. Domain `.workers.dev` gratis tetap bisa dipakai tanpa domain sendiri.

## Struktur penting

- `src/app/page.tsx` — beranda dan formulir unduh.
- `src/app/panduan-cloudflare/page.tsx` — panduan bergambar.
- `src/app/globals.css` — tampilan dan responsivitas.
- `src/app/api/resolve/route.ts` — proses tautan video publik.
- `src/app/api/download/route.ts` — alirkan file video/audio yang tersedia.
- `wrangler.jsonc` dan `open-next.config.ts` — konfigurasi Cloudflare Workers.

## Catatan penting

- Proyek situs ini **tidak membutuhkan database** untuk fitur utamanya. File template database yang mungkin tersedia di lingkungan pengembangan tidak dibutuhkan untuk deploy.
- TikWM adalah layanan pihak ketiga tanpa jaminan ketersediaan. Jika layanan berubah atau konten privat/dibatasi, unduhan bisa gagal.
- Hanya unduh konten milik sendiri atau konten yang boleh Anda gunakan. Hormati hak cipta dan ketentuan platform terkait.
- Jangan memasukkan `.env`, API key, atau data pribadi ke ZIP maupun repository publik.
- Bila nama Worker `tiktooksaver` sudah digunakan di akun Anda, ubah nilai `name` di `wrangler.jsonc` menjadi nama yang unik.
- Rujukan resmi: https://opennext.js.org/cloudflare/get-started dan https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/.
