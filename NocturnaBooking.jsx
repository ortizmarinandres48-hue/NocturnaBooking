import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Play, Pause, MapPin, Star, Zap, CheckCircle2, Music2, Users, ShieldCheck,
  X, Radio, Headphones, Clock, DollarSign, Volume2, BadgeCheck, Waves,
  Building2, ListChecks, ArrowRight, Sparkles, Lock, Repeat, CalendarDays,
  Percent, Award, Instagram, Youtube, Download, FileText, Megaphone,
  AlertTriangle, Wallet, TrendingUp, PiggyBank, ExternalLink,
  Fingerprint, Globe, ShieldAlert, FileSignature, Store, Crown, RefreshCw,
  Ban, Plus, Check, XCircle, Rocket, Infinity as InfinityIcon, CalendarClock,
  Info, Unlock,
} from "lucide-react";

/* ============================================================
   TOKENS
   Fondo: zinc-950/slate-900 · Acentos: violeta #8B5CF6, esmeralda #10B981, cian #06B6D4
   Display: Space Grotesk · Body: Inter · Data/mono: JetBrains Mono
   ============================================================ */

const FONT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
  .font-display { font-family: 'Space Grotesk', sans-serif; }
  .font-body { font-family: 'Inter', sans-serif; }
  .font-mono { font-family: 'JetBrains Mono', monospace; }
  @keyframes pulseBar { 0%,100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }
  @keyframes toastIn { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes sosPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.45); } 50% { box-shadow: 0 0 0 8px rgba(239,68,68,0); } }
  @keyframes stepGlow { 0%,100% { box-shadow: 0 0 0 0 rgba(139,92,246,0.5); } 50% { box-shadow: 0 0 0 6px rgba(139,92,246,0); } }
  .animate-toast-in { animation: toastIn 0.25s ease-out; }
  .animate-sos { animation: sosPulse 1.8s ease-in-out infinite; }
  .animate-step-glow { animation: stepGlow 1.8s ease-in-out infinite; }
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 999px; }
`;

/* ============================================================
   MOCK DATA
   ============================================================ */

const ARTIST = {
  name: "KLARA",
  handle: "@klara.hardgroove",
  genres: "Hard Groove / Peak-Time Techno",
  bpm: "138–142 BPM",
  location: "Bogotá, COL",
  rating: 4.9,
  shows: 18,
  attendance: 99,
  responseTime: "< 1h",
  verified: "VERIFIED SENIOR",
  trackTitle: "Set Baile — Baum Festival 2026",
  trackDuration: 194,
  rider: [
    "3x Pioneer CDJ-3000",
    "1x Allen & Heath Xone:92",
    "Monitores de booth activos",
    "Iluminación RGB controlable",
  ],
  bio: "Productora y DJ colombiana especializada en hard groove y peak-time techno. Desde 2019 ha construido una identidad sonora cruda y física, con residencias en clubes subterráneos de Bogotá y presentaciones en festivales de la región.",
  labels: ["Drumcode", "Suara", "Exhale"],
  clubsPlayed: ["Fabric (Londres)", "Awakenings (NL)", "Baum Festival (COL)"],
  social: {
    instagram: { handle: "@klara_music", followers: "14.2K", engagement: "4.8%" },
    spotify: { listeners: "3,400 oyentes/mes", topTracks: ["Groove State", "Descent", "Warehouse Anthem"] },
    soundcloud: [
      { title: "Set Baile — Baum Festival 2026", plays: "12.4K" },
      { title: "Boiler Room Bogotá Mix", plays: "28.9K" },
      { title: "Warehouse Sessions Vol. 4", plays: "9.1K" },
    ],
    youtube: { title: "Boiler Room / Off-Week Bogotá", views: "45K vistas" },
  },
};

const INITIAL_OPEN_CALLS = [
  { id: "c1", club: "Octava Club", slot: "Warm-up Slot", date: "15 Ago", city: "Bogotá", feeRange: "$150 – $250", status: "open" },
  { id: "c2", club: "Fauna Rooftop", slot: "Peak-Time Slot", date: "22 Ago", city: "Medellín", feeRange: "$300 – $450", status: "open" },
  { id: "c3", club: "Subterráneo", slot: "Closing Set", date: "30 Ago", city: "Bogotá", feeRange: "$200 – $300", status: "open" },
];

const CLUB = {
  name: "Octava Club",
  location: "Bogotá, COL",
  capacity: 500,
  sound: "Function One",
  activeCalls: 1,
  slot: "Warm-up Slot — 15 Ago",
  budget: 4000,
  spentMTD: 2800,
  datesCovered: 8,
  datesTotal: 10,
  residencySavings: 450,
};

const SLOT_OPTIONS = [
  "15 Ago · 01:00 AM – 03:00 AM",
  "15 Ago · 11:00 PM – 01:00 AM",
  "22 Ago · 01:00 AM – 03:00 AM",
];

const RESIDENCY_DURATIONS = ["3 Meses", "6 Meses", "12 Meses"];
const RESIDENCY_FREQUENCIES = [
  { key: "1", label: "1 Fecha/Mes", datesPerMonth: 1 },
  { key: "2", label: "2 Fechas/Mes", datesPerMonth: 2 },
  { key: "4", label: "Semanal (4 Fechas/Mes)", datesPerMonth: 4 },
];

const GENRE_OPTIONS = ["Techno", "Hard Groove", "Tech House", "Melodic Techno", "Progressive House"];

const INITIAL_APPLICATIONS = [
  { id: "a1", name: "KLARA", genre: "Hard Groove Techno", fee: 250, rating: 4.9, shows: 18, track: "Set Baile — Baum 2026", status: "pending", residency: null, dealType: null, escrowStage: null, signed: false, hash: null },
  { id: "a2", name: "NAIRO", genre: "Melodic Techno", fee: 300, rating: 4.7, shows: 12, track: "Live @ Neón Fest", status: "pending", residency: null, dealType: null, escrowStage: null, signed: false, hash: null },
  { id: "a3", name: "ESSENTIA", genre: "Progressive House", fee: 220, rating: 4.8, shows: 25, track: "Sunset Sessions Vol. 3", status: "pending", residency: null, dealType: null, escrowStage: null, signed: false, hash: null },
  { id: "a4", name: "DARKROOM", genre: "Industrial Techno", fee: 280, rating: 4.6, shows: 9, track: "Warehouse Mix", status: "preselected", residency: null, dealType: null, escrowStage: null, signed: false, hash: null },
  { id: "a5", name: "VELVET", genre: "Tech House", fee: 200, rating: 5.0, shows: 31, track: "Club Reload Mix", status: "hired", residency: { active: true, frequencyLabel: "2 Fechas/Mes", duration: "6 Meses", exclusivity: true }, dealType: "residency", escrowStage: "retained", signed: true, hash: "#RES-OCT-VELVET-2026-6M" },
  { id: "a6", name: "MERAKI", genre: "Minimal Tech House", fee: 210, rating: 4.7, shows: 15, track: "Late Night Groove", status: "hired", residency: null, dealType: "spot", escrowStage: "completed", signed: true, hash: "#SPOT-OCT-MERAKI-0815" },
];

const MONTH_LABEL = "Agosto 2026";
const MONTH_YEAR = { year: 2026, monthIndex: 7 }; // Agosto = index 7
const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const DJ_CAL_OVERRIDES = { 5: "blocked", 12: "blocked", 15: "confirmed", 19: "blocked", 22: "pending", 26: "blocked" };
const CLUB_CAL_OVERRIDES = { 1: "residency", 3: "covered", 8: "residency", 15: "covered", 24: "covered", 29: "residency" };
const DJ_CAL_INFO = {
  15: { label: "Octava Club — Warm-up Slot (confirmado)" },
  22: { label: "Fauna Rooftop — oferta pendiente de aprobación" },
};
const CLUB_CAL_INFO = {
  1: { label: "VELVET — Residencia Tech House" },
  3: { label: "NAIRO — Show confirmado" },
  8: { label: "VELVET — Residencia Tech House" },
  15: { label: "KLARA — Warm-up Slot" },
  24: { label: "MERAKI — Show confirmado" },
  29: { label: "VELVET — Residencia Tech House" },
};

/* ============================================================
   UTILIDADES
   ============================================================ */

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getMonthGrid(year, monthIndex) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayJs = new Date(year, monthIndex, 1).getDay(); // 0=Dom
  const leadingBlanks = (firstDayJs + 6) % 7; // convertir a semana Lun-Dom
  return { daysInMonth, leadingBlanks };
}

/* ============================================================
   TOASTS
   ============================================================ */

const TOAST_COLORS = { emerald: "#10B981", cyan: "#06B6D4", violet: "#8B5CF6", red: "#EF4444" };

function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => {
        const c = TOAST_COLORS[t.tone] || TOAST_COLORS.violet;
        return (
          <div
            key={t.id}
            className="animate-toast-in pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl shadow-black/40 backdrop-blur-md font-body text-sm max-w-xs"
            style={{ background: "rgba(15,23,42,0.92)", borderColor: `${c}66` }}
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full shrink-0" style={{ background: `${c}26`, color: c }}>
              {t.tone === "red" ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
            </span>
            <div>
              <p className="text-slate-100 font-medium leading-tight">{t.title}</p>
              {t.desc && <p className="text-slate-400 text-xs mt-0.5">{t.desc}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   COMPONENTES COMPARTIDOS
   ============================================================ */

function ReputationChip({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border font-body" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
      <Icon size={15} style={{ color }} />
      <div className="leading-tight">
        <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-slate-100">{value}</p>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} style={{ color }} />
        <p className="font-body text-[11px] uppercase tracking-wider text-slate-500">{label}</p>
      </div>
      <p className="font-display text-xl font-bold text-white">{value}</p>
      {sub && <p className="font-body text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function WaveformPlayer({ title, duration }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const barsRef = useRef(Array.from({ length: 42 }, () => 0.25 + Math.random() * 0.75));

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= duration) { setIsPlaying(false); return 0; }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const pct = (progress / duration) * 100;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Radio size={14} className="text-emerald-400" />
          <p className="font-body text-xs uppercase tracking-wider text-slate-400">Set / Mix de referencia</p>
        </div>
        <Volume2 size={15} className="text-slate-500" />
      </div>
      <p className="font-display text-slate-100 font-semibold mb-4">{title}</p>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsPlaying((p) => !p)}
          className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-95"
          style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", boxShadow: isPlaying ? "0 0 22px rgba(139,92,246,0.55)" : "0 0 0 rgba(0,0,0,0)" }}
          aria-label={isPlaying ? "Pausar" : "Reproducir"}
        >
          {isPlaying ? <Pause size={20} className="text-white" fill="white" /> : <Play size={20} className="text-white ml-0.5" fill="white" />}
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-[3px] h-10">
            {barsRef.current.map((h, i) => {
              const barPct = (i / barsRef.current.length) * 100;
              const played = barPct <= pct;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-full origin-center"
                  style={{
                    height: `${h * 100}%`,
                    background: played ? "linear-gradient(180deg, #06B6D4, #8B5CF6)" : "#27272a",
                    animation: isPlaying && played ? `pulseBar ${0.6 + (i % 5) * 0.1}s ease-in-out infinite` : "none",
                    transition: "background 0.2s",
                  }}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 font-mono text-[11px] text-slate-500">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniWaveform({ playing, onToggle }) {
  const bars = useRef(Array.from({ length: 16 }, () => 0.3 + Math.random() * 0.7));
  return (
    <button onClick={onToggle} className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-cyan-500/40 transition-colors">
      {playing ? <Pause size={12} className="text-cyan-400" /> : <Play size={12} className="text-slate-400" />}
      <div className="flex items-center gap-[2px] h-4">
        {bars.current.map((h, i) => (
          <div key={i} className="w-[2px] rounded-full" style={{ height: `${h * 100}%`, background: playing ? "#06B6D4" : "#3f3f46", animation: playing ? `pulseBar ${0.5 + (i % 4) * 0.1}s ease-in-out infinite` : "none" }} />
        ))}
      </div>
    </button>
  );
}

/* ============================================================
   TAB 1 · MARKETPLACE & EPK — VISTA ARTISTA
   ============================================================ */

const ARTIST_TABS = [
  { key: "booking", label: "Resumen & Booking" },
  { key: "epk", label: "EPK Completo & Redes" },
];

function ArtistHeader() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-zinc-950 p-6 md:p-8 mt-6">
      <div className="flex flex-col md:flex-row gap-6 md:items-center">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl shrink-0 flex items-center justify-center font-display text-3xl font-bold text-white" style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}>KL</div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h1 className="font-display text-3xl font-bold text-white tracking-tight">{ARTIST.name}</h1>
            <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full font-body" style={{ background: "rgba(6,182,212,0.12)", color: "#06B6D4", border: "1px solid rgba(6,182,212,0.3)" }}>
              <BadgeCheck size={12} /> {ARTIST.verified}
            </span>
          </div>
          <p className="font-body text-slate-400 text-sm">{ARTIST.handle}</p>
          <div className="flex flex-wrap gap-4 mt-3 font-body text-sm text-slate-300">
            <span className="flex items-center gap-1.5"><Music2 size={14} className="text-violet-400" /> {ARTIST.genres}</span>
            <span className="flex items-center gap-1.5 font-mono text-cyan-400"><Zap size={14} /> {ARTIST.bpm}</span>
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-500" /> {ARTIST.location}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <ReputationChip icon={CheckCircle2} label="Asistencia" value={`${ARTIST.attendance}%`} color="#10B981" />
        <ReputationChip icon={Clock} label="Respuesta" value={ARTIST.responseTime} color="#06B6D4" />
        <ReputationChip icon={Star} label="Valoración" value={`${ARTIST.rating} ★`} color="#8B5CF6" />
        <ReputationChip icon={Headphones} label="Shows" value={`${ARTIST.shows} eventos`} color="#8B5CF6" />
      </div>
    </div>
  );
}

function BookingTab({ openCalls, onPitch, pushToast }) {
  const [modalCall, setModalCall] = useState(null);
  const [offer, setOffer] = useState(0);

  const openPitchModal = (call) => {
    const base = parseInt(call.feeRange.match(/\d+/g)[0], 10);
    setOffer(base);
    setModalCall(call);
  };

  const submitPitch = () => {
    onPitch(modalCall.id, offer);
    pushToast({ title: "Propuesta enviada", desc: `${modalCall.club} recibió tu tarifa de $${offer} USD`, tone: "emerald" });
    setModalCall(null);
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-5 mt-5">
        <WaveformPlayer title={ARTIST.trackTitle} duration={ARTIST.trackDuration} />
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center gap-2 mb-4">
            <ListChecks size={14} className="text-violet-400" />
            <p className="font-body text-xs uppercase tracking-wider text-slate-400">Rider técnico resumido</p>
          </div>
          <ul className="space-y-2.5">
            {ARTIST.rider.map((item, i) => (
              <li key={i} className="flex items-center gap-2.5 font-body text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#8B5CF6" }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-cyan-400" />
          <h2 className="font-display text-xl font-semibold text-white">Convocatorias abiertas cerca de ti</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {openCalls.map((call) => (
            <div key={call.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-display font-semibold text-slate-100">{call.club}</p>
                  <span className="font-mono text-[11px] text-slate-500">{call.date}</span>
                </div>
                <p className="font-body text-sm text-violet-300 mb-1">{call.slot}</p>
                <p className="font-body text-xs text-slate-500 flex items-center gap-1 mb-3"><MapPin size={11} /> {call.city}</p>
                <p className="font-mono text-sm text-emerald-400">{call.feeRange} USD</p>
              </div>
              {call.status === "open" ? (
                <button onClick={() => openPitchModal(call)} className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-body font-semibold text-sm text-white transition-transform active:scale-[0.98]" style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}>
                  Postular mi perfil (1-Tap Pitch) <ArrowRight size={14} />
                </button>
              ) : (
                <div className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-body font-semibold text-sm" style={{ background: "rgba(16,185,129,0.12)", color: "#10B981", border: "1px solid rgba(16,185,129,0.35)" }}>
                  Postulado 🟢 · ${call.myOffer} USD
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {modalCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(2,6,23,0.75)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-zinc-950 p-6 relative">
            <button onClick={() => setModalCall(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"><X size={18} /></button>
            <p className="font-body text-xs uppercase tracking-wider text-cyan-400 mb-1">1-Tap Pitch</p>
            <h3 className="font-display text-xl font-semibold text-white mb-1">{modalCall.slot}</h3>
            <p className="font-body text-sm text-slate-400 mb-6">{modalCall.club} · {modalCall.date} · {modalCall.city}</p>
            <label className="font-body text-xs uppercase tracking-wider text-slate-500">Tu tarifa ofertada (USD)</label>
            <div className="flex items-center gap-3 mt-2 mb-6">
              <button onClick={() => setOffer((o) => Math.max(0, o - 10))} className="w-9 h-9 rounded-lg border border-slate-800 text-slate-300 hover:border-violet-500/50 font-display text-lg">−</button>
              <div className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60">
                <DollarSign size={16} className="text-emerald-400" />
                <span className="font-mono text-lg text-white">{offer}</span>
              </div>
              <button onClick={() => setOffer((o) => o + 10)} className="w-9 h-9 rounded-lg border border-slate-800 text-slate-300 hover:border-violet-500/50 font-display text-lg">+</button>
            </div>
            <button onClick={submitPitch} className="w-full py-3 rounded-xl font-body font-semibold text-white transition-transform active:scale-[0.98]" style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}>Enviar propuesta</button>
          </div>
        </div>
      )}
    </>
  );
}

function EpkTab({ pushToast }) {
  const s = ARTIST.social;
  const mockDownload = (label) => pushToast({ title: "Preparando archivo…", desc: `${label} simulado, listo para compartir`, tone: "cyan" });

  return (
    <div className="mt-5 space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center gap-2 mb-3"><Instagram size={15} className="text-pink-400" /><p className="font-body text-xs uppercase tracking-wider text-slate-400">Instagram</p></div>
          <p className="font-display text-slate-100 font-semibold">{s.instagram.handle}</p>
          <div className="flex gap-5 mt-3 font-body text-sm">
            <span className="text-slate-300"><span className="font-mono text-white">{s.instagram.followers}</span> seguidores</span>
            <span className="text-slate-300"><span className="font-mono text-emerald-400">{s.instagram.engagement}</span> engagement</span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center gap-2 mb-3"><Music2 size={15} className="text-emerald-400" /><p className="font-body text-xs uppercase tracking-wider text-slate-400">Spotify</p></div>
          <p className="font-display text-slate-100 font-semibold mb-3">{s.spotify.listeners}</p>
          <div className="flex flex-wrap gap-2">
            {s.spotify.topTracks.map((t) => (<span key={t} className="px-2.5 py-1 rounded-full font-body text-xs text-slate-300 border border-slate-800 bg-zinc-950/60">{t}</span>))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center gap-2 mb-3"><Radio size={15} className="text-orange-400" /><p className="font-body text-xs uppercase tracking-wider text-slate-400">SoundCloud / Mixcloud</p></div>
          <ul className="space-y-2">
            {s.soundcloud.map((track) => (
              <li key={track.title} className="flex items-center justify-between font-body text-sm text-slate-300">
                <span className="flex items-center gap-1.5"><ExternalLink size={11} className="text-slate-600" /> {track.title}</span>
                <span className="font-mono text-xs text-slate-500">{track.plays}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center gap-2 mb-3"><Youtube size={15} className="text-red-400" /><p className="font-body text-xs uppercase tracking-wider text-slate-400">YouTube</p></div>
          <div className="rounded-xl overflow-hidden border border-slate-800 relative aspect-video flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.25), rgba(6,182,212,0.25))" }}>
            <div className="w-11 h-11 rounded-full bg-black/50 flex items-center justify-center"><Play size={18} className="text-white ml-0.5" fill="white" /></div>
          </div>
          <p className="font-body text-sm text-slate-300 mt-2">{s.youtube.title}</p>
          <p className="font-mono text-xs text-slate-500">{s.youtube.views}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <p className="font-body text-xs uppercase tracking-wider text-slate-400 mb-3">Biografía & Discografía</p>
        <p className="font-body text-sm text-slate-300 leading-relaxed mb-4">{ARTIST.bio}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="font-body text-[11px] uppercase tracking-wider text-slate-500 mb-2">Sellos discográficos</p>
            <div className="flex flex-wrap gap-2">{ARTIST.labels.map((l) => (<span key={l} className="px-2.5 py-1 rounded-full font-body text-xs text-violet-300 border border-violet-500/30 bg-violet-500/10">{l}</span>))}</div>
          </div>
          <div>
            <p className="font-body text-[11px] uppercase tracking-wider text-slate-500 mb-2">Clubes de referencia</p>
            <div className="flex flex-wrap gap-2">{ARTIST.clubsPlayed.map((c) => (<span key={c} className="px-2.5 py-1 rounded-full font-body text-xs text-cyan-300 border border-cyan-500/30 bg-cyan-500/10">{c}</span>))}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={() => mockDownload("Rider Técnico (PDF)")} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-body text-sm font-semibold border border-slate-800 bg-slate-900/60 text-slate-200 hover:border-violet-500/40 transition-colors">
          <FileText size={15} className="text-violet-400" /> Descargar Rider Técnico (PDF)
        </button>
        <button onClick={() => mockDownload("Press Photos (ZIP)")} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-body text-sm font-semibold border border-slate-800 bg-slate-900/60 text-slate-200 hover:border-cyan-500/40 transition-colors">
          <Download size={15} className="text-cyan-400" /> Descargar Press Photos (ZIP)
        </button>
      </div>
    </div>
  );
}

function ArtistMarketplaceView({ openCalls, onPitch, pushToast }) {
  const [tab, setTab] = useState("booking");
  return (
    <div>
      <ArtistHeader />
      <div className="flex gap-2 mt-8 mb-1 overflow-x-auto">
        {ARTIST_TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className="px-4 py-2 rounded-xl font-body text-sm font-medium whitespace-nowrap transition-colors border" style={tab === t.key ? { background: "rgba(139,92,246,0.15)", borderColor: "rgba(139,92,246,0.4)", color: "#c4b5fd" } : { background: "transparent", borderColor: "#27272a", color: "#94a3b8" }}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === "booking" ? <BookingTab openCalls={openCalls} onPitch={onPitch} pushToast={pushToast} /> : <EpkTab pushToast={pushToast} />}
    </div>
  );
}

/* ============================================================
   TAB 1 · MARKETPLACE & EPK — VISTA CLUB (KANBAN)
   ============================================================ */

const KANBAN_TABS = [
  { key: "pending", label: "Pendientes" },
  { key: "preselected", label: "Preseleccionados" },
  { key: "hired", label: "Contratados / Residentes" },
];

function genHash(app, dealType) {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return dealType === "residency" ? `#RES-OCT-${app.name}-${suffix}` : `#SPOT-OCT-${app.name}-${suffix}`;
}

function ClubMarketplaceView({ applications, onPreselect, onConfirmContract, pushToast }) {
  const [tab, setTab] = useState("pending");
  const [contractApp, setContractApp] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [dealType, setDealType] = useState("spot");
  const [slotChoice, setSlotChoice] = useState(SLOT_OPTIONS[0]);
  const [duration, setDuration] = useState(RESIDENCY_DURATIONS[1]);
  const [frequency, setFrequency] = useState(RESIDENCY_FREQUENCIES[1]);
  const [exclusivity, setExclusivity] = useState(false);

  const counts = {
    pending: applications.filter((a) => a.status === "pending").length,
    preselected: applications.filter((a) => a.status === "preselected").length,
    hired: applications.filter((a) => a.status === "hired").length,
  };
  const visible = applications.filter((a) => a.status === tab);

  const handlePreselect = (app) => {
    onPreselect(app.id);
    pushToast({ title: "Artista preseleccionado", desc: `${app.name} pasó a la lista de finalistas`, tone: "cyan" });
  };

  const openContractModal = (app) => {
    setDealType("spot"); setSlotChoice(SLOT_OPTIONS[0]); setDuration(RESIDENCY_DURATIONS[1]); setFrequency(RESIDENCY_FREQUENCIES[1]); setExclusivity(false);
    setContractApp(app);
  };

  const confirmSpot = () => {
    onConfirmContract(contractApp.id, { dealType: "spot", residency: null, escrowStage: "retained", signed: false, hash: genHash(contractApp, "spot") });
    pushToast({ title: "Contratado / Residente ⭐", desc: `${contractApp.name} está listo para el show. Firma el contrato en Legal-Tech.`, tone: "emerald" });
    setContractApp(null); setTab("hired");
  };

  const confirmResidency = () => {
    onConfirmContract(contractApp.id, { dealType: "residency", residency: { active: true, frequencyLabel: frequency.label, duration, exclusivity }, escrowStage: "retained", signed: false, hash: genHash(contractApp, "residency") });
    pushToast({ title: "Propuesta de residencia enviada", desc: `${contractApp.name} · ${duration} · ${frequency.label}. Firma pendiente en Legal-Tech.`, tone: "emerald" });
    setContractApp(null); setTab("hired");
  };

  const handleQuickAction = (action) => {
    if (action === "sos") pushToast({ title: "🚨 Alerta SOS enviada", desc: "Buscando reemplazo de DJ disponible ahora mismo en un radio de 5km", tone: "red" });
    else if (action === "openCall") pushToast({ title: "Convocatoria publicada", desc: "Tu Open Call ya es visible para artistas cercanos", tone: "cyan" });
    else if (action === "residency") { setTab("pending"); pushToast({ title: "Elige un artista pendiente", desc: "Usa 'Aprobar y Contratar' → pestaña Alianza de Residencia", tone: "violet" }); }
  };

  const fee = contractApp?.fee ?? 0;
  const guarantee = Math.round(fee * 0.08);
  const total = fee + guarantee;
  const monthlySubtotal = fee * frequency.datesPerMonth;
  const residencyCommission = Math.round(monthlySubtotal * 0.03);
  const monthlyTotal = monthlySubtotal + residencyCommission;

  return (
    <div>
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-zinc-950 p-6 md:p-8 mt-6">
        <div className="flex flex-col md:flex-row gap-6 md:items-center">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)" }}><Building2 size={38} className="text-white" /></div>
          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold text-white tracking-tight mb-1">{CLUB.name}</h1>
            <p className="font-body text-slate-400 text-sm flex items-center gap-1.5 mb-3"><MapPin size={13} /> {CLUB.location}</p>
            <div className="flex flex-wrap gap-4 font-body text-sm text-slate-300">
              <span className="flex items-center gap-1.5"><Users size={14} className="text-violet-400" /> Aforo {CLUB.capacity} pax</span>
              <span className="flex items-center gap-1.5"><Waves size={14} className="text-cyan-400" /> {CLUB.sound}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center">
            <p className="font-mono text-2xl font-bold text-emerald-400">{CLUB.activeCalls}</p>
            <p className="font-body text-[11px] uppercase tracking-wider text-emerald-300/80">Convocatoria activa</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
        <KpiCard icon={Wallet} label="Presupuesto" value={`$${CLUB.budget.toLocaleString()}`} sub="USD / mes" color="#8B5CF6" />
        <KpiCard icon={TrendingUp} label="Gastado MTD" value={`$${CLUB.spentMTD.toLocaleString()}`} sub={`${Math.round((CLUB.spentMTD / CLUB.budget) * 100)}% del presupuesto`} color="#06B6D4" />
        <KpiCard icon={CalendarDays} label="Fechas cubiertas" value={`${CLUB.datesCovered}/${CLUB.datesTotal}`} sub="Shows este mes" color="#10B981" />
        <KpiCard icon={PiggyBank} label="Ahorro por residencias" value={`$${CLUB.residencySavings}`} sub="vs. contratación spot" color="#8B5CF6" />
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <button onClick={() => handleQuickAction("openCall")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-body text-sm font-semibold border border-slate-800 bg-slate-900/60 text-slate-200 hover:border-violet-500/40 transition-colors">
          <Megaphone size={14} className="text-violet-400" /> Publicar Open Call
        </button>
        <button onClick={() => handleQuickAction("residency")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-body text-sm font-semibold border border-slate-800 bg-slate-900/60 text-slate-200 hover:border-emerald-500/40 transition-colors">
          <Repeat size={14} className="text-emerald-400" /> Proponer Residencia
        </button>
        <div className="flex flex-col">
          <button onClick={() => handleQuickAction("sos")} className="animate-sos flex items-center gap-2 px-4 py-2.5 rounded-xl font-body text-sm font-semibold border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors">
            <AlertTriangle size={14} /> SOS · DJ 3:00 AM
          </button>
          <span className="font-body text-[10px] text-slate-500 mt-1 flex items-center gap-1"><Crown size={10} className="text-amber-400" /> Sin recargo con plan Enterprise</span>
        </div>
      </div>

      <div className="flex gap-2 mt-8 mb-5 overflow-x-auto">
        {KANBAN_TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className="px-4 py-2 rounded-xl font-body text-sm font-medium whitespace-nowrap transition-colors border" style={tab === t.key ? { background: "rgba(139,92,246,0.15)", borderColor: "rgba(139,92,246,0.4)", color: "#c4b5fd" } : { background: "transparent", borderColor: "#27272a", color: "#94a3b8" }}>
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {visible.length === 0 && (<div className="col-span-full text-center py-16 rounded-2xl border border-dashed border-slate-800"><p className="font-body text-slate-500 text-sm">No hay artistas en esta columna todavía.</p></div>)}
        {visible.map((app) => (
          <div key={app.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-start justify-between mb-3">
              <div><p className="font-display font-semibold text-slate-100 text-lg">{app.name}</p><p className="font-body text-xs text-violet-300">{app.genre}</p></div>
              <span className="font-mono text-sm text-emerald-400">${app.fee}</span>
            </div>
            {app.residency?.active && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-body text-[11px] font-semibold mb-3" style={{ background: "rgba(139,92,246,0.12)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.35)" }}>
                <Award size={11} /> ⭐ DJ Residente ({app.residency.frequencyLabel})
              </div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <MiniWaveform playing={playingId === app.id} onToggle={() => setPlayingId(playingId === app.id ? null : app.id)} />
              <p className="font-body text-xs text-slate-500 truncate">{app.track}</p>
            </div>
            <div className="flex items-center gap-3 mb-4 font-body text-xs text-slate-400">
              <span className="flex items-center gap-1"><Star size={12} className="text-amber-400" /> {app.rating}</span>
              <span className="flex items-center gap-1"><Headphones size={12} /> {app.shows} shows</span>
            </div>
            {app.status === "pending" && (
              <div className="flex gap-2">
                <button onClick={() => handlePreselect(app)} className="flex-1 py-2.5 rounded-xl font-body text-sm font-semibold border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 transition-colors">Preseleccionar</button>
                <button onClick={() => openContractModal(app)} className="flex-1 py-2.5 rounded-xl font-body text-sm font-semibold text-white transition-transform active:scale-[0.98]" style={{ background: "linear-gradient(135deg, #8B5CF6, #10B981)" }}>Aprobar y Contratar</button>
              </div>
            )}
            {app.status === "preselected" && (
              <button onClick={() => openContractModal(app)} className="w-full py-2.5 rounded-xl font-body text-sm font-semibold text-white transition-transform active:scale-[0.98]" style={{ background: "linear-gradient(135deg, #8B5CF6, #10B981)" }}>Aprobar y Contratar</button>
            )}
            {app.status === "hired" && (
              <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-body text-sm font-semibold" style={{ background: app.signed ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)", color: app.signed ? "#10B981" : "#f59e0b", border: `1px solid ${app.signed ? "rgba(16,185,129,0.35)" : "rgba(245,158,11,0.35)"}` }}>
                <ShieldCheck size={14} /> {app.signed ? "Contratado / Residente ⭐" : "Pendiente de firma"}
              </div>
            )}
          </div>
        ))}
      </div>

      {contractApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto" style={{ background: "rgba(2,6,23,0.75)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-zinc-950 p-6 relative my-auto">
            <button onClick={() => setContractApp(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"><X size={18} /></button>
            <p className="font-body text-xs uppercase tracking-wider text-cyan-400 mb-1">Tipo de alianza / contratación</p>
            <h3 className="font-display text-xl font-semibold text-white mb-1">{contractApp.name}</h3>
            <p className="font-body text-sm text-slate-400 mb-5">{CLUB.name} · {CLUB.location}</p>

            <div className="flex p-1 rounded-2xl border border-slate-800 bg-slate-900/60 mb-6">
              <button onClick={() => setDealType("spot")} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-body text-sm font-semibold transition-colors" style={dealType === "spot" ? { background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", color: "white" } : { color: "#94a3b8" }}>
                <CalendarDays size={14} /> Contrato Spot
              </button>
              <button onClick={() => setDealType("residency")} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-body text-sm font-semibold transition-colors" style={dealType === "residency" ? { background: "linear-gradient(135deg, #8B5CF6, #10B981)", color: "white" } : { color: "#94a3b8" }}>
                <Repeat size={14} /> Alianza de Residencia
              </button>
            </div>

            {dealType === "spot" && (
              <>
                <label className="font-body text-xs uppercase tracking-wider text-slate-500">Fecha y slot</label>
                <div className="relative mt-2 mb-5">
                  <select value={slotChoice} onChange={(e) => setSlotChoice(e.target.value)} className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 font-body text-sm text-slate-100 focus:outline-none focus:border-violet-500/50">
                    {SLOT_OPTIONS.map((s) => (<option key={s} value={s} className="bg-slate-900">{s}</option>))}
                  </select>
                  <Clock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
                <div className="flex items-center gap-2 mb-1"><Lock size={14} className="text-emerald-400" /><p className="font-body text-xs uppercase tracking-wider text-emerald-400">Pago protegido (Escrow · 8%)</p></div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 my-4">
                  <div className="flex justify-between font-body text-sm text-slate-300"><span>Tarifa fija por show</span><span className="font-mono">${fee} USD</span></div>
                  <div className="flex justify-between font-body text-sm text-slate-300"><span>Fee de garantía plataforma (8%)</span><span className="font-mono">${guarantee} USD</span></div>
                  <div className="h-px bg-slate-800" />
                  <div className="flex justify-between font-body text-sm font-semibold text-white"><span>Total retenido</span><span className="font-mono text-emerald-400">${total} USD</span></div>
                </div>
                <button onClick={confirmSpot} className="w-full py-3 rounded-xl font-body font-semibold text-white flex items-center justify-center gap-2 transition-transform active:scale-[0.98]" style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}><ShieldCheck size={16} /> Confirmar y pre-autorizar fondos</button>
              </>
            )}

            {dealType === "residency" && (
              <>
                <label className="font-body text-xs uppercase tracking-wider text-slate-500">Duración de la alianza</label>
                <div className="grid grid-cols-3 gap-2 mt-2 mb-5">
                  {RESIDENCY_DURATIONS.map((d) => (
                    <button key={d} onClick={() => setDuration(d)} className="py-2.5 rounded-xl font-body text-sm font-medium border transition-colors" style={duration === d ? { background: "rgba(139,92,246,0.15)", borderColor: "rgba(139,92,246,0.5)", color: "#c4b5fd" } : { background: "transparent", borderColor: "#27272a", color: "#94a3b8" }}>{d}</button>
                  ))}
                </div>
                <label className="font-body text-xs uppercase tracking-wider text-slate-500">Frecuencia de fechas</label>
                <div className="flex flex-col gap-2 mt-2 mb-5">
                  {RESIDENCY_FREQUENCIES.map((f) => (
                    <button key={f.key} onClick={() => setFrequency(f)} className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-body text-sm font-medium border transition-colors" style={frequency.key === f.key ? { background: "rgba(16,185,129,0.12)", borderColor: "rgba(16,185,129,0.4)", color: "#6ee7b7" } : { background: "transparent", borderColor: "#27272a", color: "#94a3b8" }}>
                      {f.label}{frequency.key === f.key && <CheckCircle2 size={14} />}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-3 mb-5 cursor-pointer select-none">
                  <input type="checkbox" checked={exclusivity} onChange={(e) => setExclusivity(e.target.checked)} className="w-4 h-4 rounded accent-violet-500" />
                  <span className="font-body text-sm text-slate-300">Cláusula de exclusividad territorial (5 km)</span>
                </label>
                <div className="flex items-center gap-2 mb-1"><Percent size={14} className="text-emerald-400" /><p className="font-body text-xs uppercase tracking-wider text-emerald-400">Desglose con descuento por recurrencia (3%)</p></div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 my-4">
                  <div className="flex justify-between font-body text-sm text-slate-300"><span>Tarifa por fecha</span><span className="font-mono">${fee} USD</span></div>
                  <div className="flex justify-between font-body text-sm text-slate-300"><span>Fechas por mes</span><span className="font-mono">×{frequency.datesPerMonth}</span></div>
                  <div className="flex justify-between font-body text-sm text-slate-300"><span>Subtotal mensual</span><span className="font-mono">${monthlySubtotal} USD</span></div>
                  <div className="flex justify-between font-body text-sm text-slate-300"><span>Comisión app residencia (3%)</span><span className="font-mono text-cyan-400">${residencyCommission} USD</span></div>
                  <div className="h-px bg-slate-800" />
                  <div className="flex justify-between font-body text-sm font-semibold text-white"><span>Total retenido / mes</span><span className="font-mono text-emerald-400">${monthlyTotal} USD</span></div>
                  <p className="font-body text-[11px] text-slate-500 pt-1">Vigencia total: {duration}{exclusivity ? " · con exclusividad territorial" : ""}</p>
                </div>
                <button onClick={confirmResidency} className="w-full py-3 rounded-xl font-body font-semibold text-white flex items-center justify-center gap-2 transition-transform active:scale-[0.98]" style={{ background: "linear-gradient(135deg, #8B5CF6, #10B981)" }}><Repeat size={16} /> Enviar propuesta de residencia</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MarketplaceTab({ perspective, setPerspective, openCalls, applications, onPitch, onPreselect, onConfirmContract, pushToast }) {
  return (
    <div>
      <div className="flex items-center p-1 rounded-full border border-slate-800 bg-slate-900/60 w-fit mx-auto mt-2">
        <button onClick={() => setPerspective("artist")} className="px-4 py-1.5 rounded-full font-body text-sm font-medium transition-colors flex items-center gap-1.5" style={perspective === "artist" ? { background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", color: "white" } : { color: "#94a3b8" }}>
          <Headphones size={14} /> Vista Artista
        </button>
        <button onClick={() => setPerspective("club")} className="px-4 py-1.5 rounded-full font-body text-sm font-medium transition-colors flex items-center gap-1.5" style={perspective === "club" ? { background: "linear-gradient(135deg, #8B5CF6, #10B981)", color: "white" } : { color: "#94a3b8" }}>
          <Building2 size={14} /> Vista Club
        </button>
      </div>
      {perspective === "artist" ? (
        <ArtistMarketplaceView openCalls={openCalls} onPitch={onPitch} pushToast={pushToast} />
      ) : (
        <ClubMarketplaceView applications={applications} onPreselect={onPreselect} onConfirmContract={onConfirmContract} pushToast={pushToast} />
      )}
    </div>
  );
}

/* ============================================================
   TAB 2 · CALENDARIO & DISPONIBILIDAD
   ============================================================ */

const DJ_STATUS_STYLE = {
  available: { bg: "rgba(16,185,129,0.14)", border: "rgba(16,185,129,0.4)", text: "#6ee7b7", label: "Disponible" },
  pending: { bg: "rgba(245,158,11,0.14)", border: "rgba(245,158,11,0.4)", text: "#fcd34d", label: "Oferta pendiente" },
  confirmed: { bg: "rgba(239,68,68,0.14)", border: "rgba(239,68,68,0.4)", text: "#fca5a5", label: "Gig confirmado" },
  blocked: { bg: "rgba(255,255,255,0.03)", border: "#27272a", text: "#71717a", label: "Bloqueado" },
};

const CLUB_STATUS_STYLE = {
  empty: { bg: "rgba(255,255,255,0.02)", border: "#27272a", text: "#52525b", label: "Slot vacío" },
  published: { bg: "rgba(6,182,212,0.14)", border: "rgba(6,182,212,0.4)", text: "#67e8f9", label: "Open Call publicado" },
  covered: { bg: "rgba(139,92,246,0.14)", border: "rgba(139,92,246,0.4)", text: "#c4b5fd", label: "Show confirmado" },
  residency: { bg: "linear-gradient(135deg, rgba(139,92,246,0.22), rgba(16,185,129,0.22))", border: "rgba(139,92,246,0.5)", text: "#d8b4fe", label: "Alianza de residencia" },
};

function MonthGrid({ renderDay }) {
  const { daysInMonth, leadingBlanks } = getMonthGrid(MONTH_YEAR.year, MONTH_YEAR.monthIndex);
  const cells = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(<div key={`b${i}`} />);
  for (let d = 1; d <= daysInMonth; d++) cells.push(<React.Fragment key={d}>{renderDay(d)}</React.Fragment>);
  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {WEEKDAYS.map((w) => (<div key={w} className="text-center font-body text-[11px] uppercase tracking-wider text-slate-500 py-1">{w}</div>))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">{cells}</div>
    </div>
  );
}

function DjCalendar({ pushToast }) {
  const [statusMap, setStatusMap] = useState(() => {
    const m = {};
    for (let d = 1; d <= 31; d++) m[d] = DJ_CAL_OVERRIDES[d] || "available";
    return m;
  });
  const [meta, setMeta] = useState({});
  const [dayModal, setDayModal] = useState(null); // { day, status }
  const [slotForm, setSlotForm] = useState(false);
  const [start, setStart] = useState("01:00");
  const [end, setEnd] = useState("03:00");

  const openDay = (day) => {
    const status = statusMap[day];
    if (status === "pending" || status === "confirmed") {
      pushToast({ title: DJ_CAL_INFO[day]?.label || "Fecha con actividad", desc: "Gestiona el contrato desde Contratos & Legal-Tech", tone: "violet" });
      return;
    }
    setSlotForm(false);
    setDayModal({ day, status });
  };

  const markUnavailable = () => {
    setStatusMap((m) => ({ ...m, [dayModal.day]: "blocked" }));
    pushToast({ title: "Fecha bloqueada", desc: `${dayModal.day} Ago marcado como no disponible`, tone: "violet" });
    setDayModal(null);
  };

  const markAvailable = () => {
    setStatusMap((m) => ({ ...m, [dayModal.day]: "available" }));
    pushToast({ title: "Fecha liberada", desc: `${dayModal.day} Ago ahora está disponible`, tone: "emerald" });
    setDayModal(null);
  };

  const saveSlot = () => {
    setMeta((m) => ({ ...m, [dayModal.day]: { slot: `${start} – ${end}` } }));
    pushToast({ title: "Franja horaria guardada", desc: `${dayModal.day} Ago · ${start} – ${end}`, tone: "cyan" });
    setDayModal(null);
  };

  const sync = () => pushToast({ title: "Sincronización completada ✅", desc: "3 eventos importados desde Google Calendar / iCal", tone: "cyan" });

  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="font-display text-lg font-semibold text-white flex items-center gap-2"><CalendarClock size={16} className="text-violet-400" /> {MONTH_LABEL} · KLARA</p>
        <button onClick={sync} className="flex items-center gap-2 px-3.5 py-2 rounded-xl font-body text-xs font-semibold border border-slate-800 bg-slate-900/60 text-slate-200 hover:border-cyan-500/40 transition-colors">
          <RefreshCw size={13} className="text-cyan-400" /> Sincronizar con Google Calendar / iCal
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5">
        <MonthGrid renderDay={(day) => {
          const st = DJ_STATUS_STYLE[statusMap[day]];
          const hasSlot = meta[day]?.slot;
          return (
            <button onClick={() => openDay(day)} className="aspect-square rounded-lg border flex flex-col items-center justify-center relative transition-transform hover:scale-[1.04] font-body" style={{ background: st.bg, borderColor: st.border }}>
              <span className="font-mono text-xs font-semibold" style={{ color: st.text }}>{day}</span>
              {statusMap[day] === "confirmed" && <Lock size={9} className="mt-0.5" style={{ color: st.text }} />}
              {statusMap[day] === "pending" && <Clock size={9} className="mt-0.5" style={{ color: st.text }} />}
              {statusMap[day] === "blocked" && <Ban size={9} className="mt-0.5" style={{ color: st.text }} />}
              {hasSlot && statusMap[day] === "available" && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-cyan-400" />}
            </button>
          );
        }} />
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        {Object.entries(DJ_STATUS_STYLE).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5 font-body text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: v.border }} /> {v.label}
          </div>
        ))}
      </div>

      {dayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(2,6,23,0.75)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-zinc-950 p-6 relative">
            <button onClick={() => setDayModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"><X size={18} /></button>
            <p className="font-body text-xs uppercase tracking-wider text-cyan-400 mb-1">{dayModal.day} de Agosto, 2026</p>
            <h3 className="font-display text-lg font-semibold text-white mb-5">Gestionar disponibilidad</h3>

            {dayModal.status === "blocked" ? (
              <button onClick={markAvailable} className="w-full py-3 rounded-xl font-body font-semibold text-white flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)" }}><Unlock size={15} /> Marcar como disponible</button>
            ) : !slotForm ? (
              <div className="flex flex-col gap-2.5">
                <button onClick={markUnavailable} className="w-full py-3 rounded-xl font-body text-sm font-semibold border border-slate-800 text-slate-200 hover:border-red-500/40 flex items-center justify-center gap-2"><Ban size={14} /> Marcar como no disponible</button>
                <button onClick={() => setSlotForm(true)} className="w-full py-3 rounded-xl font-body text-sm font-semibold text-white flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}><Clock size={14} /> Establecer franja horaria</button>
              </div>
            ) : (
              <div>
                <div className="flex gap-3 mb-4">
                  <div className="flex-1"><label className="font-body text-[11px] uppercase tracking-wider text-slate-500">Inicio</label><input type="time" value={start} onChange={(e) => setStart(e.target.value)} className="w-full mt-1 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 font-mono text-sm text-slate-100 focus:outline-none focus:border-violet-500/50" /></div>
                  <div className="flex-1"><label className="font-body text-[11px] uppercase tracking-wider text-slate-500">Fin</label><input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full mt-1 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 font-mono text-sm text-slate-100 focus:outline-none focus:border-violet-500/50" /></div>
                </div>
                <button onClick={saveSlot} className="w-full py-3 rounded-xl font-body font-semibold text-white flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}><Check size={15} /> Guardar franja horaria</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ClubCalendar({ pushToast }) {
  const [statusMap, setStatusMap] = useState(() => {
    const m = {};
    for (let d = 1; d <= 31; d++) m[d] = CLUB_CAL_OVERRIDES[d] || "empty";
    return m;
  });
  const [openCallModal, setOpenCallModal] = useState(null); // { day }
  const [budget, setBudget] = useState(250);
  const [genre, setGenre] = useState(GENRE_OPTIONS[0]);

  const openDay = (day) => {
    const status = statusMap[day];
    if (status === "empty") { setBudget(250); setGenre(GENRE_OPTIONS[0]); setOpenCallModal({ day }); return; }
    pushToast({ title: CLUB_CAL_INFO[day]?.label || "Fecha ocupada", desc: `${day} Ago · ${CLUB_STATUS_STYLE[status].label}`, tone: "violet" });
  };

  const publish = () => {
    setStatusMap((m) => ({ ...m, [openCallModal.day]: "published" }));
    pushToast({ title: "Convocatoria publicada", desc: `${openCallModal.day} Ago · ${genre} · $${budget} USD`, tone: "cyan" });
    setOpenCallModal(null);
  };

  const sync = () => pushToast({ title: "Sincronización completada ✅", desc: "Agenda del club actualizada con reservas externas", tone: "cyan" });

  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="font-display text-lg font-semibold text-white flex items-center gap-2"><CalendarClock size={16} className="text-emerald-400" /> {MONTH_LABEL} · {CLUB.name}</p>
        <button onClick={sync} className="flex items-center gap-2 px-3.5 py-2 rounded-xl font-body text-xs font-semibold border border-slate-800 bg-slate-900/60 text-slate-200 hover:border-cyan-500/40 transition-colors">
          <RefreshCw size={13} className="text-cyan-400" /> Sincronizar con Google Calendar / iCal
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5">
        <MonthGrid renderDay={(day) => {
          const stKey = statusMap[day];
          const st = CLUB_STATUS_STYLE[stKey];
          return (
            <button onClick={() => openDay(day)} className={`aspect-square rounded-lg border flex flex-col items-center justify-center relative transition-transform hover:scale-[1.04] font-body ${stKey === "empty" ? "border-dashed" : ""}`} style={{ background: st.bg, borderColor: st.border }}>
              <span className="font-mono text-xs font-semibold" style={{ color: st.text }}>{day}</span>
              {stKey === "residency" && <Star size={9} className="mt-0.5" style={{ color: st.text }} fill={st.text} />}
              {stKey === "covered" && <ShieldCheck size={9} className="mt-0.5" style={{ color: st.text }} />}
              {stKey === "published" && <Megaphone size={9} className="mt-0.5" style={{ color: st.text }} />}
              {stKey === "empty" && <Plus size={9} className="mt-0.5 opacity-40" style={{ color: st.text }} />}
            </button>
          );
        }} />
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        {Object.entries(CLUB_STATUS_STYLE).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5 font-body text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: v.border }} /> {v.label}
          </div>
        ))}
      </div>

      {openCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(2,6,23,0.75)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-zinc-950 p-6 relative">
            <button onClick={() => setOpenCallModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"><X size={18} /></button>
            <p className="font-body text-xs uppercase tracking-wider text-cyan-400 mb-1">Publicar Open Call</p>
            <h3 className="font-display text-lg font-semibold text-white mb-5">{openCallModal.day} de Agosto, 2026</h3>

            <label className="font-body text-xs uppercase tracking-wider text-slate-500">Género musical</label>
            <select value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full mt-2 mb-4 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 font-body text-sm text-slate-100 focus:outline-none focus:border-violet-500/50">
              {GENRE_OPTIONS.map((g) => (<option key={g} value={g} className="bg-slate-900">{g}</option>))}
            </select>

            <label className="font-body text-xs uppercase tracking-wider text-slate-500">Presupuesto (USD)</label>
            <div className="flex items-center gap-3 mt-2 mb-6">
              <button onClick={() => setBudget((b) => Math.max(0, b - 25))} className="w-9 h-9 rounded-lg border border-slate-800 text-slate-300 hover:border-violet-500/50 font-display text-lg">−</button>
              <div className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60"><DollarSign size={16} className="text-emerald-400" /><span className="font-mono text-lg text-white">{budget}</span></div>
              <button onClick={() => setBudget((b) => b + 25)} className="w-9 h-9 rounded-lg border border-slate-800 text-slate-300 hover:border-violet-500/50 font-display text-lg">+</button>
            </div>

            <button onClick={publish} className="w-full py-3 rounded-xl font-body font-semibold text-white flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #8B5CF6, #10B981)" }}><Megaphone size={15} /> Publicar Open Call</button>
          </div>
        </div>
      )}
    </div>
  );
}

function CalendarTab({ pushToast }) {
  const [view, setView] = useState("dj");
  return (
    <div>
      <div className="flex items-center p-1 rounded-full border border-slate-800 bg-slate-900/60 w-fit mx-auto mt-2">
        <button onClick={() => setView("dj")} className="px-4 py-1.5 rounded-full font-body text-sm font-medium transition-colors flex items-center gap-1.5" style={view === "dj" ? { background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", color: "white" } : { color: "#94a3b8" }}>
          <Headphones size={14} /> Vista DJ
        </button>
        <button onClick={() => setView("club")} className="px-4 py-1.5 rounded-full font-body text-sm font-medium transition-colors flex items-center gap-1.5" style={view === "club" ? { background: "linear-gradient(135deg, #8B5CF6, #10B981)", color: "white" } : { color: "#94a3b8" }}>
          <Building2 size={14} /> Vista Club
        </button>
      </div>
      {view === "dj" ? <DjCalendar pushToast={pushToast} /> : <ClubCalendar pushToast={pushToast} />}
    </div>
  );
}

/* ============================================================
   TAB 3 · CONTRATOS & LEGAL-TECH
   ============================================================ */

const ESCROW_STEPS = [
  { key: "retained", label: "Retenido en Custodia", icon: Lock },
  { key: "completed", label: "Show Realizado", icon: CheckCircle2 },
  { key: "released", label: "Liberación Automática (24h)", icon: Unlock },
];

function EscrowStepper({ stage }) {
  const activeIndex = ESCROW_STEPS.findIndex((s) => s.key === stage);
  return (
    <div className="flex items-center">
      {ESCROW_STEPS.map((step, i) => {
        const Icon = step.icon;
        const done = i < activeIndex || (i === activeIndex && stage === "released");
        const current = i === activeIndex && stage !== "released";
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center gap-2 w-20">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${current ? "animate-step-glow" : ""}`} style={{ background: done || current ? "linear-gradient(135deg, #8B5CF6, #10B981)" : "rgba(255,255,255,0.03)", borderColor: done || current ? "transparent" : "#27272a" }}>
                <Icon size={15} className={done || current ? "text-white" : "text-slate-600"} />
              </div>
              <p className="font-body text-[10px] text-center leading-tight" style={{ color: done || current ? "#e4e4e7" : "#52525b" }}>{step.label}</p>
            </div>
            {i < ESCROW_STEPS.length - 1 && <div className="flex-1 h-px mb-6" style={{ background: i < activeIndex ? "#10B981" : "#27272a" }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ContractCard({ app, active, onClick }) {
  return (
    <button onClick={onClick} className="w-full text-left rounded-2xl border p-4 transition-colors" style={active ? { background: "rgba(139,92,246,0.1)", borderColor: "rgba(139,92,246,0.45)" } : { background: "rgba(255,255,255,0.02)", borderColor: "#27272a" }}>
      <div className="flex items-center justify-between mb-1">
        <p className="font-display font-semibold text-slate-100">{app.name}</p>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full" style={{ background: app.dealType === "residency" ? "rgba(16,185,129,0.15)" : "rgba(6,182,212,0.15)", color: app.dealType === "residency" ? "#6ee7b7" : "#67e8f9" }}>
          {app.dealType === "residency" ? "Residencia" : "Spot"}
        </span>
      </div>
      <p className="font-mono text-[11px] text-slate-500">{app.hash}</p>
      <div className="flex items-center gap-2 mt-2">
        {app.signed ? <BadgeCheck size={12} className="text-emerald-400" /> : <FileSignature size={12} className="text-amber-400" />}
        <span className="font-body text-xs" style={{ color: app.signed ? "#6ee7b7" : "#fcd34d" }}>{app.signed ? "Firmado" : "Pendiente de firma"}</span>
      </div>
    </button>
  );
}

function LegalTechTab({ applications, onSign, onAdvanceEscrow, pushToast }) {
  const contracts = applications.filter((a) => a.status === "hired" && a.dealType);
  const [selectedId, setSelectedId] = useState(contracts[0]?.id || null);
  const selected = contracts.find((c) => c.id === selectedId) || contracts[0];

  useEffect(() => {
    if (!selected && contracts.length) setSelectedId(contracts[0].id);
  }, [contracts, selected]);

  if (!selected) {
    return (
      <div className="mt-10 text-center py-16 rounded-2xl border border-dashed border-slate-800">
        <p className="font-body text-slate-500 text-sm">Aún no hay contratos generados. Aprueba un artista desde Marketplace & EPK.</p>
      </div>
    );
  }

  const fee = selected.fee;
  const isResidency = selected.dealType === "residency";
  const commissionPct = isResidency ? 3 : 8;
  const datesPerMonth = isResidency ? (RESIDENCY_FREQUENCIES.find((f) => f.label === selected.residency?.frequencyLabel)?.datesPerMonth || 2) : 1;
  const subtotal = fee * datesPerMonth;
  const commission = Math.round(subtotal * (commissionPct / 100));
  const total = subtotal + commission;

  const sign = () => { onSign(selected.id); pushToast({ title: "Contrato firmado digitalmente ✅", desc: `${selected.name} · ${selected.hash}`, tone: "emerald" }); };
  const advance = () => {
    const next = selected.escrowStage === "retained" ? "completed" : "released";
    onAdvanceEscrow(selected.id, next);
    if (next === "completed") pushToast({ title: "Show marcado como realizado", desc: "Liberación automática de fondos en 24h", tone: "cyan" });
    else pushToast({ title: "💰 Fondos liberados", desc: `${selected.name} recibió el pago retenido en escrow`, tone: "emerald" });
  };

  return (
    <div className="mt-6 grid lg:grid-cols-[280px_1fr] gap-5">
      <div className="space-y-3">
        <p className="font-body text-xs uppercase tracking-wider text-slate-500 px-1">Contratos activos ({contracts.length})</p>
        {contracts.map((c) => (<ContractCard key={c.id} app={c} active={c.id === selected.id} onClick={() => setSelectedId(c.id)} />))}
      </div>

      <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-zinc-950 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-5 border-b border-slate-800">
          <div>
            <p className="font-body text-[11px] uppercase tracking-wider text-slate-500 mb-1">
              {isResidency ? `Contrato Marco de Residencia Artística Recurrente (${selected.residency?.duration || "6 Meses"})` : "Contrato Spot de Presentación Única"}
            </p>
            <p className="font-mono text-lg text-cyan-400">{selected.hash}</p>
          </div>
          <span className="flex items-center gap-1.5 self-start md:self-auto text-[11px] font-semibold px-3 py-1.5 rounded-full font-body" style={{ background: selected.signed ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)", color: selected.signed ? "#10B981" : "#f59e0b", border: `1px solid ${selected.signed ? "rgba(16,185,129,0.35)" : "rgba(245,158,11,0.35)"}` }}>
            <ShieldCheck size={12} /> {selected.signed ? "Verificado en cadena de custodia" : "Esperando firma digital"}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4 py-5 border-b border-slate-800">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"><p className="font-body text-[11px] uppercase tracking-wider text-slate-500 mb-1">El Club</p><p className="font-display text-slate-100 font-semibold">{CLUB.name}</p><p className="font-body text-xs text-slate-500 mt-1">Legal Rep. Octava Club S.A.S.</p></div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"><p className="font-body text-[11px] uppercase tracking-wider text-slate-500 mb-1">El Artista</p><p className="font-display text-slate-100 font-semibold">{selected.name}</p><p className="font-body text-xs text-slate-500 mt-1">{selected.name} — DJ / Productor Independiente</p></div>
        </div>

        <div className="py-5 border-b border-slate-800">
          <p className="font-body text-xs uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2"><DollarSign size={13} className="text-emerald-400" /> Desglose financiero</p>
          <div className="flex justify-between items-center py-2.5 border-b border-slate-800/70 font-body text-sm"><span className="text-slate-400">Tarifa por show</span><span className="font-mono text-slate-100">${fee} USD</span></div>
          {isResidency && (<div className="flex justify-between items-center py-2.5 border-b border-slate-800/70 font-body text-sm"><span className="text-slate-400">Frecuencia acordada</span><span className="font-mono text-slate-100">{selected.residency?.frequencyLabel}</span></div>)}
          <div className="flex justify-between items-center py-2.5 border-b border-slate-800/70 font-body text-sm"><span className="text-slate-400">{isResidency ? "Subtotal mensual" : "Subtotal"}</span><span className="font-mono text-slate-100">${subtotal} USD</span></div>
          <div className="flex justify-between items-center py-2.5 border-b border-slate-800/70 font-body text-sm"><span className="text-slate-400">Fee de plataforma ({commissionPct}%)</span><span className="font-mono text-cyan-400">${commission} USD</span></div>
          <div className="flex justify-between items-center py-2.5 font-body text-sm font-semibold"><span className="text-white">Total retenido en Escrow</span><span className="font-mono text-emerald-400">${total} USD</span></div>
        </div>

        {isResidency && (
          <div className="py-5 border-b border-slate-800">
            <p className="font-body text-xs uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2"><Globe size={13} className="text-violet-400" /> Cláusula de exclusividad territorial</p>
            <p className="font-body text-sm text-slate-300 leading-relaxed">
              Durante la vigencia de este contrato, EL ARTISTA se compromete a no presentarse en otros establecimientos ubicados dentro de un radio de <span className="text-violet-300 font-medium">5 km</span> alrededor de EL CLUB, salvo autorización previa y por escrito de ambas partes.
              {!selected.residency?.exclusivity && " (Cláusula no activada en esta alianza.)"}
            </p>
          </div>
        )}

        <div className="py-5 border-b border-slate-800">
          <p className="font-body text-xs uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2"><ShieldAlert size={13} className="text-cyan-400" /> Estado del pago (Mecanismo Escrow)</p>
          <EscrowStepper stage={selected.signed ? selected.escrowStage : "retained"} />
          <div className="mt-5">
            {!selected.signed ? (
              <p className="font-body text-xs text-slate-500 flex items-center gap-1.5"><Info size={12} /> Firma el contrato para habilitar el flujo de Escrow.</p>
            ) : selected.escrowStage === "retained" ? (
              <button onClick={advance} className="px-5 py-2.5 rounded-xl font-body text-sm font-semibold text-white flex items-center gap-2" style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}><CheckCircle2 size={15} /> Marcar show como realizado</button>
            ) : selected.escrowStage === "completed" ? (
              <button onClick={advance} className="px-5 py-2.5 rounded-xl font-body text-sm font-semibold text-white flex items-center gap-2" style={{ background: "linear-gradient(135deg, #8B5CF6, #10B981)" }}><Unlock size={15} /> Liberar fondos ahora (simular 24h)</button>
            ) : (
              <p className="font-body text-xs text-emerald-400 flex items-center gap-1.5"><ShieldCheck size={13} /> Fondos liberados correctamente.</p>
            )}
          </div>
        </div>

        <div className="pt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8B5CF6, #10B981)" }}><Fingerprint size={20} className="text-white" /></div>
            <div>
              <p className="font-body text-sm text-slate-200 font-medium">{selected.signed ? "Firmado digitalmente por ambas partes" : "Firma digital pendiente"}</p>
              <p className="font-mono text-xs text-slate-500">{selected.signed ? "31 Jul 2026 · 14:32 (GMT-5) · IP 190.24.118.207" : "Aún sin registrar"}</p>
            </div>
          </div>
          {!selected.signed ? (
            <button onClick={sign} className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-body text-sm font-semibold text-white transition-transform active:scale-[0.98]" style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}><FileSignature size={15} /> Firmar digitalmente</button>
          ) : (
            <button onClick={() => pushToast({ title: "Descargando contrato…", desc: "Se está generando el PDF firmado", tone: "violet" })} className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-body text-sm font-semibold border border-slate-800 bg-slate-900/60 text-slate-200 hover:border-violet-500/40 transition-colors"><Download size={15} /> Descargar PDF</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TAB 4 · MEMBRESÍAS & PLANES PRO
   ============================================================ */

const DJ_PLANS = [
  { key: "free", name: "Free", price: "$0", period: "/mes", features: ["Perfil básico en el marketplace", "Postulación a Open Calls", "Chat estándar con clubes", "1 mix destacado en EPK"] },
  { key: "pro", name: "Nocturna PRO", price: "$15", period: "/mes", highlight: true, features: ["Prioridad en algoritmo de búsqueda", "Acceso anticipado a Open Calls (24h)", "Analíticas avanzadas del EPK", "Insignia PRO visible en el perfil", "Mixes y redes ilimitadas en EPK"] },
];

const CLUB_PLANS = [
  { key: "standard", name: "Standard", price: "$49", period: "/mes", features: ["1 venue activo", "Hasta 10 contratos/mes", "Kanban de postulaciones", "SOS con recargo por uso"] },
  { key: "enterprise", name: "Enterprise", price: "$199", period: "/mes", highlight: true, features: ["Gestión multi-venue", "Contratos ilimitados", "Botón SOS / Red de Emergencia sin recargo", "Analíticas financieras avanzadas", "Soporte prioritario 24/7"] },
];

function PlanCard({ plan, selected, onSelect, iconAccent }) {
  return (
    <div className="rounded-3xl border p-6 flex flex-col relative overflow-hidden" style={plan.highlight ? { borderColor: "rgba(139,92,246,0.5)", background: "linear-gradient(180deg, rgba(139,92,246,0.08), rgba(6,182,212,0.04))" } : { borderColor: "#27272a", background: "rgba(255,255,255,0.02)" }}>
      {plan.highlight && (<span className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full font-body" style={{ background: "rgba(139,92,246,0.18)", color: "#c4b5fd" }}><Rocket size={10} /> Recomendado</span>)}
      <p className="font-display text-xl font-bold text-white mb-1">{plan.name}</p>
      <p className="font-display text-3xl font-bold mb-4" style={{ color: iconAccent }}>{plan.price}<span className="font-body text-sm text-slate-500 font-normal">{plan.period}</span></p>
      <ul className="space-y-2.5 mb-6 flex-1">
        {plan.features.map((f) => (<li key={f} className="flex items-start gap-2 font-body text-sm text-slate-300"><Check size={15} className="text-emerald-400 shrink-0 mt-0.5" /> {f}</li>))}
      </ul>
      {selected === plan.key ? (
        <div className="w-full py-2.5 rounded-xl font-body text-sm font-semibold text-center flex items-center justify-center gap-2" style={{ background: "rgba(16,185,129,0.12)", color: "#10B981", border: "1px solid rgba(16,185,129,0.35)" }}><BadgeCheck size={15} /> Plan actual</div>
      ) : (
        <button onClick={() => onSelect(plan.key)} className="w-full py-2.5 rounded-xl font-body text-sm font-semibold text-white transition-transform active:scale-[0.98]" style={{ background: plan.highlight ? "linear-gradient(135deg, #8B5CF6, #06B6D4)" : "#27272a" }}>Elegir plan</button>
      )}
    </div>
  );
}

function PlansTab({ pushToast }) {
  const [audience, setAudience] = useState("dj");
  const [djPlan, setDjPlan] = useState("free");
  const [clubPlan, setClubPlan] = useState("standard");

  const selectDjPlan = (key) => { setDjPlan(key); pushToast({ title: "Plan actualizado", desc: `Ahora tienes el plan ${DJ_PLANS.find((p) => p.key === key).name}`, tone: "violet" }); };
  const selectClubPlan = (key) => { setClubPlan(key); pushToast({ title: "Plan actualizado", desc: `Ahora tienes el plan ${CLUB_PLANS.find((p) => p.key === key).name}`, tone: "violet" }); };

  return (
    <div className="mt-6">
      <div className="text-center mb-6">
        <p className="font-body text-xs uppercase tracking-wider text-cyan-400 mb-2 flex items-center justify-center gap-1.5"><Crown size={13} /> Membresías & Planes PRO</p>
        <h2 className="font-display text-2xl font-bold text-white">Elige el plan que impulsa tu operación</h2>
      </div>

      <div className="flex items-center p-1 rounded-full border border-slate-800 bg-slate-900/60 w-fit mx-auto mb-8">
        <button onClick={() => setAudience("dj")} className="px-4 py-1.5 rounded-full font-body text-sm font-medium transition-colors flex items-center gap-1.5" style={audience === "dj" ? { background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", color: "white" } : { color: "#94a3b8" }}><Headphones size={14} /> Para DJs</button>
        <button onClick={() => setAudience("club")} className="px-4 py-1.5 rounded-full font-body text-sm font-medium transition-colors flex items-center gap-1.5" style={audience === "club" ? { background: "linear-gradient(135deg, #8B5CF6, #10B981)", color: "white" } : { color: "#94a3b8" }}><Building2 size={14} /> Para Clubes</button>
      </div>

      <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
        {audience === "dj"
          ? DJ_PLANS.map((p) => (<PlanCard key={p.key} plan={p} selected={djPlan} onSelect={selectDjPlan} iconAccent="#8B5CF6" />))
          : CLUB_PLANS.map((p) => (<PlanCard key={p.key} plan={p} selected={clubPlan} onSelect={selectClubPlan} iconAccent="#10B981" />))}
      </div>

      <div className="max-w-3xl mx-auto mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex items-start gap-3">
        <InfinityIcon size={18} className="text-cyan-400 shrink-0 mt-0.5" />
        <p className="font-body text-sm text-slate-400">
          {audience === "dj"
            ? "Los planes PRO se facturan mensualmente y pueden cancelarse en cualquier momento. Las analíticas avanzadas del EPK incluyen métricas de reproducciones, alcance de convocatorias y tasa de conversión de propuestas."
            : "El plan Enterprise incluye acceso ilimitado a la Red de Emergencia a 5km, ideal para operaciones con múltiples venues que necesitan reemplazos de DJ garantizados a las 3:00 AM."}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   APP RAÍZ
   ============================================================ */

const NAV_ITEMS = [
  { key: "marketplace", label: "Marketplace & EPK", icon: Store, from: "#8B5CF6", to: "#06B6D4" },
  { key: "calendar", label: "Calendario & Disponibilidad", icon: CalendarDays, from: "#06B6D4", to: "#10B981" },
  { key: "legal", label: "Contratos & Legal-Tech", icon: FileSignature, from: "#8B5CF6", to: "#10B981" },
  { key: "plans", label: "Membresías & Planes PRO", icon: Crown, from: "#06B6D4", to: "#8B5CF6" },
];

export default function App() {
  const [tab, setTab] = useState("marketplace");
  const [perspective, setPerspective] = useState("artist");
  const [openCalls, setOpenCalls] = useState(INITIAL_OPEN_CALLS);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { ...toast, id }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }, []);

  const handlePitch = (callId, offer) => setOpenCalls((calls) => calls.map((c) => (c.id === callId ? { ...c, status: "applied", myOffer: offer } : c)));
  const handlePreselect = (id) => setApplications((apps) => apps.map((a) => (a.id === id ? { ...a, status: "preselected" } : a)));
  const handleConfirmContract = (id, payload) => setApplications((apps) => apps.map((a) => (a.id === id ? { ...a, status: "hired", ...payload } : a)));
  const handleSignContract = (id) => setApplications((apps) => apps.map((a) => (a.id === id ? { ...a, signed: true } : a)));
  const handleAdvanceEscrow = (id, stage) => setApplications((apps) => apps.map((a) => (a.id === id ? { ...a, escrowStage: stage } : a)));

  return (
    <div className="min-h-screen bg-zinc-950 font-body" style={{ colorScheme: "dark" }}>
      <style>{FONT_STYLES}</style>

      <div className="sticky top-0 z-40 border-b border-slate-800/80 bg-zinc-950/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}><Waves size={16} className="text-white" /></div>
            <span className="font-display font-bold text-white tracking-tight text-lg">NOCTURNA</span>
          </div>
          <div className="flex items-center gap-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-1 overflow-x-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = tab === item.key;
              return (
                <button key={item.key} onClick={() => setTab(item.key)} className="px-3.5 py-2 rounded-xl font-body text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap" style={active ? { background: `linear-gradient(135deg, ${item.from}, ${item.to})`, color: "white" } : { color: "#94a3b8" }}>
                  <Icon size={14} /> {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-24">
        {tab === "marketplace" && (
          <MarketplaceTab perspective={perspective} setPerspective={setPerspective} openCalls={openCalls} applications={applications} onPitch={handlePitch} onPreselect={handlePreselect} onConfirmContract={handleConfirmContract} pushToast={pushToast} />
        )}
        {tab === "calendar" && <CalendarTab pushToast={pushToast} />}
        {tab === "legal" && <LegalTechTab applications={applications} onSign={handleSignContract} onAdvanceEscrow={handleAdvanceEscrow} pushToast={pushToast} />}
        {tab === "plans" && <PlansTab pushToast={pushToast} />}
      </div>

      <ToastStack toasts={toasts} />
    </div>
  );
}
