import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-c090ocC3.mjs";
import { s as supabase } from "./client-CSmeRDtX.mjs";
import { u as useAuth } from "./router-UGTBz-_d.mjs";
import "../_libs/seroval.mjs";
import { T as Trophy, C as Crown, Z as Zap, L as LogOut } from "../_libs/lucide-react.mjs";
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
function ProfilePage() {
  const {
    user,
    loading,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const {
    data: profile
  } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      return data;
    }
  });
  if (!loading && !user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-3xl px-6 py-28 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "senpai-mega text-6xl senpai-grad-text", children: "PROFILE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-senpai-text-dim", children: "Sign in to view your profile." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "senpai-glass mt-8 inline-block rounded-full px-6 py-3 text-sm hover:bg-white/10", children: "Sign in" })
    ] });
  }
  const name = profile?.display_name || user?.email?.split("@")[0] || "Senpai";
  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const xpInLevel = xp % 1e3;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative mx-auto max-w-4xl px-4 sm:px-8 pt-10 pb-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "senpai-sticker", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-3 w-3" }),
      " You"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "senpai-mega mt-3 text-6xl sm:text-7xl senpai-grad-text", children: "PROFILE" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "senpai-glass senpai-glass-strong mt-10 flex flex-col items-center gap-6 rounded-3xl p-8 sm:flex-row sm:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-28 w-28 flex-none place-items-center overflow-hidden rounded-full bg-gradient-to-br from-senpai-violet to-senpai-fuchsia text-4xl font-bold text-white", children: profile?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: profile.avatar_url, alt: name, className: "h-full w-full object-cover" }) : name.charAt(0).toUpperCase() }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 text-center sm:text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 sm:justify-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-[var(--font-display)] text-2xl tracking-wide", children: name }),
          profile?.is_premium && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "senpai-sticker !bg-senpai-amber/85 !border-transparent !text-black", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3 w-3" }),
            " Premium"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-senpai-text-muted", children: user?.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-senpai-text-dim", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5 text-senpai-teal" }),
              " Level ",
              level
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              xpInLevel,
              " / 1000 XP"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-2 overflow-hidden rounded-full bg-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-to-r from-senpai-violet to-senpai-fuchsia", style: {
            width: `${xpInLevel / 1e3 * 100}%`
          } }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Level", value: String(level) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Total XP", value: xp.toLocaleString() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Status", value: profile?.is_premium ? "Premium" : "Free" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", className: "senpai-glass rounded-full px-5 py-2.5 text-sm hover:bg-white/10", children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/library", className: "senpai-glass rounded-full px-5 py-2.5 text-sm hover:bg-white/10", children: "Library" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: async () => {
        await signOut();
        navigate({
          to: "/"
        });
      }, className: "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-senpai-violet to-senpai-fuchsia px-5 py-2.5 text-sm font-semibold text-white hover:scale-[1.03] transition-transform", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
        " Sign out"
      ] })
    ] })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "senpai-glass rounded-2xl p-5 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[var(--font-display)] text-2xl tracking-wide senpai-grad-text", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[10px] uppercase tracking-[0.3em] text-senpai-text-muted", children: label })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProfilePage, {}) });
export {
  SplitComponent as component
};
