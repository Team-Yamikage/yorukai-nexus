import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Rows, Columns } from "lucide-react";
import { chapterPagesQuery } from "@/lib/api/manga.functions";

export const Route = createFileRoute("/reader/$id")({
  head: () => ({ meta: [{ title: "Reader — YORUKAI.TV" }] }),
  component: Reader,
});

function Reader() {
  const { id } = Route.useParams();
  const { data: pages, isLoading, isError } = useQuery(chapterPagesQuery(id));
  const [mode, setMode] = useState<"vertical" | "horizontal">("vertical");
  const [idx, setIdx] = useState(0);

  return (
    <div className="min-h-dvh bg-black text-white">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-black/70 px-4 py-3 backdrop-blur">
        <Link to="/manga" className="senpai-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/10">
          <ArrowLeft className="h-4 w-4" /> Library
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => setMode("vertical")} className={`grid h-9 w-9 place-items-center rounded-full ${mode === "vertical" ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia" : "senpai-glass"}`}><Rows className="h-4 w-4" /></button>
          <button onClick={() => setMode("horizontal")} className={`grid h-9 w-9 place-items-center rounded-full ${mode === "horizontal" ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia" : "senpai-glass"}`}><Columns className="h-4 w-4" /></button>
        </div>
      </header>

      {isLoading && <div className="grid place-items-center py-32 text-senpai-text-muted">Loading pages…</div>}
      {isError && <div className="grid place-items-center py-32 text-senpai-text-muted">Couldn't load this chapter.</div>}

      {pages && mode === "vertical" && (
        <div className="mx-auto flex max-w-3xl flex-col">
          {pages.map((p, i) => (
            <img key={i} src={p} alt={`Page ${i + 1}`} loading="lazy" className="w-full" />
          ))}
        </div>
      )}

      {pages && pages.length > 0 && mode === "horizontal" && (
        <div className="relative mx-auto grid min-h-[calc(100dvh-57px)] max-w-3xl place-items-center">
          <img src={pages[idx]} alt={`Page ${idx + 1}`} className="max-h-[calc(100dvh-120px)] w-auto" />
          <div className="absolute inset-y-0 left-0 w-1/3 cursor-pointer" onClick={() => setIdx((i) => Math.max(0, i - 1))} />
          <div className="absolute inset-y-0 right-0 w-1/3 cursor-pointer" onClick={() => setIdx((i) => Math.min(pages.length - 1, i + 1))} />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-1.5 text-xs">{idx + 1} / {pages.length}</div>
        </div>
      )}
    </div>
  );
}
