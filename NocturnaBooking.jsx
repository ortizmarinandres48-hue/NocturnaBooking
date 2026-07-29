import React, { useState, useEffect, useRef } from "react";
import {
  Headphones,
  Landmark,
  Play,
  Pause,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  Radio,
  Users,
  Volume2,
  Sliders,
  Send,
  X,
  ShieldCheck,
  CreditCard,
  Wallet,
  ChevronRight,
  BadgeCheck,
  Zap,
  CalendarDays,
  Music4,
  Sparkles,
  ArrowRight,
  Lock,
} from "lucide-react";

/* ============================================================
   MOCK DATA
   ============================================================ */

const ARTIST = {
  name: "KLARA",
  handle: "@klara.hardgroove",
  genre: "Hard Groove / Peak-Time Techno",
  bpm: "138–142 BPM",
  location: "Bogotá, COL",
  rate: 250,
  avatarInitials: "KL",
  compliance: 99,
  responseTime: "< 1h",
  rating: 4.9,
  ratingCount: 18,
  setTitle: "Set Baile · Baum Festival 2026",
  setDuration: "58:12",
  rider: ["3x Pioneer CDJ-3000", "1x Allen & Heath Xone:92", "Monitores DJ (par) 12\""],
};

const OPEN_CALLS_SEED = [
  {
    id: "oc1",
    club: "Octava Club",
    city: "Bogotá, COL",
    slot: "Warm-up Slot",
    date: "15 Ago 2026",
    budget: "$180 – $300 USD",
    tag: "Peak Time",
  },
  {
    id: "oc2",
    club: "Subsuelo Bar",
    city: "Medellín, COL",
    slot: "Closing Set",
    date: "22 Ago 2026",
    budget: "$200 – $260 USD",
    tag: "Hard Groove",
  },
  {
    id: "oc3",
    club: "Néctar Rooftop",
    city: "Cali, COL",
    slot: "Prime Time B2B",
    date: "29 Ago 2026",
    budget: "$220 – $350 USD",
    tag: "Techno",
  },
];

const CLUB = {
  name: "Octava Club",
  city: "Bogotá, COL",
  capacity: 500,
  sound: "Function-One",
  callStatus: "Activa",
};

const APPLICANTS_SEED = [
  {
    id: "a1",
    name: "KLARA",
    genre: "Hard Groove / Peak-Time Techno",
    rate: 250,
    rating: 4.9,
    ratingCount: 18,
    compliance: 99,
    slot: "Warm-up Slot · 15 Ago",
    stage: "pending",
    track: "Set Baile · Baum Festival 2026",
  },
  {
    id: "a2",
    name: "DERU.",
    genre: "Melodic Techno",
    rate: 300,
    rating: 4.7,
    ratingCount: 24,
    compliance: 96,
    slot: "Prime Time · 15 Ago",
    stage: "pending",
    track: "Live @ Andes Sessions",
  },
  {
    id: "a3",
    name: "NOVA RUIZ",
    genre: "Acid / Hard Groove",
    rate: 220,
    rating: 4.8,
    ratingCount: 12,
    compliance: 100,
    slot: "Warm-up Slot · 15 Ago",
    stage: "preselected",
    track: "Rooftop Tape Vol. 3",
  },
  {
    id: "a4",
    name: "MATEO BRAVA",
    genre: "Peak-Time Techno",
    rate: 280,
    rating: 4.6,
    ratingCount: 31,
    compliance: 94,
    slot: "Closing Set · 15 Ago",
    stage: "hired",
    track: "Boiler Room Bogotá",
  },
];

const STAGES = [
  { key: "pending", label: "Postulaciones Pendientes" },
  { key: "preselected", label: "Preseleccionados" },
  { key: "hired", label: "Contratados" },
];

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */

const Pill = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide ${className}`}
  >
    {children}
  </span>
);

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm ${className}`}
  >
    {children}
  </div>
);

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-[100] w-[92%] max-w-sm -translate-x-1/2 animate-[slideUp_0.25s_ease-out]">
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/30 bg-slate-900/95 px-4 py-3 shadow-[0_0_30px_-8px_rgba(52,211,153,0.5)]">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
        <p className="text-sm text-slate-100">{toast}</p>
      </div>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */

export default function App() {
  const [role, setRole] = useState("artist"); // 'artist' | 'club'
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2600);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 antialiased">
      <style>{`
        @keyframes slideUp { from { opacity:0; transform: translate(-50%, 12px);} to {opacity:1; transform: translate(-50%,0);} }
        @keyframes fadeIn { from {opacity:0;} to {opacity:1;} }
        @keyframes popIn { from {opacity:0; transform: scale(0.96) translateY(8px);} to {opacity:1; transform: scale(1) translateY(0);} }
        .anim-fade { animation: fadeIn 0.2s ease-out; }
        .anim-pop { animation: popIn 0.2s ease-out; }
        ::-webkit-scrollbar { height: 6px; width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.25); border-radius: 999px; }
      `}</style>

      <TopNav role={role} setRole={setRole} />

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-6 sm:px-6">
        {role === "artist" ? (
          <ArtistView showToast={showToast} />
        ) : (
          <ClubView showToast={showToast} />
        )}
      </main>

      <Toast toast={toast} />
    </div>
  );
}

/* ============================================================
   TOP NAV / ROLE SWITCHER
   ============================================================ */

function TopNav({ role, setRole }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400">
            <Radio className="h-4 w-4 text-slate-950" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none tracking-tight">
              Nocturna<span className="text-fuchsia-400">Booking</span>
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Talent Marketplace
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-800 bg-slate-900/70 p-1 sm:w-auto">
          <button
            onClick={() => setRole("artist")}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
              role === "artist"
                ? "bg-gradient-to-r from-fuchsia-600/90 to-violet-600/90 text-white shadow-[0_0_18px_-4px_rgba(217,70,239,0.6)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Headphones className="h-3.5 w-3.5" />
            Modo Artista
          </button>
          <button
            onClick={() => setRole("club")}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
              role === "club"
                ? "bg-gradient-to-r from-cyan-600/90 to-emerald-600/90 text-white shadow-[0_0_18px_-4px_rgba(34,211,238,0.6)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Landmark className="h-3.5 w-3.5" />
            Modo Club
          </button>
        </div>
      </div>
    </header>
  );
}

/* ============================================================
   ARTIST VIEW
   ============================================================ */

function ArtistView({ showToast }) {
  const [openCalls, setOpenCalls] = useState(
    OPEN_CALLS_SEED.map((c) => ({ ...c, applied: false }))
  );
  const [activeCall, setActiveCall] = useState(null);

  const handleApply = (id, offeredRate) => {
    setOpenCalls((prev) =>
      prev.map((c) => (c.id === id ? { ...c, applied: true, offeredRate } : c))
    );
    setActiveCall(null);
    showToast(`Propuesta enviada por $${offeredRate} USD. Estado: Postulado ✅`);
  };

  return (
    <div className="anim-fade space-y-6">
      <ArtistProfileHeader />
      <ReputationBadges />
      <div className="grid gap-6 sm:grid-cols-2">
        <MockPlayer />
        <TechRider />
      </div>
      <OpenCallsSection
        openCalls={openCalls}
        onApplyClick={(call) => setActiveCall(call)}
      />

      {activeCall && (
        <ApplyModal
          call={activeCall}
          onClose={() => setActiveCall(null)}
          onConfirm={handleApply}
        />
      )}
    </div>
  );
}

function ArtistProfileHeader() {
  return (
    <Card className="overflow-hidden">
      <div className="h-20 w-full bg-[radial-gradient(circle_at_20%_-20%,rgba(217,70,239,0.35),transparent_60%),radial-gradient(circle_at_80%_120%,rgba(52,211,153,0.25),transparent_55%)]" />
      <div className="-mt-10 flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-end gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-950 bg-gradient-to-br from-fuchsia-500 to-violet-700 text-xl font-bold shadow-lg">
            {ARTIST.avatarInitials}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{ARTIST.name}</h1>
            <p className="text-xs text-slate-400">{ARTIST.handle}</p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <Pill className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
            <Music4 className="h-3 w-3" /> {ARTIST.rate} USD / slot
          </Pill>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-5 pb-5">
        <Pill className="border-violet-500/30 bg-violet-500/10 text-violet-300">
          <Sliders className="h-3 w-3" /> {ARTIST.genre}
        </Pill>
        <Pill className="border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
          <Zap className="h-3 w-3" /> {ARTIST.bpm}
        </Pill>
        <Pill className="border-slate-700 bg-slate-800/60 text-slate-300">
          <MapPin className="h-3 w-3" /> {ARTIST.location}
        </Pill>
      </div>
    </Card>
  );
}

function ReputationBadges() {
  const items = [
    {
      icon: ShieldCheck,
      label: "Cumplimiento",
      value: `${ARTIST.compliance}%`,
      sub: "Asistencia",
      color: "text-emerald-300",
      ring: "border-emerald-500/25 bg-emerald-500/5",
    },
    {
      icon: Clock,
      label: "Respuesta",
      value: ARTIST.responseTime,
      sub: "Tiempo promedio",
      color: "text-cyan-300",
      ring: "border-cyan-500/25 bg-cyan-500/5",
    },
    {
      icon: Star,
      label: "Valoración",
      value: `${ARTIST.rating} ★`,
      sub: `${ARTIST.ratingCount} shows`,
      color: "text-fuchsia-300",
      ring: "border-fuchsia-500/25 bg-fuchsia-500/5",
    },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((it) => (
        <Card key={it.label} className={`px-3 py-3 text-center ${it.ring}`}>
          <it.icon className={`mx-auto mb-1 h-4 w-4 ${it.color}`} />
          <p className={`text-sm font-bold ${it.color}`}>{it.value}</p>
          <p className="text-[10px] text-slate-500">{it.sub}</p>
        </Card>
      ))}
    </div>
  );
}

function MockPlayer() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(18);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = window.setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + 1));
      }, 220);
    } else {
      window.clearInterval(intervalRef.current);
    }
    return () => window.clearInterval(intervalRef.current);
  }, [playing]);

  const bars = Array.from({ length: 40 });

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Reproductor de Set
        </p>
        <Volume2 className="h-4 w-4 text-slate-600" />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setPlaying((p) => !p)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 text-slate-950 shadow-[0_0_20px_-4px_rgba(217,70,239,0.7)] transition-transform active:scale-95"
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{ARTIST.setTitle}</p>
          <p className="text-[11px] text-slate-500">SoundCloud · {ARTIST.setDuration}</p>
        </div>
      </div>

      <div className="flex h-10 items-end gap-[3px] overflow-hidden">
        {bars.map((_, i) => {
          const active = (i / bars.length) * 100 < progress;
          const h = 20 + Math.abs(Math.sin(i * 0.7)) * 70;
          return (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className={`w-full flex-1 rounded-full transition-colors duration-150 ${
                active ? "bg-gradient-to-t from-fuchsia-500 to-cyan-400" : "bg-slate-800"
              } ${playing && active ? "opacity-100" : "opacity-80"}`}
            />
          );
        })}
      </div>
      <p className="text-right text-[10px] text-slate-500">{progress}%</p>
    </Card>
  );
}

function TechRider() {
  return (
    <Card className="p-5">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
        Rider Técnico Resumido
      </p>
      <ul className="space-y-2.5">
        {ARTIST.rider.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function OpenCallsSection({ openCalls, onApplyClick }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-fuchsia-400" />
        <h2 className="text-sm font-semibold tracking-tight">
          Convocatorias Abiertas para Aplicar
        </h2>
      </div>
      <div className="space-y-3">
        {openCalls.map((call) => (
          <Card
            key={call.id}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold">{call.slot}</p>
                <Pill className="border-slate-700 bg-slate-800/60 text-[10px] text-slate-400">
                  {call.tag}
                </Pill>
              </div>
              <p className="text-xs text-slate-400">
                {call.club} · {call.city}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                📅 {call.date} &nbsp;·&nbsp; 💵 {call.budget}
              </p>
            </div>
            <button
              onClick={() => !call.applied && onApplyClick(call)}
              disabled={call.applied}
              className={`flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                call.applied
                  ? "cursor-default border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white shadow-[0_0_16px_-4px_rgba(217,70,239,0.6)] hover:brightness-110 active:scale-[0.98]"
              }`}
            >
              {call.applied ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Postulado
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" /> Postular mi Perfil (1-Tap)
                </>
              )}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ApplyModal({ call, onClose, onConfirm }) {
  const [rate, setRate] = useState(ARTIST.rate);

  return (
    <ModalShell onClose={onClose}>
      <p className="mb-1 text-[11px] uppercase tracking-wider text-slate-500">
        Postulación rápida
      </p>
      <h3 className="mb-4 text-lg font-bold">
        {call.slot} · {call.club}
      </h3>

      <div className="mb-4 space-y-1 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-xs text-slate-400">
        <p>📍 {call.city}</p>
        <p>📅 {call.date}</p>
        <p>💵 Rango sugerido: {call.budget}</p>
      </div>

      <label className="mb-1 block text-xs font-medium text-slate-400">
        Tu tarifa ofertada (USD)
      </label>
      <div className="mb-6 flex items-center gap-3">
        <input
          type="range"
          min={100}
          max={400}
          step={10}
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-fuchsia-500"
        />
        <span className="w-16 shrink-0 rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/10 py-1 text-center text-sm font-bold text-fuchsia-300">
          ${rate}
        </span>
      </div>

      <button
        onClick={() => onConfirm(call.id, rate)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-[0_0_20px_-4px_rgba(217,70,239,0.7)] transition-transform active:scale-[0.98]"
      >
        <Send className="h-4 w-4" /> Enviar Propuesta al Club
      </button>
    </ModalShell>
  );
}

/* ============================================================
   CLUB VIEW
   ============================================================ */

function ClubView({ showToast }) {
  const [applicants, setApplicants] = useState(APPLICANTS_SEED);
  const [tab, setTab] = useState("pending");
  const [contractTarget, setContractTarget] = useState(null);

  const moveStage = (id, nextStage, label) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, stage: nextStage } : a))
    );
    showToast(label);
  };

  const filtered = applicants.filter((a) => a.stage === tab);

  return (
    <div className="anim-fade space-y-6">
      <ClubProfileHeader />

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-cyan-400" />
          <h2 className="text-sm font-semibold tracking-tight">
            Buzón de Talentos · Postulaciones Recibidas
          </h2>
        </div>

        <div className="mb-4 flex gap-1 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70 p-1">
          {STAGES.map((s) => {
            const count = applicants.filter((a) => a.stage === s.key).length;
            return (
              <button
                key={s.key}
                onClick={() => setTab(s.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                  tab === s.key
                    ? "bg-gradient-to-r from-cyan-600/90 to-emerald-600/90 text-white shadow-[0_0_16px_-4px_rgba(34,211,238,0.6)]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {s.label}
                <span
                  className={`rounded-full px-1.5 text-[10px] ${
                    tab === s.key ? "bg-white/20" : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {filtered.length === 0 && (
            <Card className="p-6 text-center text-sm text-slate-500">
              No hay artistas en esta etapa todavía.
            </Card>
          )}
          {filtered.map((a) => (
            <ApplicantCard
              key={a.id}
              artist={a}
              onPreselect={() =>
                moveStage(a.id, "preselected", `${a.name} movido a Preseleccionados ⭐`)
              }
              onApprove={() => setContractTarget(a)}
            />
          ))}
        </div>
      </div>

      {contractTarget && (
        <ContractModal
          artist={contractTarget}
          onClose={() => setContractTarget(null)}
          onConfirm={() => {
            moveStage(
              contractTarget.id,
              "hired",
              `Contrato confirmado con ${contractTarget.name} 🎉 Notificación enviada`
            );
            setContractTarget(null);
          }}
        />
      )}
    </div>
  );
}

function ClubProfileHeader() {
  return (
    <Card className="overflow-hidden">
      <div className="h-20 w-full bg-[radial-gradient(circle_at_20%_-20%,rgba(34,211,238,0.3),transparent_60%),radial-gradient(circle_at_80%_120%,rgba(16,185,129,0.25),transparent_55%)]" />
      <div className="-mt-10 flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-end gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-950 bg-gradient-to-br from-cyan-500 to-emerald-700 shadow-lg">
            <Landmark className="h-8 w-8 text-slate-950" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{CLUB.name}</h1>
            <p className="text-xs text-slate-400">{CLUB.city}</p>
          </div>
        </div>
        <Pill className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Convocatoria {CLUB.callStatus}
        </Pill>
      </div>
      <div className="flex flex-wrap gap-2 px-5 pb-5">
        <Pill className="border-slate-700 bg-slate-800/60 text-slate-300">
          <Users className="h-3 w-3" /> {CLUB.capacity} pax
        </Pill>
        <Pill className="border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
          <Volume2 className="h-3 w-3" /> Sistema {CLUB.sound}
        </Pill>
      </div>
    </Card>
  );
}

function ApplicantCard({ artist, onPreselect, onApprove }) {
  const [playing, setPlaying] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-700 text-sm font-bold">
          {artist.name.slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">{artist.name}</p>
            <Pill className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-300">
              ${artist.rate} USD
            </Pill>
          </div>
          <p className="truncate text-xs text-slate-400">{artist.genre}</p>
          <p className="mt-0.5 text-[11px] text-slate-500">{artist.slot}</p>
        </div>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800/70 text-slate-200 transition-colors hover:border-cyan-500/50"
          title={`Reproducir ${artist.track}`}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-3">
        <Pill className="border-slate-700 bg-slate-800/40 text-[10px] text-slate-400">
          <ShieldCheck className="h-3 w-3 text-emerald-400" /> {artist.compliance}%
        </Pill>
        <Pill className="border-slate-700 bg-slate-800/40 text-[10px] text-slate-400">
          <Star className="h-3 w-3 text-amber-400" /> {artist.rating} ({artist.ratingCount})
        </Pill>
        {playing && (
          <span className="ml-auto flex items-center gap-1 text-[10px] text-cyan-400">
            <Sparkles className="h-3 w-3 animate-pulse" /> Reproduciendo demo…
          </span>
        )}
      </div>

      {artist.stage !== "hired" && (
        <div className="mt-3 flex gap-2">
          {artist.stage === "pending" && (
            <button
              onClick={onPreselect}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-cyan-500/50 hover:text-cyan-300"
            >
              <ChevronRight className="h-3.5 w-3.5" /> Preseleccionar
            </button>
          )}
          <button
            onClick={onApprove}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 py-2 text-xs font-semibold text-white shadow-[0_0_16px_-4px_rgba(34,211,238,0.6)] transition-transform active:scale-[0.98]"
          >
            <ShieldCheck className="h-3.5 w-3.5" /> Aprobar y Enviar Contrato
          </button>
        </div>
      )}
      {artist.stage === "hired" && (
        <div className="mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2 text-xs font-semibold text-emerald-300">
          <CheckCircle2 className="h-3.5 w-3.5" /> Contrato Confirmado
        </div>
      )}
    </Card>
  );
}

function ContractModal({ artist, onClose, onConfirm }) {
  const [method, setMethod] = useState("stripe"); // 'stripe' | 'onsite'
  const [step, setStep] = useState("form"); // 'form' | 'success'

  const fee = Math.round(artist.rate * 0.08);
  const total = artist.rate + fee;

  const handleConfirm = () => {
    setStep("success");
    window.setTimeout(() => {
      onConfirm();
    }, 1100);
  };

  return (
    <ModalShell onClose={onClose}>
      {step === "form" ? (
        <>
          <p className="mb-1 text-[11px] uppercase tracking-wider text-slate-500">
            Contratación y Pago Protegido
          </p>
          <h3 className="mb-4 text-lg font-bold">
            {artist.name} · {artist.slot}
          </h3>

          <div className="mb-5 space-y-2 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-sm">
            <Row label="Tarifa del Artista" value={`$${artist.rate} USD`} />
            <Row label="Fee de Garantía Plataforma (8%)" value={`$${fee} USD`} />
            <div className="my-1 h-px bg-slate-800" />
            <Row
              label="Total Retenido"
              value={`$${total} USD`}
              bold
              accent="text-emerald-300"
            />
          </div>

          <p className="mb-2 text-xs font-medium text-slate-400">Método de pago</p>
          <div className="mb-6 grid grid-cols-2 gap-2">
            <button
              onClick={() => setMethod("stripe")}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs transition-all ${
                method === "stripe"
                  ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-200"
                  : "border-slate-800 bg-slate-900/50 text-slate-400"
              }`}
            >
              <CreditCard className="h-4 w-4" />
              Retención con Tarjeta (Stripe)
            </button>
            <button
              onClick={() => setMethod("onsite")}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs transition-all ${
                method === "onsite"
                  ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-200"
                  : "border-slate-800 bg-slate-900/50 text-slate-400"
              }`}
            >
              <Wallet className="h-4 w-4" />
              Pago en Sitio
            </button>
          </div>

          <button
            onClick={handleConfirm}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 py-3 text-sm font-semibold text-white shadow-[0_0_20px_-4px_rgba(34,211,238,0.7)] transition-transform active:scale-[0.98]"
          >
            <Lock className="h-4 w-4" /> Confirmar y Pre-autorizar Fondos
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <p className="text-lg font-bold">Contrato Confirmado</p>
          <p className="text-sm text-slate-400">
            Fondos pre-autorizados · Notificando a {artist.name}…
          </p>
        </div>
      )}
    </ModalShell>
  );
}

function Row({ label, value, bold, accent }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className={`${bold ? "font-bold" : "font-medium"} ${accent || "text-slate-200"}`}>
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   MODAL SHELL
   ============================================================ */

function ModalShell({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="anim-pop w-full max-w-md rounded-t-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl sm:rounded-3xl sm:p-6"
      >
        <div className="mb-2 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
