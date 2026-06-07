import { c as createSsrRpc } from "./router-UGTBz-_d.mjs";
import { c as createServerFn } from "./server-DKFzjMa8.mjs";
import "../_libs/react.mjs";
import "../_libs/seroval.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "./client-CSmeRDtX.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const DeviceInput = objectType({
  episodeId: stringType().uuid(),
  deviceId: stringType().min(1).max(128)
});
const getEpisodeServersGuarded = createServerFn({
  method: "POST"
}).inputValidator((d) => DeviceInput.parse(d)).handler(createSsrRpc("1fb5cc3dc7ce900efc8c9f77e19c50f15d3fb28d551745e2f36ce4460f5f38d7"));
export {
  getEpisodeServersGuarded
};
