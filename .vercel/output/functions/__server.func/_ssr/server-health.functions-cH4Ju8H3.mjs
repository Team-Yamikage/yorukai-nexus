import { c as createServerRpc } from "./createServerRpc-BeKFeFff.mjs";
import { c as createServerFn } from "./server-DKFzjMa8.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, a as arrayType, s as stringType } from "../_libs/zod.mjs";
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
import "crypto";
import "../_libs/isbot.mjs";
const ProbeInput = objectType({
  servers: arrayType(objectType({
    id: stringType().min(1).max(64),
    url: stringType().url().max(2048)
  })).min(1).max(20)
});
async function probeOne(url, timeoutMs = 6e3) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    let res;
    try {
      res = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
        signal: ctrl.signal
      });
      if (res.status === 405 || res.status === 501) {
        res = await fetch(url, {
          method: "GET",
          headers: {
            Range: "bytes=0-0"
          },
          redirect: "follow",
          signal: ctrl.signal
        });
      }
    } catch {
      res = await fetch(url, {
        method: "GET",
        headers: {
          Range: "bytes=0-0"
        },
        redirect: "follow",
        signal: ctrl.signal
      });
    }
    return res.status !== 404 && res.status !== 410 && res.status < 500;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}
const probeServers_createServerFn_handler = createServerRpc({
  id: "3a05a354576130d8f79083a063c81b056fdd48df107dfe6c1910e2a81812b811",
  name: "probeServers",
  filename: "src/lib/api/server-health.functions.ts"
}, (opts) => probeServers.__executeServer(opts));
const probeServers = createServerFn({
  method: "POST"
}).inputValidator((d) => ProbeInput.parse(d)).handler(probeServers_createServerFn_handler, async ({
  data
}) => {
  const entries = await Promise.all(data.servers.map(async (s) => [s.id, await probeOne(s.url)]));
  return {
    health: Object.fromEntries(entries)
  };
});
export {
  probeServers_createServerFn_handler
};
