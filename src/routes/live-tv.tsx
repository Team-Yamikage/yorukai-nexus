import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Tv, Radio } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { liveChannelsQuery, type LiveChannel } from "@/lib/api/iptv.functions";

export const Route = createFileRoute("/live-tv")({
  head: () => ({
    meta: [
      { title: "Live TV — Indian Channels | YORUKAI.TV" },
      { name: "description", content: "Stream live Indian TV channels — news, sports, entertainment, movies, music and more." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(liveChannelsQuery),
  component: () => (
    <AppShell>
      <LiveTV />
    </AppShell>
  ),
  errorComponent: ({ error }) => (
    <AppShell>
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="senpai-mega text-5xl senpai-grad-text-fire">SIGNAL LOST</h1>
        <p className="mt-4 text-senpai-text-dim">{error.message}</p>
      </div>
    </AppShell>
  ),
});

const CATEGORY_LABELS: Record<string, string> = {
  news: "News",
  sports: "Sports",
  entertainment: "Entertainment",
  movies: "Movies",
  music: "Music",
  kids: "Kids",
  religious: "Devotional",
  general: "General",
  documentary: "Documentary",
  lifestyle: "Lifestyle",
};

function LiveTV() {
  const { data: channels } = useSuspenseQuery(liveChannelsQuery);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const cats = useMemo(() => {
    const set = new Set<string>();
    channels.forEach((c) => c.categories.forEach((x) => set.add(x)));
    return ["all", ...Array.from(set).sort()];
  }, [channels]);

  const filtered = useMemo(() => {
    return channels.filter((c) => {
      const matchCat = cat === "all" || c.categories.includes(cat);
      const matchQ = !q || c.name.toLowerCase().includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [channels, q, cat]);

  return (
    <section className="relative mx-auto max-w-[1600px] px-4 sm:px-8 pt-10 pb-32">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="senpai-sticker"><Radio className="h-3 w-3" /> 放送中 · Live now</span>
          <h1 className="senpai-mega mt-3 text-6xl sm:text-7xl senpai-grad-text-fire">LIVE TV</h1>
          <p className="mt-3 text-senpai-text-dim">{channels.length} Indian channels streaming right now.</p>
        </div>
        <div className="senpai-glass flex items-center gap-2 rounded-full px-4 py-2.5">
          <Search className="h-4 w-4 text-senpai-text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search channels…"
            className="w-44 bg-transparent text-sm outline-none placeholder:text-senpai-text-muted"
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="mt-8 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition ${
              cat === c
                ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia text-white shadow-[0_0_16px_-4px_var(--senpai-fuchsia)]"
                : "senpai-glass text-senpai-text-dim hover:text-white"
            }`}
          >
            {c === "all" ? "All" : CATEGORY_LABELS[c] ?? c}
          </button>
        ))}
      </div>

      {/* Channel grid */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filtered.map((c) => (
          <ChannelCard key={c.id} c={c} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-16 text-center text-senpai-text-muted">No channels match your filter.</p>
      )}
    </section>
  );
}

function ChannelCard({ c }: { c: LiveChannel }) {
  return (
    <Link
      to="/live-watch/$id"
      params={{ id: c.id }}
      className="senpai-glass group flex flex-col items-center gap-3 rounded-2xl p-4 text-center transition hover:bg-white/5 hover:ring-1 hover:ring-senpai-fuchsia/40 focus-visible:ring-2 focus-visible:ring-senpai-fuchsia outline-none"
    >
      <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-xl bg-white/5">
        {c.logo ? (
          <img
            src={c.logo}
            alt={c.name}
            loading="lazy"
            className="h-full w-full object-contain p-1"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <Tv className="h-7 w-7 text-senpai-text-muted" />
        )}
      </div>
      <div className="min-w-0">
        <div className="line-clamp-2 text-xs font-semibold tracking-wide text-white">{c.name}</div>
        <div className="mt-1 text-[9px] uppercase tracking-widest text-senpai-teal">
          {CATEGORY_LABELS[c.categories[0]] ?? c.categories[0]}
        </div>
      </div>
    </Link>
  );
}
