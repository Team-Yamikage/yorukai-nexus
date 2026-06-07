import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { createHmac } from "crypto";

/**
 * Admin-only device ban management. All checks run server-side as the
 * authenticated admin (RLS on banned_devices restricts to admins). Device ids
 * are hashed with STREAM_SIGNING_SECRET before storage so raw ids never live
 * in the database.
 */

function hashDevice(deviceId: string): string {
  const s = process.env.STREAM_SIGNING_SECRET;
  if (!s) throw new Error("Missing STREAM_SIGNING_SECRET");
  return createHmac("sha256", s).update(deviceId).digest("hex");
}

export const listBansFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("banned_devices")
      .select("id, device_hash, user_id, reason, created_at, expires_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return { bans: data ?? [] };
  });

const CreateBanInput = z.object({
  deviceId: z.string().min(1).max(128).optional(),
  deviceHash: z.string().min(8).max(128).optional(),
  userId: z.string().uuid().optional(),
  reason: z.string().max(500).optional(),
  expiresAt: z.string().datetime().optional(),
});

export const createBanFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => CreateBanInput.parse(d))
  .handler(async ({ data, context }) => {
    const device_hash = data.deviceHash ?? (data.deviceId ? hashDevice(data.deviceId) : null);
    if (!device_hash && !data.userId) {
      throw new Error("Provide a device id/hash or a user id to ban.");
    }
    const { error } = await context.supabase.from("banned_devices").insert({
      device_hash: device_hash ?? "n/a",
      user_id: data.userId ?? null,
      reason: data.reason ?? null,
      created_by: context.userId,
      expires_at: data.expiresAt ?? null,
    });
    if (error) throw error;
    return { ok: true };
  });

export const revokeBanFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("banned_devices")
      .delete()
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const bansQuery = () =>
  queryOptions({
    queryKey: ["admin-bans"],
    queryFn: () => listBansFn(),
    staleTime: 10_000,
  });
