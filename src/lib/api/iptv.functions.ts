import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

export type LiveChannel = {
  id: string;
  name: string;
  logo: string | null;
  categories: string[];
  url: string;
  quality: string | null;
};

const API = "https://iptv-org.github.io/api";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API}/${path}`, {
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`IPTV fetch failed: ${path}`);
  return (await res.json()) as T;
}

type RawChannel = {
  id: string;
  name: string;
  country: string;
  categories: string[];
  is_nsfw: boolean;
  closed: string | null;
};
type RawStream = {
  channel: string | null;
  url: string;
  quality: string | null;
  user_agent: string | null;
  referrer: string | null;
};
type RawLogo = { channel: string; url: string };

/**
 * Securely fetch the list of Indian IPTV channels server-side.
 * Source: iptv-org public API. We only return channels that have a
 * browser-playable stream so the UI never shows dead entries.
 */
export const liveChannelsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const [channels, streams, logos] = await Promise.all([
      getJson<RawChannel[]>("channels.json"),
      getJson<RawStream[]>("streams.json"),
      getJson<RawLogo[]>("logos.json"),
    ]);

    // Map channel id -> first browser-playable stream.
    // Streams that require a custom user_agent or referrer can't be played
    // from a browser <video> element, so we skip them to avoid dead tiles.
    const streamByChannel = new Map<string, RawStream>();
    for (const s of streams) {
      if (!s.channel || !s.url) continue;
      if (s.user_agent || s.referrer) continue;
      if (!/^https/i.test(s.url)) continue;
      if (!streamByChannel.has(s.channel)) streamByChannel.set(s.channel, s);
    }
    const logoByChannel = new Map<string, string>();
    for (const l of logos) {
      if (l.channel && l.url && !logoByChannel.has(l.channel))
        logoByChannel.set(l.channel, l.url);
    }

    const result: LiveChannel[] = [];
    for (const c of channels) {
      if (c.country !== "IN" || c.is_nsfw || c.closed) continue;
      const stream = streamByChannel.get(c.id);
      if (!stream) continue;
      result.push({
        id: c.id,
        name: c.name,
        logo: logoByChannel.get(c.id) ?? null,
        categories: c.categories?.length ? c.categories : ["general"],
        url: stream.url,
        quality: stream.quality,
      });
    }
    result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  },
);

export const liveChannelsQuery = queryOptions({
  queryKey: ["live-channels-in"],
  queryFn: () => liveChannelsFn(),
  staleTime: 1000 * 60 * 30,
});
