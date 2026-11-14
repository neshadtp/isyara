"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, Check, CircleHelp, Heart, LayoutGrid, ListChecks, Lock,
  Megaphone, Music, PartyPopper, Play, Puzzle, RotateCcw, Sparkles, Star, Volume2,
  BookOpen, Mic, Repeat, X, Square,
} from "lucide-react";
import s from "./membaca.module.css";

/* Gambar kata memakai emoji sementara. Nanti ganti dengan <Image src="/images/apel.png" /> */
const WORDS = [
  ["Apel", "🍎"], ["Bebek", "🦆"], ["Ceri", "🍒"], ["Domba", "🐑"], ["Elang", "🦅"],
  ["Foto", "📷"], ["Gajah", "🐘"], ["Harimau", "🐯"], ["Ikan", "🐟"], ["Jeruk", "🍊"],
  ["Kelinci", "🐇"], ["Lemon", "🍋"], ["Mangga", "🥭"], ["Nanas", "🍍"], ["Onta", "🐫"],
  ["Panda", "🐼"], ["Quran", "📖"], ["Rusa", "🦌"], ["Sapi", "🐄"], ["Tupai", "🐿️"],
  ["Udang", "🦐"], ["Vas", "🏺"], ["Wortel", "🥕"], ["Xilofon", "🎵"], ["Yoyo", "🪀"], ["Zebra", "🦓"],
].map(([word, emoji]) => ({ word, emoji, letter: word[0] }));

const VOWELS = ["A", "I", "U", "E", "O"];
const byLetter = (l: string) => WORDS.find((w) => w.letter === l)!;

/* 10 soal pertama: huruf A sampai J */
const QUESTIONS = WORDS.slice(0, 10).map((w, i) => ({
  ...w,
  options: [w.letter, ...[1, 3, 5].map((k) => WORDS[(i + k) % 10].letter)].sort(),
}));

/* Level 1: huruf vokal */
const VOWEL_QS = ["Apel", "Ikan", "Udang", "Elang", "Onta"].map((word) => {
  const w = WORDS.find((x) => x.word === word)!;
  return { ...w, options: [w.letter, ...VOWELS.filter((v) => v !== w.letter).slice(0, 3)].sort() };
});

const TABS = [
  { label: "Tebak Huruf Ajaib", icon: Sparkles },
  { label: "Cocokkan Gambar & Kata", icon: Puzzle },
  { label: "Susun Balok Kata", icon: LayoutGrid },
  { label: "Lagu Fonik Visual", icon: Music },
];

const TONES = ["teal", "violet", "rose", "indigo"] as const;

/* Cocokkan Gambar & Kata: huruf K sampai T */
const MATCH = WORDS.slice(10, 20);
/* Susun Balok Kata */
const SUSUN = ["Apel", "Ikan", "Sapi", "Ceri", "Onta", "Panda", "Bebek", "Zebra"].map(
  (w) => WORDS.find((x) => x.word === w)!
);
const scramble = (w: string) => {
  const a = w.toUpperCase().split("").reverse();
  a.push(a.shift()!);
  return a;
};
/* Level 3: Susun Kalimat */
const KAL = [
  { words: ["Saya", "makan", "apel"], emoji: "🍎" },
  { words: ["Kucing", "minum", "susu"], emoji: "🐱" },
  { words: ["Ibu", "masak", "wortel"], emoji: "🥕" },
  { words: ["Ayah", "naik", "mobil"], emoji: "🚗" },
  { words: ["Saya", "suka", "jeruk"], emoji: "🍊" },
];
const scrambleW = (a: string[]) => {
  const r = [...a].reverse();
  r.push(r.shift()!);
  return r;
};
const GUIDE = [
  "Lihat gambar dan dengarkan bunyinya dengan tombol suara.",
  "Ketuk balok jawaban yang paling cocok.",
  "Jawaban benar mendapat 10 poin. Jawaban salah mengurangi satu hati.",
  "Kumpulkan 300 poin untuk membuka Level 3.",
  "Coba empat permainan: Tebak Huruf, Cocokkan, Susun Balok, dan Lagu Fonik.",
];

export default function MembacaPage() {
  const [tab, setTab] = useState(0);
  const [qi, setQi] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string[]>([]);
  const [points, setPoints] = useState(250);
  const [hearts, setHearts] = useState(3);
  const [filter, setFilter] = useState<"semua" | "vokal" | "konsonan">("semua");
  const [msg, setMsg] = useState("");
  const [guide, setGuide] = useState(false);
  const [mi, setMi] = useState(0);
  const [mPick, setMPick] = useState<string | null>(null);
  const [mWrong, setMWrong] = useState<string[]>([]);
  const [si, setSi] = useState(0);
  const [placed, setPlaced] = useState<number[]>([]);
  const [song, setSong] = useState(-1);
  const stopRef = useRef(false);
  const [level, setLevel] = useState<1 | 2 | 3>(2);
  const [lvMsg, setLvMsg] = useState("");
  const [ki, setKi] = useState(0);
  const [kPlaced, setKPlaced] = useState<number[]>([]);

  const questions = level === 1 ? VOWEL_QS : QUESTIONS;
  const q = questions[qi % questions.length];
  const solved = chosen === q.letter;

  const speak = (text: string, slow = true) => {
    stopRef.current = true;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "id-ID";
    u.rate = slow ? 0.65 : 0.9;
    window.speechSynthesis.speak(u);
  };

  useEffect(() => () => {
    stopRef.current = true;
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const spell = () => speak(q.word.toUpperCase().split("").join(", ") + ". " + q.word);

  const pick = (l: string) => {
    if (solved || hearts === 0) return;
    if (l === q.letter) {
      setChosen(l);
      setPoints((p) => p + 10);
      setMsg(`Hebat! ${q.letter} untuk ${q.word}!`);
      speak(`Benar! ${q.word}`);
    } else {
      setWrong((w) => [...w, l]);
      setHearts((h) => Math.max(0, h - 1));
      setMsg("Hampir benar! Coba dengarkan bunyinya lagi.");
      speak("Coba lagi ya");
    }
  };

  const go = (d: number) => {
    setQi((i) => (i + d + questions.length) % questions.length);
    setChosen(null); setWrong([]); setMsg("");
  };
  const retry = () => { setChosen(null); setWrong([]); setMsg(""); if (hearts === 0) setHearts(3); };

  const wall = WORDS.filter((w) =>
    filter === "semua" ? true : filter === "vokal" ? VOWELS.includes(w.letter) : !VOWELS.includes(w.letter)
  );

  useEffect(() => {
    if (!guide) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setGuide(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [guide]);

  useEffect(() => {
    if (points >= 300 && points < 310) setLvMsg("Selamat! Level 3 sudah terbuka. Klik kotak Level 3!");
  }, [points]);

  /* ---------- Lagu Fonik ---------- */
  const playSong = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    stopRef.current = false;
    const run = (i: number) => {
      if (stopRef.current || i >= WORDS.length) { setSong(-1); return; }
      setSong(i);
      const w = WORDS[i];
      const u = new SpeechSynthesisUtterance(`${w.letter}. ${w.letter} untuk ${w.word}`);
      u.lang = "id-ID";
      u.rate = 0.7;
      u.onend = () => run(i + 1);
      u.onerror = () => { if (!stopRef.current) run(i + 1); };
      window.speechSynthesis.speak(u);
    };
    run(0);
  };
  const stopSong = () => {
    stopRef.current = true;
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setSong(-1);
  };
  const changeTab = (i: number) => { stopSong(); setQi(0); setChosen(null); setWrong([]); setMsg(""); setLvMsg(""); setLevel(2); setTab(i); };
  const openLevel = (n: 1 | 2 | 3) => {
    if (n === 3 && points < 300) { setLvMsg(`Kumpulkan ${300 - points} poin lagi untuk membuka Level 3!`); return; }
    stopSong(); setMsg(""); setQi(0); setChosen(null); setWrong([]); if (n === 1) setTab(0);
    setLvMsg(n === 3 ? "Selamat! Level 3 terbuka. Ayo susun kalimat!" : n === 1 ? "Level 1: kenali huruf vokal A, I, U, E, O!" : "");
    setLevel(n);
  };

  /* ---------- Cocokkan ---------- */
  const mq = MATCH[mi];
  const mOk = mPick === mq.word;
  const mOptions = [mq.word, ...[1, 3, 6].map((k) => MATCH[(mi + k) % MATCH.length].word)].sort();
  const pickMatch = (w: string) => {
    if (mOk || hearts === 0) return;
    if (w === mq.word) {
      setMPick(w); setPoints((p) => p + 10);
      setMsg(`Hebat! Itu ${mq.word}!`); speak(`Benar! ${mq.word}`);
    } else {
      setMWrong((x) => [...x, w]); setHearts((h) => Math.max(0, h - 1));
      setMsg("Hampir benar! Lihat gambarnya lagi."); speak("Coba lagi ya");
    }
  };
  const goMatch = (d: number) => { setMi((i) => (i + d + MATCH.length) % MATCH.length); setMPick(null); setMWrong([]); setMsg(""); };
  const retryMatch = () => { setMPick(null); setMWrong([]); setMsg(""); if (hearts === 0) setHearts(3); };

  /* ---------- Susun Balok ---------- */
  const sw = SUSUN[si];
  const tiles = scramble(sw.word);
  const target = sw.word.toUpperCase();
  const sDone = placed.length === tiles.length && placed.map((k) => tiles[k]).join("") === target;
  const tapTile = (i: number) => {
    if (sDone || placed.includes(i)) return;
    const next = [...placed, i];
    setPlaced(next);
    if (next.length < tiles.length) { setMsg(""); return; }
    if (next.map((k) => tiles[k]).join("") === target) {
      setPoints((p) => p + 10); setMsg(`Hebat! Kamu menyusun ${sw.word}!`); speak(`Benar! ${sw.word}`);
    } else {
      setMsg("Belum tepat. Ketuk kotak untuk melepas huruf, lalu susun lagi!");
    }
  };
  const removeSlot = (k: number) => { if (sDone) return; setPlaced((p) => p.filter((_, j) => j !== k)); setMsg(""); };
  const goSusun = (d: number) => { setSi((i) => (i + d + SUSUN.length) % SUSUN.length); setPlaced([]); setMsg(""); };

  const nav = (retry: () => void, go: (d: number) => void) => (
    <div className={s.footer}>
      <button type="button" className={s.retry} onClick={retry}><RotateCcw size={14} /> Coba Lagi</button>
      <div className={s.navBtns}>
        <button type="button" className={s.prev} onClick={() => go(-1)}><ArrowLeft size={14} /> Sebelumnya</button>
        <button type="button" className={s.next} onClick={() => go(1)}>Selanjutnya <ArrowRight size={14} /></button>
      </div>
    </div>
  );

  const matchUI = (
    <section className={`${s.card} ${s.quiz}`}>
      <div className={s.quizTop}>
        <span className={s.challenge}><Puzzle size={16} /> Tantangan: Cocokkan Gambar &amp; Kata</span>
        <span className={s.progress}><ListChecks size={14} /> Soal {mi + 1} dari {MATCH.length}</span>
      </div>
      <div className={s.stage}>
        <div className={s.picture}>
          <div className={s.pictureCircle}><span>{mq.emoji}</span></div>
          <button type="button" className={s.sound} onClick={() => speak(mq.word, false)}><Volume2 size={15} /> Dengar kata</button>
        </div>
        <div className={s.fill}>
          <h2>Gambar apakah ini?</h2>
          <p>Pilih kata yang cocok dengan gambar di samping!</p>
          {msg && <p className={`${s.msg} ${mOk ? s.msgOk : ""}`} aria-live="polite">{msg}</p>}
        </div>
      </div>
      <div className={s.answers}>
        <div className={s.answersTop}><h3>Pilih Kata yang Cocok:</h3><span><ArrowRight size={13} /> Ketuk balok</span></div>
        <div className={s.blocks}>
          {mOptions.map((w, i) => (
            <button key={w} type="button" disabled={mOk || mWrong.includes(w) || hearts === 0}
              className={`${s.block} ${s.wb} ${s[TONES[i % 4]]} ${mOk && w === mq.word ? s.blockOk : ""}`}
              onClick={() => pickMatch(w)}>
              <small>Balok {i + 1}</small><strong>{w}</strong>
            </button>
          ))}
        </div>
      </div>
      {nav(retryMatch, goMatch)}
    </section>
  );

  const susunUI = (
    <section className={`${s.card} ${s.quiz}`}>
      <div className={s.quizTop}>
        <span className={s.challenge}><LayoutGrid size={16} /> Tantangan: Susun Balok Kata</span>
        <span className={s.progress}><ListChecks size={14} /> Soal {si + 1} dari {SUSUN.length}</span>
      </div>
      <div className={s.stage}>
        <div className={s.picture}>
          <div className={s.pictureCircle}><span>{sw.emoji}</span></div>
          <button type="button" className={s.sound} onClick={() => speak(sw.word, false)}><Volume2 size={15} /> Dengar kata</button>
        </div>
        <div className={s.fill}>
          <h2>Susun Hurufnya!</h2>
          <p>Ketuk balok huruf sesuai urutan untuk membentuk nama gambar.</p>
          <div className={s.slots}>
            {tiles.map((_, k) => (
              <button key={k} type="button" disabled={sDone} onClick={() => placed[k] !== undefined && removeSlot(k)}
                className={`${s.slot} ${s.slotBtn} ${placed[k] === undefined ? s.slotEmpty : sDone ? s.slotOk : s.slotFill}`}>
                {placed[k] === undefined ? "?" : tiles[placed[k]]}
              </button>
            ))}
          </div>
          {msg && <p className={`${s.msg} ${sDone ? s.msgOk : ""}`} aria-live="polite">{msg}</p>}
        </div>
      </div>
      <div className={s.answers}>
        <div className={s.answersTop}><h3>Pilih Balok Huruf:</h3><span><ArrowRight size={13} /> Ketuk balok</span></div>
        <div className={s.tiles}>
          {tiles.map((l, i) => (
            <button key={i} type="button" disabled={placed.includes(i) || sDone}
              className={`${s.block} ${s.tile} ${s[TONES[i % 4]]}`} onClick={() => tapTile(i)}>
              <strong>{l}</strong>
            </button>
          ))}
        </div>
      </div>
      {nav(() => { setPlaced([]); setMsg(""); }, goSusun)}
    </section>
  );

  /* ---------- Level 3: Susun Kalimat ---------- */
  const kq = KAL[ki];
  const kTiles = scrambleW(kq.words);
  const kTarget = kq.words.join(" ");
  const kDone = kPlaced.length === kTiles.length && kPlaced.map((k) => kTiles[k]).join(" ") === kTarget;
  const tapWord = (i: number) => {
    if (kDone || kPlaced.includes(i)) return;
    const next = [...kPlaced, i];
    setKPlaced(next);
    if (next.length < kTiles.length) { setMsg(""); return; }
    if (next.map((k) => kTiles[k]).join(" ") === kTarget) {
      setPoints((p) => p + 10); setMsg(`Hebat! “${kTarget}.”`); speak(kTarget, false);
    } else {
      setMsg("Belum tepat. Ketuk kotak untuk melepas kata, lalu susun lagi!");
    }
  };
  const removeWord = (k: number) => { if (kDone) return; setKPlaced((p) => p.filter((_, j) => j !== k)); setMsg(""); };
  const goKal = (d: number) => { setKi((i) => (i + d + KAL.length) % KAL.length); setKPlaced([]); setMsg(""); };

  const kalUI = (
    <section className={`${s.card} ${s.quiz}`}>
      <div className={s.quizTop}>
        <span className={s.challenge}><Sparkles size={16} /> Level 3: Susun Kalimat</span>
        <span className={s.progress}><ListChecks size={14} /> Soal {ki + 1} dari {KAL.length}</span>
      </div>
      <div className={s.stage}>
        <div className={s.picture}>
          <div className={s.pictureCircle}><span>{kq.emoji}</span></div>
          <button type="button" className={s.sound} onClick={() => speak(kTarget, false)}><Volume2 size={15} /> Dengar kalimat</button>
        </div>
        <div className={s.fill}>
          <h2>Susun Kalimatnya!</h2>
          <p>Ketuk balok kata sesuai urutan untuk membentuk kalimat dari gambar.</p>
          <div className={s.slots}>
            {kTiles.map((_, k) => (
              <button key={k} type="button" disabled={kDone} onClick={() => kPlaced[k] !== undefined && removeWord(k)}
                className={`${s.slot} ${s.slotBtn} ${s.slotWord} ${kPlaced[k] === undefined ? s.slotEmpty : kDone ? s.slotOk : s.slotFill}`}>
                {kPlaced[k] === undefined ? "?" : kTiles[kPlaced[k]]}
              </button>
            ))}
          </div>
          {msg && <p className={`${s.msg} ${kDone ? s.msgOk : ""}`} aria-live="polite">{msg}</p>}
        </div>
      </div>
      <div className={s.answers}>
        <div className={s.answersTop}><h3>Pilih Balok Kata:</h3><span><ArrowRight size={13} /> Ketuk balok</span></div>
        <div className={s.tiles}>
          {kTiles.map((w, i) => (
            <button key={i} type="button" disabled={kPlaced.includes(i) || kDone}
              className={`${s.block} ${s.tile} ${s.tileW} ${s[TONES[i % 4]]}`} onClick={() => tapWord(i)}>
              <strong>{w}</strong>
            </button>
          ))}
        </div>
      </div>
      {nav(() => { setKPlaced([]); setMsg(""); }, goKal)}
    </section>
  );

  const cur = song >= 0 ? WORDS[song] : WORDS[0];
  const songUI = (
    <section className={`${s.card} ${s.quiz}`}>
      <div className={s.quizTop}>
        <span className={s.challenge}><Music size={16} /> Lagu Fonik Visual</span>
        <span className={s.progress}><ListChecks size={14} /> {song >= 0 ? `Huruf ${song + 1} dari ${WORDS.length}` : "Siap dinyanyikan"}</span>
      </div>
      <div className={s.stage}>
        <div className={s.picture}>
          <div className={s.pictureCircle}><span>{cur.emoji}</span></div>
          <strong className={s.bigLetter}>{cur.letter} untuk {cur.word}</strong>
        </div>
        <div className={s.fill}>
          <h2>Nyanyikan Alfabet Bersama YARA!</h2>
          <p>Tekan putar, lalu ikuti bunyi huruf A sampai Z sambil melihat teman katanya.</p>
          <button type="button" className={`${s.next} ${s.songBtn}`} onClick={song >= 0 ? stopSong : playSong}>
            {song >= 0 ? <><Square size={15} /> Berhenti</> : <><Play size={15} /> Putar Lagu</>}
          </button>
        </div>
      </div>
      <div className={`${s.letters} ${s.songLetters}`}>
        {WORDS.map((w, i) => (
          <button key={w.letter} type="button" className={`${s.letter} ${s[TONES[i % 4]]} ${song === i ? s.letterOn : ""}`}
            onClick={() => { speak(`${w.letter}. ${w.word}`); setSong(-1); }}>
            <strong>{w.letter}</strong>
          </button>
        ))}
      </div>
    </section>
  );

  return (
    <main className={s.wrap}>
      {/* Header */}
      <header className={`${s.card} ${s.head}`}>
        <div className={s.headMain}>
          <div className={s.metaRow}>
            <span className={s.badge}><BookOpen size={13} /> Ayo Membaca</span>
            <span className={s.meta}><Sparkles size={13} /> Negeri Huruf &amp; Kata Ceria</span>
          </div>
          <h1>Petualangan Menjelajah Alfabet &amp; Mengenal Kata Lucu!</h1>
        </div>
        <div className={s.stats}>
          <span className={s.pill}><Star size={16} /> {points} Poin</span>
          <span className={s.pill} aria-label={`${hearts} hati`}>
            {[0, 1, 2].map((i) => (
              <Heart key={i} size={16} className={i < hearts ? s.heartOn : s.heartOff} />
            ))}
            {hearts} Hati
          </span>
          <button type="button" className={s.guide} onClick={() => setGuide(true)}><Megaphone size={15} /> Panduan Main</button>
        </div>

        <div className={s.levels}>
          <button type="button" className={`${s.level} ${level === 1 ? s.active : s.done}`} onClick={() => openLevel(1)}>
            <span className={`${s.lvIcon} ${level === 1 ? s.lvPlay : ""}`}>{level === 1 ? <Play size={16} /> : <Check size={18} />}</span>
            <div><b>Level 1: Vokal A-I-U-E-O</b><small>★★★ Selesai! Ketuk untuk mengulang</small></div>
            {level === 1 && <span className={s.now}>Aktif</span>}
          </button>
          <button type="button" className={`${s.level} ${level === 2 ? s.active : s.idle}`} onClick={() => openLevel(2)}>
            <span className={`${s.lvIcon} ${level === 2 ? s.lvPlay : ""}`}><Play size={16} /></span>
            <div><b>Level 2: Huruf A–Z Lengkap</b><small>Tebak Kata Hewan &amp; Buah</small></div>
            {level === 2 && <span className={s.now}>Aktif</span>}
          </button>
          <button type="button" className={`${s.level} ${level === 3 ? s.active : points >= 300 ? s.idle : s.locked}`} onClick={() => openLevel(3)} aria-disabled={points < 300}>
            <span className={`${s.lvIcon} ${points >= 300 ? s.lvPlay : ""}`}>{points >= 300 ? <Play size={16} /> : <Lock size={16} />}</span>
            <div><b>Level 3: Kalimat Pertama</b><small>{points >= 300 ? "Susun Kalimat Sederhana" : "Buka setelah 300 Poin"}</small></div>
            {level === 3 && <span className={s.now}>Aktif</span>}
          </button>
          {lvMsg && <p className={s.lvMsg} aria-live="polite">{lvMsg}</p>}
        </div>
      </header>

      {/* Tab permainan */}
      <nav className={s.tabs} aria-label="Jenis permainan">
        {TABS.map((t, i) => {
          const Icon = t.icon;
          return (
            <button key={t.label} type="button" aria-pressed={level !== 3 && tab === i}
              className={`${s.tab} ${level !== 3 && tab === i ? s.tabOn : ""}`} onClick={() => changeTab(i)}>
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </nav>

      {level === 3 ? kalUI : tab !== 0 ? (
        <>{tab === 1 ? matchUI : tab === 2 ? susunUI : songUI}</>
      ) : (
        <div className={s.play}>
          {/* Kolom kiri */}
          <aside className={s.side}>
            <div className={`${s.card} ${s.mascot}`}>
              <PartyPopper size={22} className={s.party} />
              <div className={s.mascotImg} aria-hidden>Y</div>
              <span className={s.mascotTag}><Mic size={13} /> Mascot YARA</span>
              <p className={s.quote}>“Ayo tebak huruf awal buah merah manis ini! Kamu pasti bisa!”</p>
              <button type="button" className={s.cheer} onClick={() => speak("Semangat! Kamu pasti bisa!", false)}>
                <Sparkles size={14} /> Semangat Aku!
              </button>
            </div>
            <div className={`${s.card} ${s.help}`}>
              <h3><Volume2 size={16} /> Bantuan Suara (AAC)</h3>
              <p>Sentuh tombol untuk mendengar pelafalan lambat huruf dan bibir bersuara.</p>
              <div className={s.helpBtns}>
                <button type="button" onClick={spell}><Play size={16} /> Fonik Lambat</button>
                <button type="button" onClick={() => speak(q.word, false)}><Repeat size={16} /> Ulang Kata</button>
              </div>
            </div>
          </aside>

          {/* Kartu tantangan */}
          <section className={`${s.card} ${s.quiz}`}>
            <div className={s.quizTop}>
              <span className={s.challenge}><CircleHelp size={16} /> Tantangan: Huruf Pertama</span>
              <span className={s.progress}><ListChecks size={14} /> Soal {(qi % questions.length) + 1} dari {questions.length}</span>
            </div>

            <div className={s.stage}>
              <div className={s.picture}>
                <div className={s.pictureCircle}><span>{q.emoji}</span></div>
                <button type="button" className={s.sound} onClick={spell}>
                  <Volume2 size={15} /> Bunyi: “{q.word.toUpperCase().split("").join("-")}”
                </button>
              </div>
              <div className={s.fill}>
                <h2>Lengkapi Kata di Bawah:</h2>
                <p>Pilihlah balok huruf ajaib yang cocok untuk mengisi kotak kosong!</p>
                <div className={s.slots} aria-live="polite">
                  {q.word.toUpperCase().split("").map((ch, i) => (
                    <span key={i} className={`${s.slot} ${i === 0 ? (solved ? s.slotOk : s.slotEmpty) : ""}`}>
                      {i === 0 && !solved ? "?" : ch}
                    </span>
                  ))}
                </div>
                {msg && <p className={`${s.msg} ${solved ? s.msgOk : ""}`}>{msg}</p>}
              </div>
            </div>

            <div className={s.answers}>
              <div className={s.answersTop}>
                <h3>Pilih Balok Jawaban:</h3>
                <span><ArrowRight size={13} /> Ketuk balok</span>
              </div>
              <div className={s.blocks}>
                {q.options.map((l, i) => {
                  const w = byLetter(l);
                  const isWrong = wrong.includes(l);
                  return (
                    <button key={l} type="button" disabled={solved || isWrong || hearts === 0}
                      className={`${s.block} ${s[TONES[i % 4]]} ${solved && l === q.letter ? s.blockOk : ""}`}
                      onClick={() => pick(l)}>
                      <small>Balok {i + 1}</small>
                      <strong>{l}</strong>
                      <span>{l}-{w.word.slice(1).toLowerCase()} {w.emoji}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={s.footer}>
              <button type="button" className={s.retry} onClick={retry}><RotateCcw size={14} /> Coba Lagi</button>
              <div className={s.navBtns}>
                <button type="button" className={s.prev} onClick={() => go(-1)}><ArrowLeft size={14} /> Kata Sebelumnya</button>
                <button type="button" className={s.next} onClick={() => go(1)}>Kata Selanjutnya <ArrowRight size={14} /></button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Dinding alfabet */}
      <section className={`${s.card} ${s.wall}`}>
        <span className={s.eyebrow}>Papan Eksplorasi Interaktif</span>
        <div className={s.wallHead}>
          <div>
            <h2>Dinding Alfabet A–Z &amp; Teman Kata</h2>
            <p>Tekan salah satu huruf untuk mendengar bunyinya dan melihat kartun teman kata lucunya!</p>
          </div>
          <div className={s.filters}>
            {([["semua", `Semua (${WORDS.length})`], ["vokal", "Huruf Vokal"], ["konsonan", "Konsonan"]] as const).map(([k, label]) => (
              <button key={k} type="button" aria-pressed={filter === k}
                className={filter === k ? s.filterOn : ""} onClick={() => setFilter(k)}>{label}</button>
            ))}
          </div>
        </div>
        <div className={s.letters}>
          {wall.map((w) => {
            const idx = WORDS.indexOf(w);
            return (
              <button key={w.letter} type="button" className={`${s.letter} ${s[TONES[idx % 4]]}`}
                onClick={() => speak(`${w.letter}. ${w.word}`)}>
                <span className={s.lnum}><Volume2 size={11} /> {String(idx + 1).padStart(2, "0")}</span>
                <strong>{w.letter}</strong>
                <span className={s.lword}>{w.word} {w.emoji}</span>
              </button>
            );
          })}
        </div>
      </section>

      {guide && (
        <div className={s.overlay} onClick={() => setGuide(false)}>
          <div className={s.modal} role="dialog" aria-modal="true" aria-label="Panduan main" onClick={(e) => e.stopPropagation()}>
            <button type="button" className={s.close} aria-label="Tutup" onClick={() => setGuide(false)}><X size={18} /></button>
            <h2><Megaphone size={20} /> Panduan Main</h2>
            <ol>{GUIDE.map((g) => <li key={g}>{g}</li>)}</ol>
            <button type="button" className={s.next} onClick={() => setGuide(false)}>Mengerti, ayo main!</button>
          </div>
        </div>
      )}
    </main>
  );
}
