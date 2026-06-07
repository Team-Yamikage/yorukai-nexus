import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-c090ocC3.mjs";
import { C as ContentPoster } from "./ContentPoster-CKCOJLHh.mjs";
import { b as browseQuery } from "./router-UGTBz-_d.mjs";
import "../_libs/seroval.mjs";
import { a as Search } from "../_libs/lucide-react.mjs";
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
function SearchPage() {
  const [q, setQ] = reactExports.useState("");
  const [term, setTerm] = reactExports.useState("");
  reactExports.useEffect(() => {
    const t = setTimeout(() => setTerm(q.trim()), 350);
    return () => clearTimeout(t);
  }, [q]);
  const {
    data: rows,
    isFetching
  } = useQuery({
    ...browseQuery({
      q: term || void 0,
      limit: 48
    }),
    enabled: term.length >= 2
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative mx-auto max-w-[1600px] px-4 sm:px-8 pt-10 pb-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "senpai-sticker", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3 w-3" }),
      " Find anything"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "senpai-mega mt-3 text-6xl sm:text-7xl senpai-grad-text-cyber", children: "SEARCH" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "senpai-glass mt-8 flex items-center gap-3 rounded-full px-5 py-3.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-5 w-5 text-senpai-text-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { autoFocus: true, value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search anime titles…", className: "w-full bg-transparent text-base outline-none placeholder:text-senpai-text-muted" })
    ] }),
    term.length < 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-16 text-center text-senpai-text-muted", children: "Type at least 2 characters to search." }),
    term.length >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6", children: [
      isFetching ? Array.from({
        length: 12
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[2/3] w-full animate-pulse rounded-2xl bg-white/5" }, i)) : rows?.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(ContentPoster, { item }, item.id)),
      !isFetching && (rows?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "col-span-full text-center text-senpai-text-muted", children: [
        "No results for “",
        term,
        "”."
      ] })
    ] })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchPage, {}) });
export {
  SplitComponent as component
};
