import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-c090ocC3.mjs";
import { p as Route, a as FALLBACK_BANNER, F as FALLBACK_POSTER, q as detailQuery } from "./router-UGTBz-_d.mjs";
import "../_libs/seroval.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { l as Star, N as Calendar, O as Clock, b as Tv, P as Play, j as Plus } from "../_libs/lucide-react.mjs";
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
function Detail() {
  const {
    id
  } = Route.useParams();
  const {
    data
  } = useSuspenseQuery(detailQuery(id));
  const content = data.content;
  const seasons = Array.from(new Set(data.episodes.map((e) => e.season_number))).sort((a, b) => a - b);
  const [season, setSeason] = reactExports.useState(seasons[0] ?? 1);
  const eps = data.episodes.filter((e) => e.season_number === season);
  const firstEp = data.episodes[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative isolate", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 top-0 -z-10 h-[70vh]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: content.banner_url || content.poster_url || FALLBACK_BANNER(content.id), alt: "", className: "h-full w-full object-cover opacity-50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-senpai-bg via-senpai-bg/70 to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-senpai-bg via-senpai-bg/40 to-transparent" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-8 pt-16 md:pt-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
          opacity: 0,
          y: 20
        }, animate: {
          opacity: 1,
          y: 0
        }, className: "senpai-poster aspect-[2/3] w-full max-w-[280px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: content.poster_url || FALLBACK_POSTER(content.id), alt: content.title, className: "senpai-duotone absolute inset-0 h-full w-full object-cover" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-[var(--font-mono)] text-[11px] uppercase tracking-[0.35em] text-senpai-text-muted", children: [
            content.type,
            " · ",
            content.status
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(motion.h1, { initial: {
            opacity: 0,
            y: 20
          }, animate: {
            opacity: 1,
            y: 0
          }, className: "senpai-mega mt-2 text-4xl sm:text-6xl md:text-7xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "senpai-grad-text", children: content.title }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap items-center gap-4 text-xs uppercase tracking-widest text-senpai-text-dim", children: [
            content.rating != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-senpai-amber", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 fill-current" }),
              " ",
              Number(content.rating).toFixed(1)
            ] }),
            content.release_year && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }),
              " ",
              content.release_year
            ] }),
            content.duration_minutes && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
              " ",
              content.duration_minutes,
              "m"
            ] }),
            data.episodes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "h-3.5 w-3.5" }),
              " ",
              data.episodes.length,
              " eps"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: data.genres.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/browse", search: {
            genre: g.slug
          }, className: "senpai-sticker hover:!text-senpai-teal", children: g.name }, g.id)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 max-w-2xl text-sm text-senpai-text-dim sm:text-base", children: content.description || "No synopsis available yet." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [
            firstEp && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/watch/$id", params: {
              id: firstEp.id
            }, className: "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-senpai-violet via-senpai-fuchsia to-senpai-pink px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_var(--senpai-fuchsia)] hover:scale-[1.03] transition-transform", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4 fill-current" }),
              " Watch S",
              firstEp.season_number,
              " · E",
              firstEp.episode_number
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "senpai-glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white hover:bg-white/10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              " Watchlist"
            ] })
          ] })
        ] })
      ] }) })
    ] }),
    seasons.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 sm:px-8 pt-20 pb-32", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-4 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[var(--font-mono)] text-[11px] uppercase tracking-[0.35em] text-senpai-text-muted", children: "Episodes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "senpai-mega mt-1 text-3xl sm:text-4xl senpai-grad-text-cyber", children: [
            "SEASON ",
            season
          ] })
        ] }),
        seasons.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: seasons.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSeason(s), className: `rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest ${season === s ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia text-white" : "senpai-glass text-senpai-text-dim hover:text-white"}`, children: [
          "S",
          s
        ] }, s)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3", children: eps.map((ep) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/watch/$id", params: {
        id: ep.id
      }, className: "senpai-glass group relative overflow-hidden rounded-2xl p-3 hover:bg-white/5 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-video overflow-hidden rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: ep.thumbnail_url || content.thumbnail_url || content.banner_url || FALLBACK_POSTER(ep.id), alt: "", onError: (e) => {
            e.currentTarget.src = FALLBACK_POSTER(ep.id);
          }, className: "h-full w-full object-cover transition-transform group-hover:scale-105" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-senpai-violet to-senpai-fuchsia shadow-[0_0_24px_var(--senpai-fuchsia)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-5 w-5 fill-current text-white" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-2 left-2 senpai-sticker !px-2 !py-1 !text-[10px]", children: [
            "E",
            ep.episode_number
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 px-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[var(--font-display)] text-sm tracking-wide text-white line-clamp-1", children: ep.title || `Episode ${ep.episode_number}` }),
          ep.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-senpai-text-muted line-clamp-2", children: ep.description })
        ] })
      ] }, ep.id)) }),
      eps.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "senpai-glass mt-6 rounded-2xl p-16 text-center text-senpai-text-dim", children: "No episodes in this season yet." })
    ] })
  ] });
}
export {
  Detail as component
};
