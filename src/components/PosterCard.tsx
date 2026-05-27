import { Link } from "@tanstack/react-router";
import { Play, Star } from "lucide-react";

export type Poster = {
  id: string;
  title: string;
  image: string;
  badge?: string;
  rating?: number;
  year?: number | string;
};

export function PosterCard({ poster, kind = "anime" }: { poster: Poster; kind?: "anime" | "manga" }) {
  const href = kind === "manga" ? "/manga/$id" : "/detail/$id";
  return (
    <Link
      to={href}
      params={{ id: poster.id }}
      className="senpai-poster group block aspect-[2/3] w-full"
    >
      <img
        src={poster.image}
        alt={poster.title}
        loading="lazy"
        className="senpai-duotone absolute inset-0 h-full w-full object-cover"
      />
      {poster.badge && (
        <span className="absolute left-3 top-3 z-10 senpai-sticker !bg-senpai-violet/80 !border-transparent !text-white">
          {poster.badge}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4">
        <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-widest text-senpai-text-dim">
          {poster.rating != null && (
            <span className="inline-flex items-center gap-1 text-senpai-amber">
              <Star className="h-3 w-3 fill-current" /> {poster.rating.toFixed(1)}
            </span>
          )}
          {poster.year && <span>{poster.year}</span>}
        </div>
        <h3 className="font-[var(--font-display)] text-lg leading-tight tracking-wide text-white line-clamp-2">
          {poster.title}
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
