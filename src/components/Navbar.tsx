
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const learningItems = [
  { label: "Ayo Membaca", href: "/membaca", icon: "📖" },
  { label: "Ayo Menulis", href: "/menulis", icon: "✏️" },
  { label: "Ayo Berhitung", href: "/berhitung", icon: "🔢" },
];

const items = [
  { label: "Beranda", href: "/", icon: "🏠" },
  { label: "BicaraKu (AAC)", href: "/bicaraku", icon: "💬" },
  { label: "Cerita Isyarat", href: "/cerita", icon: "📚" },
  { label: "Petualangan", href: "/Petualangan", icon: "💜" },
];

export default function Navbar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const [sound, setSound] = useState(true);

  const [loginOpen, setLoginOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  useEffect(() => {
    setOpen(false);
    setLearnOpen(false);
    setLoginOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setLearnOpen(false);
        setLoginOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => pathname === href;

  const learningActive = learningItems.some(
    (item) => pathname === item.href
  );

  const openLogin = () => {
    setOpen(false);
    setLearnOpen(false);
    setLoginMessage("");
    setLoginOpen(true);
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Form tampilan saja: autentikasi belum dihubungkan.
    setLoginMessage(
      "Tampilan login sudah siap. Sistem autentikasi perlu dihubungkan agar akun bisa digunakan."
    );
  };

  return (
    <>
      <div className="sn-wrap">
        <div className="sn-inner">
          <div className="sn-bar">

            {/* BRAND */}
            <Link href="/" className="sn-brand" aria-label="ISYARA, ke beranda">
              <span className="sn-logo">🦄</span>
              <span className="sn-name">
                <strong>ISYARA</strong>
                <small>Dunia Cerita Anak</small>
              </span>
            </Link>

            {/* NAVIGASI DESKTOP */}
            <nav className="sn-links" aria-label="Navigasi utama">
              {items.slice(0, 1).map((it) => (
                <Link
                  key={it.label}
                  href={it.href}
                  className={isActive(it.href) ? "sn-link is-active" : "sn-link"}
                  aria-current={isActive(it.href) ? "page" : undefined}
                >
                  <span aria-hidden="true">{it.icon}</span>
                  {it.label}
                </Link>
              ))}

              {/* DROPDOWN BELAJAR */}
              <div className="sn-dropdown">
                <button
                  type="button"
                  className={learningActive ? "sn-link is-active" : "sn-link"}
                  onClick={() => setLearnOpen((v) => !v)}
                  aria-expanded={learnOpen}
                >
                  📚 Belajar
                  <span aria-hidden="true"></span>
                </button>

                {learnOpen && (
                  <div className="sn-dropdown-menu">
                    {learningItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="sn-dropdown-item"
                        onClick={() => setLearnOpen(false)}
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {items.slice(1).map((it) => (
                <Link
                  key={it.label}
                  href={it.href}
                  className={isActive(it.href) ? "sn-link is-active" : "sn-link"}
                  aria-current={isActive(it.href) ? "page" : undefined}
                >
                  <span aria-hidden="true">{it.icon}</span>
                  {it.label}
                </Link>
              ))}
            </nav>

            {/* ACTIONS */}
            <div className="sn-actions">
              <button
                type="button"
                className="sn-round"
                onClick={() => setSound((s) => !s)}
                aria-pressed={sound}
                aria-label={sound ? "Matikan suara" : "Nyalakan suara"}
              >
                {sound ? "🔊" : "🔇"}
              </button>

              <button
                type="button"
                className="sn-login"
                onClick={openLogin}
              >
                Masuk
              </button>

              <button
                type="button"
                className="sn-round sn-burger"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="sn-panel"
                aria-label={open ? "Tutup menu" : "Buka menu"}
              >
                {open ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {/* MENU MOBILE */}
          {open && (
            <nav id="sn-panel" className="sn-panel" aria-label="Menu utama">
              {items.slice(0, 1).map((it) => (
                <Link
                  key={it.label}
                  href={it.href}
                  className="sn-tile"
                  onClick={() => setOpen(false)}
                >
                  <span className="sn-tile-icon">{it.icon}</span>
                  {it.label}
                </Link>
              ))}

              <div className="sn-mobile-group">
                <button
                  type="button"
                  className="sn-tile"
                  onClick={() => setLearnOpen((v) => !v)}
                  aria-expanded={learnOpen}
                >
                  <span className="sn-tile-icon">📚</span>
                  Belajar {learnOpen ? "⌃" : "⌄"}
                </button>

                {learnOpen &&
                  learningItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="sn-tile sn-subtile"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sn-tile-icon">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
              </div>

              {items.slice(1).map((it) => (
                <Link
                  key={it.label}
                  href={it.href}
                  className="sn-tile"
                  onClick={() => setOpen(false)}
                >
                  <span className="sn-tile-icon">{it.icon}</span>
                  {it.label}
                </Link>
              ))}

              <button
                type="button"
                className="sn-tile"
                onClick={openLogin}
              >
                <span className="sn-tile-icon">👤</span>
                Masuk
              </button>
            </nav>
          )}
        </div>
      </div>

      {/* POP-UP LOGIN */}
      {loginOpen && (
        <div
          className="login-overlay"
          onClick={() => setLoginOpen(false)}
        >
          <section
            className="login-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="login-close"
              onClick={() => setLoginOpen(false)}
              aria-label="Tutup login"
            >
              ✕
            </button>

            <div className="login-logo">🦄</div>

            <div className="login-heading">
              <h2 id="login-title">Selamat Datang!</h2>
              <p>Masuk ke akun ISYARA kamu</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                placeholder="Masukkan email kamu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

              <label htmlFor="login-password">Kata Sandi</label>
              <div className="login-password-wrap">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-eye"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <div className="login-forgot">
                <Link href="/lupa-password" onClick={() => setLoginOpen(false)}>
                  Lupa kata sandi?
                </Link>
              </div>

              <button type="submit" className="login-submit">
                Masuk
              </button>

              {loginMessage && (
                <p className="login-message" role="status">
                  {loginMessage}
                </p>
              )}
            </form>

            <div className="login-register">
              Belum punya akun?{" "}
              <Link href="/daftar" onClick={() => setLoginOpen(false)}>
                Daftar sekarang
              </Link>
            </div>

            <p className="login-note">
              💜 Setiap isyaratmu berharga.
            </p>
          </section>
        </div>
      )}
    </>
  );
}

