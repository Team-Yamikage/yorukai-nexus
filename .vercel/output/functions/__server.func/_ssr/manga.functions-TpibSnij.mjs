import { c as createServerRpc } from "./createServerRpc-BeKFeFff.mjs";
import { c as createServerFn } from "./server-DKFzjMa8.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
const API = "https://api.mangadex.org";
const COVERS = "https://uploads.mangadex.org/covers";
function pickTitle(attr) {
  const t = attr?.title ?? {};
  return t.en || t["ja-ro"] || t.ja || Object.values(t)[0] || "Untitled";
}
function pickDescription(attr) {
  const d = attr?.description ?? {};
  return d.en || Object.values(d)[0] || "";
}
function mapManga(m) {
  const rels = m.relationships ?? [];
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
    tags: (m.attributes?.tags ?? []).map((t) => t?.attributes?.name?.en).filter(Boolean)
  };
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function getJson(path, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12e3);
    try {
      const res = await fetch(`${API}${path}`, {
        signal: ctrl.signal,
        headers: {
          accept: "application/json",
          // MangaDex returns 400 when the User-Agent header is empty (as it is
          // by default in the Worker runtime), so we always send an explicit one.
          "User-Agent": "YorukaiTV/1.0 (+https://anisti.vercel.app)"
        }
      });
      clearTimeout(timer);
      if (res.status === 429 || res.status >= 500) {
        const retryAfter = Number(res.headers.get("retry-after"));
        const wait = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1e3 : 500 * 2 ** i;
        if (i < attempts - 1) {
          await sleep(Math.min(wait, 5e3));
          continue;
        }
        throw new Error(`MangaDex error ${res.status}`);
      }
      if (!res.ok) throw new Error(`MangaDex error ${res.status}`);
      return res.json();
    } catch (e) {
      clearTimeout(timer);
      lastErr = e;
      if (i < attempts - 1) await sleep(500 * 2 ** i);
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("MangaDex request failed");
}
const mangaListFn_createServerFn_handler = createServerRpc({
  id: "cf163a37ce6862c7e2d0d008db2160c7b923e641268540dd49c2c85d2ba88753",
  name: "mangaListFn",
  filename: "src/lib/api/manga.functions.ts"
}, (opts) => mangaListFn.__executeServer(opts));
const mangaListFn = createServerFn({
  method: "GET"
}).inputValidator((input) => input ?? {}).handler(mangaListFn_createServerFn_handler, async ({
  data
}) => {
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
    items: (json.data ?? []).map(mapManga),
    total: json.total ?? 0
  };
});
const mangaDetailFn_createServerFn_handler = createServerRpc({
  id: "34d622c6f35c0a43d629b4a0cbd4bab5a00fe61dff33a3527bf78bd6bf2367a1",
  name: "mangaDetailFn",
  filename: "src/lib/api/manga.functions.ts"
}, (opts) => mangaDetailFn.__executeServer(opts));
const mangaDetailFn = createServerFn({
  method: "GET"
}).inputValidator((input) => input).handler(mangaDetailFn_createServerFn_handler, async ({
  data
}) => {
  const json = await getJson(`/manga/${data.id}?includes[]=cover_art&includes[]=author&includes[]=artist`);
  return mapManga(json.data);
});
const mangaChaptersFn_createServerFn_handler = createServerRpc({
  id: "327e71ee482e4be5fd4a435a9ca43e5a742f48dff583421f3673ae71823e89fa",
  name: "mangaChaptersFn",
  filename: "src/lib/api/manga.functions.ts"
}, (opts) => mangaChaptersFn.__executeServer(opts));
const mangaChaptersFn = createServerFn({
  method: "GET"
}).inputValidator((input) => input).handler(mangaChaptersFn_createServerFn_handler, async ({
  data
}) => {
  const all = [];
  let offset = 0;
  let firstPageFailed = false;
  for (let i = 0; i < 10; i++) {
    const params = new URLSearchParams();
    params.set("limit", "100");
    params.set("offset", String(offset));
    params.append("translatedLanguage[]", "en");
    params.append("contentRating[]", "safe");
    params.append("contentRating[]", "suggestive");
    params.set("order[chapter]", "asc");
    params.append("includes[]", "scanlation_group");
    let json;
    try {
      json = await getJson(`/manga/${data.id}/feed?${params.toString()}`);
    } catch (e) {
      if (i === 0) firstPageFailed = true;
      break;
    }
    const batch = (json.data ?? []).map((c) => ({
      id: c.id,
      chapter: c.attributes?.chapter ?? null,
      title: c.attributes?.title ?? null,
      volume: c.attributes?.volume ?? null,
      pages: c.attributes?.pages ?? 0,
      language: c.attributes?.translatedLanguage ?? "en",
      publishedAt: c.attributes?.publishAt ?? null
    }));
    all.push(...batch);
    offset += 100;
    if (offset >= (json.total ?? 0)) break;
    await sleep(250);
  }
  if (firstPageFailed) throw new Error("Failed to load chapters");
  const seen = /* @__PURE__ */ new Set();
  const deduped = all.filter((c) => {
    const key = c.chapter ?? c.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return deduped;
});
const chapterPagesFn_createServerFn_handler = createServerRpc({
  id: "22326cdd89e837e282249dd5f4dc9752a5c1ae32a62a853d07097aea31ed8054",
  name: "chapterPagesFn",
  filename: "src/lib/api/manga.functions.ts"
}, (opts) => chapterPagesFn.__executeServer(opts));
const chapterPagesFn = createServerFn({
  method: "GET"
}).inputValidator((input) => input).handler(chapterPagesFn_createServerFn_handler, async ({
  data
}) => {
  const json = await getJson(`/at-home/server/${data.chapterId}`);
  const base = json.baseUrl;
  const hash = json.chapter?.hash;
  const files = json.chapter?.data ?? [];
  const saver = json.chapter?.dataSaver ?? [];
  return files.map((f, i) => ({
    url: `${base}/data/${hash}/${f}`,
    // Data-saver images are smaller/JPEG and resolve from the same node,
    // so they are a reliable fallback when a full-res page 404s/times out.
    fallback: saver[i] ? `${base}/data-saver/${hash}/${saver[i]}` : `${base}/data/${hash}/${f}`
  }));
});
export {
  chapterPagesFn_createServerFn_handler,
  mangaChaptersFn_createServerFn_handler,
  mangaDetailFn_createServerFn_handler,
  mangaListFn_createServerFn_handler
};
