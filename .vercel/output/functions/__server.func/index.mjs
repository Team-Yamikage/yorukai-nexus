globalThis.__nitro_main__ = import.meta.url;
import { H as HTTPError, d as defineHandler, h as handleCacheHeaders, t as toResponse, a as defineLazyEventHandler, b as H3Core, c as toRequest } from "./_libs/h3.mjs";
import { N as NodeResponse } from "./_libs/srvx.mjs";
import { d as defineCachedHandler$1, s as setStorage } from "./_libs/ocache.mjs";
import { c as createStorage, p as prefixStorage } from "./_libs/unstorage.mjs";
import "./_libs/rou3.mjs";
import "node:stream";
import "./_libs/ohash.mjs";
import "node:crypto";
function lazyService(loader) {
  let promise, mod;
  return {
    fetch(req) {
      if (mod) {
        return mod.fetch(req);
      }
      if (!promise) {
        promise = loader().then((_mod) => mod = _mod.default || _mod);
      }
      return promise.then((mod2) => mod2.fetch(req));
    }
  };
}
const services = {
  ["ssr"]: lazyService(() => import("./_ssr/index.mjs"))
};
globalThis.__nitro_vite_envs__ = services;
const errorHandler$1 = (error, event) => {
  const res = defaultHandler(error, event);
  return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
  const unhandled = error.unhandled ?? !HTTPError.isError(error);
  const { status = 500, statusText = "" } = unhandled ? {} : error;
  if (status === 404) {
    const url = event.url || new URL(event.req.url);
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      return {
        status: 302,
        headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
      };
    }
  }
  const headers2 = new Headers(unhandled ? {} : error.headers);
  headers2.set("content-type", "application/json; charset=utf-8");
  const jsonBody = unhandled ? {
    status,
    unhandled: true
  } : typeof error.toJSON === "function" ? error.toJSON() : {
    status,
    statusText,
    message: error.message
  };
  return {
    status,
    statusText,
    headers: headers2,
    body: {
      error: true,
      ...jsonBody
    }
  };
}
const errorHandlers = [errorHandler$1];
async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      const response = await handler(error, event, { defaultHandler });
      if (response) {
        return response;
      }
    } catch (error2) {
      console.error(error2);
    }
  }
}
const _assets = {};
const normalizeKey = function normalizeKey2(key) {
  if (!key) return "";
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};
const assets = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets));
  },
  hasItem(id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets);
  },
  getItem(id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null);
  },
  getMeta(id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {});
  }
};
function initStorage() {
  const storage = createStorage({});
  storage.mount("/assets", assets);
  return storage;
}
function useStorage(base = "") {
  const storage = useStorage._storage ??= initStorage();
  return base ? prefixStorage(storage, base) : storage;
}
let _storageReady = false;
function ensureStorage() {
  if (_storageReady) {
    return;
  }
  _storageReady = true;
  const storage = useStorage();
  setStorage({
    get: (key) => storage.getItem(key),
    set: (key, value, opts) => storage.setItem(key, value, opts?.ttl ? { ttl: opts.ttl } : void 0)
  });
}
function defaultOnError(error) {
  console.error("[cache]", error);
  useNitroApp().captureError?.(error, { tags: ["cache"] });
}
function defineCachedHandler(handler, opts = {}) {
  ensureStorage();
  const ocacheHandler = defineCachedHandler$1(handler, {
    group: "nitro/handlers",
    onError: defaultOnError,
    toResponse: (value, event) => toResponse(value, event),
    createResponse: (body, init) => new NodeResponse(body, init),
    handleCacheHeaders: (event, conditions) => handleCacheHeaders(event, conditions),
    ...opts
  });
  return defineHandler((event) => ocacheHandler(event));
}
const headers = ((m) => function headersRouteRule(event) {
  for (const [key, value] of Object.entries(m.options || {})) {
    event.res.headers.set(key, value);
  }
});
const cache = ((m) => function cacheRouteRule(event, next) {
  if (!event.context.matchedRoute) {
    return next();
  }
  const cachedHandlers = globalThis.__nitroCachedHandlers ??= /* @__PURE__ */ new Map();
  const { handler, route } = event.context.matchedRoute;
  const key = `${m.route}:${route}`;
  let cachedHandler = cachedHandlers.get(key);
  if (!cachedHandler) {
    cachedHandler = defineCachedHandler(handler, {
      group: "nitro/route-rules",
      name: key,
      ...m.options
    });
    cachedHandlers.set(key, cachedHandler);
  }
  return cachedHandler(event);
});
const findRouteRules = /* @__PURE__ */ (() => {
  const $0 = [{ name: "headers", route: "/assets/**", handler: headers, options: { "cache-control": "public, max-age=31536000, immutable" } }], $1 = [{ name: "cache", route: "/**", handler: cache, options: { "maxAge": 0 } }];
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    let s = p.split("/"), l = s.length;
    if (l > 1) {
      if (s[1] === "assets") {
        r.unshift({ data: $0, params: { "_": s.slice(2).join("/") } });
      }
    }
    r.unshift({ data: $1, params: { "_": s.slice(1).join("/") } });
    return r;
  };
})();
const _lazy_tWbiRK = defineLazyEventHandler(() => Promise.resolve().then(function() {
  return ssrRenderer$1;
}));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_tWbiRK };
  return ((_m, p) => {
    return { data, params: { "_": p.slice(1) } };
  });
})();
const APP_ID = "default";
function useNitroApp() {
  let instance = useNitroApp._instance;
  if (instance) {
    return instance;
  }
  instance = useNitroApp._instance = createNitroApp();
  globalThis.__nitro__ = globalThis.__nitro__ || {};
  globalThis.__nitro__[APP_ID] = instance;
  return instance;
}
function createNitroApp() {
  const hooks = void 0;
  const captureError = (error, errorCtx) => {
    if (errorCtx?.event) {
      const errors = errorCtx.event.req.context?.nitro?.errors;
      if (errors) {
        errors.push({
          error,
          context: errorCtx
        });
      }
    }
  };
  const h3App = createH3App({ onError(error, event) {
    return errorHandler(error, event);
  } });
  let appHandler = (req) => {
    req.context ||= {};
    req.context.nitro = req.context.nitro || { errors: [] };
    return h3App.fetch(req);
  };
  const app = {
    fetch: appHandler,
    h3: h3App,
    hooks,
    captureError
  };
  return app;
}
function createH3App(config) {
  const h3App = new H3Core(config);
  h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
  {
    h3App["~getMiddleware"] = (event, route) => {
      const pathname = event.url.pathname;
      const method = event.req.method;
      const middleware = [];
      {
        const routeRules = getRouteRules(method, pathname);
        event.context.routeRules = routeRules?.routeRules;
        if (routeRules?.routeRuleMiddleware.length) {
          middleware.push(...routeRules.routeRuleMiddleware);
        }
      }
      if (route?.data?.middleware?.length) {
        middleware.push(...route.data.middleware);
      }
      return middleware;
    };
  }
  return h3App;
}
function getRouteRules(method, pathname) {
  const m = findRouteRules(method, pathname);
  if (!m?.length) {
    return { routeRuleMiddleware: [] };
  }
  const routeRules = {};
  for (const layer of m) {
    for (const rule of layer.data) {
      const currentRule = routeRules[rule.name];
      if (currentRule) {
        if (rule.options === false) {
          delete routeRules[rule.name];
          continue;
        }
        if (typeof currentRule.options === "object" && typeof rule.options === "object") {
          currentRule.options = {
            ...currentRule.options,
            ...rule.options
          };
        } else {
          currentRule.options = rule.options;
        }
        currentRule.route = rule.route;
        currentRule.params = {
          ...currentRule.params,
          ...layer.params
        };
      } else if (rule.options !== false) {
        routeRules[rule.name] = {
          ...rule,
          params: layer.params
        };
      }
    }
  }
  const middleware = [];
  const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
  for (const rule of orderedRules) {
    if (rule.options === false || !rule.handler) {
      continue;
    }
    middleware.push(rule.handler(rule));
  }
  return {
    routeRules,
    routeRuleMiddleware: middleware
  };
}
const ISR_URL_PARAM = "__isr_route";
function isrRouteRewrite(reqUrl, xNowRouteMatches) {
  if (xNowRouteMatches) {
    const isrURL = new URLSearchParams(xNowRouteMatches).get(ISR_URL_PARAM);
    if (isrURL) {
      return [decodeURIComponent(isrURL), ""];
    }
  } else {
    const queryIndex = reqUrl.indexOf("?");
    if (queryIndex !== -1) {
      const params = new URLSearchParams(reqUrl.slice(queryIndex + 1));
      const isrURL = params.get(ISR_URL_PARAM);
      if (isrURL) {
        params.delete(ISR_URL_PARAM);
        return [decodeURIComponent(isrURL), params.toString()];
      }
    }
  }
}
const nitroApp = useNitroApp();
const vercel_web = { fetch(req, context) {
  const isrURL = isrRouteRewrite(req.url, req.headers.get("x-now-route-matches"));
  if (isrURL) {
    const { routeRules } = getRouteRules("", isrURL[0]);
    if (routeRules?.isr) {
      req = new Request(new URL(isrURL[0] + (isrURL[1] ? `?${isrURL[1]}` : ""), req.url).href, req);
    }
  }
  req.runtime ??= { name: "vercel" };
  req.runtime.vercel = { context };
  let ip;
  Object.defineProperty(req, "ip", { get() {
    const h = req.headers.get("x-forwarded-for");
    return ip ??= h?.split(",").shift()?.trim();
  } });
  req.waitUntil = context?.waitUntil;
  return nitroApp.fetch(req);
} };
function fetchViteEnv(viteEnvName, input, init) {
  const envs = globalThis.__nitro_vite_envs__ || {};
  const viteEnv = envs[viteEnvName];
  if (!viteEnv) {
    throw HTTPError.status(404);
  }
  return Promise.resolve(viteEnv.fetch(toRequest(input, init)));
}
function ssrRenderer({ req }) {
  return fetchViteEnv("ssr", req);
}
const ssrRenderer$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  default: ssrRenderer
});
export {
  vercel_web as default
};
