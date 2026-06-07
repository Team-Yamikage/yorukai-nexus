import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useSuspenseQuery, b as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { H as Hls } from "../_libs/hls.js.mjs";
import { d as Route$4, u as useAuth, F as FALLBACK_POSTER, e as episodeQuery, c as createSsrRpc, f as episodeServersQuery } from "./router-UGTBz-_d.mjs";
import { c as createServerFn } from "./server-DKFzjMa8.mjs";
import { s as supabase } from "./client-CSmeRDtX.mjs";
import { S as ShareButton } from "./ShareButton-1PifcBw2.mjs";
import "../_libs/seroval.mjs";
import { r as ArrowLeft, s as Pause, P as Play, V as VolumeX, t as Volume2, u as Maximize, v as SkipForward, w as Languages, S as Settings, x as ChevronLeft, k as ChevronRight } from "../_libs/lucide-react.mjs";
import { o as objectType, a as arrayType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const DEAD_HOSTS = [
  "short.icu",
  "shorturl",
  "adf.ly",
  "adfly",
  "ouo.io",
  "linkvertise",
  "exe.io",
  "exe.app",
  "gplinks",
  "za.gl",
  "clk.sh",
  "shrtfly",
  "bc.vc",
  "cuty.io",
  "sub2unlock",
  "safelinkconverter",
  "fc-lc"
];
const DEAD_HOST_RE = new RegExp(
  `://(www\\.)?(${DEAD_HOSTS.map((h) => h.replace(/\./g, "\\.")).join("|")})`,
  "i"
);
function isDeadHost(url) {
  if (!url) return true;
  return DEAD_HOST_RE.test(url);
}
function isDirectMedia(url) {
  return !!url && /\.(m3u8|mp4|webm)(\?|$)/i.test(url);
}
function isEmbedUrl(url) {
  return !!url && !isDirectMedia(url);
}
function playableServers(servers, health) {
  return servers.filter((s) => {
    const url = s.embed_url;
    if (!url || !/^https?:\/\//i.test(url)) return false;
    if (/\.(webp|jpg|jpeg|png|gif|svg)(\?|$)/i.test(url)) return false;
    if (isDeadHost(url)) return false;
    if (health && health[s.id] === false) return false;
    return true;
  });
}
const LANG_ORDER = [
  "English",
  "Hindi",
  "Japanese",
  "Multi",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Kannada",
  "Bengali"
];
function languagesOf(servers) {
  const set = Array.from(
    new Set(servers.map((s) => s.language).filter(Boolean))
  );
  return set.sort(
    (a, b) => (LANG_ORDER.indexOf(a) + 1 || 99) - (LANG_ORDER.indexOf(b) + 1 || 99)
  );
}
function nextServer(servers, state) {
  const langs = languagesOf(servers);
  if (langs.length === 0) return state;
  const lang = state.lang ?? langs[0];
  const inLang = servers.filter((s) => s.language === lang);
  if (state.index < inLang.length - 1) {
    return { lang, index: state.index + 1 };
  }
  if (langs.length > 1) {
    const next = (langs.indexOf(lang) + 1) % langs.length;
    return { lang: langs[next], index: 0 };
  }
  return { lang, index: inLang.length ? (state.index + 1) % inLang.length : 0 };
}
function classifyPlaybackError(input) {
  const msg = (input.message ?? "").toLowerCase();
  const url = input.url ?? "";
  if (!url) return { reason: "no-source", label: "No playable source." };
  if (isDeadHost(url) || msg.includes("could not be found") || msg.includes("dns") || msg.includes("enotfound")) {
    return { reason: "dns", label: "Source host is offline (domain not found)." };
  }
  if (msg.includes("sandbox") || msg.includes("adblock") || msg.includes("ads are not being displayed")) {
    return { reason: "sandbox", label: "Player blocked by sandbox/ad-block. Disable ad-block or try another server." };
  }
  if (msg.includes("cors") || msg.includes("cross-origin") || msg.includes("blocked by")) {
    return { reason: "cors", label: "Source blocked cross-origin playback (CORS)." };
  }
  if (input.status === 403 || input.status === 410 || msg.includes("expired") || msg.includes("token")) {
    return { reason: "expired", label: "This source link has expired." };
  }
  if (input.status === 404 || msg.includes("not found")) {
    return { reason: "expired", label: "Source not found (link removed)." };
  }
  if (msg.includes("network") || msg.includes("failed to fetch") || msg.includes("timeout")) {
    return { reason: "network", label: "Network error reaching the source." };
  }
  return { reason: "unknown", label: "Playback failed. Try another server." };
}
const ProbeInput = objectType({
  servers: arrayType(objectType({
    id: stringType().min(1).max(64),
    url: stringType().url().max(2048)
  })).min(1).max(20)
});
const probeServers = createServerFn({
  method: "POST"
}).inputValidator((d) => ProbeInput.parse(d)).handler(createSsrRpc("3a05a354576130d8f79083a063c81b056fdd48df107dfe6c1910e2a81812b811"));
const KEY = "yk_device_id";
function randomId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }
}
function getDeviceId() {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = randomId();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "no-storage";
  }
}
function Watch() {
  const {
    id
  } = Route$4.useParams();
  const {
    data
  } = useSuspenseQuery(episodeQuery(id));
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const ep = data.episode;
  const content = data.content;
  const deviceId = reactExports.useMemo(() => getDeviceId(), []);
  const {
    data: serverData
  } = useQuery(episodeServersQuery(id, deviceId));
  const rawServers = reactExports.useMemo(() => serverData?.servers ?? [], [serverData]);
  const blocked = serverData?.blocked;
  const [health, setHealth] = reactExports.useState({});
  const servers = reactExports.useMemo(() => playableServers(rawServers, health), [rawServers, health]);
  reactExports.useEffect(() => {
    const candidates = rawServers.filter((s) => !!s.embed_url && !isDeadHost(s.embed_url)).slice(0, 20).map((s) => ({
      id: s.id,
      url: s.embed_url
    }));
    if (candidates.length === 0) return;
    let cancelled = false;
    probeServers({
      data: {
        servers: candidates
      }
    }).then((res) => {
      if (!cancelled) setHealth(res.health);
    }).catch((e) => console.warn("[watch] server health probe failed", e));
    return () => {
      cancelled = true;
    };
  }, [rawServers]);
  const languages = reactExports.useMemo(() => languagesOf(servers), [servers]);
  const [activeLang, setActiveLang] = reactExports.useState(languages[0] ?? null);
  const [serverIdx, setServerIdx] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (languages.length === 0) {
      setActiveLang(null);
      return;
    }
    if (!activeLang || !languages.includes(activeLang)) {
      setActiveLang(languages[0]);
      setServerIdx(0);
    }
  }, [languages, activeLang]);
  const langServers = reactExports.useMemo(() => servers.filter((s) => s.language === activeLang), [servers, activeLang]);
  const activeServer = langServers[serverIdx] ?? langServers[0] ?? servers[0] ?? null;
  const isEmbed = isEmbedUrl(activeServer?.embed_url);
  const [playbackError, setPlaybackError] = reactExports.useState(null);
  const tryAnother = () => {
    setPlaybackError(null);
    const {
      lang,
      index
    } = nextServer(servers, {
      lang: activeLang,
      index: serverIdx
    });
    setActiveLang(lang);
    setServerIdx(index);
  };
  const pickServer = (s) => {
    setPlaybackError(null);
    setActiveLang(s.language);
    const inLang = servers.filter((x) => x.language === s.language);
    setServerIdx(Math.max(0, inLang.findIndex((x) => x.id === s.id)));
  };
  const videoRef = reactExports.useRef(null);
  const [playing, setPlaying] = reactExports.useState(false);
  const [muted, setMuted] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(0);
  const [duration, setDuration] = reactExports.useState(0);
  const [showIntroSkip, setShowIntroSkip] = reactExports.useState(false);
  const idxInSiblings = data.siblings.findIndex((s) => s.id === ep.id);
  const prevEp = data.siblings[idxInSiblings - 1];
  const nextEp = data.siblings[idxInSiblings + 1];
  reactExports.useEffect(() => {
    if (!user || !duration) return;
    const t = setInterval(() => {
      supabase.from("watch_history").upsert({
        user_id: user.id,
        episode_id: ep.id,
        progress_seconds: Math.floor(progress),
        total_seconds: Math.floor(duration),
        completed: progress / duration > 0.9,
        last_watched_at: (/* @__PURE__ */ new Date()).toISOString()
      }, {
        onConflict: "user_id,episode_id"
      }).then(() => {
      });
    }, 15e3);
    return () => clearInterval(t);
  }, [user, ep.id, progress, duration]);
  reactExports.useEffect(() => {
    const v = videoRef.current;
    if (!v || !activeServer?.embed_url) return;
    const url = activeServer.embed_url;
    if (!/\.m3u8(\?|$)/i.test(url)) {
      v.src = url;
      return;
    }
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true
      });
      hls.loadSource(url);
      hls.attachMedia(v);
      return () => hls.destroy();
    } else if (v.canPlayType("application/vnd.apple.mpegurl")) {
      v.src = url;
    }
  }, [activeServer]);
  reactExports.useEffect(() => {
    setShowIntroSkip(progress > 5 && progress < 90);
  }, [progress]);
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-dvh bg-senpai-bg text-white overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none fixed inset-0 -z-10 opacity-40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: content?.banner_url || content?.poster_url || FALLBACK_POSTER(id), alt: "", className: "h-full w-full object-cover blur-3xl scale-110" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-senpai-bg/70" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative z-10 flex items-center justify-between p-4 sm:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/detail/$id", params: {
        id: ep.content_id
      }, className: "senpai-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Back"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-senpai-text-muted", children: content?.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-[var(--font-display)] text-lg tracking-wide", children: [
            content?.title ? `${content.title} — ` : "",
            "S",
            ep.season_number,
            " · E",
            ep.episode_number,
            ep.title ? ` — ${ep.title}` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShareButton, { title: content?.title })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pb-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "senpai-glass-strong relative overflow-hidden rounded-3xl ring-1 ring-senpai-violet/30 shadow-[0_30px_120px_-30px_var(--senpai-violet)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-video bg-black", children: [
          !activeServer ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-full place-items-center text-center p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "senpai-mega text-3xl senpai-grad-text-fire", children: blocked === "banned" ? "ACCESS BLOCKED" : blocked === "rate_limited" ? "SLOW DOWN" : "NO SERVERS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-senpai-text-dim", children: blocked === "banned" ? "This device has been blocked from streaming." : blocked === "rate_limited" ? "Too many requests — please wait a moment and refresh." : rawServers.length > 0 ? "All known sources for this episode are offline or unreachable right now." : "This episode has no playable servers yet." })
          ] }) }) : isEmbed ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "iframe",
            {
              src: activeServer.embed_url,
              className: "absolute inset-0 h-full w-full",
              allow: "autoplay; encrypted-media; picture-in-picture; fullscreen",
              allowFullScreen: true,
              referrerPolicy: "no-referrer",
              onLoad: () => console.info("[watch] embed loaded", {
                server: activeServer.server_name,
                quality: activeServer.quality,
                language: activeServer.language,
                url: activeServer.embed_url
              }),
              onError: () => {
                const info = classifyPlaybackError({
                  url: activeServer.embed_url
                });
                console.error("[watch] embed error", {
                  ...info,
                  url: activeServer.embed_url
                });
                setPlaybackError(info);
              }
            },
            activeServer.id
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("video", { ref: videoRef, className: "absolute inset-0 h-full w-full", onPlay: () => setPlaying(true), onPause: () => setPlaying(false), onTimeUpdate: (e) => setProgress(e.currentTarget.currentTime), onLoadedMetadata: (e) => setDuration(e.currentTarget.duration), onError: (e) => {
              const mediaErr = e.currentTarget.error;
              const info = classifyPlaybackError({
                url: activeServer.embed_url,
                message: mediaErr?.message
              });
              console.error("[watch] video error", {
                code: mediaErr?.code,
                message: mediaErr?.message,
                ...info,
                url: activeServer.embed_url
              });
              setPlaybackError(info);
            }, poster: ep.thumbnail_url || content?.banner_url || void 0, controls: false }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-1.5 cursor-pointer rounded-full bg-white/15", onClick: (e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const v = videoRef.current;
                if (!v || !duration) return;
                v.currentTime = (e.clientX - r.left) / r.width * duration;
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-senpai-violet to-senpai-fuchsia shadow-[0_0_10px_var(--senpai-fuchsia)]", style: {
                width: `${duration ? progress / duration * 100 : 0}%`
              } }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { "aria-label": playing ? "Pause" : "Play", onClick: togglePlay, className: "grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20", children: playing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-4 w-4 fill-current" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4 fill-current" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { "aria-label": muted ? "Unmute" : "Mute", onClick: () => {
                    const v = videoRef.current;
                    if (!v) return;
                    v.muted = !v.muted;
                    setMuted(v.muted);
                  }, className: "grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20", children: muted ? /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-[var(--font-mono)] text-xs text-senpai-text-dim", children: [
                    fmt(progress),
                    " / ",
                    fmt(duration)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { "aria-label": "Fullscreen", onClick: () => videoRef.current?.requestFullscreen(), className: "grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize, { className: "h-4 w-4" }) })
              ] })
            ] })
          ] }),
          !isEmbed && showIntroSkip && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            const v = videoRef.current;
            if (v) v.currentTime = 90;
          }, className: "absolute right-6 top-6 z-20 inline-flex items-center gap-2 rounded-full bg-black/60 ring-1 ring-white/30 backdrop-blur px-4 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-black/80 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SkipForward, { className: "h-3.5 w-3.5" }),
            " Skip Intro"
          ] }),
          playbackError && activeServer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "max-w-md text-sm text-senpai-text-dim", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-white", children: "Can’t play this source." }),
              " ",
              playbackError.label
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-center gap-2", children: [
              servers.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: tryAnother, className: "rounded-full bg-gradient-to-r from-senpai-violet to-senpai-fuchsia px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white", children: "Try another server" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPlaybackError(null), className: "senpai-glass rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest text-senpai-text-dim hover:text-white", children: "Dismiss" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 border-t border-senpai-border p-4 sm:p-6 md:grid-cols-[1fr_auto]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-[var(--font-mono)] mr-2 flex items-center gap-1 text-[10px] uppercase tracking-[0.3em] text-senpai-text-muted self-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { className: "h-3.5 w-3.5" }),
              " Language"
            ] }),
            languages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-senpai-text-muted", children: "No playable language tracks yet." }),
            languages.map((lang) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
              setActiveLang(lang);
              setServerIdx(0);
            }, className: `rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-widest ${activeLang === lang ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia text-white shadow-[0_0_16px_-4px_var(--senpai-fuchsia)]" : "senpai-glass text-senpai-text-dim hover:text-white"}`, children: lang }, lang))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-senpai-text-dim justify-end", children: [
            activeServer && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-3.5 w-3.5" }),
              " ",
              activeServer.quality
            ] }),
            activeServer?.embed_url && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: activeServer.embed_url, target: "_blank", rel: "noreferrer", className: "senpai-glass inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-semibold uppercase tracking-widest text-senpai-text-dim hover:text-white", children: "Open in new tab" }),
            servers.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: tryAnother, className: "senpai-glass inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-semibold uppercase tracking-widest text-senpai-text-dim hover:text-white", children: "Not loading? Try another" })
          ] })
        ] }),
        langServers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-senpai-border p-4 sm:p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-[var(--font-mono)] mb-3 flex items-center gap-1 text-[10px] uppercase tracking-[0.3em] text-senpai-text-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-3.5 w-3.5" }),
            " Servers",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-senpai-text-dim/70", children: [
              "(",
              langServers.length,
              " available · ",
              activeLang,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: langServers.map((s) => {
            const isActive = activeServer?.id === s.id;
            const reachable = health[s.id];
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => pickServer(s), className: `group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold tracking-wide transition-colors ${isActive ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia text-white shadow-[0_0_16px_-4px_var(--senpai-fuchsia)]" : "senpai-glass text-senpai-text-dim hover:text-white"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-2 w-2 rounded-full ${reachable === false ? "bg-red-500" : reachable ? "bg-emerald-400" : "bg-yellow-400/70"}`, title: reachable === false ? "Unreachable" : reachable ? "Online" : "Checking…" }),
              s.server_name,
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "opacity-60", children: [
                "· ",
                s.quality
              ] })
            ] }, s.id);
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-between gap-3", children: [
        prevEp ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/watch/$id", params: {
          id: prevEp.id
        }, onClick: () => qc.invalidateQueries({
          queryKey: ["episode"]
        }), className: "senpai-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm hover:bg-white/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }),
          " Prev · E",
          prevEp.episode_number
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
        nextEp ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/watch/$id", params: {
          id: nextEp.id
        }, onClick: () => qc.invalidateQueries({
          queryKey: ["episode"]
        }), className: "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-senpai-violet to-senpai-fuchsia px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_var(--senpai-fuchsia)] hover:scale-[1.03] transition-transform", children: [
          "Next · E",
          nextEp.episode_number,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
      ] }),
      data.siblings.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-senpai-text-muted", children: "Up Next" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3", children: data.siblings.filter((s) => s.id !== ep.id).slice(0, 9).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/watch/$id", params: {
          id: s.id
        }, className: "senpai-glass group flex items-center gap-3 rounded-2xl p-2.5 hover:bg-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-video w-32 flex-none overflow-hidden rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: s.thumbnail_url || content?.banner_url || FALLBACK_POSTER(s.id), onError: (e) => {
              e.currentTarget.src = FALLBACK_POSTER(s.id);
            }, alt: "", className: "h-full w-full object-cover transition-transform group-hover:scale-105" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-1 left-1 senpai-sticker !px-1.5 !py-0.5 !text-[9px]", children: [
              "E",
              s.episode_number
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[var(--font-display)] text-sm tracking-wide line-clamp-1", children: s.title || `Episode ${s.episode_number}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] uppercase tracking-widest text-senpai-text-muted", children: [
              "S",
              s.season_number
            ] })
          ] })
        ] }, s.id)) })
      ] })
    ] })
  ] });
}
function fmt(s) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}
export {
  Watch as component
};
