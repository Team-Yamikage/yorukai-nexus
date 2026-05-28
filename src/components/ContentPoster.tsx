import { Link } from "@tanstack/react-router";
import { Play, Star } from "lucide-react";
import type { ContentRow } from "@/lib/api/content";
import { FALLBACK_POSTER } from "@/lib/api/content";

export function ContentPoster({ item, kind = "anime" }: { item: ContentRow; kind?: "anime" | "manga" }) {
  const href = kind === "manga" ? "/manga/$id" : "/detail/$id";
  return (
    <Link
      to={href}
      params={{ id: item.id }}
      className="senpai-poster group block aspect-[2/3] w-full"
    >
      <img
        src={item.poster_url || FALLBACK_POSTER(item.id)}
        alt={item.title}
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = FALLBACK_POSTER(item.id);
        }}
        className="senpai-duotone absolute inset-0 h-full w-full object-cover"
      />
      {item.featured && (
        <span className="absolute left-3 top-3 z-10 senpai-sticker !bg-senpai-fuchsia/85 !border-transparent !text-white">
          Featured
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4">
        <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-widest text-senpai-text-dim">
          {item.rating != null && item.rating > 0 && (
            <span className="inline-flex items-center gap-1 text-senpai-amber">
              <Star className="h-3 w-3 fill-current" /> {Number(item.rating).toFixed(1)}
            </span>
          )}
          {item.release_year && <span>{item.release_year}</span>}
          {item.type && <span className="text-senpai-teal">{item.type}</span>}
        </div>
        <h3 className="font-[var(--font-display)] text-base sm:text-lg leading-tight tracking-wide text-white line-clamp-2">
          {item.title}
        </h3>
      </div>
      <div className="absolute inset-0 z-10 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-senpai-violet to-senpai-fuchsia text-white shadow-[0_0_30px_var(--senpai-fuchsia)]">
          <Play className="h-6 w-6 fill-current" />
        </div>
      </div>
    </Link>
  );
}
