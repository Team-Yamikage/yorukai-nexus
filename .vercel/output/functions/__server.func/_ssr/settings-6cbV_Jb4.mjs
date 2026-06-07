import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-c090ocC3.mjs";
import { u as useAuth } from "./router-UGTBz-_d.mjs";
import "../_libs/seroval.mjs";
import { S as Settings, L as LogOut } from "../_libs/lucide-react.mjs";
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
const LANGS = ["English", "Hindi", "Japanese", "Tamil", "Telugu", "Malayalam", "Kannada", "Bengali"];
function usePref(key, initial) {
  const [value, setValue] = reactExports.useState(initial);
  reactExports.useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored !== null) setValue(stored);
  }, [key]);
  const update = (v) => {
    setValue(v);
    localStorage.setItem(key, v);
  };
  return [value, update];
}
function SettingsPage() {
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = usePref("yk_pref_lang", "English");
  const [autoplay, setAutoplay] = usePref("yk_pref_autoplay", "on");
  const [skipIntro, setSkipIntro] = usePref("yk_pref_skipintro", "on");
  const [reduceMotion, setReduceMotion] = usePref("yk_pref_reducemotion", "off");
  reactExports.useEffect(() => {
    document.documentElement.classList.toggle("yk-reduce-motion", reduceMotion === "on");
  }, [reduceMotion]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative mx-auto max-w-3xl px-4 sm:px-8 pt-10 pb-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "senpai-sticker", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-3 w-3" }),
      " Preferences"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "senpai-mega mt-3 text-6xl sm:text-7xl senpai-grad-text-cyber", children: "SETTINGS" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "senpai-glass mt-10 rounded-3xl p-6 sm:p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-[var(--font-display)] text-lg tracking-wide", children: "Playback" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mt-5 block text-xs uppercase tracking-[0.3em] text-senpai-text-muted", children: "Preferred audio language" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: LANGS.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setLang(l), className: `rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition ${lang === l ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia text-white shadow-[0_0_16px_-4px_var(--senpai-fuchsia)]" : "senpai-glass text-senpai-text-dim hover:text-white"}`, children: l }, l)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: "Autoplay next episode", on: autoplay === "on", onChange: (v) => setAutoplay(v ? "on" : "off") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: "Auto skip intro", on: skipIntro === "on", onChange: (v) => setSkipIntro(v ? "on" : "off") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: "Reduce motion", on: reduceMotion === "on", onChange: (v) => setReduceMotion(v ? "on" : "off") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "senpai-glass mt-6 rounded-3xl p-6 sm:p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-[var(--font-display)] text-lg tracking-wide", children: "Account" }),
      user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-senpai-text-dim", children: user.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: async () => {
          await signOut();
          navigate({
            to: "/"
          });
        }, className: "mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-senpai-violet to-senpai-fuchsia px-5 py-2.5 text-sm font-semibold text-white hover:scale-[1.03] transition-transform", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
          " Sign out"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "senpai-glass mt-4 inline-block rounded-full px-5 py-2.5 text-sm hover:bg-white/10", children: "Sign in" })
    ] })
  ] });
}
function Toggle({
  label,
  on,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-senpai-text-dim", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onChange(!on), className: `relative h-7 w-12 rounded-full transition-colors ${on ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia" : "bg-white/15"}`, "aria-pressed": on, "aria-label": label, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${on ? "left-6" : "left-1"}` }) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsPage, {}) });
export {
  SplitComponent as component
};
