import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-c090ocC3.mjs";
import { C as ContentPoster } from "./ContentPoster-CKCOJLHh.mjs";
import { h as homeFeedQuery, a as FALLBACK_BANNER } from "./router-UGTBz-_d.mjs";
import "../_libs/seroval.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { F as Flame, P as Play, j as Plus, k as ChevronRight, d as Sparkles, b as Tv } from "../_libs/lucide-react.mjs";
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
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function Hero({
  item
}) {
  const banner = item.banner_url || item.poster_url || FALLBACK_BANNER(item.id);
  const words = item.title.toUpperCase().split(/\s+/);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative isolate overflow-hidden px-4 pt-10 sm:px-8 md:pt-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-auto max-w-7xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid items-end gap-8 md:grid-cols-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none absolute inset-0 -z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: banner, alt: "", className: "h-full w-full rounded-3xl object-cover opacity-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-3xl bg-gradient-to-t from-senpai-bg via-senpai-bg/70 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-3xl bg-gradient-to-r from-senpai-bg via-senpai-bg/40 to-transparent" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-8 lg:col-span-7 py-10 md:py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.6
      }, className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "senpai-sticker !text-senpai-amber !border-senpai-amber/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-3 w-3" }),
          " Featured · ",
          item.type
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[var(--font-hand)] text-xl text-senpai-teal", children: "streaming now ✦" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.h1, { initial: {
        opacity: 0,
        y: 30
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.7,
        delay: 0.05
      }, className: "senpai-mega mt-4 text-[14vw] leading-[0.85] sm:text-6xl md:text-7xl lg:text-[96px] break-words", children: words.map((w, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: i % 3 === 0 ? "senpai-grad-text-cyber" : i % 3 === 1 ? "senpai-stroke-text" : "senpai-grad-text-fire", children: [
        w,
        i < words.length - 1 ? " " : ""
      ] }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.p, { initial: {
        opacity: 0
      }, animate: {
        opacity: 1
      }, transition: {
        delay: 0.3
      }, className: "mt-6 max-w-xl text-sm text-senpai-text-dim sm:text-base line-clamp-3", children: item.description || "An untold story drops tonight. Cinematic. Cyberpunk. Absolutely senpai." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 10
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: 0.45
      }, className: "mt-8 flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/detail/$id", params: {
          id: item.id
        }, className: "group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-senpai-violet via-senpai-fuchsia to-senpai-pink px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_var(--senpai-fuchsia)] transition-transform hover:scale-[1.03]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4 fill-current" }),
          " Watch Now"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "senpai-glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Watchlist"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/detail/$id", params: {
          id: item.id
        }, className: "inline-flex items-center gap-1 px-3 py-3 text-sm text-senpai-text-dim hover:text-white", children: [
          "More info ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex items-center gap-6 text-xs uppercase tracking-[0.3em] text-senpai-text-muted", children: [
        item.rating != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-senpai-amber", children: [
          "★ ",
          Number(item.rating).toFixed(1)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px w-8 bg-senpai-border-strong" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.release_year ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px w-8 bg-senpai-border-strong" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-senpai-teal", children: item.language ?? "JP" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:col-span-4 lg:col-span-5 md:flex justify-end pb-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      scale: 0.9
    }, animate: {
      opacity: 1,
      scale: 1
    }, transition: {
      delay: 0.2,
      duration: 0.6
    }, className: "relative w-full max-w-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ContentPoster, { item }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "senpai-sticker absolute -top-3 -right-3 !bg-senpai-fuchsia !text-white !border-transparent shadow-[0_0_20px_var(--senpai-fuchsia)]", children: "Live Drop" })
    ] }) })
  ] }) }) });
}
function Row({
  title,
  kicker,
  items,
  accent
}) {
  if (!items.length) return null;
  const grad = accent === "fire" ? "senpai-grad-text-fire" : accent === "cyber" ? "senpai-grad-text-cyber" : "senpai-grad-text";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative mx-auto mt-16 max-w-7xl px-4 sm:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex items-end justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[var(--font-mono)] text-[11px] uppercase tracking-[0.35em] text-senpai-text-muted", children: kicker }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: `senpai-mega mt-1 text-3xl sm:text-4xl md:text-5xl ${grad}`, children: title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/browse", className: "senpai-glass inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs uppercase tracking-widest text-senpai-text-dim hover:text-white", children: [
        "See all ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-4", children: items.slice(0, 12).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ContentPoster, { item: p }, p.id)) })
  ] });
}
function Genres({
  items
}) {
  const palette = ["from-senpai-red to-senpai-orange", "from-senpai-teal to-senpai-violet", "from-senpai-pink to-senpai-fuchsia", "from-senpai-violet-2 to-senpai-red", "from-senpai-amber to-senpai-pink", "from-senpai-violet to-senpai-teal"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative mx-auto mt-20 max-w-7xl px-4 sm:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-senpai-teal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[var(--font-mono)] text-[11px] uppercase tracking-[0.35em] text-senpai-text-muted", children: "Explore by mood" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6", children: items.slice(0, 12).map((g, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/browse", search: {
      genre: g.slug
    }, className: `group relative overflow-hidden rounded-2xl bg-gradient-to-br ${palette[i % palette.length]} p-5 transition-transform hover:scale-[1.03]`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 senpai-halftone opacity-25 mix-blend-overlay" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[var(--font-display)] text-xl tracking-wide text-white", children: g.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "✦" })
      ] })
    ] }, g.id)) })
  ] });
}
function LiveTV() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative mx-auto mt-20 max-w-7xl px-4 sm:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "senpai-glass senpai-glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "senpai-aurora" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "senpai-sticker !text-senpai-red !border-senpai-red/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-senpai-red shadow-[0_0_8px_var(--senpai-red)]" }),
          " On Air"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "senpai-mega mt-4 text-4xl sm:text-5xl md:text-6xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "senpai-grad-text-cyber", children: "LIVE TV" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[var(--font-jp)] ml-3 text-2xl text-senpai-text-dim", children: "放送中" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-md text-sm text-senpai-text-dim", children: "2,000+ channels streaming nonstop — anime networks, Tokyo news, retro reruns, J-music." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/live-tv", className: "grid place-items-center rounded-xl bg-gradient-to-br from-senpai-violet to-senpai-fuchsia px-6 py-4 text-sm font-semibold text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "mr-2 inline h-4 w-4" }),
        " Tune In"
      ] })
    ] })
  ] }) });
}
function Marquee() {
  const words = ["夜界", "STREAM BEYOND", "★", "ANIME", "MOVIES", "LIVE TV", "MANGA", "✦", "4K HDR", "夜界"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-24 overflow-hidden border-y border-senpai-border py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-senpai-bg to-transparent" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-senpai-bg to-transparent" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "senpai-marquee-track", children: [...words, ...words].map((w, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "senpai-mega text-6xl text-senpai-text-muted/60", children: w }, i)) })
  ] });
}
function Home() {
  const {
    data
  } = useSuspenseQuery(homeFeedQuery);
  const hero = data.featured[0] ?? data.trending[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    hero && /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, { item: hero }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { title: "Trending Now", kicker: "Top picks · This week", items: data.trending, accent: "violet" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { title: "New Drops", kicker: "Fresh from the studio", items: data.recent, accent: "fire" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Genres, { items: data.genres }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LiveTV, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { title: "Featured", kicker: "Editor's selection", items: data.featured, accent: "cyber" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Marquee, {})
  ] });
}
export {
  Home as component
};
