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
 */

const DeviceInput = z.object({
  episodeId: z.string().uuid(),
  deviceId: z.string().min(1).max(128),
});

function secret(): string {
  const s = process.env.STREAM_SIGNING_SECRET;
  if (!s) throw new Error("Missing STREAM_SIGNING_SECRET");
  return s;
}

function hashWithSecret(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

// Ad-hoc fixed-window rate limit. Returns true when the caller is over budget.
async function isRateLimited(
  admin: any,
  bucketKey: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const now = Date.now();
  const windowStart = new Date(
    Math.floor(now / (windowSeconds * 1000)) * windowSeconds * 1000,
  ).toISOString();

  // Upsert + increment the counter for this window.
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
}

/**
 * Guarded replacement for the get_episode_servers RPC. Returns the playable
 * server rows for an episode after ban + rate-limit checks.
 */
export const getEpisodeServersGuarded = createServerFn({ method: "POST" })
  .inputValidator((d) => DeviceInput.parse(d))
  .handler(async ({ data }): Promise<{ servers: ServerRow[]; blocked?: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const deviceHash = hashWithSecret(data.deviceId);

    // Ban check (device only; no IP bans).
    const { data: banned } = await (supabaseAdmin.rpc as any)("has_active_ban", {
      _device_hash: deviceHash,
      _user_id: null,
    });
    if (banned === true) {
      return { servers: [], blocked: "banned" };
    }

    // Rate limit per device. IP only contributes to the bucket key (cheap
    // dedupe across shared devices), never to a ban.
    let ip = "0.0.0.0";
    try {
      ip = getRequestIP({ xForwardedFor: true }) ?? "0.0.0.0";
    } catch {
      /* ip unavailable in some runtimes */
    }
    const ipHash = hashWithSecret(ip).slice(0, 16);
    const limited = await isRateLimited(
      supabaseAdmin,
      `srv:${deviceHash}:${ipHash}`,
      30, // 30 requests
      60, // per 60s window
    );
    if (limited) {
      return { servers: [], blocked: "rate_limited" };
    }

    const { data: servers, error } = await supabaseAdmin.rpc("get_episode_servers", {
      _episode_id: data.episodeId,
    });
    if (error) throw error;
    return { servers: (servers ?? []) as ServerRow[] };
  });
