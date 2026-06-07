import { c as createServerRpc } from "./createServerRpc-BeKFeFff.mjs";
import { c as createServerFn, b as getRequestIP } from "./server-DKFzjMa8.mjs";
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
const DeviceInput = objectType({
  episodeId: stringType().uuid(),
  deviceId: stringType().min(1).max(128)
});
function secret() {
  const s = process.env.STREAM_SIGNING_SECRET;
  if (!s) throw new Error("Missing STREAM_SIGNING_SECRET");
  return s;
}
function hashWithSecret(value) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}
async function isRateLimited(admin, bucketKey, limit, windowSeconds) {
  const now = Date.now();
  const windowStart = new Date(Math.floor(now / (windowSeconds * 1e3)) * windowSeconds * 1e3).toISOString();
  const {
    data: existing
  } = await admin.from("endpoint_hits").select("id,count").eq("bucket_key", bucketKey).eq("window_start", windowStart).maybeSingle();
  if (existing) {
    const next = (existing.count ?? 0) + 1;
    await admin.from("endpoint_hits").update({
      count: next
    }).eq("id", existing.id);
    return next > limit;
  }
  await admin.from("endpoint_hits").insert({
    bucket_key: bucketKey,
    window_start: windowStart,
    count: 1
  });
  return 1 > limit;
}
const getEpisodeServersGuarded_createServerFn_handler = createServerRpc({
  id: "1fb5cc3dc7ce900efc8c9f77e19c50f15d3fb28d551745e2f36ce4460f5f38d7",
  name: "getEpisodeServersGuarded",
  filename: "src/lib/api/stream.functions.ts"
}, (opts) => getEpisodeServersGuarded.__executeServer(opts));
const getEpisodeServersGuarded = createServerFn({
  method: "POST"
}).inputValidator((d) => DeviceInput.parse(d)).handler(getEpisodeServersGuarded_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-BGjGOWO-.mjs");
  const deviceHash = hashWithSecret(data.deviceId);
  const {
    data: banned
  } = await supabaseAdmin.rpc("has_active_ban", {
    _device_hash: deviceHash,
    _user_id: null
  });
  if (banned === true) {
    return {
      servers: [],
      blocked: "banned"
    };
  }
  let ip = "0.0.0.0";
  try {
    ip = getRequestIP({
      xForwardedFor: true
    }) ?? "0.0.0.0";
  } catch {
  }
  const ipHash = hashWithSecret(ip).slice(0, 16);
  const limited = await isRateLimited(
    supabaseAdmin,
    `srv:${deviceHash}:${ipHash}`,
    30,
    // 30 requests
    60
    // per 60s window
  );
  if (limited) {
    return {
      servers: [],
      blocked: "rate_limited"
    };
  }
  const {
    data: servers,
    error
  } = await supabaseAdmin.rpc("get_episode_servers", {
    _episode_id: data.episodeId
  });
  if (error) throw error;
  return {
    servers: servers ?? []
  };
});
export {
  getEpisodeServersGuarded_createServerFn_handler
};
