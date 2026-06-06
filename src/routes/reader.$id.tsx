import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Rows, Columns, Play, Pause } from "lucide-react";
import { chapterPagesQuery } from "@/lib/api/manga.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

/** Swap a failed full-res page image to its data-saver fallback once. */
function onPageError(e: React.SyntheticEvent<HTMLImageElement>, fallback: string) {
  const img = e.currentTarget;
  if (img.dataset.fellback === "1" || img.src === fallback) return;
  img.dataset.fellback = "1";
  img.src = fallback;
}

export const Route = createFileRoute("/reader/$id")({
  head: () => ({ meta: [{ title: "Reader — YORUKAI.TV" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    manga: typeof search.manga === "string" ? search.manga : undefined,
  }),
  component: Reader,
});

function Reader() {
  const { id } = Route.useParams();
  const { manga } = Route.useSearch();
  const { user } = useAuth();
  const { data: pages, isLoading, isError } = useQuery(chapterPagesQuery(id));
  const [mode, setMode] = useState<"vertical" | "horizontal">("vertical");
  const [idx, setIdx] = useState(0);
  const [autoRead, setAutoRead] = useState(false);
  // Reading speed preference (seconds per page), saved per user/device.
  const [speed, setSpeed] = useState<number>(() => {
    if (typeof window === "undefined") return 6;
    return Number(localStorage.getItem("yk_pref_reader_speed")) || 6;
  });
  const savedOnce = useRef(false);

  useEffect(() => {
    localStorage.setItem("yk_pref_reader_speed", String(speed));
  }, [speed]);

  // Auto-read: advance pages at the chosen speed (MangaDex/Mangaverse style).
  useEffect(() => {
    if (!autoRead || !pages || pages.length === 0) return;
    const t = setInterval(() => {
      if (mode === "vertical") {
        window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" });
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
    }, Math.max(1, speed) * 1000);
    return () => clearInterval(t);
  }, [autoRead, speed, mode, pages]);

  // Resume from saved page if returning to the same chapter
  useEffect(() => {
    if (!user || !manga || savedOnce.current) return;
    supabase
      .from("manga_progress")
      .select("page, chapter_id")
      .eq("user_id", user.id)
      .eq("manga_id", manga)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.chapter_id === id && data?.page) setIdx(Math.max(0, data.page - 1));
      });
  }, [user, manga, id]);

  // Persist reading progress (debounced) — one row per manga (continue reading)
  useEffect(() => {
    if (!user || !manga || !pages || pages.length === 0) return;
    savedOnce.current = true;
    const t = setTimeout(() => {
      supabase.from("manga_progress").upsert(
        {
          user_id: user.id,
          manga_id: manga,
          chapter_id: id,
          page: idx + 1,
          total_pages: pages.length,
          updated_at: new Date().toISOString(),
        } as never,
        { onConflict: "user_id,manga_id" } as never,
      ).then(() => {});
    }, 800);
    return () => clearTimeout(t);
  }, [user, manga, id, idx, pages]);

  // Track scroll position → current page in vertical mode
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
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
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode, pages]);

  return (
    <div className="min-h-dvh bg-black text-white">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-black/70 px-4 py-3 backdrop-blur">
        {manga ? (
          <Link to="/manga/$id" params={{ id: manga }} className="senpai-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        ) : (
          <Link to="/manga" className="senpai-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        )}
        <div className="flex items-center gap-3">
          {pages && pages.length > 0 && (
            <span className="font-[var(--font-mono)] text-xs text-senpai-text-muted">{idx + 1} / {pages.length}</span>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRead((v) => !v)}
              aria-label={autoRead ? "Pause auto-read" : "Start auto-read"}
              className={`grid h-9 w-9 place-items-center rounded-full ${autoRead ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia" : "senpai-glass"}`}
            >
              {autoRead ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              aria-label="Auto-read speed"
              className="senpai-glass h-9 rounded-full bg-transparent px-2 text-xs outline-none [&>option]:bg-black"
            >
              <option value={3}>Fast 3s</option>
              <option value={6}>Normal 6s</option>
              <option value={10}>Slow 10s</option>
            </select>
            <button onClick={() => setMode("vertical")} className={`grid h-9 w-9 place-items-center rounded-full ${mode === "vertical" ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia" : "senpai-glass"}`}><Rows className="h-4 w-4" /></button>
            <button onClick={() => setMode("horizontal")} className={`grid h-9 w-9 place-items-center rounded-full ${mode === "horizontal" ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia" : "senpai-glass"}`}><Columns className="h-4 w-4" /></button>
          </div>
        </div>
      </header>

      {isLoading && <div className="grid place-items-center py-32 text-senpai-text-muted">Loading pages…</div>}
      {isError && <div className="grid place-items-center py-32 text-senpai-text-muted">Couldn't load this chapter.</div>}

      {pages && mode === "vertical" && (
        <div ref={containerRef} className="mx-auto flex max-w-3xl flex-col">
          {pages.map((p, i) => (
            <img key={i} src={p} alt={`Page ${i + 1}`} loading="lazy" referrerPolicy="no-referrer" className="w-full" />
          ))}
        </div>
      )}

      {pages && pages.length > 0 && mode === "horizontal" && (
        <div className="relative mx-auto grid min-h-[calc(100dvh-57px)] max-w-3xl place-items-center">
          <img src={pages[idx]} alt={`Page ${idx + 1}`} referrerPolicy="no-referrer" className="max-h-[calc(100dvh-120px)] w-auto" />
          <div className="absolute inset-y-0 left-0 w-1/3 cursor-pointer" onClick={() => setIdx((i) => Math.max(0, i - 1))} />
          <div className="absolute inset-y-0 right-0 w-1/3 cursor-pointer" onClick={() => setIdx((i) => Math.min(pages.length - 1, i + 1))} />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-1.5 text-xs">{idx + 1} / {pages.length}</div>
        </div>
      )}
    </div>
  );
}
