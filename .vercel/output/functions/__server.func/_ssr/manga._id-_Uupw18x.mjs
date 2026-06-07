import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-c090ocC3.mjs";
import "../_libs/seroval.mjs";
import { K as RotateCcw } from "../_libs/lucide-react.mjs";
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
import "./router-UGTBz-_d.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
const SplitErrorComponent = ({
  reset
}) => {
  const router = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-6 py-24 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "senpai-mega text-5xl senpai-grad-text-fire", children: "Oops" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-senpai-text-dim", children: "This manga page didn't load." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
      router.invalidate();
      reset();
    }, className: "senpai-glass mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs uppercase tracking-widest hover:bg-white/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4" }),
      " Try again"
    ] })
  ] }) });
};
export {
  SplitErrorComponent as errorComponent
};
