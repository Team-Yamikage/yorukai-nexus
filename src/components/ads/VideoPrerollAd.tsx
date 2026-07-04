import { useEffect, useRef, useState } from "react";
import { Loader2, VolumeX } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { AdBanner } from "@/components/AdBanner";

export const VAST_PREROLL_URL =
  "https://butterygrandmother.com/dRmJFMzVd.GrN/vAZrG/Uu/be/md9NuxZsUClfkbPqTicWxAOwDrgd2jMPzgMAtgNAz/EC4ZOZDpYRzJN/yrZdsua-W/1ApldFD/0_xC";

type Props = {
  onComplete: () => void;
};

export function VideoPrerollAd({ onComplete }: Props) {
  const { loading, isPremium, user, profile } = useAuth();
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [canSkip, setCanSkip] = useState(false);
  const [fallback, setFallback] = useState(false);
  const completed = useRef(false);

  const complete = () => {
    if (completed.current) return;
    completed.current = true;
    onComplete();
  };

  useEffect(() => {
    if (loading) return;
    if (isPremium) {
      complete();
      return;
    }
    if (user && !profile) return;

    const skipTimer = window.setTimeout(() => setCanSkip(true), 4500);
    const fallbackTimer = window.setTimeout(() => setFallback(true), 3500);
    const maxTimer = window.setTimeout(complete, 14000);
    let cancelled = false;

    fetch(VAST_PREROLL_URL, { credentials: "omit", mode: "cors" })
      .then((r) => r.text())
      .then((xml) => {
        if (cancelled) return;
        const doc = new DOMParser().parseFromString(xml, "application/xml");
        const media = Array.from(doc.querySelectorAll("MediaFile"))
          .map((node) => ({
            url: node.textContent?.trim() ?? "",
            type: node.getAttribute("type") ?? "",
          }))
          .find((m) => m.url && (/mp4|webm|mpegurl|application\/x-mpegURL/i.test(m.type) || /\.(mp4|webm|m3u8)(\?|$)/i.test(m.url)));
        if (media?.url) setMediaUrl(media.url);
        else setFallback(true);
      })
      .catch(() => setFallback(true));

    return () => {
      cancelled = true;
      window.clearTimeout(skipTimer);
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(maxTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isPremium, user, profile]);

  if (loading || isPremium || (user && !profile)) return null;

  return (
    <div className="absolute inset-0 z-40 grid place-items-center bg-black text-white">
      <div className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80 ring-1 ring-white/15">
        Sponsored preview
      </div>

      {mediaUrl ? (
        <video
          src={mediaUrl}
          className="h-full w-full object-contain"
          autoPlay
          muted
          playsInline
          onEnded={complete}
          onError={() => setFallback(true)}
        />
      ) : (
        <div className="text-center">
          {fallback ? (
            <>
              <div className="senpai-mega text-4xl senpai-grad-text-fire">AD BREAK</div>
              <p className="mt-2 text-sm text-senpai-text-dim">Your episode starts in a moment.</p>
              <div className="mt-6">
                <AdBanner adKey="921c3b2b7865019cf9b9ece13ab15bf4" width={468} height={60} />
              </div>
            </>
          ) : (
            <>
              <Loader2 className="mx-auto h-7 w-7 animate-spin text-senpai-fuchsia" />
              <p className="mt-3 text-sm text-senpai-text-dim">Loading sponsor video…</p>
            </>
          )}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black via-black/75 to-transparent p-4">
        <div className="inline-flex items-center gap-2 text-xs text-white/70">
          <VolumeX className="h-4 w-4" /> muted ad
        </div>
        <button
          type="button"
          disabled={!canSkip}
          onClick={complete}
          className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-black disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/50"
        >
          {canSkip ? "Skip ad" : "Skip soon"}
        </button>
      </div>
    </div>
  );
}