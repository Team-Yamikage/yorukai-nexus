import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { F as FALLBACK_POSTER } from "./router-UGTBz-_d.mjs";
import { l as Star, P as Play } from "../_libs/lucide-react.mjs";
function ContentPoster({ item, kind = "anime" }) {
  const href = kind === "manga" ? "/manga/$id" : "/detail/$id";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: href,
      params: { id: item.id },
      className: "senpai-poster group block aspect-[2/3] w-full",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: item.poster_url || FALLBACK_POSTER(item.id),
            alt: item.title,
            loading: "lazy",
            onError: (e) => {
              e.currentTarget.src = FALLBACK_POSTER(item.id);
            },
            className: "senpai-duotone absolute inset-0 h-full w-full object-cover"
          }
        ),
        item.featured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-3 z-10 senpai-sticker !bg-senpai-fuchsia/85 !border-transparent !text-white", children: "Featured" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex items-center gap-2 text-[10px] uppercase tracking-widest text-senpai-text-dim", children: [
            item.rating != null && item.rating > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-senpai-amber", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-current" }),
              " ",
              Number(item.rating).toFixed(1)
            ] }),
            item.release_year && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.release_year }),
            item.type && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-senpai-teal", children: item.type })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-[var(--font-display)] text-base sm:text-lg leading-tight tracking-wide text-white line-clamp-2", children: item.title })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-10 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-senpai-violet to-senpai-fuchsia text-white shadow-[0_0_30px_var(--senpai-fuchsia)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-6 w-6 fill-current" }) }) })
      ]
    }
  );
}
export {
  ContentPoster as C
};
