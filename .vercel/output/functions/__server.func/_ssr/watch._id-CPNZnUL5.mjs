import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
const SplitErrorComponent = ({
  error
}) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-dvh grid place-items-center bg-senpai-bg p-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "senpai-mega text-5xl senpai-grad-text-fire", children: "SIGNAL LOST" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-senpai-text-dim", children: error.message }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "senpai-glass mt-6 inline-block rounded-full px-5 py-2 text-sm", children: "Go home" })
] }) });
export {
  SplitErrorComponent as errorComponent
};
