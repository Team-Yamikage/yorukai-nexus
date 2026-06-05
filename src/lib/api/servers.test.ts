import { describe, it, expect } from "vitest";
import {
  isDeadHost,
  isDirectMedia,
  isEmbedUrl,
  playableServers,
  languagesOf,
  nextServer,
  classifyPlaybackError,
} from "./servers";
import type { ServerRow } from "./content";

function srv(p: Partial<ServerRow>): ServerRow {
  return {
    id: p.id ?? crypto.randomUUID(),
    episode_id: "ep1",
    server_name: p.server_name ?? "S1",
    quality: p.quality ?? "1080p",
    language: p.language ?? "English",
    embed_url: p.embed_url ?? "https://good.example/embed/1",
  };
}

describe("isDeadHost", () => {
  it("flags short.icu and ad redirectors", () => {
    expect(isDeadHost("https://short.icu/abc")).toBe(true);
    expect(isDeadHost("https://www.linkvertise.com/x")).toBe(true);
    expect(isDeadHost("https://ouo.io/x")).toBe(true);
  });
  it("treats empty/null as dead", () => {
    expect(isDeadHost(null)).toBe(true);
    expect(isDeadHost("")).toBe(true);
  });
  it("allows normal hosts", () => {
    expect(isDeadHost("https://vidplay.example/e/123")).toBe(false);
  });
});

describe("media type detection", () => {
  it("detects direct media", () => {
    expect(isDirectMedia("https://x/y.m3u8")).toBe(true);
    expect(isDirectMedia("https://x/y.mp4?t=1")).toBe(true);
    expect(isDirectMedia("https://x/embed/1")).toBe(false);
  });
  it("treats non-media as embed", () => {
    expect(isEmbedUrl("https://x/embed/1")).toBe(true);
    expect(isEmbedUrl("https://x/y.m3u8")).toBe(false);
  });
});

describe("playableServers", () => {
  it("removes dead hosts, images and non-http", () => {
    const list = [
      srv({ id: "a", embed_url: "https://short.icu/x" }),
      srv({ id: "b", embed_url: "https://good.example/poster.jpg" }),
      srv({ id: "c", embed_url: "ftp://nope/x" }),
      srv({ id: "d", embed_url: "https://good.example/embed/1" }),
    ];
    expect(playableServers(list).map((s) => s.id)).toEqual(["d"]);
  });
  it("drops servers marked unreachable by health probe", () => {
    const list = [
      srv({ id: "d", embed_url: "https://good.example/embed/1" }),
      srv({ id: "e", embed_url: "https://good.example/embed/2" }),
    ];
    expect(playableServers(list, { d: false, e: true }).map((s) => s.id)).toEqual(["e"]);
  });
});

describe("languagesOf", () => {
  it("returns distinct langs in preferred order", () => {
    const list = [
      srv({ language: "Japanese" }),
      srv({ language: "Hindi" }),
      srv({ language: "English" }),
      srv({ language: "Hindi" }),
    ];
    expect(languagesOf(list)).toEqual(["English", "Hindi", "Japanese"]);
  });
});

describe("nextServer cycling", () => {
  const list = [
    srv({ id: "en1", language: "English" }),
    srv({ id: "en2", language: "English" }),
    srv({ id: "hi1", language: "Hindi" }),
  ];
  it("advances within the same language first", () => {
    expect(nextServer(list, { lang: "English", index: 0 })).toEqual({ lang: "English", index: 1 });
  });
  it("rolls over to the next language", () => {
    expect(nextServer(list, { lang: "English", index: 1 })).toEqual({ lang: "Hindi", index: 0 });
  });
  it("wraps a single-server single-language list", () => {
    const one = [srv({ id: "only", language: "English" })];
    expect(nextServer(one, { lang: "English", index: 0 })).toEqual({ lang: "English", index: 0 });
  });
  it("handles empty list", () => {
    expect(nextServer([], { lang: null, index: 0 })).toEqual({ lang: null, index: 0 });
  });
});

describe("classifyPlaybackError", () => {
  it("detects no source", () => {
    expect(classifyPlaybackError({ url: "" }).reason).toBe("no-source");
  });
  it("detects dead dns", () => {
    expect(classifyPlaybackError({ url: "https://short.icu/x" }).reason).toBe("dns");
    expect(classifyPlaybackError({ url: "https://x/e", message: "could not be found" }).reason).toBe("dns");
  });
  it("detects sandbox/adblock", () => {
    expect(classifyPlaybackError({ url: "https://x/e", message: "ads are not being displayed (AdBlock/Sandbox)" }).reason).toBe("sandbox");
  });
  it("detects cors", () => {
    expect(classifyPlaybackError({ url: "https://x/e", message: "blocked by CORS policy" }).reason).toBe("cors");
  });
  it("detects expired by status", () => {
    expect(classifyPlaybackError({ url: "https://x/e", status: 403 }).reason).toBe("expired");
    expect(classifyPlaybackError({ url: "https://x/e", status: 410 }).reason).toBe("expired");
  });
  it("falls back to unknown", () => {
    expect(classifyPlaybackError({ url: "https://x/e", message: "weird" }).reason).toBe("unknown");
  });
});
