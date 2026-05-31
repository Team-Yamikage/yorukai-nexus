import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Library as LibraryIcon, History, Bookmark, Play } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ContentPoster } from "@/components/ContentPoster";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { FALLBACK_POSTER, type ContentRow, type EpisodeRow } from "@/lib/api/content";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library — YORUKAI.TV" },
      { name: "description", content: "Your continue-watching list and watchlist on YORUKAI.TV." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AppShell>
      <LibraryPage />
    </AppShell>
  ),
});

type ContinueItem = {
  episode: EpisodeRow;
  content: ContentRow | null;
  progress: number;
  total: number;
};

function LibraryPage() {
  const { user, loading } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["library", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [history, watchlist] = await Promise.all([
        supabase
          .from("watch_history")
          .select("*")
          .order("last_watched_at", { ascending: false })
          .limit(24),
        supabase
          .from("watchlist")
          .select("content_id, created_at")
          .order("created_at", { ascending: false }),
      ]);

      const epIds = (history.data ?? []).map((h) => h.episode_id);
      const wlIds = (watchlist.data ?? []).map((w) => w.content_id);

      const [episodes, contentForEps, contentForWl] = await Promise.all([
        epIds.length ? supabase.from("episodes").select("*").in("id", epIds) : Promise.resolve({ data: [] }),
        Promise.resolve({ data: [] }),
        wlIds.length ? supabase.from("content").select("*").in("id", wlIds) : Promise.resolve({ data: [] }),
      ]);

      const epMap = new Map((episodes.data ?? []).map((e: any) => [e.id, e as EpisodeRow]));
      const epContentIds = Array.from(new Set((episodes.data ?? []).map((e: any) => e.content_id)));
      const epContent = epContentIds.length
        ? await supabase.from("content").select("*").in("id", epContentIds)
        : { data: [] };
      const epContentMap = new Map((epContent.data ?? []).map((c: any) => [c.id, c as ContentRow]));

      const continueItems: ContinueItem[] = (history.data ?? [])
        .map((h) => {
          const ep = epMap.get(h.episode_id);
          if (!ep) return null;
          return {
            episode: ep,
            content: epContentMap.get(ep.content_id) ?? null,
            progress: h.progress_seconds,
            total: h.total_seconds,
          } as ContinueItem;
        })
        .filter(Boolean) as ContinueItem[];

      void contentForEps;
      return {
        continueItems,
        watchlist: (contentForWl.data ?? []) as ContentRow[],
      };
    },
  });

  if (!loading && !user) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-28 text-center">
        <h1 className="senpai-mega text-6xl senpai-grad-text-fire">LIBRARY</h1>
        <p className="mt-6 text-senpai-text-dim">Sign in to track your continue-watching list and watchlist.</p>
        <Link to="/auth" className="senpai-glass mt-8 inline-block rounded-full px-6 py-3 text-sm hover:bg-white/10">Sign in</Link>
      </section>
    );
  }

  return (
    <section className="relative mx-auto max-w-[1600px] px-4 sm:px-8 pt-10 pb-32">
      <span className="senpai-sticker"><LibraryIcon className="h-3 w-3" /> Your shelves</span>
      <h1 className="senpai-mega mt-3 text-6xl sm:text-7xl senpai-grad-text-fire">LIBRARY</h1>

      <h2 className="mt-12 flex items-center gap-2 font-[var(--font-display)] text-xl tracking-wide">
        <History className="h-5 w-5 text-senpai-teal" /> Continue Watching
      </h2>
      {isLoading ? (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="aspect-video animate-pulse rounded-2xl bg-white/5" />)}
        </div>
      ) : (data?.continueItems.length ?? 0) === 0 ? (
        <p className="mt-5 text-senpai-text-muted">Nothing in progress yet.</p>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data!.continueItems.map((it) => (
            <Link key={it.episode.id} to="/watch/$id" params={{ id: it.episode.id }} className="senpai-glass group relative flex gap-3 overflow-hidden rounded-2xl p-2.5 hover:bg-white/5">
              <div className="relative aspect-video w-40 flex-none overflow-hidden rounded-lg">
                <img src={it.episode.thumbnail_url || it.content?.banner_url || FALLBACK_POSTER(it.episode.id)} alt="" className="h-full w-full object-cover" />
                <div className="grid absolute inset-0 place-items-center opacity-0 transition-opacity group-hover:opacity-100"><Play className="h-8 w-8 fill-current text-white" /></div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
                  <div className="h-full bg-gradient-to-r from-senpai-violet to-senpai-fuchsia" style={{ width: `${it.total ? Math.min(100, (it.progress / it.total) * 100) : 0}%` }} />
                </div>
              </div>
              <div className="min-w-0 self-center">
                <div className="font-[var(--font-display)] text-sm tracking-wide line-clamp-1">{it.content?.title ?? "Episode"}</div>
                <div className="text-[10px] uppercase tracking-widest text-senpai-text-muted">S{it.episode.season_number} · E{it.episode.episode_number}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <h2 className="mt-14 flex items-center gap-2 font-[var(--font-display)] text-xl tracking-wide">
        <Bookmark className="h-5 w-5 text-senpai-fuchsia" /> Watchlist
      </h2>
      {(data?.watchlist.length ?? 0) === 0 && !isLoading ? (
        <p className="mt-5 text-senpai-text-muted">Your watchlist is empty.</p>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {data?.watchlist.map((item) => <ContentPoster key={item.id} item={item} />)}
        </div>
      )}
    </section>
  );
}
