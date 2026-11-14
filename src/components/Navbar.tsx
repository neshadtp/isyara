
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "@/lib/supabase/client";

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
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const [sound, setSound] = useState(true);

  // Status pengguna
  const [user, setUser] = useState<any>(null);

  // State autentikasi
  const [loginOpen, setLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // State form
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginMessage, setLoginMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ==================================
  // CEK STATUS LOGIN SUPABASE
  // ==================================

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (mounted && !error) {
        setUser(data.session?.user ?? null);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setUser(session?.user ?? null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ==================================
  // MENUTUP MENU SAAT PINDAH HALAMAN
  // ==================================

  useEffect(() => {
    setOpen(false);
    setLearnOpen(false);
    setLoginOpen(false);
  }, [pathname]);

  // ==================================
  // TOMBOL ESCAPE
  // ==================================

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        setOpen(false);
        setLearnOpen(false);
        setLoginOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [isLoading]);

  const isActive = (href: string) => pathname === href;

  const learningActive = learningItems.some(
    (item) => pathname === item.href
  );

  // ==================================
  // MEMBUKA POP-UP LOGIN
  // ==================================

  const openLogin = () => {
    setOpen(false);
    setLearnOpen(false);
    setAuthMode("login");
    setLoginMessage("");
    setLoginOpen(true);
  };

  // ==================================
  // PINDAH LOGIN DAN REGISTER
  // ==================================

  const switchAuthMode = (mode: "login" | "register") => {
    setAuthMode(mode);
    setLoginMessage("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // ==================================
  // PROSES LOGIN
  // ==================================

  const handleLogin = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (isLoading) return;

    setLoginMessage("");
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        const errorMessage = error.message.toLowerCase();

        if (
          errorMessage.includes("invalid login credentials") ||
          errorMessage.includes("invalid credentials")
        ) {
          setLoginMessage(
            "Email atau kata sandi yang kamu masukkan salah."
          );
        } else if (
          errorMessage.includes("email not confirmed")
        ) {
          setLoginMessage(
            "Silakan verifikasi email terlebih dahulu."
          );
        } else {
          setLoginMessage(error.message);
        }

        return;
      }

      setLoginOpen(false);
      setEmail("");
      setPassword("");
      setLoginMessage("");

      router.push("/Petualangan");
      router.refresh();

    } catch {
      setLoginMessage(
        "Terjadi kesalahan koneksi. Silakan coba kembali."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ==================================
  // PROSES REGISTER
  // ==================================

  const handleRegister = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (isLoading) return;

    setLoginMessage("");

    if (password.length < 6) {
      setLoginMessage("Password minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setLoginMessage(
        "Konfirmasi password tidak cocok."
      );
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: nama.trim(),
          },
        },
      });

      if (error) {
        setLoginMessage(error.message);
        return;
      }

      // Jika langsung mendapatkan session
      if (data.session) {
        setLoginOpen(false);
        setNama("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        router.push("/Petualangan");
        router.refresh();
        return;
      }

      // Jika membutuhkan verifikasi email
      setAuthMode("login");
      setPassword("");
      setConfirmPassword("");

      setLoginMessage(
        "Pendaftaran berhasil! Silakan cek email untuk konfirmasi akun sebelum masuk."
      );

    } catch {
      setLoginMessage(
        "Terjadi kesalahan koneksi. Silakan coba kembali."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ==================================
  // MENUTUP POP-UP
  // ==================================

  const closeAuth = () => {
    if (isLoading) return;

    setLoginOpen(false);
    setLoginMessage("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // ==================================
  // TAMPILAN NAVBAR
  // ==================================

  return (
    <>
      <div className="sn-wrap">
        <div className="sn-inner">
          <div className="sn-bar">

            {/* BRAND */}
            <Link
              href="/"
              className="sn-brand"
              aria-label="ISYARA, ke beranda"
            >
              <span className="sn-logo">🦄</span>

              <span className="sn-name">
                <strong>ISYARA</strong>
                <small>Dunia Cerita Anak</small>
              </span>
            </Link>

            {/* NAVIGASI DESKTOP */}
            <nav
              className="sn-links"
              aria-label="Navigasi utama"
            >
              {items.slice(0, 1).map((it) => (
                <Link
                  key={it.label}
                  href={it.href}
                  className={
                    isActive(it.href)
                      ? "sn-link is-active"
                      : "sn-link"
                  }
                  aria-current={
                    isActive(it.href) ? "page" : undefined
                  }
                >
                  <span aria-hidden="true">{it.icon}</span>
                  {it.label}
                </Link>
              ))}

              {/* DROPDOWN BELAJAR */}
              <div className="sn-dropdown">
                <button
                  type="button"
                  className={
                    learningActive
                      ? "sn-link is-active"
                      : "sn-link"
                  }
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
                  className={
                    isActive(it.href)
                      ? "sn-link is-active"
                      : "sn-link"
                  }
                  aria-current={
                    isActive(it.href) ? "page" : undefined
                  }
                >
                  <span aria-hidden="true">{it.icon}</span>
                  {it.label}
                </Link>
              ))}
            </nav>

            {/* ACTIONS DESKTOP */}
            <div className="sn-actions">
              <button
                type="button"
                className="sn-round"
                onClick={() => setSound((s) => !s)}
                aria-pressed={sound}
                aria-label={
                  sound ? "Matikan suara" : "Nyalakan suara"
                }
              >
                {sound ? "🔊" : "🔇"}
              </button>

              {/* PROFIL ATAU MASUK */}
              {user ? (
                <Link
                  href="/profile"
                  className="sn-login"
                >
                  👤 Profil
                </Link>
              ) : (
                <button
                  type="button"
                  className="sn-login"
                  onClick={openLogin}
                >
                  Masuk
                </button>
              )}

              {/* BURGER */}
              <button
                type="button"
                className="sn-round sn-burger"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="sn-panel"
                aria-label={
                  open ? "Tutup menu" : "Buka menu"
                }
              >
                {open ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {/* MENU MOBILE */}
          {open && (
            <nav
              id="sn-panel"
              className="sn-panel"
              aria-label="Menu utama"
            >
              {items.slice(0, 1).map((it) => (
                <Link
                  key={it.label}
                  href={it.href}
                  className="sn-tile"
                  onClick={() => setOpen(false)}
                >
                  <span className="sn-tile-icon">
                    {it.icon}
                  </span>
                  {it.label}
                </Link>
              ))}

              {/* BELAJAR MOBILE */}
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
                      onClick={() => {
                        setOpen(false);
                        setLearnOpen(false);
                      }}
                    >
                      <span className="sn-tile-icon">
                        {item.icon}
                      </span>
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
                  <span className="sn-tile-icon">
                    {it.icon}
                  </span>
                  {it.label}
                </Link>
              ))}

              {/* PROFIL ATAU MASUK MOBILE */}
              {user ? (
                <Link
                  href="/profile"
                  className="sn-tile"
                  onClick={() => setOpen(false)}
                >
                  <span className="sn-tile-icon">👤</span>
                  Profil
                </Link>
              ) : (
                <button
                  type="button"
                  className="sn-tile"
                  onClick={openLogin}
                >
                  <span className="sn-tile-icon">👤</span>
                  Masuk
                </button>
              )}
            </nav>
          )}
        </div>
      </div>

      {/* POP-UP LOGIN DAN DAFTAR */}
      {loginOpen && (
        <div
          className="login-overlay"
          onClick={closeAuth}
        >
          <section
            className="login-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-title"
            onClick={(e) => e.stopPropagation()}
          >
            {/* TOMBOL TUTUP */}
            <button
              type="button"
              className="login-close"
              onClick={closeAuth}
              disabled={isLoading}
              aria-label="Tutup pop-up"
            >
              ✕
            </button>

            {/* LOGO */}
            <div className="login-logo">🦄</div>

            {/* HEADING */}
            <div className="login-heading">
              <h2 id="login-title">
                {authMode === "login"
                  ? "Selamat Datang!"
                  : "Buat Akun ISYARA"}
              </h2>

              <p>
                {authMode === "login"
                  ? "Masuk ke akun ISYARA kamu"
                  : "Yuk, bergabung dan mulai petualanganmu!"}
              </p>
            </div>

            {/* FORM LOGIN */}
            {authMode === "login" && (
              <form
                onSubmit={handleLogin}
                className="login-form"
              >
                <label htmlFor="login-email">
                  Email
                </label>

                <input
                  id="login-email"
                  type="email"
                  placeholder="Masukkan email kamu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  disabled={isLoading}
                />

                <label htmlFor="login-password">
                  Kata Sandi
                </label>

                <div className="login-password-wrap">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                  />

                  <button
                    type="button"
                    className="login-eye"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
                    }
                    disabled={isLoading}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                {/* LUPA PASSWORD */}
                <div className="login-forgot">
                  <Link
                    href="/lupa-password"
                    onClick={() => setLoginOpen(false)}
                  >
                    Lupa kata sandi?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="login-submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Memproses..." : "Masuk"}
                </button>
              </form>
            )}

            {/* FORM DAFTAR */}
            {authMode === "register" && (
              <form
                onSubmit={handleRegister}
                className="login-form"
              >
                <label htmlFor="register-name">
                  Nama Lengkap
                </label>

                <input
                  id="register-name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  autoComplete="name"
                  required
                  disabled={isLoading}
                />

                <label htmlFor="register-email">
                  Email
                </label>

                <input
                  id="register-email"
                  type="email"
                  placeholder="Masukkan email kamu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  disabled={isLoading}
                />

                <label htmlFor="register-password">
                  Kata Sandi
                </label>

                <div className="login-password-wrap">
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    minLength={6}
                    required
                    disabled={isLoading}
                  />

                  <button
                    type="button"
                    className="login-eye"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
                    }
                    disabled={isLoading}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                <label htmlFor="register-confirm-password">
                  Konfirmasi Kata Sandi
                </label>

                <div className="login-password-wrap">
                  <input
                    id="register-confirm-password"
                    type={
                      showConfirmPassword ? "text" : "password"
                    }
                    placeholder="Ulangi kata sandi"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    autoComplete="new-password"
                    minLength={6}
                    required
                    disabled={isLoading}
                  />

                  <button
                    type="button"
                    className="login-eye"
                    onClick={() =>
                      setShowConfirmPassword((v) => !v)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
                    }
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                <button
                  type="submit"
                  className="login-submit"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Memproses..."
                    : "Daftar Sekarang"}
                </button>
              </form>
            )}

            {/* PESAN LOGIN / DAFTAR */}
            {loginMessage && (
              <p
                className="login-message"
                role="alert"
                aria-live="polite"
              >
                {loginMessage}
              </p>
            )}

            {/* PINDAH MODE */}
            <div className="login-register">
              {authMode === "login" ? (
                <>
                  Belum punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => switchAuthMode("register")}
                    disabled={isLoading}
                  >
                    Daftar sekarang
                  </button>
                </>
              ) : (
                <>
                  Sudah punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => switchAuthMode("login")}
                    disabled={isLoading}
                  >
                    Masuk di sini
                  </button>
                </>
              )}
            </div>

            {/* FOOTER */}
            <p className="login-note">
              💜 Setiap isyaratmu berharga.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
