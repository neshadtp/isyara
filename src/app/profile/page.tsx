
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import "./profile.css";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data.user) {
          router.replace("/");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error(error);
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  };

  if (loading) {
    return <div className="profile-loading">Memuat profil...</div>;
  }

  if (!user) return null;

  return (
    <main className="profile-page">
      <div className="profile-container">

        <Link href="/" className="profile-back">
          ← Kembali ke Beranda
        </Link>

        <div className="profile-card">

          <div className="profile-header">
            <div className="profile-avatar">🦄</div>
            <h1>Profil Saya</h1>
            <p>Selamat datang kembali di dunia ISYARA!</p>
          </div>

          <div className="profile-divider" />

          <div className="profile-info">
            <div className="profile-item">
              <span className="profile-icon">👤</span>
              <div>
                <small>Nama Lengkap</small>
                <p>{user.user_metadata?.full_name || "Pengguna ISYARA"}</p>
              </div>
            </div>

            <div className="profile-item">
              <span className="profile-icon">📧</span>
              <div>
                <small>Alamat Email</small>
                <p>{user.email}</p>
              </div>
            </div>

            <div className="profile-item">
              <span className="profile-icon">💜</span>
              <div>
                <small>Status Akun</small>
                <p className="profile-status">
                  {user.email_confirmed_at
                    ? "Email Terverifikasi"
                    : "Menunggu Verifikasi"}
                </p>
              </div>
            </div>
          </div>

          <button
            className="profile-logout"
            onClick={handleLogout}
          >
            Keluar dari Akun
          </button>

          <p className="profile-note">
            💜 Setiap isyaratmu berharga.
          </p>
        </div>
      </div>
    </main>
  );
}
