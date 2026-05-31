import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import { ChevronLeft, ChevronRight, SkipForward, Settings, Languages, ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { episodeQuery, FALLBACK_POSTER, type ServerRow } from "@/lib/api/content";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { ShareButton } from "@/components/ShareButton";

export const Route = createFileRoute("/watch/$id")({
  head: () => ({ meta: [{ title: "Watch — YORUKAI.TV" }] }),
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(episodeQuery(params.id));
    if (!data.episode) throw notFound();
    return data;
  },
  component: Watch,
  errorComponent: ({ error }) => (
    <div className="min-h-dvh grid place-items-center bg-senpai-bg p-8 text-center">
      <div><h1 className="senpai-mega text-5xl senpai-grad-text-fire">SIGNAL LOST</h1><p className="mt-4 text-senpai-text-dim">{error.message}</p><Link to="/" className="senpai-glass mt-6 inline-block rounded-full px-5 py-2 text-sm">Go home</Link></div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-dvh grid place-items-center bg-senpai-bg p-8 text-center">
      <div><h1 className="senpai-mega text-5xl senpai-grad-text-fire">404</h1><p className="mt-4 text-senpai-text-dim">Episode not found</p><Link to="/" className="senpai-glass mt-6 inline-block rounded-full px-5 py-2 text-sm">Go home</Link></div>
    </div>
  ),
});

function Watch() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(episodeQuery(id));
  const { user } = useAuth();
  const qc = useQueryClient();
  const ep = data.episode!;
  const content = data.content;
  const playableServers = data.servers.filter((s) => !!s.embed_url);
  const directServers = data.servers.filter((s) => !s.embed_url);
  const [activeServer, setActiveServer] = useState<ServerRow | null>(playableServers[0] ?? directServers[0] ?? null);
  const isEmbed = !!activeServer?.embed_url && /\.(m3u8|mp4|webm)(\?|$)/i.test(activeServer.embed_url) === false;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showIntroSkip, setShowIntroSkip] = useState(false);

  const idxInSiblings = data.siblings.findIndex((s) => s.id === ep.id);
  const prevEp = data.siblings[idxInSiblings - 1];
  const nextEp = data.siblings[idxInSiblings + 1];

  // Save watch progress
  useEffect(() => {
    if (!user || !duration) return;
    const t = setInterval(() => {
      supabase.from("watch_history").upsert({
        user_id: user.id,
        episode_id: ep.id,
        progress_seconds: Math.floor(progress),
        total_seconds: Math.floor(duration),
        completed: progress / duration > 0.9,
        last_watched_at: new Date().toISOString(),
      } as never, { onConflict: "user_id,episode_id" } as never).then(() => {});
    }, 15000);
    return () => clearInterval(t);
  }, [user, ep.id, progress, duration]);

  // Mount HLS for direct streams
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !activeServer?.embed_url) return;
    const url = activeServer.embed_url;
    if (!/\.m3u8(\?|$)/i.test(url)) {
      v.src = url;
      return;
    }
    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true });
      hls.loadSource(url);
      hls.attachMedia(v);
      return () => hls.destroy();
    } else if (v.canPlayType("application/vnd.apple.mpegurl")) {
      v.src = url;
    }
  }, [activeServer]);

  // Show intro skip between 5-90s
  useEffect(() => {
    setShowIntroSkip(progress > 5 && progress < 90);
  }, [progress]);

  const togglePlay = () => {
    const v = videoRef.current; if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  return (
    <div className="relative min-h-dvh bg-senpai-bg text-white overflow-x-hidden">
      {/* Ambient lighting from poster */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-40">
        <img src={content?.banner_url || content?.poster_url || FALLBACK_POSTER(id)} alt="" className="h-full w-full object-cover blur-3xl scale-110" />
        <div className="absolute inset-0 bg-senpai-bg/70" />
      </div>

      <header className="relative z-10 flex items-center justify-between p-4 sm:p-6">
        <Link to="/detail/$id" params={{ id: ep.content_id }} className="senpai-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/10">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-senpai-text-muted">{content?.title}</div>
            <div className="font-[var(--font-display)] text-lg tracking-wide">S{ep.season_number} · E{ep.episode_number}{ep.title ? ` — ${ep.title}` : ""}</div>
          </div>
          <ShareButton title={content?.title} />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        <div className="senpai-glass-strong relative overflow-hidden rounded-3xl ring-1 ring-senpai-violet/30 shadow-[0_30px_120px_-30px_var(--senpai-violet)]">
          {/* Player */}
          <div className="relative aspect-video bg-black">
            {!activeServer ? (
              <div className="grid h-full place-items-center text-center p-8">
                <div>
                  <div className="senpai-mega text-3xl senpai-grad-text-fire">NO SERVERS</div>
                  <p className="mt-2 text-sm text-senpai-text-dim">This episode has no playable servers yet.</p>
                </div>
              </div>
            ) : isEmbed ? (
              <iframe
                src={activeServer.embed_url!}
                className="absolute inset-0 h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="no-referrer"
                /* sandbox blocks popups + top-navigation so embeds can't
                   redirect the page to ads or open popup windows */
                sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full"
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  poster={ep.thumbnail_url || content?.banner_url || undefined}
                  controls={false}
                />
                {/* Custom controls overlay */}
                <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4">
                  <div className="relative h-1.5 cursor-pointer rounded-full bg-white/15"
                    onClick={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      const v = videoRef.current; if (!v || !duration) return;
                      v.currentTime = ((e.clientX - r.left) / r.width) * duration;
                    }}
                  >
                    <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-senpai-violet to-senpai-fuchsia shadow-[0_0_10px_var(--senpai-fuchsia)]" style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button onClick={togglePlay} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                        {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                      </button>
                      <button onClick={() => { const v = videoRef.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted); }} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </button>
                      <span className="font-[var(--font-mono)] text-xs text-senpai-text-dim">{fmt(progress)} / {fmt(duration)}</span>
                    </div>
                    <button onClick={() => videoRef.current?.requestFullscreen()} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                      <Maximize className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Skip intro */}
            {!isEmbed && showIntroSkip && (
              <button
                onClick={() => { const v = videoRef.current; if (v) v.currentTime = 90; }}
                className="absolute right-6 top-6 z-20 inline-flex items-center gap-2 rounded-full bg-black/60 ring-1 ring-white/30 backdrop-blur px-4 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-black/80 transition-colors"
              >
                <SkipForward className="h-3.5 w-3.5" /> Skip Intro
              </button>
            )}
          </div>

          {/* Bottom bar — servers + quality + language */}
          <div className="grid gap-4 border-t border-senpai-border p-4 sm:p-6 md:grid-cols-[1fr_auto]">
            <div className="flex flex-wrap gap-2">
              <div className="font-[var(--font-mono)] mr-2 text-[10px] uppercase tracking-[0.3em] text-senpai-text-muted self-center">Sources</div>
              {data.servers.length === 0 && <span className="text-xs text-senpai-text-muted">No sources available.</span>}
              {data.servers.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActiveServer(s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-widest ${activeServer?.id === s.id ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia text-white shadow-[0_0_16px_-4px_var(--senpai-fuchsia)]" : "senpai-glass text-senpai-text-dim hover:text-white"}`}
                >
                  Source {i + 1}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 text-xs text-senpai-text-dim justify-end">
              {activeServer && (
                <>
                  <span className="inline-flex items-center gap-1"><Settings className="h-3.5 w-3.5" /> {activeServer.quality}</span>
                  <span className="inline-flex items-center gap-1"><Languages className="h-3.5 w-3.5" /> {activeServer.language}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Prev/Next + Episode strip */}
        <div className="mt-6 flex items-center justify-between gap-3">
          {prevEp ? (
            <Link to="/watch/$id" params={{ id: prevEp.id }} onClick={() => qc.invalidateQueries({ queryKey: ["episode"] })} className="senpai-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm hover:bg-white/10">
              <ChevronLeft className="h-4 w-4" /> Prev · E{prevEp.episode_number}
            </Link>
          ) : <span />}
          {nextEp ? (
            <Link to="/watch/$id" params={{ id: nextEp.id }} onClick={() => qc.invalidateQueries({ queryKey: ["episode"] })} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-senpai-violet to-senpai-fuchsia px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_var(--senpai-fuchsia)] hover:scale-[1.03] transition-transform">
              Next · E{nextEp.episode_number} <ChevronRight className="h-4 w-4" />
            </Link>
          ) : <span />}
        </div>

        {/* Episode list */}
        {data.siblings.length > 1 && (
          <section className="mt-10">
            <div className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-senpai-text-muted">Up Next</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.siblings.filter((s) => s.id !== ep.id).slice(0, 9).map((s) => (
                <Link key={s.id} to="/watch/$id" params={{ id: s.id }} className="senpai-glass group flex items-center gap-3 rounded-2xl p-2.5 hover:bg-white/5">
                  <div className="relative aspect-video w-32 flex-none overflow-hidden rounded-lg">
                    <img src={s.thumbnail_url || content?.banner_url || FALLBACK_POSTER(s.id)} onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_POSTER(s.id); }} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute bottom-1 left-1 senpai-sticker !px-1.5 !py-0.5 !text-[9px]">E{s.episode_number}</div>
                  </div>
                  <div className="min-w-0">
                    <div className="font-[var(--font-display)] text-sm tracking-wide line-clamp-1">{s.title || `Episode ${s.episode_number}`}</div>
                    <div className="text-[10px] uppercase tracking-widest text-senpai-text-muted">S{s.season_number}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function fmt(s: number) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60); const ss = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}
