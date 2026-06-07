import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useRouterState, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-UGTBz-_d.mjs";
import { a as Search, n as Bell, U as User, c as Library, o as Tags, B as Bookmark, p as CircleUserRound, S as Settings, q as Shield } from "../_libs/lucide-react.mjs";
const logoIcon = "/assets/logo-icon-D-OhYxs1.png";
const NAV = [
  { to: "/", label: "Home" },
  { to: "/browse", label: "Browse" },
  { to: "/live-tv", label: "Live TV" },
  { to: "/manga", label: "Manga" }
];
function GlassNavbar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50 px-4 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "senpai-glass senpai-glass-strong mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl px-4 py-2.5 md:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-9 w-9", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-xl bg-gradient-to-br from-senpai-violet via-senpai-fuchsia to-senpai-teal blur-md opacity-60" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: logoIcon,
            alt: "YORUKAI.TV logo",
            width: 36,
            height: 36,
            className: "relative h-9 w-9 rounded-xl object-cover"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:block leading-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-[var(--font-display)] text-lg tracking-wider", children: [
          "YORUKAI",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-senpai-fuchsia", children: "." }),
          "TV"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-senpai-text-muted", children: "stream beyond" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "hidden md:flex items-center gap-1", children: NAV.map((item) => {
      const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
      return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: item.to,
          className: `relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${active ? "text-white" : "text-senpai-text-dim hover:text-white"}`,
          children: [
            active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-senpai-violet/30 to-senpai-fuchsia/30 ring-1 ring-senpai-violet/50" }),
            item.label
          ]
        }
      ) }, item.to);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/search",
          className: "senpai-glass group flex items-center gap-2 rounded-full px-3 py-2 text-sm text-senpai-text-muted transition-all hover:text-white hover:ring-1 hover:ring-senpai-violet/60",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden lg:inline text-xs uppercase tracking-widest", children: "Search" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "senpai-glass relative grid h-9 w-9 place-items-center rounded-full text-senpai-text-dim hover:text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-senpai-fuchsia shadow-[0_0_8px_var(--senpai-fuchsia)]" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/auth",
          className: "grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-senpai-violet to-senpai-violet-2 text-white shadow-[0_8px_24px_-8px_var(--senpai-violet)]",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" })
        }
      )
    ] })
  ] }) });
}
const ITEMS = [
  { to: "/library", label: "Library", icon: Library },
  { to: "/genres", label: "Genres", icon: Tags },
  { to: "/library", label: "Watchlist", icon: Bookmark },
  { to: "/profile", label: "Profile", icon: CircleUserRound },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/admin", label: "Admin", icon: Shield, accent: true, adminOnly: true }
];
function FloatingSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { isAdmin } = useAuth();
  const items = ITEMS.filter((i) => !i.adminOnly || isAdmin);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "pointer-events-none fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "senpai-glass senpai-glass-strong pointer-events-auto flex flex-col items-center gap-1 rounded-2xl p-2", children: items.map((item) => {
    const active = path === item.to;
    const Icon = item.icon;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: item.to,
        className: `group relative grid h-11 w-11 place-items-center rounded-xl transition-all ${active ? "bg-gradient-to-br from-senpai-violet to-senpai-violet-2 text-white shadow-[0_0_20px_-4px_var(--senpai-violet)]" : item.accent ? "text-senpai-amber hover:bg-senpai-amber/10" : "text-senpai-text-dim hover:bg-white/5 hover:text-white"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4.5 w-4.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-senpai-bg-3 px-2 py-1 text-[11px] font-medium uppercase tracking-wider opacity-0 ring-1 ring-senpai-border-strong transition-opacity group-hover:opacity-100", children: item.label })
        ]
      },
      item.label
    );
  }) }) });
}
function AppShell({ children }) {
  reactExports.useEffect(() => {
    const reduce = localStorage.getItem("yk_pref_reducemotion") === "on";
    document.documentElement.classList.toggle("yk-reduce-motion", reduce);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "senpai-root senpai-scrollbar relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed inset-0 -z-10 senpai-bg-grid" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed -top-40 left-1/2 -z-10 h-[60vh] w-[120vw] -translate-x-1/2 senpai-aurora" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(GlassNavbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "relative lg:pl-20", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "relative mt-32 border-t border-senpai-border px-6 py-10 text-center text-xs uppercase tracking-[0.3em] text-senpai-text-muted", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-[var(--font-jp)]", children: "夜界" }),
      " · YORUKAI.TV · stream beyond"
    ] })
  ] });
}
export {
  AppShell as A
};
