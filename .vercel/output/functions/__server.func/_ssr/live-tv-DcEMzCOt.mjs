import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-c090ocC3.mjs";
import { l as liveChannelsQuery } from "./router-UGTBz-_d.mjs";
import "../_libs/seroval.mjs";
import { R as Radio, a as Search, b as Tv } from "../_libs/lucide-react.mjs";
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
const CATEGORY_LABELS = {
  news: "News",
  sports: "Sports",
  entertainment: "Entertainment",
  movies: "Movies",
  music: "Music",
  kids: "Kids",
  religious: "Devotional",
  general: "General",
  documentary: "Documentary",
  lifestyle: "Lifestyle"
};
function LiveTV() {
  const {
    data: channels
  } = useSuspenseQuery(liveChannelsQuery);
  const [q, setQ] = reactExports.useState("");
  const [cat, setCat] = reactExports.useState("all");
  const cats = reactExports.useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    channels.forEach((c) => c.categories.forEach((x) => set.add(x)));
    return ["all", ...Array.from(set).sort()];
  }, [channels]);
  const filtered = reactExports.useMemo(() => {
    return channels.filter((c) => {
      const matchCat = cat === "all" || c.categories.includes(cat);
      const matchQ = !q || c.name.toLowerCase().includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [channels, q, cat]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative mx-auto max-w-[1600px] px-4 sm:px-8 pt-10 pb-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "senpai-sticker", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "h-3 w-3" }),
          " 放送中 · Live now"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "senpai-mega mt-3 text-6xl sm:text-7xl senpai-grad-text-fire", children: "LIVE TV" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-senpai-text-dim", children: [
          channels.length,
          " Indian channels streaming right now."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "senpai-glass flex items-center gap-2 rounded-full px-4 py-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 text-senpai-text-muted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search channels…", className: "w-44 bg-transparent text-sm outline-none placeholder:text-senpai-text-muted" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 flex flex-wrap gap-2", children: cats.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCat(c), className: `rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition ${cat === c ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia text-white shadow-[0_0_16px_-4px_var(--senpai-fuchsia)]" : "senpai-glass text-senpai-text-dim hover:text-white"}`, children: c === "all" ? "All" : CATEGORY_LABELS[c] ?? c }, c)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6", children: filtered.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(ChannelCard, { c }, c.id)) }),
    filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-16 text-center text-senpai-text-muted", children: "No channels match your filter." })
  ] });
}
function ChannelCard({
  c
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/live-watch/$id", params: {
    id: c.id
  }, className: "senpai-glass group flex flex-col items-center gap-3 rounded-2xl p-4 text-center transition hover:bg-white/5 hover:ring-1 hover:ring-senpai-fuchsia/40 focus-visible:ring-2 focus-visible:ring-senpai-fuchsia outline-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-16 w-16 place-items-center overflow-hidden rounded-xl bg-white/5", children: c.logo ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.logo, alt: c.name, loading: "lazy", className: "h-full w-full object-contain p-1", onError: (e) => {
      e.currentTarget.style.display = "none";
    } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "h-7 w-7 text-senpai-text-muted" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "line-clamp-2 text-xs font-semibold tracking-wide text-white", children: c.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[9px] uppercase tracking-widest text-senpai-teal", children: CATEGORY_LABELS[c.categories[0]] ?? c.categories[0] })
    ] })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(LiveTV, {}) });
export {
  SplitComponent as component
};
