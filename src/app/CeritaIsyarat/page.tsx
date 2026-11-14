"use client";

import { useState } from "react";
import "./cerita.css";

type Word = { word: string; meaning: string; context: string; videoSrc?: string; note: string };
type Scene = { title: string; story: string; question: string; choices: string[]; answer: string; image: string; words: Word[] };
type Story = { id: string; title: string; subtitle: string; scenes: Scene[] };

const STORIES: Story[] = [
  {
    id: "sekolah", title: "Aku Pergi ke Sekolah", subtitle: "Belajar menyapa, meminta bantuan, dan berterima kasih.",
    scenes: [
      { title: "Pagi yang cerah", story: "Pagi ini Dita tiba di sekolah. Ia bertemu Bu Guru dan ingin menyapanya.", question: "Apa sapaan yang tepat saat bertemu Bu Guru?", choices: ["Halo", "Selamat tidur", "Sampai besok"], answer: "Halo", image: "🌞", words: [{ word: "HALO", meaning: "Sapaan untuk memulai interaksi.", context: "Digunakan ketika bertemu guru, teman, atau orang lain.", note: "Tambahkan video BISINDO yang telah diperiksa pengajar." }] },
      { title: "Belajar bersama", story: "Bu Guru menunjukkan buku bergambar. Dita ingin meminjam buku itu untuk belajar.", question: "Apa yang ingin Dita pinjam?", choices: ["Buku", "Bola", "Payung"], answer: "Buku", image: "📚", words: [{ word: "BUKU", meaning: "Benda berisi tulisan atau gambar untuk dibaca dan dipelajari.", context: "Digunakan saat membicarakan atau meminta buku.", note: "Tambahkan rekaman BISINDO tervalidasi." }] },
      { title: "Waktu istirahat", story: "Setelah belajar, Dita merasa haus dan ingin meminta air minum.", question: "Apa yang dibutuhkan Dita?", choices: ["Air minum", "Pensil", "Sepatu"], answer: "Air minum", image: "🥤", words: [{ word: "AIR MINUM", meaning: "Minuman yang dibutuhkan ketika haus.", context: "Digunakan untuk menyampaikan kebutuhan minum.", note: "Tambahkan video BISINDO tervalidasi." }] },
      { title: "Terima kasih, Bu Guru", story: "Bu Guru memberikan air minum. Dita ingin menghargai bantuan Bu Guru.", question: "Apa ungkapan yang tepat setelah menerima bantuan?", choices: ["Terima kasih", "Selamat malam", "Tidak mau"], answer: "Terima kasih", image: "💛", words: [{ word: "TERIMA KASIH", meaning: "Ungkapan untuk menghargai bantuan orang lain.", context: "Digunakan setelah menerima bantuan atau pemberian.", note: "Tambahkan video BISINDO yang sudah divalidasi pengajar." }] }
    ]
  },
  {
    id: "teman", title: "Aku dan Teman Baru", subtitle: "Belajar berkenalan, mengajak bermain, dan berbagi.",
    scenes: [
      { title: "Berkenalan", story: "Raka bertemu teman baru bernama Nia. Raka ingin memulai perkenalan.", question: "Apa yang bisa Raka sampaikan?", choices: ["Halo", "Selamat tidur", "Jangan pergi"], answer: "Halo", image: "👋", words: [{ word: "HALO", meaning: "Sapaan untuk memulai interaksi.", context: "Digunakan ketika bertemu orang baru.", note: "Gunakan video BISINDO yang telah diperiksa pengajar." }] },
      { title: "Ayo bermain", story: "Raka melihat Nia menyusun balok. Raka ingin mengajak Nia bermain bersama.", question: "Apa ajakan yang sesuai?", choices: ["Ayo bermain", "Saya haus", "Selamat tidur"], answer: "Ayo bermain", image: "🧸", words: [{ word: "AYO BERMAIN", meaning: "Ajakan untuk melakukan kegiatan bersama.", context: "Digunakan ketika mengajak teman bermain.", note: "Lengkapi dengan video BISINDO tervalidasi." }] },
      { title: "Berbagi balok", story: "Nia belum memiliki balok biru. Raka memberikan sebagian baloknya.", question: "Sikap baik apa yang ditunjukkan Raka?", choices: ["Berbagi", "Mengejek", "Menyembunyikan"], answer: "Berbagi", image: "🧩", words: [{ word: "BERBAGI", meaning: "Memberikan kesempatan kepada orang lain untuk menggunakan sesuatu.", context: "Digunakan dalam situasi berbagi barang atau kegiatan.", note: "Tambahkan demonstrasi BISINDO dari sumber tervalidasi." }] }
    ]
  }
];

const KEY = "isyara-cerita-progress-v1";
function getCompleted(): string[] {
  if (typeof window === "undefined") return [];
  try { const data = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(data) ? data : []; }
  catch { return []; }
}

export default function CeritaIsyaratPage() {
  const [storyIndex, setStoryIndex] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [choice, setChoice] = useState("");
  const [checked, setChecked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [stars, setStars] = useState(0);
  const story = STORIES[storyIndex];
  const scene = story.scenes[sceneIndex];
  const correct = checked && choice === scene.answer;
  const percent = Math.round(((sceneIndex + 1) / story.scenes.length) * 100);

  function selectStory(index: number) {
    setStoryIndex(index); setSceneIndex(0); setChoice(""); setChecked(false); setFinished(false);
  }
  function next() {
    if (!correct) return;
    if (sceneIndex < story.scenes.length - 1) {
      setSceneIndex((v) => v + 1); setChoice(""); setChecked(false); return;
    }
    const nextCompleted = getCompleted();
    if (!nextCompleted.includes(story.id)) {
      nextCompleted.push(story.id);
      localStorage.setItem(KEY, JSON.stringify(nextCompleted));
      setStars((v) => v + 3);
    }
    setCompleted(nextCompleted); setFinished(true);
  }

  return (
    <div className="cerita-page">
      <div className="cerita-container">
        <div className="cerita-breadcrumb"><a href="/">Beranda</a><span>/</span><span>Cerita Isyarat</span></div>
        <header className="cerita-header">
          <span className="cerita-kicker">📖 DUNIA CERITA ISYARA</span>
          <h1>Cerita Isyarat</h1>
          <p>Baca kisah bergambar, kenali kosakata BISINDO, dan jawab pertanyaan sederhana bersama YARA!</p>
        </header>
        <section className="cerita-stats">
          <div><b>⭐ {stars}</b><small>Bintang sesi ini</small></div>
          <div><b>📚 {completed.length}</b><small>Cerita selesai</small></div>
          <div><b>🤟 BISINDO</b><small>Bahasa isyarat</small></div>
        </section>
        <div className="cerita-layout">
          <aside className="cerita-sidebar">
            <h2>Pilih cerita</h2>
            {STORIES.map((item, index) => (
              <button type="button" key={item.id} className={`cerita-story-option ${storyIndex === index ? "active" : ""}`} onClick={() => selectStory(index)}>
                <span className="story-icon">{index === 0 ? "🏫" : "🧸"}</span>
                <span><strong>{item.title}</strong><small>{item.subtitle}</small></span>
              </button>
            ))}
            <div className="cerita-tip"><strong>💡 Untuk pengajar</strong><p>Dampingi anak membaca gambar, memahami konteks, dan mempraktikkan isyarat berdasarkan video BISINDO yang telah divalidasi.</p></div>
          </aside>
          <section className="cerita-main">
            {finished ? (
              <div className="cerita-finished"><div>🏆</div><span className="cerita-kicker">PETUALANGAN SELESAI</span><h2>Hebat! Kamu berhasil!</h2><p>Kamu telah menyelesaikan cerita “{story.title}”. Terus belajar dan kenali kosakata baru, ya!</p><button className="cerita-btn primary" onClick={() => selectStory((storyIndex + 1) % STORIES.length)}>Pilih cerita lain</button><button className="cerita-btn secondary" onClick={() => { setSceneIndex(0); setChoice(""); setChecked(false); setFinished(false); }}>Baca ulang</button></div>
            ) : (
              <>
                <div className="cerita-progress-label"><span>Bagian {sceneIndex + 1} dari {story.scenes.length}</span><span>{percent}%</span></div>
                <div className="cerita-progress"><span style={{ width: `${percent}%` }} /></div>
                <article className="cerita-scene">
                  <div className="cerita-illustration" aria-hidden="true">{scene.image}</div>
                  <div><span className="cerita-kicker">{story.title}</span><h2>{scene.title}</h2><p>{scene.story}</p></div>
                </article>
                <section className="bisindo-panel">
                  <div className="bisindo-title"><span>🤟</span><div><span className="cerita-kicker">KENALI KOSAKATA</span><h3>Bahasa Isyarat Indonesia (BISINDO)</h3></div></div>
                  {scene.words.map((word) => <article className="bisindo-word" key={word.word}>
                    <h4>{word.word}</h4><p>{word.meaning}</p><p><strong>Konteks:</strong> {word.context}</p>
                    {word.videoSrc ? <video className="bisindo-video" controls playsInline preload="metadata"><source src={word.videoSrc} />Browser tidak mendukung video.</video> :
                      <div className="bisindo-placeholder"><span>🎥</span><strong>Video gerakan BISINDO belum tersedia</strong><small>Tambahkan video yang sudah diperiksa pengajar dan sesuai variasi BISINDO setempat.</small></div>}
                    <small className="bisindo-note">📝 {word.note}</small>
                  </article>)}
                </section>
                <section className="cerita-quiz">
                  <span className="cerita-kicker">YUK, JAWAB!</span><h3>{scene.question}</h3>
                  <div className="cerita-choices">{scene.choices.map((item) => <button type="button" key={item} disabled={checked} className={`cerita-choice ${choice === item ? "selected" : ""} ${checked && item === scene.answer ? "correct" : ""}`} onClick={() => setChoice(item)}>{item}</button>)}</div>
                  {checked && <p className={`cerita-feedback ${correct ? "good" : "retry"}`} role="status" aria-live="polite">{correct ? "✨ Benar! Kamu hebat. Mari lanjutkan!" : "Tidak apa-apa, ayo coba lagi. Perhatikan cerita dan gambar, ya."}</p>}
                  <div className="cerita-actions">
                    {!checked && <button className="cerita-btn primary" disabled={!choice} onClick={() => choice && setChecked(true)}>Periksa jawaban</button>}
                    {checked && !correct && <button className="cerita-btn secondary" onClick={() => { setChoice(""); setChecked(false); }}>Coba lagi</button>}
                    {correct && <button className="cerita-btn primary" onClick={next}>{sceneIndex === story.scenes.length - 1 ? "Selesaikan cerita" : "Lanjut cerita →"}</button>}
                  </div>
                </section>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
