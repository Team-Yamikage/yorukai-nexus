import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-c090ocC3.mjs";
import { H as Hls } from "../_libs/hls.js.mjs";
import { S as ShareButton } from "./ShareButton-1PifcBw2.mjs";
import { o as Route$1, l as liveChannelsQuery } from "./router-UGTBz-_d.mjs";
import "../_libs/seroval.mjs";
import { r as ArrowLeft, b as Tv } from "../_libs/lucide-react.mjs";
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
import "./client-CSmeRDtX.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./server-DKFzjMa8.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function HlsPlayer({
  url,
  poster,
  className = ""
}) {
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const v = ref.current;
    if (!v || !url) return;
    let hls;
    if (/\.m3u8(\?|$)/i.test(url)) {
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          maxBufferLength: 30
        });
        hls.loadSource(url);
        hls.attachMedia(v);
        hls.on(Hls.Events.ERROR, (_e, data) => {
          if (!hls) return;
          if (data.fatal) {
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
            else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
          }
        });
        v.play().catch(() => {
        });
      } else if (v.canPlayType("application/vnd.apple.mpegurl")) {
        v.src = url;
        v.play().catch(() => {
        });
      }
    } else {
      v.src = url;
      v.play().catch(() => {
      });
    }
    return () => hls?.destroy();
  }, [url]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "video",
    {
      ref,
      poster: poster ?? void 0,
      controls: true,
      playsInline: true,
      autoPlay: true,
      className
    }
  );
}
function LiveWatch() {
  const {
    id
  } = Route$1.useParams();
  const {
    data: channels
  } = useSuspenseQuery(liveChannelsQuery);
  const channel = channels.find((c) => c.id === id);
  const related = channels.filter((c) => c.id !== id && c.categories.some((x) => channel?.categories.includes(x))).slice(0, 12);
  if (!channel) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-6 py-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "senpai-mega text-5xl senpai-grad-text-fire", children: "OFF AIR" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-senpai-text-dim", children: "This channel is not available." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/live-tv", className: "senpai-glass mt-6 inline-block rounded-full px-5 py-2 text-sm", children: "Back to Live TV" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 sm:px-8 pt-6 pb-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/live-tv", className: "senpai-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Live TV"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShareButton, { title: channel.name })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "senpai-glass-strong mt-4 overflow-hidden rounded-3xl ring-1 ring-senpai-violet/30 shadow-[0_30px_120px_-30px_var(--senpai-violet)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video bg-black", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HlsPlayer, { url: channel.url, poster: channel.logo, className: "h-full w-full" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 border-t border-senpai-border p-4 sm:p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 flex-none place-items-center overflow-hidden rounded-xl bg-white/5", children: channel.logo ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: channel.logo, alt: "", className: "h-full w-full object-contain p-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-2 w-2 animate-pulse rounded-full bg-senpai-fuchsia" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-senpai-fuchsia", children: "Now playing · Live" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-[var(--font-display)] text-xl tracking-wide", children: channel.name })
        ] })
      ] })
    ] }),
    related.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-senpai-text-muted", children: "Up next" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6", children: related.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/live-watch/$id", params: {
        id: c.id
      }, className: "senpai-glass flex flex-col items-center gap-2 rounded-2xl p-3 text-center hover:bg-white/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-white/5", children: c.logo ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.logo, alt: "", loading: "lazy", className: "h-full w-full object-contain p-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-2 text-[11px] font-semibold", children: c.name })
      ] }, c.id)) })
    ] })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(LiveWatch, {}) });
export {
  SplitComponent as component
};
