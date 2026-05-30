import { useState } from "react";
import { Share2, Copy, Check, MessageCircle, Send } from "lucide-react";

export function ShareButton({
  title,
  className = "",
}: {
  title?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = title ? `Watch ${title} on YORUKAI.TV` : "Check this out on YORUKAI.TV";

  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: title ?? "YORUKAI.TV", text, url });
        return;
      } catch {
        /* user cancelled — fall through to menu */
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
      /* ignore */
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={nativeShare}
        className="senpai-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-senpai-fuchsia outline-none"
      >
        <Share2 className="h-4 w-4" /> Share
      </button>
      {open && (
        <div className="senpai-glass-strong absolute right-0 z-30 mt-2 w-52 rounded-2xl p-2 ring-1 ring-senpai-violet/30">
          <button onClick={copy} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-white/10">
            {copied ? <Check className="h-4 w-4 text-senpai-teal" /> : <Copy className="h-4 w-4" />}
            {copied ? "Link copied" : "Copy link"}
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4 text-[#25D366]" /> WhatsApp
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-white/10"
          >
            <Send className="h-4 w-4 text-[#229ED9]" /> Telegram
          </a>
        </div>
      )}
    </div>
  );
}
