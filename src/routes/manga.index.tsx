import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, BookOpen } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { mangaListQuery, type MangaItem } from "@/lib/api/manga.functions";

export const Route = createFileRoute("/manga/")({
  head: () => ({
    meta: [
      { title: "Manga — YORUKAI.TV" },
      { name: "description", content: "Read trending, popular and latest manga in high quality." },
    ],
  }),
  component: () => (
    <AppShell>
      <Manga />
    </AppShell>
  ),
});

type Kind = "popular" | "trending" | "latest";

function Manga() {
  const [kind, setKind] = useState<Kind>("popular");
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState("");
  const { data, isLoading, isError } = useQuery(mangaListQuery(kind, submitted || undefined));

  const tabs: { id: Kind; label: string }[] = [
    { id: "popular", label: "Popular" },
    { id: "trending", label: "Trending" },
    { id: "latest", label: "Latest" },
  ];

  return (
    <section className="relative mx-auto max-w-[1600px] px-4 sm:px-8 pt-10 pb-32">
      <span className="senpai-sticker"><BookOpen className="h-3 w-3" /> Manga library</span>
      <h1 className="senpai-mega mt-3 text-6xl sm:text-7xl senpai-grad-text">MANGA</h1>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setKind(t.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition ${
                kind === t.id && !submitted
                  ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia text-white shadow-[0_0_16px_-4px_var(--senpai-fuchsia)]"
                  : "senpai-glass text-senpai-text-dim hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); setSubmitted(q.trim()); }}
          className="senpai-glass flex items-center gap-2 rounded-full px-4 py-2.5"
        >
          <Search className="h-4 w-4 text-senpai-text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search manga…"
            className="w-44 bg-transparent text-sm outline-none placeholder:text-senpai-text-muted"
          />
        </form>
      </div>

      {isError && <p className="mt-16 text-center text-senpai-text-muted">Couldn't load manga. Try again.</p>}

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] w-full animate-pulse rounded-2xl bg-white/5" />
            ))
          : data?.items.map((m) => <MangaCard key={m.id} m={m} />)}
      </div>
    </section>
  );
}

function MangaCard({ m }: { m: MangaItem }) {
  return (
    <Link
      to="/manga/$id"
      params={{ id: m.id }}
      className="senpai-poster group block aspect-[2/3] w-full"
    >
      {m.cover ? (
        <img
          src={m.cover}
          alt={m.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          className="senpai-duotone absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-white/5"><BookOpen className="h-8 w-8 text-senpai-text-muted" /></div>
      )}
      <div className="absolute inset-x-0 bottom-0 z-10 p-3">
        <h3 className="font-[var(--font-display)] text-sm leading-tight tracking-wide text-white line-clamp-2">{m.title}</h3>
      </div>
    </Link>
  );
}
