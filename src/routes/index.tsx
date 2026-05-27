import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play, Plus, ChevronRight, Sparkles, Tv, BookOpen, Flame } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PosterCard, type Poster } from "@/components/PosterCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YORUKAI.TV — Stream Beyond" },
      { name: "description", content: "The cinematic home of anime, movies, live TV, and manga." },
    ],
  }),
  component: Home,
});

const img = (seed: string, w = 600, h = 900) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const TRENDING: Poster[] = [
  { id: "t1", title: "Neon Samurai Requiem", image: img("yk-trend-1"), badge: "#1", rating: 9.2, year: 2025 },
  { id: "t2", title: "Crimson Petal Protocol", image: img("yk-trend-2"), badge: "#2", rating: 8.9, year: 2025 },
  { id: "t3", title: "Velvet Sky Tokyo", image: img("yk-trend-3"), badge: "#3", rating: 8.7, year: 2024 },
  { id: "t4", title: "Echoes of Akihabara", image: img("yk-trend-4"), badge: "#4", rating: 8.6, year: 2025 },
  { id: "t5", title: "Ghost Frequency", image: img("yk-trend-5"), badge: "#5", rating: 8.5, year: 2024 },
  { id: "t6", title: "Holographic Heart", image: img("yk-trend-6"), badge: "#6", rating: 8.4, year: 2025 },
];

const NEW_DROPS: Poster[] = [
  { id: "n1", title: "Midnight Pixel Cult", image: img("yk-new-1"), badge: "NEW", rating: 8.1, year: 2025 },
  { id: "n2", title: "Glasswire Saint", image: img("yk-new-2"), badge: "NEW", rating: 7.9, year: 2025 },
  { id: "n3", title: "Saturn Mecha Hour", image: img("yk-new-3"), badge: "DUB", rating: 8.3, year: 2025 },
  { id: "n4", title: "Lotus Static", image: img("yk-new-4"), badge: "NEW", rating: 7.8, year: 2025 },
  { id: "n5", title: "Bioluminous", image: img("yk-new-5"), badge: "SUB", rating: 8.0, year: 2025 },
  { id: "n6", title: "Cassette Future", image: img("yk-new-6"), badge: "NEW", rating: 8.2, year: 2025 },
];

const MANGA: Poster[] = [
  { id: "m1", title: "Hanabi Static Vol.1", image: img("yk-manga-1"), badge: "HOT", rating: 9.0 },
  { id: "m2", title: "Iron Crane Diary", image: img("yk-manga-2"), badge: "NEW", rating: 8.4 },
  { id: "m3", title: "Pale Comet", image: img("yk-manga-3"), badge: "ONGOING", rating: 8.7 },
  { id: "m4", title: "Sword & Synth", image: img("yk-manga-4"), badge: "VIRAL", rating: 9.1 },
  { id: "m5", title: "Cherry Glitch", image: img("yk-manga-5"), badge: "NEW", rating: 8.2 },
  { id: "m6", title: "Phantom Idol", image: img("yk-manga-6"), badge: "HOT", rating: 8.8 },
];

function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-4 pt-10 sm:px-8 md:pt-16">
      <div className="relative mx-auto max-w-7xl">
        <div className="relative grid items-end gap-8 md:grid-cols-12">
          {/* Backdrop */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <img
              src={img("yk-hero", 1800, 1000)}
              alt=""
              className="h-full w-full rounded-3xl object-cover opacity-40"
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-senpai-bg via-senpai-bg/70 to-transparent" />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-senpai-bg via-senpai-bg/40 to-transparent" />
          </div>

          <div className="md:col-span-8 lg:col-span-7 py-10 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <span className="senpai-sticker !text-senpai-amber !border-senpai-amber/40">
                <Flame className="h-3 w-3" /> Featured · Ep 07
              </span>
              <span className="font-[var(--font-hand)] text-xl text-senpai-teal">arriving tonight ✦</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="senpai-mega mt-4 text-[15vw] leading-[0.85] sm:text-7xl md:text-[88px] lg:text-[120px]"
            >
              <span className="senpai-grad-text-cyber">NEON</span>
              <br />
              <span className="senpai-stroke-text">SAMURAI</span>
              <br />
              <span className="senpai-grad-text-fire">REQUIEM</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 max-w-xl text-sm text-senpai-text-dim sm:text-base"
            >
              In a Tokyo rebuilt from chrome and prayer, a silent blade hunts a corporation that
              learned to grow gods. Eight episodes. Zero compromises.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/watch/$id"
                params={{ id: "t1" }}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-senpai-violet via-senpai-fuchsia to-senpai-pink px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_var(--senpai-fuchsia)] transition-transform hover:scale-[1.03]"
              >
                <Play className="h-4 w-4 fill-current" /> Watch Now
              </Link>
              <button className="senpai-glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10">
                <Plus className="h-4 w-4" /> Watchlist
              </button>
              <Link
                to="/detail/$id"
                params={{ id: "t1" }}
                className="inline-flex items-center gap-1 px-3 py-3 text-sm text-senpai-text-dim hover:text-white"
              >
                More info <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="mt-10 flex items-center gap-6 text-xs uppercase tracking-[0.3em] text-senpai-text-muted">
              <span>4K HDR</span>
              <span className="h-px w-8 bg-senpai-border-strong" />
              <span>Dolby Atmos</span>
              <span className="h-px w-8 bg-senpai-border-strong" />
              <span className="text-senpai-teal">Sub · Dub</span>
            </div>
          </div>

          <div className="hidden md:col-span-4 lg:col-span-5 md:flex justify-end pb-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative w-full max-w-xs"
            >
              <PosterCard poster={TRENDING[0]} />
              <div className="senpai-sticker absolute -top-3 -right-3 !bg-senpai-fuchsia !text-white !border-transparent shadow-[0_0_20px_var(--senpai-fuchsia)]">
                Live Drop
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({
  title,
  kicker,
  items,
  kind,
  accent,
}: {
  title: string;
  kicker: string;
  items: Poster[];
  kind?: "anime" | "manga";
  accent?: "violet" | "fire" | "cyber";
}) {
  const grad =
    accent === "fire" ? "senpai-grad-text-fire" : accent === "cyber" ? "senpai-grad-text-cyber" : "senpai-grad-text";
  return (
    <section className="relative mx-auto mt-16 max-w-7xl px-4 sm:px-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <div className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.35em] text-senpai-text-muted">
            {kicker}
          </div>
          <h2 className={`senpai-mega mt-1 text-3xl sm:text-4xl md:text-5xl ${grad}`}>{title}</h2>
        </div>
        <Link to="/browse" className="senpai-glass inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs uppercase tracking-widest text-senpai-text-dim hover:text-white">
          See all <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-4">
        {items.map((p) => (
          <PosterCard key={p.id} poster={p} kind={kind} />
        ))}
      </div>
    </section>
  );
}

function Genres() {
  const items = [
    { label: "Action", emoji: "⚔", grad: "from-senpai-red to-senpai-orange" },
    { label: "Sci-Fi", emoji: "🛸", grad: "from-senpai-teal to-senpai-violet" },
    { label: "Romance", emoji: "❀", grad: "from-senpai-pink to-senpai-fuchsia" },
    { label: "Horror", emoji: "✶", grad: "from-senpai-violet-2 to-senpai-red" },
    { label: "Slice", emoji: "✿", grad: "from-senpai-amber to-senpai-pink" },
    { label: "Mecha", emoji: "✦", grad: "from-senpai-violet to-senpai-teal" },
  ];
  return (
    <section className="relative mx-auto mt-20 max-w-7xl px-4 sm:px-8">
      <div className="mb-6 flex items-center gap-3">
        <Sparkles className="h-4 w-4 text-senpai-teal" />
        <div className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.35em] text-senpai-text-muted">
          Explore by mood
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {items.map((g) => (
          <Link
            key={g.label}
            to="/genres"
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${g.grad} p-5 transition-transform hover:scale-[1.03]`}
          >
            <div className="absolute inset-0 senpai-halftone opacity-25 mix-blend-overlay" />
            <div className="relative flex items-center justify-between">
              <span className="font-[var(--font-display)] text-2xl tracking-wide text-white">{g.label}</span>
              <span className="text-3xl">{g.emoji}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function LiveTV() {
  return (
    <section className="relative mx-auto mt-20 max-w-7xl px-4 sm:px-8">
      <div className="senpai-glass senpai-glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-10">
        <div className="senpai-aurora" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="senpai-sticker !text-senpai-red !border-senpai-red/50">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-senpai-red shadow-[0_0_8px_var(--senpai-red)]" />
              On Air
            </span>
            <h3 className="senpai-mega mt-4 text-4xl sm:text-5xl md:text-6xl">
              <span className="senpai-grad-text-cyber">LIVE TV</span>
              <span className="font-[var(--font-jp)] ml-3 text-2xl text-senpai-text-dim">放送中</span>
            </h3>
            <p className="mt-3 max-w-md text-sm text-senpai-text-dim">
              200+ channels streaming nonstop — anime networks, Tokyo news, retro reruns, J-music.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {["Tokyo MX", "AT-X", "BS11", "ANIPLEX"].map((c) => (
              <div key={c} className="senpai-glass rounded-xl px-4 py-3 text-xs uppercase tracking-widest">
                <div className="text-senpai-teal">● live</div>
                <div className="mt-1 font-semibold">{c}</div>
              </div>
            ))}
            <Link
              to="/live-tv"
              className="grid place-items-center rounded-xl bg-gradient-to-br from-senpai-violet to-senpai-fuchsia px-5 text-sm font-semibold text-white"
            >
              <Tv className="mr-2 inline h-4 w-4" /> Tune In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = ["夜界", "STREAM BEYOND", "★", "ANIME", "MOVIES", "LIVE TV", "MANGA", "✦", "4K HDR", "夜界"];
  const row = (
    <div className="senpai-marquee-track">
      {[...words, ...words].map((w, i) => (
        <span key={i} className="senpai-mega text-6xl text-senpai-text-muted/60">
          {w}
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative mt-24 overflow-hidden border-y border-senpai-border py-8">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-senpai-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-senpai-bg to-transparent" />
      {row}
    </div>
  );
}

function Home() {
  return (
    <AppShell>
      <Hero />
      <Row title="Trending Now" kicker="Top 10 · This week" items={TRENDING} accent="violet" />
      <Row title="New Drops" kicker="Fresh from the studio" items={NEW_DROPS} accent="fire" />
      <Genres />
      <LiveTV />
      <Row title="Manga Spotlight" kicker={`MangaDex · ${"BookOpen"}`} items={MANGA} kind="manga" accent="cyber" />
      <Marquee />
    </AppShell>
  );
}

// silence unused-import warning for icons referenced only in subcomponents above
void BookOpen;
