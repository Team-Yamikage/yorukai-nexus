import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { createHmac } from "crypto";
import type { ServerRow } from "./content";

/**
 * Server-side scraping defenses for the episode-server endpoint.
 *
 * Strategy (no client-side bans, no IP bans):
 *  - Every request carries a device id (deterrent fingerprint). The server
 *    hashes it with STREAM_SIGNING_SECRET before it touches the database.
 *  - Banned devices/accounts are rejected via has_active_ban().
 *  - Ad-hoc rate limiting via the endpoint_hits table (the backend has no
 *    built-in rate-limit primitive, so this is implemented manually).
 *  - Servers are read with the service-role client so we can revoke direct
 *    RPC access from the browser, forcing all reads through this guarded path.
 *
 * RESILIENCE: the ban + rate-limit machinery is a *defense* layer. If any part
 * of it fails (missing secret, transient DB error, runtime without an IP), it
 * must NEVER take down playback for every user. All guard steps are wrapped so
 * the worst case degrades to "serve the episode" rather than a 500 that breaks
 * the whole site and shows "NO SERVERS" everywhere.
 */

const DeviceInput = z.object({
  episodeId: z.string().uuid(),
  deviceId: z.string().min(1).max(128),
});

// Structured server-side log so we can spot guard/server-cycling regressions
// quickly in production logs.
function logEvent(event: string, fields: Record<string, unknown>) {
  try {
    console.info(`[stream] ${event} ${JSON.stringify(fields)}`);
  } catch {
    /* logging must never throw */
  }
}

function getSecret(): string | null {
  return process.env.STREAM_SIGNING_SECRET ?? null;
}

function hashWithSecret(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

// Ad-hoc fixed-window rate limit. Returns true when the caller is over budget.
// Any failure is swallowed (returns false = not limited) so the DB layer can
// never block legitimate playback.
async function isRateLimited(
  admin: any,
  bucketKey: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  try {
    const now = Date.now();
    const windowStart = new Date(
      Math.floor(now / (windowSeconds * 1000)) * windowSeconds * 1000,
    ).toISOString();

    const { data: existing } = await admin
      .from("endpoint_hits")
      .select("id,count")
      .eq("bucket_key", bucketKey)
      .eq("window_start", windowStart)
      .maybeSingle();

    if (existing) {
      const next = (existing.count ?? 0) + 1;
      await admin.from("endpoint_hits").update({ count: next }).eq("id", existing.id);
      return next > limit;
    }
    await admin
      .from("endpoint_hits")
      .insert({ bucket_key: bucketKey, window_start: windowStart, count: 1 });
    return 1 > limit;
  } catch (e) {
    logEvent("rate_limit_error", { bucketKey, error: String(e) });
    return false;
  }
}

/**
 * Guarded replacement for the get_episode_servers RPC. Returns the playable
 * server rows for an episode after best-effort ban + rate-limit checks.
 */
export const getEpisodeServersGuarded = createServerFn({ method: "POST" })
  .inputValidator((d) => DeviceInput.parse(d))
  .handler(async ({ data }): Promise<{ servers: ServerRow[]; blocked?: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const secret = getSecret();

    // Guard layer (ban + rate limit). Only active when a signing secret is
    // configured; otherwise we skip straight to serving the episode so a
    // misconfigured secret never breaks the whole site.
    if (secret) {
      try {
        const deviceHash = hashWithSecret(data.deviceId, secret);

        const { data: banned, error: banErr } = await (supabaseAdmin.rpc as any)(
          "has_active_ban",
          { _device_hash: deviceHash, _user_id: null },
        );
        if (banErr) {
          logEvent("ban_check_error", { error: banErr.message });
        } else if (banned === true) {
          logEvent("blocked_banned", { episodeId: data.episodeId });
          return { servers: [], blocked: "banned" };
        }

        let ip = "0.0.0.0";
        try {
          ip = getRequestIP({ xForwardedFor: true }) ?? "0.0.0.0";
        } catch {
          /* ip unavailable in some runtimes */
        }
        const ipHash = hashWithSecret(ip, secret).slice(0, 16);
        const limited = await isRateLimited(
          supabaseAdmin,
          `srv:${deviceHash}:${ipHash}`,
          30, // 30 requests
          60, // per 60s window
        );
        if (limited) {
          logEvent("blocked_rate_limited", { episodeId: data.episodeId });
          return { servers: [], blocked: "rate_limited" };
        }
      } catch (e) {
        // Guard layer must never block playback — log and continue.
        logEvent("guard_error", { episodeId: data.episodeId, error: String(e) });
      }
    } else {
      logEvent("missing_signing_secret", { episodeId: data.episodeId });
    }

    // Fetch servers. This is the only step allowed to surface an error, but we
    // still catch it so the client gets an empty list (graceful "no servers")
    // rather than a 500 that renders the branded crash page.
    try {
      const { data: servers, error } = await supabaseAdmin.rpc("get_episode_servers", {
        _episode_id: data.episodeId,
      });
      if (error) {
        logEvent("get_servers_error", { episodeId: data.episodeId, error: error.message });
        return { servers: [], blocked: "error" };
      }
      const rows = (servers ?? []) as ServerRow[];
      logEvent("servers_ok", { episodeId: data.episodeId, count: rows.length });
      return { servers: rows };
    } catch (e) {
      logEvent("get_servers_exception", { episodeId: data.episodeId, error: String(e) });
      return { servers: [], blocked: "error" };
    }
  });
