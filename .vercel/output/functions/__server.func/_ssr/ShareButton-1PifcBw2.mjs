import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { y as Share2, z as Check, D as Copy, E as MessageCircle, G as Send } from "../_libs/lucide-react.mjs";
function ShareButton({
  title,
  className = ""
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [copied, setCopied] = reactExports.useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = title ? `Watch ${title} on YORUKAI.TV` : "Check this out on YORUKAI.TV";
  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: title ?? "YORUKAI.TV", text, url });
        return;
      } catch {
      }
    }
    setOpen((o) => !o);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: nativeShare,
        className: "senpai-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-senpai-fuchsia outline-none",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4" }),
          " Share"
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "senpai-glass-strong absolute right-0 z-30 mt-2 w-52 rounded-2xl p-2 ring-1 ring-senpai-violet/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: copy, className: "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-white/10", children: [
        copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-senpai-teal" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" }),
        copied ? "Link copied" : "Copy link"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-white/10",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4 text-[#25D366]" }),
            " WhatsApp"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-white/10",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 text-[#229ED9]" }),
            " Telegram"
          ]
        }
      )
    ] })
  ] });
}
export {
  ShareButton as S
};
