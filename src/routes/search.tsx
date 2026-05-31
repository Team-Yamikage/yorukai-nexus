import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ContentPoster } from "@/components/ContentPoster";
import { browseQuery } from "@/lib/api/content";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — YORUKAI.TV" },
      { name: "description", content: "Search the YORUKAI.TV catalogue of anime series and movies." },
      { property: "og:title", content: "Search — YORUKAI.TV" },
      { property: "og:description", content: "Find anime series and movies on YORUKAI.TV." },
    ],
    links: [{ rel: "canonical", href: "https://neon-yokai.lovable.app/search" }],
  }),
  component: () => (
    <AppShell>
      <SearchPage />
    </AppShell>
  ),
});

function SearchPage() {
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");

  // Debounce the input into the active search term.
  useEffect(() => {
    const t = setTimeout(() => setTerm(q.trim()), 350);
    return () => clearTimeout(t);
  }, [q]);

  const { data: rows, isFetching } = useQuery({
    ...browseQuery({ q: term || undefined, limit: 48 }),
    enabled: term.length >= 2,
  });

  return (
    <section className="relative mx-auto max-w-[1600px] px-4 sm:px-8 pt-10 pb-32">
      <span className="senpai-sticker"><SearchIcon className="h-3 w-3" /> Find anything</span>
      <h1 className="senpai-mega mt-3 text-6xl sm:text-7xl senpai-grad-text-cyber">SEARCH</h1>

      <div className="senpai-glass mt-8 flex items-center gap-3 rounded-full px-5 py-3.5">
        <SearchIcon className="h-5 w-5 text-senpai-text-muted" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search anime titles…"
          className="w-full bg-transparent text-base outline-none placeholder:text-senpai-text-muted"
        />
      </div>

      {term.length < 2 && (
        <p className="mt-16 text-center text-senpai-text-muted">Type at least 2 characters to search.</p>
      )}

      {term.length >= 2 && (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {isFetching
            ? Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] w-full animate-pulse rounded-2xl bg-white/5" />
              ))
            : rows?.map((item) => <ContentPoster key={item.id} item={item} />)}
          {!isFetching && (rows?.length ?? 0) === 0 && (
            <p className="col-span-full text-center text-senpai-text-muted">No results for “{term}”.</p>
          )}
        </div>
      )}
    </section>
  );
}
