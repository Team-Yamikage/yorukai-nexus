import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ProbeInput = z.object({
  servers: z
    .array(
      z.object({
        id: z.string().min(1).max(64),
        url: z.string().url().max(2048),
      }),
    )
    .min(1)
    .max(20),
});

async function probeOne(url: string, timeoutMs = 6000): Promise<boolean> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    // Prefer a lightweight HEAD; fall back to a ranged GET for hosts that
    // reject HEAD. We only care that the host resolves and answers.
    let res: Response;
    try {
      res = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
        signal: ctrl.signal,
      });
      if (res.status === 405 || res.status === 501) {
        res = await fetch(url, {
          method: "GET",
          headers: { Range: "bytes=0-0" },
          redirect: "follow",
          signal: ctrl.signal,
        });
      }
    } catch {
      res = await fetch(url, {
        method: "GET",
        headers: { Range: "bytes=0-0" },
        redirect: "follow",
        signal: ctrl.signal,
      });
    }
    // Reachable if the server answered with anything that isn't a hard
    // gone/not-found. Many embeds 403 hotlink checks but still play in-browser,
    // so we treat 403 as "reachable".
    return res.status !== 404 && res.status !== 410 && res.status < 500;
  } catch {
    // DNS failure, connection refused, timeout, etc.
    return false;
  } finally {
    clearTimeout(t);
  }
}

/**
 * Server-side reachability probe. The browser cannot HEAD cross-origin embed
 * hosts (CORS), so this runs on the server and returns a map of
 * serverId -> reachable. Used to hide/deprioritise dead sources.
 */
export const probeServers = createServerFn({ method: "POST" })
  .inputValidator((d) => ProbeInput.parse(d))
  .handler(async ({ data }) => {
    const entries = await Promise.all(
      data.servers.map(async (s) => [s.id, await probeOne(s.url)] as const),
    );
    return { health: Object.fromEntries(entries) as Record<string, boolean> };
  });
