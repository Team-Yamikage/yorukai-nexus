import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-c090ocC3.mjs";
import { m as mangaListQuery } from "./router-UGTBz-_d.mjs";
import "../_libs/seroval.mjs";
import { m as BookOpen, a as Search } from "../_libs/lucide-react.mjs";
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
function Manga() {
  const [kind, setKind] = reactExports.useState("popular");
  const [q, setQ] = reactExports.useState("");
  const [submitted, setSubmitted] = reactExports.useState("");
  const {
    data,
    isLoading,
    isError
  } = useQuery(mangaListQuery(kind, submitted || void 0));
  const tabs = [{
    id: "popular",
    label: "Popular"
  }, {
    id: "trending",
    label: "Trending"
  }, {
    id: "latest",
    label: "Latest"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative mx-auto max-w-[1600px] px-4 sm:px-8 pt-10 pb-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "senpai-sticker", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-3 w-3" }),
      " Manga library"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "senpai-mega mt-3 text-6xl sm:text-7xl senpai-grad-text", children: "MANGA" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: tabs.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setKind(t.id), className: `rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition ${kind === t.id && !submitted ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia text-white shadow-[0_0_16px_-4px_var(--senpai-fuchsia)]" : "senpai-glass text-senpai-text-dim hover:text-white"}`, children: t.label }, t.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        setSubmitted(q.trim());
      }, className: "senpai-glass flex items-center gap-2 rounded-full px-4 py-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 text-senpai-text-muted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search manga…", className: "w-44 bg-transparent text-sm outline-none placeholder:text-senpai-text-muted" })
      ] })
    ] }),
    isError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-16 text-center text-senpai-text-muted", children: "Couldn't load manga. Try again." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6", children: isLoading ? Array.from({
      length: 12
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[2/3] w-full animate-pulse rounded-2xl bg-white/5" }, i)) : data?.items.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(MangaCard, { m }, m.id)) })
  ] });
}
function MangaCard({
  m
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/manga/$id", params: {
    id: m.id
  }, className: "senpai-poster group block aspect-[2/3] w-full", children: [
    m.cover ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: m.cover, alt: m.title, loading: "lazy", referrerPolicy: "no-referrer", onError: (e) => {
      e.currentTarget.style.display = "none";
    }, className: "senpai-duotone absolute inset-0 h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid place-items-center bg-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-8 w-8 text-senpai-text-muted" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 z-10 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-[var(--font-display)] text-sm leading-tight tracking-wide text-white line-clamp-2", children: m.title }) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Manga, {}) });
export {
  SplitComponent as component
};
