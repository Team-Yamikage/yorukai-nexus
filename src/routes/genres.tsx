import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ContentPoster } from "@/components/ContentPoster";
import { browseQuery, homeFeedQuery } from "@/lib/api/content";

export const Route = createFileRoute("/genres")({
  head: () => ({
    meta: [
      { title: "Genres — YORUKAI.TV" },
      { name: "description", content: "Browse anime by genre — action, sci-fi, romance, mecha, horror, slice of life and more." },
      { property: "og:title", content: "Genres — YORUKAI.TV" },
      { property: "og:description", content: "Browse anime by genre on YORUKAI.TV." },
    ],
    links: [{ rel: "canonical", href: "https://neon-yokai.lovable.app/genres" }],
  }),
  component: () => (
    <AppShell>
      <Genres />
    </AppShell>
  ),
});

function Genres() {
  const { data: home } = useQuery(homeFeedQuery);
  const [active, setActive] = useState<string | null>(null);
  const { data: rows, isLoading } = useQuery({
    ...browseQuery({ genre: active ?? undefined, limit: 36 }),
    enabled: !!active,
  });

  const genres = home?.genres ?? [];

  return (
    <section className="relative mx-auto max-w-[1600px] px-4 sm:px-8 pt-10 pb-32">
      <span className="senpai-sticker"><Sparkles className="h-3 w-3" /> Mood index</span>
      <h1 className="senpai-mega mt-3 text-6xl sm:text-7xl senpai-grad-text">GENRES</h1>

      <div className="mt-8 flex flex-wrap gap-2">
        {genres.map((g) => (
          <button
            key={g.id}
            onClick={() => setActive((cur) => (cur === g.slug ? null : g.slug))}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition ${
              active === g.slug
                ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia text-white shadow-[0_0_16px_-4px_var(--senpai-fuchsia)]"
                : "senpai-glass text-senpai-text-dim hover:text-white"
            }`}
          >
            {g.name}
          </button>
        ))}
        {genres.length === 0 && <p className="text-senpai-text-muted">No genres yet.</p>}
      </div>

      {!active && (
        <p className="mt-16 text-center text-senpai-text-muted">Pick a genre to explore the catalogue.</p>
      )}

      {active && (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] w-full animate-pulse rounded-2xl bg-white/5" />
              ))
            : rows?.map((item) => <ContentPoster key={item.id} item={item} />)}
          {active && !isLoading && (rows?.length ?? 0) === 0 && (
            <p className="col-span-full text-center text-senpai-text-muted">Nothing in this genre yet.</p>
          )}
        </div>
      )}
    </section>
  );
}
