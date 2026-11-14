"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Angry, ArrowRight, Bath, Book, Car, Delete, Eye, Frown, Gamepad2, GlassWater,
  Hand, Heart, House, Megaphone, MessageSquare, Meh, Moon, Music, PersonStanding,
  RotateCcw, School, Search, ShieldCheck, Smile, Snowflake, Sparkles, Stethoscope,
  ThumbsDown, ThumbsUp, Trash2, Tv, UserRound, Users, Utensils, Volume2, Zap,
  SlidersHorizontal, ScanLine, Palette, Mic,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import s from "./bicaraku.module.css";

type Tone = "teal" | "violet" | "rose" | "mint" | "indigo";
type Sym = { id: string; label: string; word: string; tag: string; icon: LucideIcon; tone: Tone };
type Picked = { uid: number; sym: Sym };

const mk = (id: string, label: string, word: string, tag: string, icon: LucideIcon, tone: Tone): Sym =>
  ({ id, label, word, tag, icon, tone });

const CATEGORIES = [
  {
    key: "kebutuhan", label: "Kebutuhan", icon: Utensils,
    items: [
      mk("saya", "Saya / Aku", "Saya", "Subjek", Smile, "teal"),
      mk("mau", "Mau / Ingin", "Mau", "Keinginan", Heart, "violet"),
      mk("makan", "Makan", "Makan", "Makanan", Utensils, "rose"),
      mk("minum", "Minum", "Minum Air", "Minuman", GlassWater, "mint"),
      mk("toilet", "Toilet", "Toilet", "Pribadi", PersonStanding, "indigo"),
      mk("tidur", "Tidur", "Tidur", "Istirahat", Moon, "teal"),
      mk("mandi", "Mandi", "Mandi", "Kebersihan", Bath, "violet"),
      mk("sakit", "Sakit", "Sakit", "Penting", Stethoscope, "rose"),
      mk("tolong", "Tolong", "Tolong", "Bantuan", Hand, "rose"),
      mk("dingin", "Dingin", "Dingin", "Sifat", Snowflake, "indigo"),
    ],
  },
  {
    key: "perasaan", label: "Perasaan", icon: Smile,
    items: [
      mk("senang", "Senang", "Senang", "Perasaan", Smile, "mint"),
      mk("sedih", "Sedih", "Sedih", "Perasaan", Frown, "indigo"),
      mk("marah", "Marah", "Marah", "Perasaan", Angry, "rose"),
      mk("sayang", "Sayang", "Sayang", "Perasaan", Heart, "violet"),
      mk("bosan", "Bosan", "Bosan", "Perasaan", Meh, "teal"),
    ],
  },
  {
    key: "aktivitas", label: "Aktivitas", icon: Gamepad2,
    items: [
      mk("main", "Main", "Main", "Kegiatan", Gamepad2, "violet"),
      mk("baca", "Baca Buku", "Baca Buku", "Kegiatan", Book, "teal"),
      mk("gambar", "Menggambar", "Menggambar", "Kegiatan", Palette, "rose"),
      mk("musik", "Musik", "Dengar Musik", "Kegiatan", Music, "indigo"),
      mk("tv", "Nonton", "Nonton TV", "Kegiatan", Tv, "mint"),
    ],
  },
  {
    key: "interaksi", label: "Interaksi", icon: Hand,
    items: [
      mk("halo", "Halo", "Halo", "Sapaan", Hand, "teal"),
      mk("ya", "Ya", "Ya", "Jawaban", ThumbsUp, "mint"),
      mk("tidak", "Tidak", "Tidak", "Jawaban", ThumbsDown, "rose"),
      mk("terimakasih", "Terima Kasih", "Terima Kasih", "Sopan", Sparkles, "violet"),
      mk("lagi", "Lagi", "Lagi", "Permintaan", RotateCcw, "indigo"),
    ],
  },
  {
    key: "tempat", label: "Tempat & Orang", icon: House,
    items: [
      mk("ke", "Ke / Pergi", "Ke", "Arah", ArrowRight, "teal"),
      mk("rumah", "Rumah", "Rumah", "Tempat", House, "mint"),
      mk("sekolah", "Sekolah", "Sekolah", "Tempat", School, "violet"),
      mk("mobil", "Mobil", "Mobil", "Tempat", Car, "indigo"),
      mk("ibu", "Ibu", "Ibu", "Orang", UserRound, "rose"),
      mk("ayah", "Ayah", "Ayah", "Orang", Users, "teal"),
    ],
  },
];

const ALL = CATEGORIES.flatMap((c) => c.items);
const byId = (id: string) => ALL.find((x) => x.id === id)!;

const QUICK = [
  { text: "Saya Mau Makan", ids: ["saya", "mau", "makan"], emoji: "🍽️" },
  { text: "Saya Mau Minum", ids: ["saya", "mau", "minum"], emoji: "🥤" },
  { text: "Mau ke Toilet", ids: ["saya", "mau", "ke", "toilet"], emoji: "🚻" },
  { text: "Terima Kasih", ids: ["terimakasih"], emoji: "❤️" },
  { text: "Tolong Bantu", ids: ["tolong"], emoji: "🆘", urgent: true },
];

export default function BicaraKuPage() {
  const [picked, setPicked] = useState<Picked[]>([
    { uid: 1, sym: byId("saya") },
    { uid: 2, sym: byId("mau") },
    { uid: 3, sym: byId("minum") },
    { uid: 4, sym: byId("dingin") },
  ]);
  const [uid, setUid] = useState(5);
  const [cat, setCat] = useState(CATEGORIES[0].key);
  const [query, setQuery] = useState("");
  const [slow, setSlow] = useState(true);
  const [volume, setVolume] = useState(100);
  const [calm, setCalm] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const sentence = picked.length ? picked.map((p) => p.sym.word).join(" ") + "." : "";

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) {
      return ALL.filter((x) =>
        [x.label, x.word, x.tag].some((t) => t.toLowerCase().includes(q))
      );
    }
    return CATEGORIES.find((c) => c.key === cat)!.items;
  }, [cat, query]);

  const speak = (text: string) => {
    if (!text || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "id-ID";
    u.rate = slow ? 0.7 : 1;
    u.pitch = calm ? 0.95 : 1.1;
    u.volume = volume / 100;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  useEffect(() => () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const add = (sym: Sym) => {
    setPicked((p) => [...p, { uid, sym }]);
    setUid((n) => n + 1);
    speak(sym.word);
  };
  const removeOne = (id: number) => setPicked((p) => p.filter((x) => x.uid !== id));
  const useQuick = (ids: string[]) => {
    const list = ids.map((id, i) => ({ uid: uid + i, sym: byId(id) }));
    setPicked(list);
    setUid((n) => n + list.length);
    speak(list.map((l) => l.sym.word).join(" "));
  };

  return (
    <main className={s.wrap} data-calm={calm}>
      {/* Judul fitur */}
      <header className={`${s.card} ${s.head}`}>
        <span className={s.headIcon}><Megaphone size={26} /></span>
        <div className={s.headText}>
          <div className={s.metaRow}>
            <span className={s.badge}>Fitur Utama</span>
            <span className={s.meta}><ShieldCheck size={14} /> AAC Visual Board</span>
          </div>
          <h1>BicaraKu — Papan Komunikasi Bergambar</h1>
        </div>
        <div className={s.voiceInfo}>
          <Megaphone size={14} />
          <span>Suara Yara: <b>Jernih &amp; Ceria</b></span>
          <button type="button" className={s.ghostBtn}><Eye size={13} /> Panduan Fokus</button>
        </div>
      </header>

      {/* Papan bicara */}
      <section className={`${s.card} ${s.board}`}>
        <div className={s.boardHead}>
          <span className={s.boardIcon}><MessageSquare size={20} /></span>
          <div>
            <h2>Papan Bicaraku yang Bersuara</h2>
            <p>Sentuh kartu di bawah, susun kata, lalu dengarkan suaramu!</p>
          </div>
          <div className={s.yara}>
            <span className={s.yaraAvatar} aria-hidden>Y</span>
            <div>
              <strong>“Keren! Tekan tombol ungu untuk bicara! 🌈”</strong>
              <small>Maskot YARA siap menemani</small>
            </div>
          </div>
        </div>

        <div className={s.compose}>
          <div className={s.composeTop}>
            <span><ScanLine size={14} /> Kalimat visual tersusun:</span>
            <span className={s.count}>{picked.length} Simbol Dipilih</span>
          </div>

          <ul className={s.chips} aria-label="Kata yang dipilih">
            {picked.length === 0 && <li className={s.empty}>Belum ada kata. Pilih kartu di bawah untuk mulai.</li>}
            {picked.map((p, i) => (
              <li key={p.uid} className={s.chipWrap}>
                <span className={s.chip}>
                  <span className={s.chipIcon}><MessageSquare size={14} /></span>
                  {p.sym.word}
                  <button type="button" aria-label={`Hapus ${p.sym.word}`} onClick={() => removeOne(p.uid)}>×</button>
                </span>
                {i < picked.length - 1 && <ArrowRight size={13} className={s.arrow} />}
              </li>
            ))}
          </ul>

          <div className={s.sentence} aria-live="polite">
            <Mic size={18} />
            <p>{sentence ? `“${sentence}”` : "Kalimatmu akan muncul di sini."}</p>
            <span className={`${s.wave} ${speaking ? s.waveOn : ""}`} aria-hidden>
              <i /><i /><i /><i /><i />
            </span>
          </div>
        </div>

        <div className={s.actions}>
          <button type="button" className={`${s.act} ${s.play}`} onClick={() => speak(sentence)} disabled={!picked.length}>
            <Volume2 size={18} /> PUTAR SUARA
          </button>
          <button type="button" className={`${s.act} ${s.again}`} onClick={() => speak(sentence)} disabled={!picked.length}>
            <RotateCcw size={17} /> Ulangi
          </button>
          <button type="button" className={`${s.act} ${s.undo}`} onClick={() => setPicked((p) => p.slice(0, -1))} disabled={!picked.length}>
            <Delete size={17} /> Hapus 1
          </button>
          <button type="button" className={`${s.act} ${s.clear}`} onClick={() => { setPicked([]); window.speechSynthesis?.cancel(); setSpeaking(false); }} disabled={!picked.length}>
            <Trash2 size={17} /> Bersihkan
          </button>
        </div>
      </section>

      {/* Pencarian & kalimat cepat */}
      <div className={s.searchRow}>
        <label className={s.search}>
          <Search size={17} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari simbol cepat (misal: susu, lapar, ti"
            aria-label="Cari simbol"
          />
        </label>
        <div className={s.quick}>
          <span className={s.quickLabel}><Zap size={13} /> Cepat:</span>
          {QUICK.map((q) => (
            <button key={q.text} type="button" className={`${s.quickBtn} ${q.urgent ? s.urgent : ""}`} onClick={() => useQuick(q.ids)}>
              <span aria-hidden>{q.emoji}</span> {q.text}
            </button>
          ))}
        </div>
      </div>

      {/* Tab kategori */}
      <nav className={s.tabs} aria-label="Kategori simbol">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const active = !query && cat === c.key;
          return (
            <button key={c.key} type="button" aria-pressed={active}
              className={`${s.tab} ${active ? s.tabOn : ""}`}
              onClick={() => { setCat(c.key); setQuery(""); }}>
              <Icon size={18} /> <span>{c.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Kartu simbol */}
      <section className={s.grid} aria-label="Kartu simbol">
        {visible.length === 0 && <p className={s.noResult}>Simbol “{query}” belum ada. Coba kata lain, misalnya “makan” atau “tidur”.</p>}
        {visible.map((x) => {
          const Icon = x.icon;
          return (
            <button key={x.id} type="button" className={`${s.sym} ${s[x.tone]}`} onClick={() => add(x)}>
              <span className={s.tag}>{x.tag}</span>
              <span className={s.symIcon}><Icon size={34} strokeWidth={1.8} /></span>
              <span className={s.symLabel}>{x.label}</span>
            </button>
          );
        })}
      </section>

      {/* Pengaturan */}
      <section className={`${s.card} ${s.settings}`}>
        <span className={s.boardIcon}><SlidersHorizontal size={20} /></span>
        <div className={s.settingsText}>
          <h3>Pengaturan Suara &amp; Kenyamanan Anak</h3>
          <p>Disesuaikan untuk terapi wicara, autisme, down syndrome &amp; toddler ramah sensorik.</p>
        </div>
        <div className={s.controls}>
          <div className={s.group}>
            <span>Tempo:</span>
            <button type="button" aria-pressed={slow} className={slow ? s.on : ""} onClick={() => setSlow(true)}>Pelan &amp; Jelas</button>
            <button type="button" aria-pressed={!slow} className={!slow ? s.on : ""} onClick={() => setSlow(false)}>Normal</button>
          </div>
          <label className={s.group}>
            <span>Volume:</span>
            <input type="range" min={20} max={100} step={10} value={volume} onChange={(e) => setVolume(Number(e.target.value))} aria-label="Volume suara" />
            <b>{volume}%</b>
          </label>
          <button type="button" aria-pressed={calm} className={`${s.calm} ${calm ? s.calmOn : ""}`} onClick={() => setCalm((v) => !v)}>
            <Sparkles size={14} /> Mode Ramah Sensorik
          </button>
        </div>
      </section>
    </main>
  );
}
