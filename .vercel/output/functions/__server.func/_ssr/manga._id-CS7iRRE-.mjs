import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-c090ocC3.mjs";
import { S as ShareButton } from "./ShareButton-1PifcBw2.mjs";
import { j as Route$2, k as mangaDetailQuery, n as mangaChaptersQuery } from "./router-UGTBz-_d.mjs";
import "../_libs/seroval.mjs";
import { r as ArrowLeft, m as BookOpen, K as RotateCcw } from "../_libs/lucide-react.mjs";
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
function Detail() {
  const {
    id
  } = Route$2.useParams();
  const {
    data: manga,
    isLoading
  } = useQuery(mangaDetailQuery(id));
  const {
    data: chapters,
    isLoading: loadingCh,
    isError: chaptersError,
    refetch: refetchChapters,
    isFetching: fetchingCh
  } = useQuery(mangaChaptersQuery(id));
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-6xl px-6 py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-96 w-full animate-pulse rounded-3xl bg-white/5" }) });
  }
  if (!manga) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-6 py-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "senpai-mega text-5xl senpai-grad-text-fire", children: "404" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-senpai-text-dim", children: "Manga not found." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-6xl px-4 sm:px-8 pt-6 pb-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/manga", className: "senpai-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Manga"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShareButton, { title: manga.title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-8 md:grid-cols-[260px_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "senpai-poster relative mx-auto aspect-[2/3] w-full max-w-[260px]", children: manga.cover ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: manga.cover, alt: manga.title, referrerPolicy: "no-referrer", className: "absolute inset-0 h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid place-items-center bg-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-10 w-10" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-[var(--font-display)] text-3xl sm:text-4xl tracking-wide text-white", children: manga.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest text-senpai-text-dim", children: [
          manga.status && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "senpai-glass rounded-full px-3 py-1", children: manga.status }),
          manga.year && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "senpai-glass rounded-full px-3 py-1", children: manga.year }),
          manga.tags.slice(0, 6).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "senpai-glass rounded-full px-3 py-1 text-senpai-teal", children: t }, t))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 max-w-2xl text-sm leading-relaxed text-senpai-text-dim line-clamp-6", children: manga.description })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-senpai-text-muted", children: "Chapters · ascending" }),
      loadingCh ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-2", children: Array.from({
        length: 8
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-full animate-pulse rounded-xl bg-white/5" }, i)) }) : chaptersError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid place-items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] py-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-senpai-text-dim", children: "Couldn't load chapters — the source may be rate-limited." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => refetchChapters(), disabled: fetchingCh, className: "senpai-glass inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs uppercase tracking-widest hover:bg-white/10 disabled:opacity-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: `h-4 w-4 ${fetchingCh ? "animate-spin" : ""}` }),
          " Retry"
        ] })
      ] }) : chapters && chapters.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-2", children: chapters.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/reader/$id", params: {
        id: c.id
      }, search: {
        manga: id
      }, className: "senpai-glass flex items-center justify-between gap-4 rounded-xl px-4 py-3 text-sm hover:bg-white/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
          c.volume ? `Vol ${c.volume} · ` : "",
          "Chapter ",
          c.chapter ?? "?",
          c.title ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-senpai-text-dim", children: c.title }) : null
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] uppercase tracking-widest text-senpai-text-muted", children: [
          c.pages,
          " pages"
        ] })
      ] }, c.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-senpai-text-muted", children: "No English chapters available." })
    ] })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, {}) });
export {
  SplitComponent as component
};
