import { c as createServerRpc } from "./createServerRpc-BeKFeFff.mjs";
import { c as createServerFn } from "./server-DKFzjMa8.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DR-6YyP5.mjs";
import { createHmac } from "crypto";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function hashDevice(deviceId) {
  const s = process.env.STREAM_SIGNING_SECRET;
  if (!s) throw new Error("Missing STREAM_SIGNING_SECRET");
  return createHmac("sha256", s).update(deviceId).digest("hex");
}
const listBansFn_createServerFn_handler = createServerRpc({
  id: "77dd1524f14db3ed31b1d8b9422e6558fa1a4b86d43c975b87d896eb061a0b04",
  name: "listBansFn",
  filename: "src/lib/api/admin-bans.functions.ts"
}, (opts) => listBansFn.__executeServer(opts));
const listBansFn = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listBansFn_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("banned_devices").select("id, device_hash, user_id, reason, created_at, expires_at").order("created_at", {
    ascending: false
  }).limit(200);
  if (error) throw error;
  return {
    bans: data ?? []
  };
});
const CreateBanInput = objectType({
  deviceId: stringType().min(1).max(128).optional(),
  deviceHash: stringType().min(8).max(128).optional(),
  userId: stringType().uuid().optional(),
  reason: stringType().max(500).optional(),
  expiresAt: stringType().datetime().optional()
});
const createBanFn_createServerFn_handler = createServerRpc({
  id: "080a4be96bd626042b3dc87d063a86faef23f7ca0402e6628fde707e59335a2a",
  name: "createBanFn",
  filename: "src/lib/api/admin-bans.functions.ts"
}, (opts) => createBanFn.__executeServer(opts));
const createBanFn = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => CreateBanInput.parse(d)).handler(createBanFn_createServerFn_handler, async ({
  data,
  context
}) => {
  const device_hash = data.deviceHash ?? (data.deviceId ? hashDevice(data.deviceId) : null);
  if (!device_hash && !data.userId) {
    throw new Error("Provide a device id/hash or a user id to ban.");
  }
  const {
    error
  } = await context.supabase.from("banned_devices").insert({
    device_hash: device_hash ?? "n/a",
    user_id: data.userId ?? null,
    reason: data.reason ?? null,
    created_by: context.userId,
    expires_at: data.expiresAt ?? null
  });
  if (error) throw error;
  return {
    ok: true
  };
});
const revokeBanFn_createServerFn_handler = createServerRpc({
  id: "3316eae9c1634831990523c1d3438b82a25dc9179bacb36e3021fc38fc7ba74e",
  name: "revokeBanFn",
  filename: "src/lib/api/admin-bans.functions.ts"
}, (opts) => revokeBanFn.__executeServer(opts));
const revokeBanFn = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  id: stringType().uuid()
}).parse(d)).handler(revokeBanFn_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("banned_devices").delete().eq("id", data.id);
  if (error) throw error;
  return {
    ok: true
  };
});
export {
  createBanFn_createServerFn_handler,
  listBansFn_createServerFn_handler,
  revokeBanFn_createServerFn_handler
};
