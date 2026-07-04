import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import { ChevronLeft, ChevronRight, SkipForward, ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Loader2, AlertTriangle } from "lucide-react";
import { episodeQuery, episodeServersQuery, FALLBACK_POSTER, type ServerRow } from "@/lib/api/content";
import {
  playableServers,
  languagesOf,
  isDeadHost,
  isEmbedUrl,
  nextServer,
  classifyPlaybackError,
  normalizeLanguage,
  prioritizeServersForLanguage,
  type PlaybackErrorReason,
} from "@/lib/api/servers";
import { probeServers } from "@/lib/api/server-health.functions";
import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "@/lib/device";
import { useAuth } from "@/lib/auth";
import { ShareButton } from "@/components/ShareButton";
import { recordAppMetric } from "@/lib/api/metrics.functions";
import { Watermark } from "@/components/Watermark";
import { AdBanner } from "@/components/AdBanner";
import { VideoPrerollAd } from "@/components/ads/VideoPrerollAd";

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
  const { user, loading: authLoading, isPremium } = useAuth();
  const qc = useQueryClient();
  const ep = data.episode!;
  const content = data.content;

  // Servers are fetched through the guarded server function (ban + rate-limit
  // checks) using the per-device id.
  const deviceId = useMemo(() => getDeviceId(), []);
  const { data: serverData, isLoading: serversLoading, isFetching: serversFetching } = useQuery(episodeServersQuery(id, deviceId));
  const rawServers = useMemo<ServerRow[]>(() => serverData?.servers ?? [], [serverData]);
  const blocked = serverData?.blocked;

  // Server-side reachability results: serverId -> reachable.
  const [health, setHealth] = useState<Record<string, boolean>>({});

  // Only show sources that could plausibly play: http(s), not an image, not a
  // known-dead/ad-redirect host (e.g. short.icu), and not flagged unreachable
  // by the health probe.
  const servers = useMemo(
    () => prioritizeServersForLanguage(playableServers(rawServers, health), content?.language),
    [rawServers, health, content?.language],
  );

  // Probe the raw (pre-filter) candidates server-side so we can auto-disable
  // dead sources. The browser can't HEAD cross-origin embeds (CORS), so this
  // runs on the server.
  useEffect(() => {
    const candidates = rawServers
      .filter((s) => !!s.embed_url && !isDeadHost(s.embed_url))
      .slice(0, 20)
      .map((s) => ({ id: s.id, url: s.embed_url! }));
    if (candidates.length === 0) return;
    let cancelled = false;
    probeServers({ data: { servers: candidates } })
      .then((res) => {
        if (!cancelled) setHealth(res.health);
      })
      .catch((e) => console.warn("[watch] server health probe failed", e));
    return () => {
      cancelled = true;
    };
  }, [rawServers]);


  // Group available sources by spoken language (audio track), with the
  // episode/content language first so the UI reflects what is playing.
  const languages = useMemo(() => {
    const ordered = languagesOf(servers);
    const preferred = normalizeLanguage(content?.language);
    if (!preferred || !ordered.includes(preferred)) return ordered;
    return [preferred, ...ordered.filter((lang) => lang !== preferred)];
  }, [servers, content?.language]);

  const [activeLang, setActiveLang] = useState<string | null>(languages[0] ?? null);
  const [serverIdx, setServerIdx] = useState(0);

  // Keep selection valid as the playable set changes (health probe results).
  useEffect(() => {
    if (languages.length === 0) {
      setActiveLang(null);
      return;
    }
    if (!activeLang || !languages.includes(activeLang)) {
      setActiveLang(languages[0]);
      setServerIdx(0);
    }
  }, [languages, activeLang]);

  const langServers = useMemo(
    () => servers.filter((s) => normalizeLanguage(s.language) === activeLang),
    [servers, activeLang],
  );
  useEffect(() => {
    if (serverIdx >= langServers.length && langServers.length > 0) setServerIdx(0);
  }, [serverIdx, langServers.length]);

  const activeServer: ServerRow | null = langServers[serverIdx] ?? langServers[0] ?? servers[serverIdx] ?? servers[0] ?? null;
  const isEmbed = isEmbedUrl(activeServer?.embed_url);

  // User-facing playback error (sandbox / CORS / expired / dns / network).
  const [playbackError, setPlaybackError] = useState<{ reason: PlaybackErrorReason; label: string } | null>(null);
  const [finalPlaybackFailure, setFinalPlaybackFailure] = useState(false);
  const sourceReadyRef = useRef(false);
  const [, setSourceReady] = useState(false);

  const markSourceReady = useCallback(() => {
    sourceReadyRef.current = true;
    setSourceReady(true);
    setPlaybackError(null);
  }, []);

  const failActiveSource = useCallback((info: { reason: PlaybackErrorReason; label: string }) => {
    sourceReadyRef.current = false;
    setSourceReady(false);
    setPlaybackError(info);
  }, []);

  // Cycle to the next available server across languages.
  const tryAnother = () => {
    setPlaybackError(null);
    setFinalPlaybackFailure(false);
    sourceReadyRef.current = false;
    setSourceReady(false);
    recordAppMetric({
      data: {
        source: "stream",
        name: "server_cycle_requested",
        labels: { episodeId: id, sourceCount: servers.length, activeSource: activeServer?.id ?? null },
      },
    }).catch(() => {});
    const { lang, index } = nextServer(servers, { lang: activeLang, index: serverIdx });
    setActiveLang(lang);
    setServerIdx(index);
  };

  // Automatic background fallback: when a source fails, silently advance to the
  // next available server (up to one full cycle) without exposing servers to
  // the user. Reset the counter whenever the episode/server set changes.
  const autoTries = useRef(0);
  useEffect(() => {
    autoTries.current = 0;
    setFinalPlaybackFailure(false);
    setPlaybackError(null);
  }, [id, servers.length]);




  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showIntroSkip, setShowIntroSkip] = useState(false);
  const [prerollDone, setPrerollDone] = useState(false);

  useEffect(() => {
    setPrerollDone(false);
    setPlaybackError(null);
    setFinalPlaybackFailure(false);
  }, [id]);

  const showPreroll = !authLoading && !isPremium && !prerollDone;
  const canLoadPlayer = !authLoading && (isPremium || prerollDone);

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
    if (!canLoadPlayer || !v || !activeServer?.embed_url) return;
    const url = activeServer.embed_url;
    setFinalPlaybackFailure(false);
    sourceReadyRef.current = false;
    setSourceReady(false);
    if (!/\.m3u8(\?|$)/i.test(url)) {
      v.src = url;
      v.load();
      return;
    }
    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true });
      hls.loadSource(url);
      hls.attachMedia(v);
      hls.on(Hls.Events.MANIFEST_PARSED, markSourceReady);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
          return;
        }
        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
          return;
        }
        failActiveSource(classifyPlaybackError({ url, message: data.details }));
      });
      return () => hls.destroy();
    } else if (v.canPlayType("application/vnd.apple.mpegurl")) {
      v.src = url;
      v.load();
    }
  }, [activeServer, canLoadPlayer, failActiveSource, markSourceReady]);

  useEffect(() => {
    if (!canLoadPlayer || !activeServer?.embed_url || finalPlaybackFailure) return;
    sourceReadyRef.current = false;
    setSourceReady(false);
    const timeoutMs = isEmbed ? 18_000 : 12_000;
    const t = window.setTimeout(() => {
      if (sourceReadyRef.current) return;
      failActiveSource(classifyPlaybackError({ url: activeServer.embed_url, message: "timeout" }));
    }, timeoutMs);
    return () => window.clearTimeout(t);
  }, [activeServer?.id, activeServer?.embed_url, canLoadPlayer, failActiveSource, finalPlaybackFailure, isEmbed]);

  useEffect(() => {
    if (blocked === "banned" || blocked === "rate_limited") {
      setFinalPlaybackFailure(true);
      return;
    }
    if (!serverData || serversLoading || serversFetching || servers.length > 0) return;
    const t = window.setTimeout(() => setFinalPlaybackFailure(true), 9000);
    return () => window.clearTimeout(t);
  }, [blocked, serverData, serversLoading, serversFetching, servers.length]);

  useEffect(() => {
    if (serverData && rawServers.length === 0) {
      recordAppMetric({
        data: { source: "stream", name: "client_no_servers", labels: { episodeId: id, blocked: blocked ?? null } },
      }).catch(() => {});
    }
  }, [serverData, rawServers.length, blocked, id]);

  // Auto-advance to the next server in the background when playback fails, so
  // users never have to pick a server manually. Stops after one full cycle.
  useEffect(() => {
    if (!playbackError) return;
    if (servers.length <= 1) {
      const t = setTimeout(() => setFinalPlaybackFailure(true), 1800);
      return () => clearTimeout(t);
    }
    if (autoTries.current >= servers.length - 1) {
      const t = setTimeout(() => setFinalPlaybackFailure(true), 1800);
      return () => clearTimeout(t);
    }
    autoTries.current += 1;
    const t = setTimeout(() => {
      const { lang, index } = nextServer(servers, { lang: activeLang, index: serverIdx });
      setActiveLang(lang);
      setServerIdx(index);
      setPlaybackError(null);
      sourceReadyRef.current = false;
      setSourceReady(false);
    }, 1200);
    return () => clearTimeout(t);
  }, [playbackError, servers, activeLang, serverIdx]);


  // Show intro skip between 5-90s
  useEffect(() => {
    setShowIntroSkip(progress > 5 && progress < 90);
  }, [progress]);

  const togglePlay = () => {
    const v = videoRef.current; if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  const displayLanguage = normalizeLanguage(activeServer?.language) ?? normalizeLanguage(content?.language) ?? "Auto";

  const retryAllSources = () => {
    autoTries.current = 0;
    setFinalPlaybackFailure(false);
    setPlaybackError(null);
    setServerIdx(0);
    setActiveLang(languages[0] ?? null);
    qc.invalidateQueries({ queryKey: ["episode-servers", id] });
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
            <h1 className="font-[var(--font-display)] text-lg tracking-wide">{content?.title ? `${content.title} — ` : ""}S{ep.season_number} · E{ep.episode_number}{ep.title ? ` — ${ep.title}` : ""}</h1>
          </div>
          <ShareButton title={content?.title} />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        <div className="senpai-glass-strong relative overflow-hidden rounded-3xl ring-1 ring-senpai-violet/30 shadow-[0_30px_120px_-30px_var(--senpai-violet)]">
          {/* Player */}
          <div className="relative aspect-video bg-black">
            <Watermark position="top-right" />
            {finalPlaybackFailure ? (
              <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_center,rgba(255,72,214,0.16),transparent_50%),#050307] p-8 text-center">
                <div className="max-w-lg">
                  <AlertTriangle className="mx-auto mb-4 h-9 w-9 text-senpai-amber" />
                  <div className="senpai-mega text-4xl senpai-grad-text-fire">
                    {blocked === "banned" ? "ACCESS BLOCKED" : blocked === "rate_limited" ? "SLOW DOWN" : "STREAM SIGNAL LOST"}
                  </div>
                  <p className="mt-3 text-sm text-senpai-text-dim">
                    {blocked === "banned"
                      ? "This device has been blocked from streaming."
                      : blocked === "rate_limited"
                      ? "Too many stream requests — wait a moment, then try again."
                      : playbackError?.label ?? "Every available source was tested and none responded."}
                  </p>
                  {blocked !== "banned" && blocked !== "rate_limited" && (
                    <button
                      type="button"
                      onClick={retryAllSources}
                      className="mt-6 rounded-full bg-gradient-to-r from-senpai-violet to-senpai-fuchsia px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white"
                    >
                      Retry playback
                    </button>
                  )}
                </div>
              </div>
            ) : !activeServer || !canLoadPlayer ? (
              <div className="grid h-full place-items-center text-center p-8">
                <div>
                  <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-senpai-fuchsia" />
                  <div className="senpai-mega text-3xl senpai-grad-text-fire">
                    LOADING STREAM
                  </div>
                  <p className="mt-2 text-sm text-senpai-text-dim">
                    {authLoading
                      ? "Checking your viewing status."
                      : showPreroll
                      ? "Preparing a short sponsor message before playback."
                      : serversLoading || serversFetching || !serverData
                      ? "Checking every playable source."
                      : rawServers.length > 0
                      ? "Still testing sources in the background."
                      : "Searching for a playable source."}
                  </p>
                </div>
              </div>
            ) : isEmbed ? (
              <iframe
                key={activeServer.id}
                src={activeServer.embed_url!}
                className="absolute inset-0 h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="no-referrer"
                onLoad={() => {
                  markSourceReady();
                  console.info("[watch] embed loaded", {
                    server: activeServer.server_name,
                    quality: activeServer.quality,
                    language: activeServer.language,
                    url: activeServer.embed_url,
                  });
                }}
                onError={() => {
                  const info = classifyPlaybackError({ url: activeServer.embed_url });
                  console.error("[watch] embed error", { ...info, url: activeServer.embed_url });
                  failActiveSource(info);
                }}
                // NOTE: no `sandbox` attribute. Many free embed players detect a
                // sandboxed iframe and refuse to play ("ads are not being
                // displayed (AdBlock/Sandbox)…"). Removing the sandbox lets the
                // player's own ad/script layer run so playback works.
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full"
                  onPlay={() => setPlaying(true)}
                  onCanPlay={markSourceReady}
                  onPause={() => setPlaying(false)}
                  onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onError={(e) => {
                    const mediaErr = e.currentTarget.error;
                    const info = classifyPlaybackError({
                      url: activeServer.embed_url,
                      message: mediaErr?.message,
                    });
                    console.error("[watch] video error", {
                      code: mediaErr?.code,
                      message: mediaErr?.message,
                      ...info,
                      url: activeServer.embed_url,
                    });
                    failActiveSource(info);
                  }}
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
                      <button aria-label={playing ? "Pause" : "Play"} onClick={togglePlay} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                        {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                      </button>
                      <button aria-label={muted ? "Unmute" : "Mute"} onClick={() => { const v = videoRef.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted); }} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </button>
                      <span className="font-[var(--font-mono)] text-xs text-senpai-text-dim">{fmt(progress)} / {fmt(duration)}</span>
                    </div>
                    <button aria-label="Fullscreen" onClick={() => videoRef.current?.requestFullscreen()} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20">
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

            {showPreroll && <VideoPrerollAd onComplete={() => setPrerollDone(true)} />}
          </div>


          {/* Source names stay hidden; language reflects the active audio track. */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-senpai-border p-4 sm:p-6">
            <div className="text-xs uppercase tracking-[0.25em] text-senpai-text-muted">
              {activeServer ? `Playback · ${displayLanguage} audio` : "Preparing playback"}
            </div>
            {servers.length > 1 && (
              <button
                onClick={tryAnother}
                className="senpai-glass inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-senpai-text-dim hover:text-white"
              >
                Not loading? Retry
              </button>
            )}
          </div>





        </div>

        <div className="mt-6 flex justify-center">
          <AdBanner adKey="921c3b2b7865019cf9b9ece13ab15bf4" width={468} height={60} />
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
