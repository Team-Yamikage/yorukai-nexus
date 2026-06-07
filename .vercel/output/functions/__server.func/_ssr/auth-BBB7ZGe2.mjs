import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-CSmeRDtX.mjs";
import { u as useAuth } from "./router-UGTBz-_d.mjs";
import "../_libs/seroval.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { M as Mail, e as Lock, f as LoaderCircle, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./server-DKFzjMa8.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const img = (s) => `https://picsum.photos/seed/${s}/1400/1800`;
function AuthPage() {
  const [tab, setTab] = reactExports.useState("login");
  const [displayName, setDisplayName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [notice, setNotice] = reactExports.useState(null);
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  reactExports.useEffect(() => {
    if (user) navigate({
      to: "/"
    });
  }, [user, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      if (tab === "login") {
        const {
          error: error2
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error2) throw error2;
        navigate({
          to: "/"
        });
      } else {
        const {
          data,
          error: error2
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              display_name: displayName || email.split("@")[0]
            }
          }
        });
        if (error2) throw error2;
        if (data.session) {
          navigate({
            to: "/"
          });
        } else {
          setNotice("Account created. Check your email to confirm, then sign in.");
          setTab("login");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "senpai-root senpai-scrollbar relative grid min-h-dvh grid-cols-1 lg:grid-cols-[6fr_4fr]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative isolate hidden overflow-hidden lg:block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: img("yk-auth-hero"), alt: "", className: "absolute inset-0 h-full w-full object-cover opacity-60" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-senpai-bg via-senpai-bg/40 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(161,107,255,0.45),transparent_55%)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 senpai-halftone opacity-20" }),
      Array.from({
        length: 14
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { className: "absolute h-1.5 w-1.5 rounded-full bg-senpai-teal shadow-[0_0_12px_var(--senpai-teal)]", style: {
        left: `${i * 73 % 100}%`,
        top: `${i * 41 % 100}%`
      }, animate: {
        y: [0, -30, 0],
        opacity: [0.2, 1, 0.2]
      }, transition: {
        duration: 4 + i % 4,
        repeat: Infinity,
        delay: i * 0.3
      } }, i)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex h-full flex-col justify-between p-10 xl:p-14", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-md bg-gradient-to-br from-senpai-violet via-senpai-fuchsia to-senpai-teal font-[var(--font-mega)] text-white", children: "夜" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-[var(--font-display)] text-xl tracking-wider", children: [
              "YORUKAI",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-senpai-fuchsia", children: "." }),
              "TV"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-senpai-text-muted", children: "stream beyond" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[var(--font-hand)] text-3xl text-senpai-teal", children: "welcome back, senpai ✦" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "senpai-mega mt-3 text-6xl xl:text-7xl 2xl:text-[110px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "senpai-grad-text", children: "ANIME" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "senpai-stroke-text", children: "MOVIES" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "senpai-grad-text-fire", children: "LIVE TV" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "senpai-grad-text-cyber", children: "MANGA" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-md text-sm text-senpai-text-dim", children: "One pass. Every screen. Four worlds of story streaming in 4K HDR with simulcasts from Tokyo." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs uppercase tracking-[0.3em] text-senpai-text-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "夜界 · est. 2026" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-senpai-teal", children: "● 12,847 streaming now" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative flex items-center justify-center px-5 py-10 sm:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 senpai-bg-grid opacity-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.5
      }, className: "senpai-glass senpai-glass-strong senpai-card-shadow relative w-full max-w-md rounded-2xl p-7 sm:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:hidden mb-6 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-senpai-violet to-senpai-fuchsia font-[var(--font-mega)] text-white text-sm", children: "夜" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[var(--font-display)] tracking-wider", children: "YORUKAI.TV" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[var(--font-mono)] text-[10px] uppercase tracking-[0.35em] text-senpai-text-muted", children: "Access Terminal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "senpai-mega mt-2 text-4xl", children: tab === "login" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "senpai-grad-text", children: "Sign In" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "senpai-grad-text-cyber", children: "Join" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid grid-cols-2 rounded-full bg-white/5 p-1 ring-1 ring-senpai-border", children: ["login", "signup"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
          setTab(t);
          setError(null);
          setNotice(null);
        }, className: "relative rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest", children: [
          tab === t && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { layoutId: "tab-pill", className: "absolute inset-0 rounded-full bg-gradient-to-r from-senpai-violet to-senpai-fuchsia shadow-[0_8px_24px_-8px_var(--senpai-fuchsia)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `relative ${tab === t ? "text-white" : "text-senpai-text-muted"}`, children: t === "login" ? "Login" : "Sign up" })
        ] }, t)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "mt-6 space-y-4", onSubmit: handleSubmit, children: [
          tab === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Display name", placeholder: "senpai_07", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserGlyph, {}), value: displayName, onChange: setDisplayName, autoComplete: "nickname" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", type: "email", placeholder: "you@beyond.tv", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }), value: email, onChange: setEmail, required: true, autoComplete: "email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Password", type: "password", placeholder: "••••••••", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4" }), value: password, onChange: setPassword, required: true, autoComplete: tab === "login" ? "current-password" : "new-password" }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300 ring-1 ring-red-500/30", children: error }),
          notice && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-senpai-teal/10 px-3.5 py-2.5 text-xs text-senpai-teal ring-1 ring-senpai-teal/30", children: notice }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-senpai-violet via-senpai-fuchsia to-senpai-pink py-3 font-semibold text-white shadow-[0_12px_40px_-12px_var(--senpai-fuchsia)] transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            tab === "login" ? "Enter the night" : "Create account",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-xs text-senpai-text-muted", children: [
          "By continuing you agree to the ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-senpai-text-dim underline-offset-4 hover:underline", children: "Terms" }),
          " &",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-senpai-text-dim underline-offset-4 hover:underline", children: "Privacy" }),
          "."
        ] })
      ] })
    ] })
  ] });
}
function Field({
  label,
  type = "text",
  placeholder,
  icon,
  value,
  onChange,
  required,
  autoComplete
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-senpai-text-muted", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex items-center gap-2 rounded-xl bg-white/5 px-3.5 py-2.5 ring-1 ring-senpai-border transition-all focus-within:bg-white/10 focus-within:ring-senpai-violet focus-within:shadow-[0_0_0_4px_rgba(161,107,255,0.18)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-senpai-text-muted", children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, required, autoComplete, value, onChange: (e) => onChange(e.target.value), placeholder, className: "w-full bg-transparent text-sm text-white placeholder:text-senpai-text-muted/70 outline-none" })
    ] })
  ] });
}
function UserGlyph() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "8", r: "4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 21c0-4 4-7 8-7s8 3 8 7" })
  ] });
}
export {
  AuthPage as component
};
