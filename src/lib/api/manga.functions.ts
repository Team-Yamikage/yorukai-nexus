import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

const API = "https://api.mangadex.org";
const COVERS = "https://uploads.mangadex.org/covers";

export type MangaItem = {
  id: string;
  title: string;
  description: string;
  cover: string | null;
  status: string | null;
  year: number | null;
  contentRating: string | null;
  tags: string[];
};

export type MangaChapter = {
  id: string;
  chapter: string | null;
  title: string | null;
  volume: string | null;
  pages: number;
  language: string;
  publishedAt: string | null;
};

function pickTitle(attr: any): string {
  const t = attr?.title ?? {};
  return t.en || t["ja-ro"] || t.ja || Object.values(t)[0] || "Untitled";
}

function pickDescription(attr: any): string {
  const d = attr?.description ?? {};
  return d.en || Object.values(d)[0] || "";
}

function mapManga(m: any): MangaItem {
  const rels: any[] = m.relationships ?? [];
  const coverRel = rels.find((r) => r.type === "cover_art");
  const fileName = coverRel?.attributes?.fileName;
  return {
    id: m.id,
    title: pickTitle(m.attributes),
    description: pickDescription(m.attributes),
    cover: fileName ? `${COVERS}/${m.id}/${fileName}.512.jpg` : null,
    status: m.attributes?.status ?? null,
    year: m.attributes?.year ?? null,
    contentRating: m.attributes?.contentRating ?? null,
    tags: (m.attributes?.tags ?? [])
      .map((t: any) => t?.attributes?.name?.en)
      .filter(Boolean),
  };
}

async function getJson(path: string): Promise<any> {
  // MangaDex returns 400 when the User-Agent header is empty (as it is by
  // default in the Worker runtime), so we always send an explicit one.
  const res = await fetch(`${API}${path}`, {
    headers: {
      accept: "application/json",
      "User-Agent": "YorukaiTV/1.0 (+https://neon-yokai.lovable.app)",
    },
  });
  if (!res.ok) throw new Error(`MangaDex error ${res.status}`);
  return res.json();
}

/** Browse / search manga. Sorted by the requested ordering. */
export const mangaListFn = createServerFn({ method: "GET" })
  .inputValidator(
    (input: {
      kind?: "popular" | "latest" | "trending";
      q?: string;
      limit?: number;
      offset?: number;
    }) => input ?? {},
  )
  .handler(async ({ data }) => {
    const params = new URLSearchParams();
    params.set("limit", String(Math.min(data.limit ?? 24, 48)));
    params.set("offset", String(data.offset ?? 0));
    params.append("includes[]", "cover_art");
    params.append("contentRating[]", "safe");
    params.append("contentRating[]", "suggestive");
    params.append("hasAvailableChapters", "true");
    if (data.q) params.set("title", data.q);
    if (data.kind === "latest") params.set("order[latestUploadedChapter]", "desc");
    else if (data.kind === "trending") params.set("order[followedCount]", "desc");
    else params.set("order[rating]", "desc");

    const json = await getJson(`/manga?${params.toString()}`);
    return {
      items: (json.data ?? []).map(mapManga) as MangaItem[],
      total: json.total ?? 0,
    };
  });

/** Single manga detail. */
export const mangaDetailFn = createServerFn({ method: "GET" })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const json = await getJson(
      `/manga/${data.id}?includes[]=cover_art&includes[]=author&includes[]=artist`,
    );
    return mapManga(json.data);
  });

/** Chapter list in ASCENDING order (English). */
export const mangaChaptersFn = createServerFn({ method: "GET" })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const all: MangaChapter[] = [];
    let offset = 0;
    for (let i = 0; i < 10; i++) {
      const params = new URLSearchParams();
      params.set("limit", "100");
      params.set("offset", String(offset));
      params.append("translatedLanguage[]", "en");
      params.append("contentRating[]", "safe");
      params.append("contentRating[]", "suggestive");
      params.set("order[chapter]", "asc");
      params.append("includes[]", "scanlation_group");
      const json = await getJson(`/manga/${data.id}/feed?${params.toString()}`);
      const batch = (json.data ?? []).map((c: any) => ({
        id: c.id,
        chapter: c.attributes?.chapter ?? null,
        title: c.attributes?.title ?? null,
        volume: c.attributes?.volume ?? null,
        pages: c.attributes?.pages ?? 0,
        language: c.attributes?.translatedLanguage ?? "en",
        publishedAt: c.attributes?.publishAt ?? null,
      })) as MangaChapter[];
      all.push(...batch);
      offset += 100;
      if (offset >= (json.total ?? 0)) break;
    }
    // Dedupe by chapter number (keep first/earliest group), keep ascending.
    const seen = new Set<string>();
    const deduped = all.filter((c) => {
      const key = c.chapter ?? c.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return deduped;
  });

export type ChapterPage = {
  /** Full-quality image URL. */
  url: string;
  /** Compressed data-saver fallback used if the full image fails to load. */
  fallback: string;
};

/** Page image URLs for a chapter (resolved via MangaDex@Home). */
export const chapterPagesFn = createServerFn({ method: "GET" })
  .inputValidator((input: { chapterId: string }) => input)
  .handler(async ({ data }): Promise<ChapterPage[]> => {
    const json = await getJson(`/at-home/server/${data.chapterId}`);
    const base = json.baseUrl;
    const hash = json.chapter?.hash;
    const files: string[] = json.chapter?.data ?? [];
    const saver: string[] = json.chapter?.dataSaver ?? [];
    return files.map((f, i) => ({
      url: `${base}/data/${hash}/${f}`,
      // Data-saver images are smaller/JPEG and resolve from the same node,
      // so they are a reliable fallback when a full-res page 404s/times out.
      fallback: saver[i]
        ? `${base}/data-saver/${hash}/${saver[i]}`
        : `${base}/data/${hash}/${f}`,
    }));
  });

export const mangaListQuery = (
  kind: "popular" | "latest" | "trending",
  q?: string,
) =>
  queryOptions({
    queryKey: ["manga-list", kind, q ?? ""],
    queryFn: () => mangaListFn({ data: { kind, q } }),
    staleTime: 1000 * 60 * 10,
  });

export const mangaDetailQuery = (id: string) =>
  queryOptions({
    queryKey: ["manga-detail", id],
    queryFn: () => mangaDetailFn({ data: { id } }),
    staleTime: 1000 * 60 * 10,
  });

export const mangaChaptersQuery = (id: string) =>
  queryOptions({
    queryKey: ["manga-chapters", id],
    queryFn: () => mangaChaptersFn({ data: { id } }),
    staleTime: 1000 * 60 * 10,
  });

export const chapterPagesQuery = (chapterId: string) =>
  queryOptions({
    queryKey: ["chapter-pages", chapterId],
    queryFn: () => chapterPagesFn({ data: { chapterId } }),
    staleTime: 1000 * 60 * 30,
  });
