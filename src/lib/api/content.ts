import { supabase } from "@/integrations/supabase/client";
import { queryOptions } from "@tanstack/react-query";

export type ContentRow = {
  id: string;
  title: string;
  type: "series" | "movie" | string;
  status: string | null;
  featured: boolean | null;
  rating: number | null;
  release_year: number | null;
  poster_url: string | null;
  banner_url: string | null;
  thumbnail_url: string | null;
  description: string | null;
  duration_minutes: number | null;
  language: string | null;
};

export type EpisodeRow = {
  id: string;
  content_id: string;
  season_number: number;
  episode_number: number;
  title: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  description: string | null;
};

export const FALLBACK_POSTER = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/900`;
export const FALLBACK_BANNER = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/1800/1000`;

export const homeFeedQuery = queryOptions({
  queryKey: ["home-feed"],
  queryFn: async () => {
    const [featured, trending, recent, genres] = await Promise.all([
      supabase
        .from("content")
        .select("*")
        .eq("featured", true)
        .not("banner_url", "is", null)
        .order("rating", { ascending: false, nullsFirst: false })
        .limit(6),
      supabase
        .from("content")
        .select("*")
        .not("poster_url", "is", null)
        .order("rating", { ascending: false, nullsFirst: false })
        .limit(18),
      supabase
        .from("content")
        .select("*")
        .not("poster_url", "is", null)
        .order("release_year", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(18),
      supabase.from("genres").select("id,name,slug").order("name").limit(24),
    ]);
    return {
      featured: (featured.data ?? []) as ContentRow[],
      trending: (trending.data ?? []) as ContentRow[],
      recent: (recent.data ?? []) as ContentRow[],
      genres: genres.data ?? [],
    };
  },
  staleTime: 60_000,
});

export function browseQuery(opts: {
  q?: string;
  genre?: string;
  year?: number;
  type?: string;
  limit?: number;
}) {
  return queryOptions({
    queryKey: ["browse", opts],
    queryFn: async () => {
      let query = supabase
        .from("content")
        .select("*, content_genres!inner(genre_id, genres(slug,name))", {
          count: "exact",
        })
        .not("poster_url", "is", null)
        .order("rating", { ascending: false, nullsFirst: false })
        .limit(opts.limit ?? 60);

      if (opts.q) query = query.ilike("title", `%${opts.q}%`);
      if (opts.type) query = query.eq("type", opts.type as never);
      if (opts.year) query = query.eq("release_year", opts.year);
      if (opts.genre) {
        // Filter via inner join
        query = query.eq("content_genres.genres.slug", opts.genre);
      }
      const { data, error } = await query;
      if (error) throw error;
      // Dedupe (inner join may yield repeats)
      const seen = new Set<string>();
      const rows: ContentRow[] = [];
      for (const row of data ?? []) {
        if (seen.has(row.id)) continue;
        seen.add(row.id);
        rows.push(row as ContentRow);
      }
      return rows;
    },
    staleTime: 30_000,
  });
}

export function detailQuery(id: string) {
  return queryOptions({
    queryKey: ["detail", id],
    queryFn: async () => {
      const [content, episodes, genres] = await Promise.all([
        supabase.from("content").select("*").eq("id", id).maybeSingle(),
        supabase
          .from("episodes")
          .select("*")
          .eq("content_id", id)
          .order("season_number")
          .order("episode_number"),
        supabase
          .from("content_genres")
          .select("genres(id,name,slug)")
          .eq("content_id", id),
      ]);
      return {
        content: content.data as ContentRow | null,
        episodes: (episodes.data ?? []) as EpisodeRow[],
        genres: (genres.data ?? [])
          .map((g) => (g as any).genres)
          .filter(Boolean) as { id: string; name: string; slug: string }[],
      };
    },
    staleTime: 30_000,
  });
}

export function episodeQuery(episodeId: string) {
  return queryOptions({
    queryKey: ["episode", episodeId],
    queryFn: async () => {
      const { data: ep } = await supabase
        .from("episodes")
        .select("*")
        .eq("id", episodeId)
        .maybeSingle();
      if (!ep) return { episode: null, content: null, siblings: [] as EpisodeRow[] };
      const [content, siblings] = await Promise.all([
        supabase.from("content").select("*").eq("id", ep.content_id).maybeSingle(),
        supabase
          .from("episodes")
          .select("*")
          .eq("content_id", ep.content_id)
          .order("season_number")
          .order("episode_number"),
      ]);
      return {
        episode: ep as EpisodeRow,
        content: content.data as ContentRow | null,
        siblings: (siblings.data ?? []) as EpisodeRow[],
      };
    },
    staleTime: 15_000,
  });
}

/**
 * Servers are fetched through the guarded server function (ban + rate-limit
 * checks) rather than the public RPC, using the per-device id. Kept separate
 * from episodeQuery so it runs client-side where the device id is available.
 */
export function episodeServersQuery(episodeId: string, deviceId: string) {
  return queryOptions({
    queryKey: ["episode-servers", episodeId],
    queryFn: async () => {
      const { getEpisodeServersGuarded } = await import("./stream.functions");
      const res = await getEpisodeServersGuarded({
        data: { episodeId, deviceId },
      });
      return res;
    },
    staleTime: 15_000,
    retry: 1,
  });
}

export type ServerRow = {
  id: string;
  episode_id: string;
  server_name: string;
  quality: string;
  language: string;
  embed_url: string | null;
};

