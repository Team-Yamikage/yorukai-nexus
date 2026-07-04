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
 * Health probe results only change priority. They must not remove a source:
 * some embed hosts block server-side probes but still work in the browser, and
 * the player should try every plausible source before giving up.
 */
export function playableServers(
  servers: ServerRow[],
  health?: Record<string, boolean>,
): ServerRow[] {
  return servers
    .filter((s) => {
      const url = s.embed_url;
      if (!url || !/^https?:\/\//i.test(url)) return false;
      if (/\.(webp|jpg|jpeg|png|gif|svg)(\?|$)/i.test(url)) return false;
      if (isDeadHost(url)) return false;
      return true;
    })
    .sort((a, b) => healthRank(health?.[a.id]) - healthRank(health?.[b.id]));
}

function healthRank(value: boolean | undefined): number {
  if (value === true) return 0;
  if (value === undefined) return 1;
  return 2;
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
    new Set(servers.map((s) => normalizeLanguage(s.language)).filter(Boolean)),
  ) as string[];
  return set.sort(
    (a, b) =>
      (LANG_ORDER.indexOf(a) + 1 || 99) - (LANG_ORDER.indexOf(b) + 1 || 99),
  );
}

export function normalizeLanguage(value: string | null | undefined): string | null {
  const raw = value?.trim();
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (lower.includes("japanese") || lower === "jp" || lower === "ja") return "Japanese";
  if (lower.includes("english") || lower === "en") return "English";
  if (lower.includes("hindi") || lower === "hi") return "Hindi";
  if (lower.includes("tamil") || lower === "ta") return "Tamil";
  if (lower.includes("telugu") || lower === "te") return "Telugu";
  if (lower.includes("malayalam") || lower === "ml") return "Malayalam";
  if (lower.includes("kannada") || lower === "kn") return "Kannada";
  if (lower.includes("bengali") || lower === "bn") return "Bengali";
  if (lower.includes("multi") || lower.includes("dual")) return "Multi";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function prioritizeServersForLanguage(
  servers: ServerRow[],
  preferredLanguage?: string | null,
): ServerRow[] {
  const preferred = normalizeLanguage(preferredLanguage);
  if (!preferred) return servers;
  return [...servers].sort((a, b) => {
    const ar = languageMatchRank(a.language, preferred);
    const br = languageMatchRank(b.language, preferred);
    if (ar !== br) return ar - br;
    return 0;
  });
}

function languageMatchRank(language: string | null | undefined, preferred: string): number {
  const normalized = normalizeLanguage(language);
  if (normalized === preferred) return 0;
  if (normalized === "Multi") return 1;
  if (normalized === "English") return preferred === "English" ? 0 : 2;
  return 3;
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
  const inLang = servers.filter((s) => normalizeLanguage(s.language) === lang);
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
  return { reason: "unknown", label: "Playback is retrying another source." };
}
