import Link from "next/link";
import "./dashboard.css";

const stats = [
  { icon: "⭐", value: "48", label: "Bintang", tag: "Klaim" },
  { icon: "🏅", value: "5", label: "Medali", tag: "Hebat" },
  { icon: "🔥", value: "7", label: "Hari beruntun", tag: "Aktif" },
  { icon: "😊", value: "Senang", label: "Suasana hati" },
];

const islands = [
  {
    theme: "purple",
    tag: "Pulau 1",
    badge: "12 🗣️",
    art: "🏡",
    title: "Rumah BicaraKu",
    desc: "Susun kartu, bicara dengan suara.",
    cta: "Masuk",
    href: "/bicaraku",
  },
  {
    theme: "mint",
    tag: "Pulau 2",
    badge: "Lv. 4 ✅",
    art: "🔤",
    title: "Negeri Huruf Ajaib",
    desc: "Kenali huruf dan suku kata.",
    cta: "Jelajahi",
    href: "/membaca",
  },
  {
    theme: "pink",
    tag: "Pulau 3",
    badge: "3 🖼️",
    art: "🖍️",
    title: "Taman Menulis & Warna",
    desc: "Tebalkan garis, lalu warnai.",
    cta: "Mulai",
    href: "/menulis",
  },
  {
    theme: "teal",
    tag: "Pulau 4",
    badge: "Baru ✨",
    art: "🍎",
    title: "Pulau Angka Buah",
    desc: "Hitung buah sampai 10.",
    cta: "Bermain",
    href: "/berhitung",
  },
  {
    theme: "violet",
    tag: "Pulau 5",
    badge: "Bab 2 📖",
    art: "🏰",
    title: "Negeri Cerita Isyarat",
    desc: "Nonton dongeng bergambar.",
    cta: "Nonton",
    href: "/cerita",
  },
];

const activities = [
  { icon: "💬", theme: "purple", title: "BicaraKu: “Aku mau minum susu”", time: "25 menit lalu", pts: 5, href: "/bicaraku" },
  { icon: "📖", theme: "mint", title: "Huruf “B-A” dan “B-O”", time: "Kemarin", pts: 5, href: "/membaca" },
  { icon: "✏️", theme: "pink", title: "Tarik garis melingkar balon", time: "2 hari lalu", pts: 3, href: "/menulis" },
];

const stickers = [
  { icon: "⭐", name: "Bintang Ceria", on: true },
  { icon: "🍎", name: "Apel Pintar", on: true },
  { icon: "🐰", name: "Kelinci Ramah", on: true },
  { icon: "🚀", name: "Roket Super", on: true },
  { icon: "❓", name: "Misteri", on: false },
  { icon: "❓", name: "Misteri", on: false },
];

export default function PetualanganPage() {
  return (
    <div className="db">
      {/* ===== Sapaan & statistik ===== */}
      <section className="db-hero">
        <div className="db-me">
          <span className="db-avatar" aria-hidden="true">
            🧒<b>Lv.3</b>
          </span>
          <div>
            <span className="db-rank">Penjelajah Bintang</span>
            <h1>Halo, Dafi! ⭐</h1>
          </div>
        </div>
        <ul className="db-stats">
          {stats.map((s) => (
            <li key={s.label}>
              <span aria-hidden="true">{s.icon}</span>
              <strong>{s.value}</strong>
              <small>{s.label}</small>
              {s.tag && <em>{s.tag}</em>}
            </li>
          ))}
        </ul>
      </section>

      {/* ===== YARA & misi ===== */}
      <section className="db-duo">
        <div className="db-yara">
          <span className="db-yara-face" aria-hidden="true">😄</span>
          <p>
            Hebat, Dafi! Yuk lanjut ke <Link href="/bicaraku">BicaraKu</Link> atau
            main di <Link href="/berhitung">Pulau Angka</Link>!
          </p>
        </div>
        <div className="db-mission">
          <div className="db-mission-top">
            <h2>Misi hari ini</h2>
            <span className="db-reward">+10 ⭐</span>
          </div>
          <div className="db-bar" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100} aria-label="Kemajuan misi">
            <div style={{ width: "60%" }} />
          </div>
          <small>1 dari 2 kalimat di BicaraKu</small>
        </div>
      </section>

      {/* ===== Peta pulau ===== */}
      <section className="db-map" aria-labelledby="peta">
        <div className="db-head">
          <h2 id="peta">🧭 Peta Petualangan</h2>
          <span className="db-pill">Semua pulau terbuka</span>
        </div>

        <div className="db-islands">
          {islands.map((i) => (
            <article key={i.title} className={`isle is-${i.theme}`}>
              <div className="isle-art">
                <span className="isle-tag">{i.tag}</span>
                <span className="isle-badge">{i.badge}</span>
                <span className="isle-emoji" aria-hidden="true">{i.art}</span>
              </div>
              <div className="isle-body">
                <h3>{i.title}</h3>
                <p>{i.desc}</p>
                <Link href={i.href} className="isle-btn">
                  {i.cta} →
                </Link>
              </div>
            </article>
          ))}

          {/* Pulau terkunci */}
          <article className="isle is-lock" aria-label="Pulau Musik, terkunci">
            <div className="isle-art">
              <span className="isle-emoji" aria-hidden="true">🔒</span>
              <span className="lock-need">48 / 60 ⭐</span>
            </div>
            <div className="isle-body">
              <h3>Pulau Musik &amp; Irama</h3>
              <div className="db-bar"><div style={{ width: "80%" }} /></div>
              <span className="isle-btn" aria-disabled="true">Terkunci 🔒</span>
            </div>
          </article>
        </div>
      </section>

      {/* ===== Aktivitas & album ===== */}
      <section className="db-duo db-duo-b">
        <div className="db-card">
          <h2>🕘 Aktivitas terakhir</h2>
          <ul className="db-acts">
            {activities.map((a) => (
              <li key={a.title}>
                <span className={`act-icon is-${a.theme}`} aria-hidden="true">{a.icon}</span>
                <div>
                  <b>{a.title}</b>
                  <small>{a.time}</small>
                </div>
                <span className="act-pts">+{a.pts} ⭐</span>
                <Link href={a.href} className="act-redo" aria-label={`Ulangi: ${a.title}`}>
                  ↻
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="db-card">
          <div className="db-head">
            <h2>🎁 Album stiker</h2>
            <span className="db-pill">4 / 6</span>
          </div>
          <ul className="db-stickers">
            {stickers.map((s, idx) => (
              <li key={idx} className={s.on ? "" : "is-off"}>
                <span aria-hidden="true">{s.icon}</span>
                {s.name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== Area orang tua ===== */}
      <section className="db-parent">
        <span className="db-parent-icon" aria-hidden="true">🛡️</span>
        <div>
          <b>Area orang tua &amp; terapis</b>
          <small>Laporan dan pengaturan</small>
        </div>
        <Link href="/orangtua" className="db-parent-btn">
          Buka kunci 🔑
        </Link>
      </section>
    </div>
  );
}