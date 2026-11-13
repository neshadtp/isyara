import Link from "next/link";

const features = [
  {
    icon: "🖼️",
    bg: "#d9f7ee",
    title: "Belajar Melalui Gambar Lucu",
    desc: "Visual konkret dengan garis tebal memperMudah anak memproses artikata tanpa merasa tertekan atau bingung.",
    tag: "Mudah Dipahami",
  },
  {
    icon: "🗣️",
    bg: "#e8e0ff",
    title: "Simbol AAC Suara Nyata",
    desc: "Dilengkapi audio suara ramah anak berbahasa Indonesia, sehingga pesan anak terdengar jelas oleh orang sekitar.",
    tag: "Audio Suara Jernih",
  },
  {
    icon: "😊",
    bg: "#ffe1e8",
    title: "Bermain Tanpa Tekanan",
    desc: "Tidak ada kata “salah” yang menakutkan. Setiap percobaan disambut dengan tepuk tangan dan animasi bintang YARA.",
    tag: "Hujan Hadiah Bintang",
  },
  {
    icon: "🤍",
    bg: "#fff4c2",
    title: "Apresiasi & Ekspresi Emosi",
    desc: "Membantu si kecil mengungkapkan rasa lelah, senang, lapar, atau butuh dipeluk tanpa harus menangis tantrum.",
    tag: "Ruang Aman Anak",
  },
];

const testimonials = [
  {
    initials: "BM",
    name: "Bunda Maya, S.Pd",
    role: "Guru TK Inklusi Cendekia",
    quote:
      "Anak didik kami yang sebelumnya sangat pemalu dan sulit mengekspresikan diri langsung menunjuk fitur BicaraKu di tablet. Rasa percaya dirinya melonjak drastis!",
  },
  {
    initials: "AR",
    name: "Ayah Rio & Keenan (4th)",
    role: "Orang Tua Anak Speech Delay",
    quote:
      "Dulu Keenan sering frustrasi kalau mau minum susu tapi belum bisa ngomong jelas. Sekarang dia tinggal klik simbol ‘Minum’ di ISYARA. Terima kasih banyak!",
  },
];

function Stars() {
  return <span className="stars">★★★★★</span>;
}

export default function Home() {
  return (
    <div className="page">

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-text">
          <span className="chip">✨ Hai, Teman Hebat! Selamat Datang di ISYARA! 🌈</span>
          <h1>
            Hai Teman Hebat! Yuk, <span className="c-blue">Belajar</span> &amp;{" "}
            <span className="c-green">Bermain</span> Bersama{" "}
            <span className="c-purple">ISYARA!</span>
          </h1>
          <p>
            Tempat seru untuk belajar membaca, menulis, berhitung, dan
            menyampaikan apa yang kamu rasakan lewat simbol gambar ajaib!{" "}
            <em>“Tak harus terucap untuk bisa tersampaikan.”</em>
          </p>
          <div className="hero-cta">
            <Link href="#petualangan" className="btn btn-purple">
              🚀 Mulai Petualangan Seru!
            </Link>
            <Link href="#kenali" className="btn btn-pink">
              ♡ Kenali ISYARA &amp; Cara Main
            </Link>
          </div>
          <ul className="badges">
            <li>🎓 Khusus Usia TK &amp; PAUD</li>
            <li>💜 Ramah AAC &amp; Non-Verbal</li>
            <li>⭐ Kumpulkan Bintang Cerita!</li>
          </ul>
        </div>

        <div className="hero-visual">
          <div className="speech">
            👋 “Hai! Namaku YARA! Aku siap jadi sahabat bicaramu setiap hari! ✨”
          </div>
          <div className="device">
            <div className="device-screen">
              <span className="mascot">🧸</span>
              <div className="device-caption">1.250+ Anak Cerita Bermain Hari Ini!</div>
            </div>
          </div>
          <span className="star-badge">⭐</span>
          <div className="award">🏆 Penghargaan Media Inklusi Terbaik</div>
        </div>
      </section>

      {/* ===== PETUALANGAN ===== */}
      <section className="adventure" id="petualangan">
        <span className="chip chip-lav">🎨 DUNIA PETUALANGAN ISYARA</span>
        <h2 className="center">5 Petualangan Ajaib di ISYARA</h2>
        <p className="center sub">
          Pilih salah satu dunia seru di bawah ini. Sentuh kartu untuk mulai
          bermain bersama YARA!
        </p>

        <div className="grid-top">
          {/* BicaraKu */}
          <article className="card card-lav" id="bicaraku">
            <div className="card-body">
              <span className="tag tag-purple">💬 Fitur Utama Komunikasi</span>
              <h3 className="c-purple">BicaraKu (AAC Pintar)</h3>
              <p>
                Susun kartu simbol bergambar untuk bicara apa saja: makan,
                minum, senang, sedih, dan sampaikan ceritamu dengan suara
                ramah!
              </p>
              <div className="sim">
                <span className="sim-label">SIMULASI:</span>
                <span className="pill pill-green">🙋 Aku</span>
                <span className="pill pill-pink">💗 Mau</span>
                <span className="pill pill-yellow">🎨 Bermain</span>
                <span className="pill pill-dark">🔊 Bunyikan!</span>
              </div>
              <Link href="/bicaraku" className="btn btn-purple btn-sm">
                Buka BicaraKu 💬
              </Link>
            </div>
            <div className="aac-cards" aria-hidden="true">
              <div>👧<b>MINUM</b></div>
              <div>🧒<b>BERMAIN</b></div>
            </div>
          </article>

          {/* Ayo Membaca */}
          <article className="card card-yellow" id="membaca">
            <span className="tag tag-yellow">🔤 Abjad &amp; Kata Ceria</span>
            <h3>Ayo Membaca</h3>
            <p>
              Petualangan mengenal abjad A–Z, tebak gambar lucu, dan bunyikan
              suku kata bersama YARA!
            </p>
            <div className="thumb thumb-grass">🅰️🅱️</div>
            <Link href="/membaca" className="btn btn-yellow btn-block">
              Ayo Membaca 📖
            </Link>
          </article>
        </div>

        <div className="grid-bottom">
          <article className="card card-pink" id="menulis">
            <span className="tag tag-red">🖍️ Papan Gambar Ajaib</span>
            <h3>Ayo Menulis</h3>
            <p>
              Tebalkan garis putus-putus, jiplak huruf berkilau, dan melukis
              dengan krayon digital warna-warni!
            </p>
            <div className="thumb thumb-desk">✏️</div>
            <Link href="/menulis" className="btn btn-red btn-block">
              Mulai Menulis ✏️
            </Link>
          </article>

          <article className="card card-teal" id="berhitung">
            <span className="tag tag-teal">🔢 Petualangan Angka 1–20</span>
            <h3>Ayo Berhitung</h3>
            <p>
              Hitung buah lezat, hewan lucu di pulau kura-kura, dan kumpulkan
              koin bintang yang bersinar!
            </p>
            <div className="thumb thumb-island">🍎🐢</div>
            <Link href="/berhitung" className="btn btn-teal btn-block">
              Hitung Bersama 🔢
            </Link>
          </article>

          <article className="card card-orange" id="cerita">
            <span className="tag tag-orange">📖 Buku Cerita Bergambar</span>
            <h3>Cerita Isyarat</h3>
            <p>
              Kisah seru petualangan “Aku Pergi ke Sekolah” dengan panduan
              simbol visual dan tebak adegan!
            </p>
            <div className="thumb thumb-book">📚</div>
            <Link href="/cerita" className="btn btn-orange btn-block">
              Buka Cerita 📚
            </Link>
          </article>
        </div>
      </section>

      {/* ===== MENGAPA SPESIAL ===== */}
      <section className="why" id="kenali">
        <div className="why-head">
          <div>
            <span className="eyebrow">✨ DIRANCANG BERSAMA TERAPIS WICARA</span>
            <h2>Mengapa ISYARA Begitu Spesial?</h2>
          </div>
          <p>
            Mendukung perkembangan anak dengan bahasa visual konkret, interaksi
            ramah sensorik, dan apresiasi penuh kasih.
          </p>
        </div>
        <div className="why-grid">
          {features.map((f) => (
            <article key={f.title} className="feature">
              <span className="f-icon" style={{ background: f.bg }}>
                {f.icon}
              </span>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
              <span className="f-tag">✔ {f.tag}</span>
            </article>
          ))}
        </div>
      </section>

      {/* ===== HADIAH & TESTIMONI ===== */}
      <section className="proof">
        <aside className="reward">
          <div className="reward-head">
            <span>Peti Hadiah &amp; Stiker</span>
            <span className="level">Level 1: Sahabat YARA</span>
          </div>
          <div className="chest">🎁</div>
          <div className="progress-row">
            <span>Bintang Dikumpulkan: 48 / 50</span>
            <span className="c-orange">Kurang 2 Bintang Lagi! ⭐</span>
          </div>
          <div className="bar">
            <div style={{ width: "96%" }} />
          </div>
        </aside>

        <div className="testi">
          <span className="eyebrow c-orange">CERITA BAHAGIA</span>
          <h2>Kata Bunda &amp; Guru Hebat</h2>
          {testimonials.map((t) => (
            <figure key={t.initials} className="quote">
              <div className="quote-top">
                <span className="q-avatar">{t.initials}</span>
                <div>
                  <b>{t.name}</b>
                  <small>{t.role}</small>
                </div>
                <Stars />
              </div>
              <blockquote>“{t.quote}”</blockquote>
            </figure>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta">
        <span className="cta-icon">🌈</span>
        <h2>Hore! Petualangan Belajarmu Dimulai di Sini!</h2>
        <p>
          Klik tombol kuning di bawah dan mari bermain bersama mascot YARA serta
          ribuan teman hebat lainnya di seluruh Indonesia!
        </p>
        <Link href="#petualangan" className="btn btn-gold">
          ⭐ Mulai Sekarang, Gratis! →
        </Link>
        <small>
          ✓ Tanpa Iklan Mengganggu • ✓ 100% Aman untuk Anak • ✓ Akses Lewat Web
          &amp; Tablet
        </small>
      </section>
    </div>
  );
}