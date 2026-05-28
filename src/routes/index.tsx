import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Play, Plus, ChevronRight, Sparkles, Tv, Flame } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ContentPoster } from "@/components/ContentPoster";
import { homeFeedQuery, FALLBACK_BANNER, type ContentRow } from "@/lib/api/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YORUKAI.TV — Stream Beyond" },
      { name: "description", content: "The cinematic home of anime, movies, live TV, and manga." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(homeFeedQuery),
  component: Home,
  errorComponent: ({ error }) => (
    <AppShell>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="senpai-mega text-5xl senpai-grad-text-fire">SIGNAL LOST</h1>
        <p className="mt-4 text-senpai-text-dim">{error.message}</p>
      </div>
    </AppShell>
  ),
  notFoundComponent: () => <AppShell><div className="p-20 text-center">404</div></AppShell>,
});

function Hero({ item }: { item: ContentRow }) {
  const banner = item.banner_url || item.poster_url || FALLBACK_BANNER(item.id);
  const words = item.title.toUpperCase().split(/\s+/);
  return (
    <section className="relative isolate overflow-hidden px-4 pt-10 sm:px-8 md:pt-16">
      <div className="relative mx-auto max-w-7xl">
        <div className="relative grid items-end gap-8 md:grid-cols-12">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <img src={banner} alt="" className="h-full w-full rounded-3xl object-cover opacity-40" />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-senpai-bg via-senpai-bg/70 to-transparent" />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-senpai-bg via-senpai-bg/40 to-transparent" />
          </div>

          <div className="md:col-span-8 lg:col-span-7 py-10 md:py-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-3">
              <span className="senpai-sticker !text-senpai-amber !border-senpai-amber/40">
                <Flame className="h-3 w-3" /> Featured · {item.type}
              </span>
              <span className="font-[var(--font-hand)] text-xl text-senpai-teal">streaming now ✦</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
              className="senpai-mega mt-4 text-[14vw] leading-[0.85] sm:text-6xl md:text-7xl lg:text-[96px] break-words"
            >
              {words.map((w, i) => (
                <span key={i} className={i % 3 === 0 ? "senpai-grad-text-cyber" : i % 3 === 1 ? "senpai-stroke-text" : "senpai-grad-text-fire"}>
                  {w}{i < words.length - 1 ? " " : ""}
                </span>
              ))}
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 max-w-xl text-sm text-senpai-text-dim sm:text-base line-clamp-3">
              {item.description || "An untold story drops tonight. Cinematic. Cyberpunk. Absolutely senpai."}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/detail/$id" params={{ id: item.id }} className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-senpai-violet via-senpai-fuchsia to-senpai-pink px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_var(--senpai-fuchsia)] transition-transform hover:scale-[1.03]">
                <Play className="h-4 w-4 fill-current" /> Watch Now
              </Link>
              <button className="senpai-glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10">
                <Plus className="h-4 w-4" /> Watchlist
              </button>
              <Link to="/detail/$id" params={{ id: item.id }} className="inline-flex items-center gap-1 px-3 py-3 text-sm text-senpai-text-dim hover:text-white">
                More info <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="mt-10 flex items-center gap-6 text-xs uppercase tracking-[0.3em] text-senpai-text-muted">
              {item.rating != null && <span className="text-senpai-amber">★ {Number(item.rating).toFixed(1)}</span>}
              <span className="h-px w-8 bg-senpai-border-strong" />
              <span>{item.release_year ?? "—"}</span>
              <span className="h-px w-8 bg-senpai-border-strong" />
              <span className="text-senpai-teal">{item.language ?? "JP"}</span>
            </div>
          </div>

          <div className="hidden md:col-span-4 lg:col-span-5 md:flex justify-end pb-10">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="relative w-full max-w-xs">
              <ContentPoster item={item} />
              <div className="senpai-sticker absolute -top-3 -right-3 !bg-senpai-fuchsia !text-white !border-transparent shadow-[0_0_20px_var(--senpai-fuchsia)]">Live Drop</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ title, kicker, items, accent }: { title: string; kicker: string; items: ContentRow[]; accent?: "violet" | "fire" | "cyber" }) {
  if (!items.length) return null;
  const grad = accent === "fire" ? "senpai-grad-text-fire" : accent === "cyber" ? "senpai-grad-text-cyber" : "senpai-grad-text";
  return (
    <section className="relative mx-auto mt-16 max-w-7xl px-4 sm:px-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <div className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.35em] text-senpai-text-muted">{kicker}</div>
          <h2 className={`senpai-mega mt-1 text-3xl sm:text-4xl md:text-5xl ${grad}`}>{title}</h2>
        </div>
        <Link to="/browse" className="senpai-glass inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs uppercase tracking-widest text-senpai-text-dim hover:text-white">
          See all <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-4">
        {items.slice(0, 12).map((p) => <ContentPoster key={p.id} item={p} />)}
      </div>
    </section>
  );
}

function Genres({ items }: { items: { id: string; name: string; slug: string }[] }) {
  const palette = ["from-senpai-red to-senpai-orange", "from-senpai-teal to-senpai-violet", "from-senpai-pink to-senpai-fuchsia", "from-senpai-violet-2 to-senpai-red", "from-senpai-amber to-senpai-pink", "from-senpai-violet to-senpai-teal"];
  return (
    <section className="relative mx-auto mt-20 max-w-7xl px-4 sm:px-8">
      <div className="mb-6 flex items-center gap-3">
        <Sparkles className="h-4 w-4 text-senpai-teal" />
        <div className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.35em] text-senpai-text-muted">Explore by mood</div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {items.slice(0, 12).map((g, i) => (
          <Link key={g.id} to="/browse" search={{ genre: g.slug } as never} className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${palette[i % palette.length]} p-5 transition-transform hover:scale-[1.03]`}>
            <div className="absolute inset-0 senpai-halftone opacity-25 mix-blend-overlay" />
            <div className="relative flex items-center justify-between">
              <span className="font-[var(--font-display)] text-xl tracking-wide text-white">{g.name}</span>
              <span className="text-2xl">✦</span>
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
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-senpai-red shadow-[0_0_8px_var(--senpai-red)]" /> On Air
            </span>
            <h3 className="senpai-mega mt-4 text-4xl sm:text-5xl md:text-6xl">
              <span className="senpai-grad-text-cyber">LIVE TV</span>
              <span className="font-[var(--font-jp)] ml-3 text-2xl text-senpai-text-dim">放送中</span>
            </h3>
            <p className="mt-3 max-w-md text-sm text-senpai-text-dim">2,000+ channels streaming nonstop — anime networks, Tokyo news, retro reruns, J-music.</p>
          </div>
          <Link to="/live-tv" className="grid place-items-center rounded-xl bg-gradient-to-br from-senpai-violet to-senpai-fuchsia px-6 py-4 text-sm font-semibold text-white">
            <Tv className="mr-2 inline h-4 w-4" /> Tune In
          </Link>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = ["夜界", "STREAM BEYOND", "★", "ANIME", "MOVIES", "LIVE TV", "MANGA", "✦", "4K HDR", "夜界"];
  return (
    <div className="relative mt-24 overflow-hidden border-y border-senpai-border py-8">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-senpai-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-senpai-bg to-transparent" />
      <div className="senpai-marquee-track">
        {[...words, ...words].map((w, i) => (
          <span key={i} className="senpai-mega text-6xl text-senpai-text-muted/60">{w}</span>
        ))}
      </div>
    </div>
  );
}

function Home() {
  const { data } = useSuspenseQuery(homeFeedQuery);
  const hero = data.featured[0] ?? data.trending[0];
  return (
    <AppShell>
      {hero && <Hero item={hero} />}
      <Row title="Trending Now" kicker="Top picks · This week" items={data.trending} accent="violet" />
      <Row title="New Drops" kicker="Fresh from the studio" items={data.recent} accent="fire" />
      <Genres items={data.genres} />
      <LiveTV />
      <Row title="Featured" kicker="Editor's selection" items={data.featured} accent="cyber" />
      <Marquee />
    </AppShell>
  );
}
