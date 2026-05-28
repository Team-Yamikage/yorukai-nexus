import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ContentPoster } from "@/components/ContentPoster";
import { browseQuery, homeFeedQuery } from "@/lib/api/content";
import { useState } from "react";

type SearchParams = { q?: string; genre?: string; year?: number; type?: string };

export const Route = createFileRoute("/browse")({
  head: () => ({ meta: [{ title: "Browse — YORUKAI.TV" }, { name: "description", content: "Browse anime, movies, and series." }] }),
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    q: s.q ? String(s.q) : undefined,
    genre: s.genre ? String(s.genre) : undefined,
    year: s.year ? Number(s.year) || undefined : undefined,
    type: s.type ? String(s.type) : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(browseQuery(deps)),
      context.queryClient.ensureQueryData(homeFeedQuery),
    ]);
  },
  component: Browse,
  errorComponent: ({ error }) => (
    <AppShell><div className="p-20 text-center"><h1 className="senpai-mega text-4xl senpai-grad-text-fire">Error</h1><p className="text-senpai-text-dim mt-4">{error.message}</p></div></AppShell>
  ),
  notFoundComponent: () => <AppShell><div className="p-20 text-center">404</div></AppShell>,
});

function Browse() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { data: items } = useSuspenseQuery(browseQuery(search));
  const { data: feed } = useSuspenseQuery(homeFeedQuery);
  const [q, setQ] = useState(search.q ?? "");

  const update = (patch: Partial<SearchParams>) =>
    navigate({ to: "/browse", search: (prev: SearchParams) => ({ ...prev, ...patch }) });

  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];
  const types = ["series", "movie"];

  return (
    <AppShell>
      <section className="relative mx-auto max-w-7xl px-4 sm:px-8 pt-10">
        <div className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.35em] text-senpai-text-muted">Discover</div>
        <h1 className="senpai-mega mt-2 text-5xl sm:text-7xl"><span className="senpai-grad-text-cyber">BROWSE</span></h1>

        <form
          onSubmit={(e) => { e.preventDefault(); update({ q: q || undefined }); }}
          className="senpai-glass senpai-glass-strong mt-8 flex items-center gap-3 rounded-2xl p-3"
        >
          <Search className="h-4 w-4 text-senpai-text-muted ml-2" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search titles…"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-senpai-text-muted outline-none"
          />
          {q && (
            <button type="button" onClick={() => { setQ(""); update({ q: undefined }); }} className="text-senpai-text-muted hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
          <button type="submit" className="rounded-xl bg-gradient-to-r from-senpai-violet to-senpai-fuchsia px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white">Search</button>
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          <Chip active={!search.genre && !search.type && !search.year} onClick={() => navigate({ to: "/browse", search: {} })}>All</Chip>
          {types.map((t) => (
            <Chip key={t} active={search.type === t} onClick={() => update({ type: search.type === t ? undefined : t })}>{t}</Chip>
          ))}
          <span className="mx-2 h-6 w-px self-center bg-senpai-border-strong" />
          {years.map((y) => (
            <Chip key={y} active={search.year === y} onClick={() => update({ year: search.year === y ? undefined : y })}>{y}</Chip>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {feed.genres.slice(0, 18).map((g) => (
            <Chip key={g.id} accent active={search.genre === g.slug} onClick={() => update({ genre: search.genre === g.slug ? undefined : g.slug })}>{g.name}</Chip>
          ))}
        </div>

        <div className="mt-8 font-[var(--font-mono)] text-xs uppercase tracking-widest text-senpai-text-muted">
          {items.length} {items.length === 1 ? "result" : "results"}
        </div>

        {items.length === 0 ? (
          <div className="senpai-glass mt-6 rounded-2xl p-16 text-center">
            <div className="senpai-mega text-3xl senpai-grad-text-fire">NO SIGNAL</div>
            <p className="mt-2 text-sm text-senpai-text-dim">No content matches these filters.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-4 pb-20">
            {items.map((it) => <ContentPoster key={it.id} item={it} />)}
          </div>
        )}
      </section>
    </AppShell>
  );
}

function Chip({ children, active, onClick, accent }: { children: React.ReactNode; active?: boolean; onClick: () => void; accent?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-widest transition-all ${
        active
          ? accent
            ? "bg-gradient-to-r from-senpai-teal to-senpai-violet text-white shadow-[0_0_18px_-4px_var(--senpai-violet)]"
            : "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia text-white shadow-[0_0_18px_-4px_var(--senpai-fuchsia)]"
          : "senpai-glass text-senpai-text-dim hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
