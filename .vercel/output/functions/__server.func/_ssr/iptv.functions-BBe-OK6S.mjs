import { c as createServerRpc } from "./createServerRpc-BeKFeFff.mjs";
import { c as createServerFn } from "./server-DKFzjMa8.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
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
const API = "https://iptv-org.github.io/api";
async function getJson(path) {
  const res = await fetch(`${API}/${path}`, {
    headers: {
      accept: "application/json"
    }
  });
  if (!res.ok) throw new Error(`IPTV fetch failed: ${path}`);
  return await res.json();
}
const liveChannelsFn_createServerFn_handler = createServerRpc({
  id: "8d75d4082cfa9203ed80219df9a77029cf555e19ce6e084d0ad48294f770ea95",
  name: "liveChannelsFn",
  filename: "src/lib/api/iptv.functions.ts"
}, (opts) => liveChannelsFn.__executeServer(opts));
const liveChannelsFn = createServerFn({
  method: "GET"
}).handler(liveChannelsFn_createServerFn_handler, async () => {
  const [channels, streams, logos] = await Promise.all([getJson("channels.json"), getJson("streams.json"), getJson("logos.json")]);
  const streamByChannel = /* @__PURE__ */ new Map();
  for (const s of streams) {
    if (!s.channel || !s.url) continue;
    if (s.user_agent || s.referrer) continue;
    if (!/^https/i.test(s.url)) continue;
    if (!streamByChannel.has(s.channel)) streamByChannel.set(s.channel, s);
  }
  const logoByChannel = /* @__PURE__ */ new Map();
  for (const l of logos) {
    if (l.channel && l.url && !logoByChannel.has(l.channel)) logoByChannel.set(l.channel, l.url);
  }
  const result = [];
  for (const c of channels) {
    if (c.country !== "IN" || c.is_nsfw || c.closed) continue;
    const stream = streamByChannel.get(c.id);
    if (!stream) continue;
    result.push({
      id: c.id,
      name: c.name,
      logo: logoByChannel.get(c.id) ?? null,
      categories: c.categories?.length ? c.categories : ["general"],
      url: stream.url,
      quality: stream.quality
    });
  }
  result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
});
export {
  liveChannelsFn_createServerFn_handler
};
