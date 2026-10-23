"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowDown, ArrowDownToLine, ArrowRight, BadgeCheck, Check, ChevronDown, Clipboard, Cloud, Download, FileAudio, FileVideo2, Heart, Link2, LoaderCircle, Menu, MousePointer2, Play, ShieldCheck, Sparkles, Smartphone, X, Zap } from "lucide-react";

type VideoResult = { id: string; title: string; author: string; cover: string; hasHd: boolean; hasAudio: boolean };

const faqs = [
  { q: "Apakah TikTokSaver gratis digunakan?", a: "Ya. Anda dapat memakai alat ini tanpa membuat akun. Ketersediaan unduhan bergantung pada video publik dan layanan sumber yang digunakan." },
  { q: "Apakah saya perlu memasang aplikasi?", a: "Tidak perlu. Cukup buka TikTokSaver melalui browser di ponsel, tablet, atau komputer, lalu tempel tautan video TikTok." },
  { q: "Video seperti apa yang dapat diunduh?", a: "Video publik yang tautannya dapat diakses oleh layanan sumber. Konten privat, dihapus, dibatasi wilayah, atau tidak mengizinkan akses mungkin tidak tersedia." },
  { q: "Bisakah saya menyimpan audio saja?", a: "Bisa, jika sumber menyediakan berkas audio. Setelah tautan diproses, pilih opsi MP3 pada hasil unduhan." },
  { q: "Apakah hasilnya selalu tanpa watermark?", a: "Kami menampilkan versi tanpa watermark bila layanan sumber menyediakannya. Kualitas dan ketersediaan format dapat berbeda untuk setiap video." },
];

function Logo({ light = false }: { light?: boolean }) {
  return <Link href="/" className={`logo ${light ? "logo-light" : ""}`} aria-label="TikTokSaver beranda"><span className="logo-symbol"><Play size={17} fill="currentColor" strokeWidth={2.5} /></span><span>tiktok<span className="logo-accent">saver</span><span className="logo-dot">.</span></span></Link>;
}

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [pasteNotice, setPasteNotice] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<VideoResult | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [menuOpen, setMenuOpen] = useState(false);

  async function pasteLink() {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setPasteNotice("Tautan berhasil ditempel");
      setError("");
      setTimeout(() => setPasteNotice(""), 2500);
    } catch {
      setPasteNotice("Izinkan akses clipboard, atau tempel manual dengan Ctrl+V.");
      setTimeout(() => setPasteNotice(""), 3500);
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!url.trim()) { setError("Tempel tautan video TikTok terlebih dahulu."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/resolve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: url.trim() }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Video tidak dapat diproses. Coba lagi nanti.");
      setResult(data);
      setTimeout(() => document.getElementById("download-result")?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    } catch (err) { setError(err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi nanti."); }
    finally { setBusy(false); }
  }

  return (
    <main>
      <header className="site-header">
        <div className="container header-inner">
          <Logo />
          <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`} aria-label="Navigasi utama">
            <a href="#cara-kerja" onClick={() => setMenuOpen(false)}>Cara Kerja</a>
            <a href="#keunggulan" onClick={() => setMenuOpen(false)}>Keunggulan</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
            <Link href="/panduan-cloudflare" onClick={() => setMenuOpen(false)} className="nav-mobile-guide">Panduan Cloudflare</Link>
          </nav>
          <Link className="header-cta" href="/panduan-cloudflare"><Cloud size={16} /> Panduan Cloudflare <ArrowRight size={15} /></Link>
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Tutup menu" : "Buka menu"}>{menuOpen ? <X size={23} /> : <Menu size={23} />}</button>
        </div>
      </header>

      <section className="hero" id="beranda">
        <div className="hero-glow hero-glow-one" /><div className="hero-glow hero-glow-two" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-spark"><Sparkles size={13} fill="currentColor" /></span> SIMPAN MOMEN FAVORITMU</div>
            <h1>Video favoritmu,<br /><span>selalu dalam genggaman.</span></h1>
            <p className="hero-description">Cara mudah menyimpan video TikTok yang kamu suka. Cukup tempel tautan, pilih format, dan nikmati kembali kapan saja.</p>
            <form className="download-form" onSubmit={submit}>
              <div className="input-wrap"><Link2 size={21} className="input-icon" /><input aria-label="Tautan video TikTok" type="text" inputMode="url" placeholder="Tempel tautan video TikTok di sini..." value={url} onChange={(e) => { setUrl(e.target.value); setError(""); }} /><button type="button" className="paste-btn" onClick={pasteLink}><Clipboard size={15} /> Tempel</button></div>
              <button className="download-btn" type="submit" disabled={busy}>{busy ? <LoaderCircle className="spin" size={19} /> : <ArrowDownToLine size={19} />} {busy ? "Memproses..." : "Unduh Sekarang"}</button>
            </form>
            {pasteNotice && <p className="form-note" role="status">{pasteNotice}</p>}
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="hero-trust"><span><Check size={14} /> Tanpa daftar</span><span><Check size={14} /> Gratis digunakan</span><span><Check size={14} /> Semua perangkat</span></div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-ring ring-one" /><div className="art-ring ring-two" />
            <div className="floating-chip chip-top"><span className="chip-icon violet"><Sparkles size={17} /></span><span><b>Siap disimpan</b><small>Momen terbaikmu</small></span><span className="chip-check"><Check size={14} /></span></div>
            <div className="phone"><div className="phone-top"><span>9:41</span><span className="phone-island" /><span>● ▰</span></div><div className="phone-video"><div className="video-orb orb-1" /><div className="video-orb orb-2" /><div className="video-arc" /><div className="video-center"><span className="video-play"><Play size={25} fill="currentColor" /></span></div><div className="video-label"><span className="label-avatar">✦</span><div><b>@creative.moments</b><span>Little moments, big memories ✨</span></div></div></div><div className="phone-bottom"><span>⌂</span><span>⌕</span><span className="plus-button">+</span><span>♡</span><span>▣</span></div></div>
            <div className="floating-chip chip-bottom"><span className="chip-icon mint"><ArrowDownToLine size={19} /></span><span><b>Download selesai!</b><small>Video tersimpan • MP4</small></span><span className="chip-check"><Check size={14} /></span></div>
            <div className="art-star star-one">✦</div><div className="art-star star-two">✳</div>
          </div>
        </div>
        <div className="hero-bottom-line" />
      </section>

      {result && <section className="container result-section" id="download-result" aria-live="polite"><div className="result-card"><div className="result-cover" style={{ backgroundImage: result.cover ? `url("${result.cover.replaceAll('"', '%22')}")` : undefined }}><Play size={25} fill="currentColor" /></div><div className="result-info"><span className="section-kicker">VIDEO DITEMUKAN <Check size={13} /></span><h2>{result.title}</h2><p>{result.author ? `Oleh @${result.author}` : "Video TikTok publik"}</p><div className="result-actions"><a href={`/api/download?type=video&id=${encodeURIComponent(result.id)}`}><FileVideo2 size={17} /> Unduh MP4</a>{result.hasHd && <a href={`/api/download?type=hd&id=${encodeURIComponent(result.id)}`}><Sparkles size={17} /> MP4 HD</a>}{result.hasAudio && <a className="action-outline" href={`/api/download?type=audio&id=${encodeURIComponent(result.id)}`}><FileAudio size={17} /> Unduh MP3</a>}</div><small className="result-disclaimer">Simpan hanya konten yang berhak Anda gunakan. Ketersediaan bergantung pada layanan sumber.</small></div><button className="result-close" onClick={() => setResult(null)} aria-label="Tutup hasil"><X size={18} /></button></div></section>}

      <section className="steps-section" id="cara-kerja"><div className="container"><div className="section-heading"><span className="section-kicker"><span className="kicker-line" /> MUDAH & CEPAT</span><h2>Cuma 3 langkah,<br /><span>videomu tersimpan.</span></h2><p>Tak perlu aplikasi tambahan atau proses yang rumit. Semuanya selesai dalam hitungan langkah.</p></div><div className="steps-grid"><div className="step-card"><span className="step-num">01</span><div className="step-illustration illustration-link"><div className="mini-video"><div className="mini-video-top" /><div className="mini-video-play"><Play size={17} fill="currentColor" /></div><div className="mini-video-bottom" /></div><span className="illus-share"><Link2 size={18} /></span></div><div className="step-text"><span className="step-icon"><Link2 size={19} /></span><h3>Salin tautan</h3><p>Buka TikTok, pilih video yang kamu suka, lalu ketuk Bagikan dan Salin Tautan.</p></div></div><div className="step-card"><span className="step-num">02</span><div className="step-illustration illustration-paste"><div className="illus-url"><Link2 size={17} /><span>tiktok.com/@video...</span><span className="illus-cursor"><MousePointer2 size={24} fill="currentColor" /></span></div><div className="illus-paste-tag"><Check size={12} /> Tautan ditempel</div></div><div className="step-text"><span className="step-icon"><Clipboard size={19} /></span><h3>Tempel di sini</h3><p>Masukkan tautan ke kolom di atas, kemudian klik tombol Unduh Sekarang.</p></div></div><div className="step-card"><span className="step-num">03</span><div className="step-illustration illustration-save"><div className="illus-file"><div className="illus-file-icon"><Play size={19} fill="currentColor" /></div><div className="illus-file-lines"><i /><i /></div><span>MP4</span></div><div className="illus-down"><ArrowDown size={22} /></div></div><div className="step-text"><span className="step-icon"><Download size={19} /></span><h3>Simpan videonya</h3><p>Pilih MP4 atau MP3 yang tersedia, lalu simpan langsung ke perangkatmu.</p></div></div></div></div></section>

      <section className="features-section" id="keunggulan"><div className="container features-layout"><div className="features-intro"><span className="section-kicker"><span className="kicker-line" /> KENAPA TIKTOOKSAVER?</span><h2>Lebih simpel.<br /><span>Lebih menyenangkan.</span></h2><p>Dibuat untuk membuat proses menyimpan konten favorit terasa ringan, cepat, dan tanpa ribet.</p><a className="text-link" href="#beranda">Coba sekarang <ArrowRight size={18} /></a></div><div className="features-grid"><div className="feature-card"><span className="feature-icon feature-violet"><Zap size={23} fill="currentColor" /></span><h3>Proses praktis</h3><p>Tempel tautan, lihat hasilnya, dan unduh. Sesederhana itu.</p></div><div className="feature-card"><span className="feature-icon feature-pink"><Heart size={23} fill="currentColor" /></span><h3>Momen selalu dekat</h3><p>Simpan video favorit untuk ditonton lagi kapan pun kamu mau.</p></div><div className="feature-card"><span className="feature-icon feature-blue"><Smartphone size={23} /></span><h3>Di semua perangkat</h3><p>Bekerja nyaman di browser ponsel, tablet, maupun laptop.</p></div><div className="feature-card"><span className="feature-icon feature-green"><ShieldCheck size={23} /></span><h3>Tanpa akun</h3><p>Tidak perlu daftar. Tautan diproses saat kamu memintanya.</p></div></div></div></section>

      <section className="guide-banner-section"><div className="container"><div className="guide-banner"><div className="guide-banner-glow" /><div className="guide-banner-content"><span className="banner-kicker"><Cloud size={15} /> UNTUK PEMILIK WEBSITE</span><h2>Ingin punya website<br />seperti ini?</h2><p>Unduh file proyek TikTookSaver dan ikuti panduan bergambar untuk memasangnya di Cloudflare Workers. Ditulis khusus untuk pemula.</p><Link href="/panduan-cloudflare" className="banner-button">Lihat panduan lengkap <ArrowRight size={18} /></Link></div><div className="banner-art" aria-hidden="true"><div className="banner-window"><div className="banner-window-top"><i /><i /><i /><span>tiktooksaver.workers.dev</span></div><div className="banner-window-body"><div className="banner-window-badge">✦ LIVE ON CLOUDFLARE</div><strong>Your website<br />is live!</strong><div className="banner-window-stroke" /><div className="banner-window-stroke short" /></div></div><div className="banner-cloud"><Cloud size={35} /></div></div></div></div></section>

      <section className="faq-section" id="faq"><div className="container faq-layout"><div className="faq-intro"><span className="section-kicker"><span className="kicker-line" /> PERTANYAAN UMUM</span><h2>Masih penasaran?<br /><span>Kami bantu jawab.</span></h2><p>Temukan jawaban singkat untuk pertanyaan yang paling sering ditanyakan.</p></div><div className="faq-list">{faqs.map((item, index) => <div className={`faq-item ${openFaq === index ? "faq-active" : ""}`} key={item.q}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>{item.q}<ChevronDown size={20} /></button>{openFaq === index && <p>{item.a}</p>}</div>)}</div></div></section>

      <footer className="footer"><div className="container"><div className="footer-top"><div><Logo light /><p>Simpan momen yang berarti.<br />Nikmati kembali kapan saja.</p></div><div className="footer-links"><div><b>Jelajahi</b><a href="#cara-kerja">Cara Kerja</a><a href="#keunggulan">Keunggulan</a><a href="#faq">FAQ</a></div><div><b>Untuk pemilik web</b><Link href="/panduan-cloudflare">Panduan Cloudflare</Link><a href="/tiktooksaver-source.zip" download>Unduh file proyek</a></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} TikTookSaver. Dibuat dengan 💜 untuk momen favoritmu.</span><span>Tidak berafiliasi dengan TikTok. Hormati hak cipta kreator.</span></div></div></footer>
    </main>
  );
}
