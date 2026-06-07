import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-c090ocC3.mjs";
import { C as ContentPoster } from "./ContentPoster-CKCOJLHh.mjs";
import { s as supabase } from "./client-CSmeRDtX.mjs";
import { u as useAuth, F as FALLBACK_POSTER } from "./router-UGTBz-_d.mjs";
import "../_libs/seroval.mjs";
import { c as Library, H as History, P as Play, B as Bookmark } from "../_libs/lucide-react.mjs";
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
import "./server-DKFzjMa8.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function LibraryPage() {
  const {
    user,
    loading
  } = useAuth();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["library", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [history, watchlist] = await Promise.all([supabase.from("watch_history").select("*").order("last_watched_at", {
        ascending: false
      }).limit(24), supabase.from("watchlist").select("content_id, created_at").order("created_at", {
        ascending: false
      })]);
      const epIds = (history.data ?? []).map((h) => h.episode_id);
      const wlIds = (watchlist.data ?? []).map((w) => w.content_id);
      const [episodes, contentForEps, contentForWl] = await Promise.all([epIds.length ? supabase.from("episodes").select("*").in("id", epIds) : Promise.resolve({
        data: []
      }), Promise.resolve({
        data: []
      }), wlIds.length ? supabase.from("content").select("*").in("id", wlIds) : Promise.resolve({
        data: []
      })]);
      const epMap = new Map((episodes.data ?? []).map((e) => [e.id, e]));
      const epContentIds = Array.from(new Set((episodes.data ?? []).map((e) => e.content_id)));
      const epContent = epContentIds.length ? await supabase.from("content").select("*").in("id", epContentIds) : {
        data: []
      };
      const epContentMap = new Map((epContent.data ?? []).map((c) => [c.id, c]));
      const continueItems = (history.data ?? []).map((h) => {
        const ep = epMap.get(h.episode_id);
        if (!ep) return null;
        return {
          episode: ep,
          content: epContentMap.get(ep.content_id) ?? null,
          progress: h.progress_seconds,
          total: h.total_seconds
        };
      }).filter(Boolean);
      return {
        continueItems,
        watchlist: contentForWl.data ?? []
      };
    }
  });
  if (!loading && !user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-3xl px-6 py-28 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "senpai-mega text-6xl senpai-grad-text-fire", children: "LIBRARY" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-senpai-text-dim", children: "Sign in to track your continue-watching list and watchlist." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "senpai-glass mt-8 inline-block rounded-full px-6 py-3 text-sm hover:bg-white/10", children: "Sign in" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative mx-auto max-w-[1600px] px-4 sm:px-8 pt-10 pb-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "senpai-sticker", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Library, { className: "h-3 w-3" }),
      " Your shelves"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "senpai-mega mt-3 text-6xl sm:text-7xl senpai-grad-text-fire", children: "LIBRARY" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-12 flex items-center gap-2 font-[var(--font-display)] text-xl tracking-wide", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-5 w-5 text-senpai-teal" }),
      " Continue Watching"
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3", children: Array.from({
      length: 3
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video animate-pulse rounded-2xl bg-white/5" }, i)) }) : (data?.continueItems.length ?? 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-senpai-text-muted", children: "Nothing in progress yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3", children: data.continueItems.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/watch/$id", params: {
      id: it.episode.id
    }, className: "senpai-glass group relative flex gap-3 overflow-hidden rounded-2xl p-2.5 hover:bg-white/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-video w-40 flex-none overflow-hidden rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: it.episode.thumbnail_url || it.content?.banner_url || FALLBACK_POSTER(it.episode.id), alt: "", className: "h-full w-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid absolute inset-0 place-items-center opacity-0 transition-opacity group-hover:opacity-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-8 w-8 fill-current text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 h-1 bg-white/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-to-r from-senpai-violet to-senpai-fuchsia", style: {
          width: `${it.total ? Math.min(100, it.progress / it.total * 100) : 0}%`
        } }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 self-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[var(--font-display)] text-sm tracking-wide line-clamp-1", children: it.content?.title ?? "Episode" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] uppercase tracking-widest text-senpai-text-muted", children: [
          "S",
          it.episode.season_number,
          " · E",
          it.episode.episode_number
        ] })
      ] })
    ] }, it.episode.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-14 flex items-center gap-2 font-[var(--font-display)] text-xl tracking-wide", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "h-5 w-5 text-senpai-fuchsia" }),
      " Watchlist"
    ] }),
    (data?.watchlist.length ?? 0) === 0 && !isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-senpai-text-muted", children: "Your watchlist is empty." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6", children: data?.watchlist.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(ContentPoster, { item }, item.id)) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(LibraryPage, {}) });
export {
  SplitComponent as component
};
