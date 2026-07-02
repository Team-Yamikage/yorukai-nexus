/**
 * Persistent YORUKAI.TV branding watermark overlaid on media surfaces
 * (video player, live TV, manga reader). Non-interactive so it never blocks
 * playback controls.
 */
export function Watermark({
  position = "top-right",
  className = "",
}: {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
}) {
  const pos =
    position === "top-right"
      ? "top-3 right-3"
      : position === "top-left"
      ? "top-3 left-3"
      : position === "bottom-left"
      ? "bottom-3 left-3"
      : "bottom-3 right-3";

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute z-40 select-none ${pos} ${className}`}
    >
      <span className="font-[var(--font-display)] text-xs sm:text-sm font-bold tracking-widest text-white/70 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
        YORUKAI<span className="text-senpai-fuchsia">.</span>TV
      </span>
    </div>
  );
}
