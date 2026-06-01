import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ShareButton } from "@/components/ShareButton";
import { mangaDetailQuery, mangaChaptersQuery } from "@/lib/api/manga.functions";

export const Route = createFileRoute("/manga/$id")({
  head: () => ({ meta: [{ title: "Manga Detail — YORUKAI.TV" }] }),
  component: () => (
    <AppShell>
      <Detail />
    </AppShell>
  ),
});

function Detail() {
  const { id } = Route.useParams();
  const { data: manga, isLoading } = useQuery(mangaDetailQuery(id));
  const { data: chapters, isLoading: loadingCh } = useQuery(mangaChaptersQuery(id));

  if (isLoading) {
    return <div className="mx-auto max-w-6xl px-6 py-24"><div className="h-96 w-full animate-pulse rounded-3xl bg-white/5" /></div>;
  }
  if (!manga) {
    return <div className="mx-auto max-w-3xl px-6 py-24 text-center"><h1 className="senpai-mega text-5xl senpai-grad-text-fire">404</h1><p className="mt-4 text-senpai-text-dim">Manga not found.</p></div>;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-8 pt-6 pb-32">
      <div className="flex items-center justify-between gap-3">
        <Link to="/manga" className="senpai-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/10">
          <ArrowLeft className="h-4 w-4" /> Manga
        </Link>
        <ShareButton title={manga.title} />
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-[260px_1fr]">
        <div className="senpai-poster relative mx-auto aspect-[2/3] w-full max-w-[260px]">
          {manga.cover ? <img src={manga.cover} alt={manga.title} referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 grid place-items-center bg-white/5"><BookOpen className="h-10 w-10" /></div>}
        </div>
        <div>
          <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl tracking-wide text-white">{manga.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest text-senpai-text-dim">
            {manga.status && <span className="senpai-glass rounded-full px-3 py-1">{manga.status}</span>}
            {manga.year && <span className="senpai-glass rounded-full px-3 py-1">{manga.year}</span>}
            {manga.tags.slice(0, 6).map((t) => <span key={t} className="senpai-glass rounded-full px-3 py-1 text-senpai-teal">{t}</span>)}
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-senpai-text-dim line-clamp-6">{manga.description}</p>
        </div>
      </div>

      <section className="mt-12">
        <div className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-senpai-text-muted">Chapters · ascending</div>
        {loadingCh ? (
          <div className="mt-4 space-y-2">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-12 w-full animate-pulse rounded-xl bg-white/5" />)}</div>
        ) : chapters && chapters.length > 0 ? (
          <div className="mt-4 grid gap-2">
            {chapters.map((c) => (
              <Link
                key={c.id}
                to="/reader/$id"
                params={{ id: c.id }}
                search={{ manga: id }}
                className="senpai-glass flex items-center justify-between gap-4 rounded-xl px-4 py-3 text-sm hover:bg-white/5"
              >
                <span className="font-semibold">
                  {c.volume ? `Vol ${c.volume} · ` : ""}Chapter {c.chapter ?? "?"}
                  {c.title ? <span className="ml-2 text-senpai-text-dim">{c.title}</span> : null}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-senpai-text-muted">{c.pages} pages</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-senpai-text-muted">No English chapters available.</p>
        )}
      </section>
    </section>
  );
}
