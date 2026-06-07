import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-c090ocC3.mjs";
import { C as ContentPoster } from "./ContentPoster-CKCOJLHh.mjs";
import { b as browseQuery, h as homeFeedQuery } from "./router-UGTBz-_d.mjs";
import "../_libs/seroval.mjs";
import { d as Sparkles } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
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
function Genres() {
  const {
    data: home
  } = useQuery(homeFeedQuery);
  const [active, setActive] = reactExports.useState(null);
  const {
    data: rows,
    isLoading
  } = useQuery({
    ...browseQuery({
      genre: active ?? void 0,
      limit: 36
    }),
    enabled: !!active
  });
  const genres = home?.genres ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative mx-auto max-w-[1600px] px-4 sm:px-8 pt-10 pb-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "senpai-sticker", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
      " Mood index"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "senpai-mega mt-3 text-6xl sm:text-7xl senpai-grad-text", children: "GENRES" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-2", children: [
      genres.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActive((cur) => cur === g.slug ? null : g.slug), className: `rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition ${active === g.slug ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia text-white shadow-[0_0_16px_-4px_var(--senpai-fuchsia)]" : "senpai-glass text-senpai-text-dim hover:text-white"}`, children: g.name }, g.id)),
      genres.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-senpai-text-muted", children: "No genres yet." })
    ] }),
    !active && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-16 text-center text-senpai-text-muted", children: "Pick a genre to explore the catalogue." }),
    active && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6", children: [
      isLoading ? Array.from({
        length: 12
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[2/3] w-full animate-pulse rounded-2xl bg-white/5" }, i)) : rows?.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(ContentPoster, { item }, item.id)),
      active && !isLoading && (rows?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "col-span-full text-center text-senpai-text-muted", children: "Nothing in this genre yet." })
    ] })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Genres, {}) });
export {
  SplitComponent as component
};
