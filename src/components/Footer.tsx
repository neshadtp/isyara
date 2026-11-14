
import Link from "next/link";

const adventures = [
  { label: "BicaraKu (AAC)", href: "/bicaraku" },
  { label: "Ayo Membaca", href: "/membaca" },
  { label: "Ayo Menulis", href: "/menulis" },
  { label: "Ayo Berhitung", href: "/berhitung" },
  { label: "Cerita Isyarat", href: "/cerita" },
];

const grownups = [
  { label: "Tentang ISYARA", href: "/tentang" },
  { label: "Panduan untuk orang tua", href: "/panduan" },
  { label: "Untuk guru dan terapis", href: "/guru" },
  { label: "Hubungi kami", href: "/kontak" },
];

export default function Footer() {
  return (
    <footer className="sf">
      <div className="sf-inner">

        {/* BRAND */}
        <div className="sf-brand">
          <Link href="/" className="sf-logo">
            <span>🦄</span> ISYARA
          </Link>

          <p>Tak harus terucap untuk bisa tersampaikan.</p>

          <ul className="sf-badges">
            <li>🛡️ Aman untuk anak</li>
            <li>🚫 Tanpa iklan</li>
            <li>📱 Web dan tablet</li>
          </ul>
        </div>

        {/* PETUALANGAN */}
        <nav className="sf-col" aria-label="Petualangan">
          <h5>Petualangan</h5>

          {adventures.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* UNTUK ORANG DEWASA */}
        <nav className="sf-col" aria-label="Untuk orang dewasa">
          <h5>Untuk orang dewasa</h5>

          {grownups.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* PESAN YARA */}
        <div className="sf-yara">
          <span className="sf-yara-face">😊</span>

          <p>
            <b>YARA bilang:</b> “Setiap isyaratmu berharga. Aku di sini untuk
            mendengarkan!”
          </p>
        </div>

      </div>

      {/* FOOTER BOTTOM */}
      <div className="sf-bottom">
        <span>
          © {new Date().getFullYear()} ISYARA, platform komunikasi visual dan belajar inklusif.
        </span>
      </div>
    </footer>
  );
}
