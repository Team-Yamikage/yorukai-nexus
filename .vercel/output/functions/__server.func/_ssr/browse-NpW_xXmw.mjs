import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { a as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-c090ocC3.mjs";
import { C as ContentPoster } from "./ContentPoster-CKCOJLHh.mjs";
import { R as Route$9, b as browseQuery, h as homeFeedQuery } from "./router-UGTBz-_d.mjs";
import "../_libs/seroval.mjs";
import { a as Search, X } from "../_libs/lucide-react.mjs";
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
function Browse() {
  const search = Route$9.useSearch();
  const navigate = useNavigate();
  const {
    data: items
  } = useSuspenseQuery(browseQuery(search));
  const {
    data: feed
  } = useSuspenseQuery(homeFeedQuery);
  const [q, setQ] = reactExports.useState(search.q ?? "");
  const update = (patch) => navigate({
    to: "/browse",
    search: (prev) => ({
      ...prev,
      ...patch
    })
  });
  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];
  const types = ["series", "movie"];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative mx-auto max-w-7xl px-4 sm:px-8 pt-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[var(--font-mono)] text-[11px] uppercase tracking-[0.35em] text-senpai-text-muted", children: "Discover" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "senpai-mega mt-2 text-5xl sm:text-7xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "senpai-grad-text-cyber", children: "BROWSE" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
      e.preventDefault();
      update({
        q: q || void 0
      });
    }, className: "senpai-glass senpai-glass-strong mt-8 flex items-center gap-3 rounded-2xl p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 text-senpai-text-muted ml-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search titles…", className: "flex-1 bg-transparent text-sm text-white placeholder:text-senpai-text-muted outline-none" }),
      q && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
        setQ("");
        update({
          q: void 0
        });
      }, className: "text-senpai-text-muted hover:text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "rounded-xl bg-gradient-to-r from-senpai-violet to-senpai-fuchsia px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white", children: "Search" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { active: !search.genre && !search.type && !search.year, onClick: () => navigate({
        to: "/browse",
        search: {}
      }), children: "All" }),
      types.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { active: search.type === t, onClick: () => update({
        type: search.type === t ? void 0 : t
      }), children: t }, t)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-2 h-6 w-px self-center bg-senpai-border-strong" }),
      years.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { active: search.year === y, onClick: () => update({
        year: search.year === y ? void 0 : y
      }), children: y }, y))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: feed.genres.slice(0, 18).map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { accent: true, active: search.genre === g.slug, onClick: () => update({
      genre: search.genre === g.slug ? void 0 : g.slug
    }), children: g.name }, g.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 font-[var(--font-mono)] text-xs uppercase tracking-widest text-senpai-text-muted", children: [
      items.length,
      " ",
      items.length === 1 ? "result" : "results"
    ] }),
    items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "senpai-glass mt-6 rounded-2xl p-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "senpai-mega text-3xl senpai-grad-text-fire", children: "NO SIGNAL" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-senpai-text-dim", children: "No content matches these filters." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-4 pb-20", children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsx(ContentPoster, { item: it }, it.id)) })
  ] }) });
}
function Chip({
  children,
  active,
  onClick,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: `rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-widest transition-all ${active ? accent ? "bg-gradient-to-r from-senpai-teal to-senpai-violet text-white shadow-[0_0_18px_-4px_var(--senpai-violet)]" : "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia text-white shadow-[0_0_18px_-4px_var(--senpai-fuchsia)]" : "senpai-glass text-senpai-text-dim hover:text-white"}`, children });
}
export {
  Browse as component
};
