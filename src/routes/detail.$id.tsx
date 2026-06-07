import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Play, Plus, Star, Clock, Calendar, Tv } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { detailQuery, FALLBACK_BANNER, FALLBACK_POSTER } from "@/lib/api/content";

export const Route = createFileRoute("/detail/$id")({
  head: ({ loaderData, params }) => {
    const c = (loaderData as { content?: { title: string; description: string | null; banner_url: string | null; type?: string; release_year?: number | null; rating?: number | null } } | undefined)?.content;
    const url = `https://anisti.vercel.app/detail/${params.id}`;
    const title = c ? `${c.title} — YORUKAI.TV` : "Detail — YORUKAI.TV";
    const desc = c?.description?.slice(0, 160) ?? "Series detail on YORUKAI.TV";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "video.other" },
        { property: "og:url", content: url },
        ...(c?.banner_url ? [{ property: "og:image", content: c.banner_url }, { name: "twitter:image", content: c.banner_url }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: c
        ? [{
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": c.type === "movie" ? "Movie" : "TVSeries",
              name: c.title,
              description: desc,
              image: c.banner_url ?? undefined,
              datePublished: c.release_year ? String(c.release_year) : undefined,
              ...(c.rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: c.rating, bestRating: 10, ratingCount: 1 } } : {}),
              url,
            }),
          }]
        : [],
    };
  },
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(detailQuery(params.id));
    if (!data.content) throw notFound();
    return data;
  },
  component: Detail,
  errorComponent: ({ error }) => (
    <AppShell><div className="p-20 text-center"><h1 className="senpai-mega text-4xl senpai-grad-text-fire">Error</h1><p className="text-senpai-text-dim mt-4">{error.message}</p></div></AppShell>
  ),
  notFoundComponent: () => (
    <AppShell><div className="p-20 text-center"><h1 className="senpai-mega text-5xl senpai-grad-text-fire">404</h1><p className="text-senpai-text-dim mt-4">Title not found</p></div></AppShell>
  ),
});

function Detail() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(detailQuery(id));
  const content = data.content!;
  const seasons = Array.from(new Set(data.episodes.map((e) => e.season_number))).sort((a, b) => a - b);
  const [season, setSeason] = useState<number>(seasons[0] ?? 1);
  const eps = data.episodes.filter((e) => e.season_number === season);
  const firstEp = data.episodes[0];

  return (
    <AppShell>
      <section className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-[70vh]">
          <img src={content.banner_url || content.poster_url || FALLBACK_BANNER(content.id)} alt="" className="h-full w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-senpai-bg via-senpai-bg/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-senpai-bg via-senpai-bg/40 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-8 pt-16 md:pt-24">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-end">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="senpai-poster aspect-[2/3] w-full max-w-[280px]">
              <img src={content.poster_url || FALLBACK_POSTER(content.id)} alt={content.title} className="senpai-duotone absolute inset-0 h-full w-full object-cover" />
            </motion.div>
            <div>
              <div className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.35em] text-senpai-text-muted">{content.type} · {content.status}</div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="senpai-mega mt-2 text-4xl sm:text-6xl md:text-7xl">
                <span className="senpai-grad-text">{content.title}</span>
              </motion.h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs uppercase tracking-widest text-senpai-text-dim">
                {content.rating != null && <span className="inline-flex items-center gap-1 text-senpai-amber"><Star className="h-3.5 w-3.5 fill-current" /> {Number(content.rating).toFixed(1)}</span>}
                {content.release_year && <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {content.release_year}</span>}
                {content.duration_minutes && <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {content.duration_minutes}m</span>}
                {data.episodes.length > 0 && <span className="inline-flex items-center gap-1"><Tv className="h-3.5 w-3.5" /> {data.episodes.length} eps</span>}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {data.genres.map((g) => (
                  <Link key={g.id} to="/browse" search={{ genre: g.slug } as never} className="senpai-sticker hover:!text-senpai-teal">{g.name}</Link>
                ))}
              </div>
              <p className="mt-5 max-w-2xl text-sm text-senpai-text-dim sm:text-base">{content.description || "No synopsis available yet."}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {firstEp && (
                  <Link to="/watch/$id" params={{ id: firstEp.id }} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-senpai-violet via-senpai-fuchsia to-senpai-pink px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_var(--senpai-fuchsia)] hover:scale-[1.03] transition-transform">
                    <Play className="h-4 w-4 fill-current" /> Watch S{firstEp.season_number} · E{firstEp.episode_number}
                  </Link>
                )}
                <button className="senpai-glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white hover:bg-white/10"><Plus className="h-4 w-4" /> Watchlist</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {seasons.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-8 pt-20 pb-32">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.35em] text-senpai-text-muted">Episodes</div>
              <h2 className="senpai-mega mt-1 text-3xl sm:text-4xl senpai-grad-text-cyber">SEASON {season}</h2>
            </div>
            {seasons.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {seasons.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeason(s)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest ${
                      season === s ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia text-white" : "senpai-glass text-senpai-text-dim hover:text-white"
                    }`}
                  >S{s}</button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {eps.map((ep) => (
              <Link
                key={ep.id} to="/watch/$id" params={{ id: ep.id }}
                className="senpai-glass group relative overflow-hidden rounded-2xl p-3 hover:bg-white/5 transition-colors"
              >
                <div className="relative aspect-video overflow-hidden rounded-xl">
                  <img
                    src={ep.thumbnail_url || content.thumbnail_url || content.banner_url || FALLBACK_POSTER(ep.id)}
                    alt=""
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_POSTER(ep.id); }}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
                  <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-senpai-violet to-senpai-fuchsia shadow-[0_0_24px_var(--senpai-fuchsia)]">
                      <Play className="h-5 w-5 fill-current text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 senpai-sticker !px-2 !py-1 !text-[10px]">E{ep.episode_number}</div>
                </div>
                <div className="mt-2 px-1">
                  <div className="font-[var(--font-display)] text-sm tracking-wide text-white line-clamp-1">
                    {ep.title || `Episode ${ep.episode_number}`}
                  </div>
                  {ep.description && <p className="mt-1 text-xs text-senpai-text-muted line-clamp-2">{ep.description}</p>}
                </div>
              </Link>
            ))}
          </div>

          {eps.length === 0 && (
            <div className="senpai-glass mt-6 rounded-2xl p-16 text-center text-senpai-text-dim">No episodes in this season yet.</div>
          )}
        </section>
      )}
    </AppShell>
  );
}
