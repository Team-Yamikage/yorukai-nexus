import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as Route$3, u as useAuth, i as chapterPagesQuery } from "./router-UGTBz-_d.mjs";
import { s as supabase } from "./client-CSmeRDtX.mjs";
import "../_libs/seroval.mjs";
import { r as ArrowLeft, s as Pause, P as Play, I as Rows2, J as Columns2 } from "../_libs/lucide-react.mjs";
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
import "./server-DKFzjMa8.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function onPageError(e, fallback) {
  const img = e.currentTarget;
  if (img.dataset.fellback === "1" || img.src === fallback) return;
  img.dataset.fellback = "1";
  img.src = fallback;
}
function Reader() {
  const {
    id
  } = Route$3.useParams();
  const {
    manga
  } = Route$3.useSearch();
  const {
    user
  } = useAuth();
  const {
    data: pages,
    isLoading,
    isError
  } = useQuery(chapterPagesQuery(id));
  const [mode, setMode] = reactExports.useState("vertical");
  const [idx, setIdx] = reactExports.useState(0);
  const [autoRead, setAutoRead] = reactExports.useState(false);
  const [speed, setSpeed] = reactExports.useState(() => {
    if (typeof window === "undefined") return 6;
    return Number(localStorage.getItem("yk_pref_reader_speed")) || 6;
  });
  const savedOnce = reactExports.useRef(false);
  reactExports.useEffect(() => {
    localStorage.setItem("yk_pref_reader_speed", String(speed));
  }, [speed]);
  reactExports.useEffect(() => {
    if (!autoRead || !pages || pages.length === 0) return;
    const t = setInterval(() => {
      if (mode === "vertical") {
        window.scrollBy({
          top: window.innerHeight * 0.9,
          behavior: "smooth"
        });
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
          setAutoRead(false);
        }
      } else {
        setIdx((i) => {
          if (i >= pages.length - 1) {
            setAutoRead(false);
            return i;
          }
          return i + 1;
        });
      }
    }, Math.max(1, speed) * 1e3);
    return () => clearInterval(t);
  }, [autoRead, speed, mode, pages]);
  reactExports.useEffect(() => {
    if (!user || !manga || savedOnce.current) return;
    supabase.from("manga_progress").select("page, chapter_id").eq("user_id", user.id).eq("manga_id", manga).maybeSingle().then(({
      data
    }) => {
      if (data?.chapter_id === id && data?.page) setIdx(Math.max(0, data.page - 1));
    });
  }, [user, manga, id]);
  reactExports.useEffect(() => {
    if (!user || !manga || !pages || pages.length === 0) return;
    savedOnce.current = true;
    const t = setTimeout(() => {
      supabase.from("manga_progress").upsert({
        user_id: user.id,
        manga_id: manga,
        chapter_id: id,
        page: idx + 1,
        total_pages: pages.length,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }, {
        onConflict: "user_id,manga_id"
      }).then(() => {
      });
    }, 800);
    return () => clearTimeout(t);
  }, [user, manga, id, idx, pages]);
  const containerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (mode !== "vertical" || !pages?.length) return;
    const onScroll = () => {
      const imgs = containerRef.current?.querySelectorAll("img");
      if (!imgs) return;
      let current = 0;
      imgs.forEach((img, i) => {
        if (img.getBoundingClientRect().top < window.innerHeight * 0.5) current = i;
      });
      setIdx(current);
    };
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode, pages]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-dvh bg-black text-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-black/70 px-4 py-3 backdrop-blur", children: [
      manga ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/manga/$id", params: {
        id: manga
      }, className: "senpai-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Back"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/manga", className: "senpai-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Back"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        pages && pages.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-[var(--font-mono)] text-xs text-senpai-text-muted", children: [
          idx + 1,
          " / ",
          pages.length
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setAutoRead((v) => !v), "aria-label": autoRead ? "Pause auto-read" : "Start auto-read", className: `grid h-9 w-9 place-items-center rounded-full ${autoRead ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia" : "senpai-glass"}`, children: autoRead ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: speed, onChange: (e) => setSpeed(Number(e.target.value)), "aria-label": "Auto-read speed", className: "senpai-glass h-9 rounded-full bg-transparent px-2 text-xs outline-none [&>option]:bg-black", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 3, children: "Fast 3s" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 6, children: "Normal 6s" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 10, children: "Slow 10s" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode("vertical"), className: `grid h-9 w-9 place-items-center rounded-full ${mode === "vertical" ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia" : "senpai-glass"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Rows2, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode("horizontal"), className: `grid h-9 w-9 place-items-center rounded-full ${mode === "horizontal" ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia" : "senpai-glass"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Columns2, { className: "h-4 w-4" }) })
        ] })
      ] })
    ] }),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center py-32 text-senpai-text-muted", children: "Loading pages…" }),
    isError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center py-32 text-senpai-text-muted", children: "Couldn't load this chapter." }),
    pages && mode === "vertical" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: containerRef, className: "mx-auto flex max-w-3xl flex-col", children: pages.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.url, alt: `Page ${i + 1}`, loading: "lazy", referrerPolicy: "no-referrer", onError: (e) => onPageError(e, p.fallback), className: "w-full" }, i)) }),
    pages && pages.length > 0 && mode === "horizontal" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto grid min-h-[calc(100dvh-57px)] max-w-3xl place-items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: pages[idx].url, alt: `Page ${idx + 1}`, referrerPolicy: "no-referrer", onError: (e) => onPageError(e, pages[idx].fallback), className: "max-h-[calc(100dvh-120px)] w-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 left-0 w-1/3 cursor-pointer", onClick: () => setIdx((i) => Math.max(0, i - 1)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 right-0 w-1/3 cursor-pointer", onClick: () => setIdx((i) => Math.min(pages.length - 1, i + 1)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-1.5 text-xs", children: [
        idx + 1,
        " / ",
        pages.length
      ] })
    ] })
  ] });
}
export {
  Reader as component
};
