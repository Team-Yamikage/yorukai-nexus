import type { ServerRow } from "./content";

/**
 * Hosts that are dead, ad-redirect shorteners, or otherwise never produce a
 * playable embed. These are hidden from the picker so users only ever see
 * sources that have a chance of working.
 *
 * `short.icu` is included because the domain no longer resolves
 * ("IP address could not be found").
 */
export const DEAD_HOSTS = [
  "short.icu",
  "shorturl",
  "adf.ly",
  "adfly",
  "ouo.io",
  "linkvertise",
  "exe.io",
  "exe.app",
  "gplinks",
  "za.gl",
  "clk.sh",
  "shrtfly",
  "bc.vc",
  "cuty.io",
  "sub2unlock",
  "safelinkconverter",
  "fc-lc",
] as const;

const DEAD_HOST_RE = new RegExp(
  `://(www\\.)?(${DEAD_HOSTS.map((h) => h.replace(/\./g, "\\.")).join("|")})`,
  "i",
);

/** True when the URL points at a known-dead / ad-redirect host. */
export function isDeadHost(url: string | null | undefined): boolean {
  if (!url) return true;
  return DEAD_HOST_RE.test(url);
}

/** A direct media file we can play in our own <video> element. */
export function isDirectMedia(url: string | null | undefined): boolean {
  return !!url && /\.(m3u8|mp4|webm)(\?|$)/i.test(url);
}

/** Whether a server should be rendered inside an iframe (embed) vs <video>. */
export function isEmbedUrl(url: string | null | undefined): boolean {
  return !!url && !isDirectMedia(url);
}

/**
 * Filter a raw server list down to ones that could plausibly play:
 * must have an http(s) embed_url, must not be a dead host, must not be an image.
 * Optionally drops servers known-unreachable from a health probe.
 */
export function playableServers(
  servers: ServerRow[],
  health?: Record<string, boolean>,
): ServerRow[] {
  return servers.filter((s) => {
    const url = s.embed_url;
    if (!url || !/^https?:\/\//i.test(url)) return false;
    if (/\.(webp|jpg|jpeg|png|gif|svg)(\?|$)/i.test(url)) return false;
    if (isDeadHost(url)) return false;
    if (health && health[s.id] === false) return false;
    return true;
  });
}

const LANG_ORDER = [
  "English",
  "Hindi",
  "Japanese",
  "Multi",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Kannada",
  "Bengali",
];

/** Distinct languages present in a server list, sorted by preferred order. */
export function languagesOf(servers: ServerRow[]): string[] {
  const set = Array.from(
    new Set(servers.map((s) => s.language).filter(Boolean)),
  ) as string[];
  return set.sort(
    (a, b) =>
      (LANG_ORDER.indexOf(a) + 1 || 99) - (LANG_ORDER.indexOf(b) + 1 || 99),
  );
}

export type CycleState = { lang: string | null; index: number };

/**
 * Compute the next server to try. Advances within the current language first,
 * then rolls over to the next language. Returns the same state when there is
 * only a single server so callers can detect "no more to try".
 */
export function nextServer(
  servers: ServerRow[],
  state: CycleState,
): CycleState {
  const langs = languagesOf(servers);
  if (langs.length === 0) return state;
  const lang = state.lang ?? langs[0];
  const inLang = servers.filter((s) => s.language === lang);
  if (state.index < inLang.length - 1) {
    return { lang, index: state.index + 1 };
  }
  if (langs.length > 1) {
    const next = (langs.indexOf(lang) + 1) % langs.length;
    return { lang: langs[next], index: 0 };
  }
  return { lang, index: inLang.length ? (state.index + 1) % inLang.length : 0 };
}

export type PlaybackErrorReason =
  | "sandbox"
  | "cors"
  | "expired"
  | "dns"
  | "network"
  | "no-source"
  | "unknown";

/** Map a raw error / signal into a concise, user-facing reason. */
export function classifyPlaybackError(input: {
  message?: string | null;
  url?: string | null;
  status?: number | null;
}): { reason: PlaybackErrorReason; label: string } {
  const msg = (input.message ?? "").toLowerCase();
  const url = input.url ?? "";

  if (!url) return { reason: "no-source", label: "No playable source." };
  if (isDeadHost(url) || msg.includes("could not be found") || msg.includes("dns") || msg.includes("enotfound")) {
    return { reason: "dns", label: "Source host is offline (domain not found)." };
  }
  if (msg.includes("sandbox") || msg.includes("adblock") || msg.includes("ads are not being displayed")) {
    return { reason: "sandbox", label: "Player blocked by sandbox/ad-block. Disable ad-block or try another server." };
  }
  if (msg.includes("cors") || msg.includes("cross-origin") || msg.includes("blocked by")) {
    return { reason: "cors", label: "Source blocked cross-origin playback (CORS)." };
  }
  if (input.status === 403 || input.status === 410 || msg.includes("expired") || msg.includes("token")) {
    return { reason: "expired", label: "This source link has expired." };
  }
  if (input.status === 404 || msg.includes("not found")) {
    return { reason: "expired", label: "Source not found (link removed)." };
  }
  if (msg.includes("network") || msg.includes("failed to fetch") || msg.includes("timeout")) {
    return { reason: "network", label: "Network error reaching the source." };
  }
  return { reason: "unknown", label: "Playback failed. Try another server." };
}
