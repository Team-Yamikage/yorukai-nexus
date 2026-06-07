import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link, u as useRouter } from "../_libs/tanstack__react-router.mjs";
import { m as isRedirect } from "../_libs/tanstack__router-core.mjs";
import { A as AppShell } from "./AppShell-c090ocC3.mjs";
import { b as useQueryClient, u as useQuery, c as useMutation, q as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { u as useAuth, c as createSsrRpc } from "./router-UGTBz-_d.mjs";
import { c as createServerFn } from "./server-DKFzjMa8.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DR-6YyP5.mjs";
import "../_libs/seroval.mjs";
import { f as LoaderCircle, g as ShieldAlert, h as Ban, i as Trash2 } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__query-core.mjs";
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
function useServerFn(serverFn) {
  const router = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router.stores.location.get();
        return router.navigate(router.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router, serverFn]);
}
const listBansFn = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("77dd1524f14db3ed31b1d8b9422e6558fa1a4b86d43c975b87d896eb061a0b04"));
const CreateBanInput = objectType({
  deviceId: stringType().min(1).max(128).optional(),
  deviceHash: stringType().min(8).max(128).optional(),
  userId: stringType().uuid().optional(),
  reason: stringType().max(500).optional(),
  expiresAt: stringType().datetime().optional()
});
const createBanFn = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => CreateBanInput.parse(d)).handler(createSsrRpc("080a4be96bd626042b3dc87d063a86faef23f7ca0402e6628fde707e59335a2a"));
const revokeBanFn = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  id: stringType().uuid()
}).parse(d)).handler(createSsrRpc("3316eae9c1634831990523c1d3438b82a25dc9179bacb36e3021fc38fc7ba74e"));
const bansQuery = () => queryOptions({
  queryKey: ["admin-bans"],
  queryFn: () => listBansFn(),
  staleTime: 1e4
});
function AdminBansPanel() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(bansQuery());
  const createBan = useServerFn(createBanFn);
  const revokeBan = useServerFn(revokeBanFn);
  const [deviceHash, setDeviceHash] = reactExports.useState("");
  const [userId, setUserId] = reactExports.useState("");
  const [reason, setReason] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const create = useMutation({
    mutationFn: () => createBan({
      data: {
        deviceHash: deviceHash.trim() || void 0,
        userId: userId.trim() || void 0,
        reason: reason.trim() || void 0
      }
    }),
    onSuccess: () => {
      setDeviceHash("");
      setUserId("");
      setReason("");
      setError(null);
      qc.invalidateQueries({ queryKey: ["admin-bans"] });
    },
    onError: (e) => setError(e?.message ?? "Failed to create ban")
  });
  const revoke = useMutation({
    mutationFn: (id) => revokeBan({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-bans"] })
  });
  const bans = data?.bans ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-4xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "h-5 w-5 text-senpai-fuchsia" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-[var(--font-display)] text-2xl tracking-wide text-white", children: "Device bans" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "senpai-glass rounded-2xl p-4 sm:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: deviceHash,
            onChange: (e) => setDeviceHash(e.target.value),
            placeholder: "Device hash",
            className: "senpai-glass rounded-xl bg-transparent px-3 py-2 text-sm outline-none placeholder:text-senpai-text-muted"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: userId,
            onChange: (e) => setUserId(e.target.value),
            placeholder: "User id (uuid)",
            className: "senpai-glass rounded-xl bg-transparent px-3 py-2 text-sm outline-none placeholder:text-senpai-text-muted"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: reason,
            onChange: (e) => setReason(e.target.value),
            placeholder: "Reason (optional)",
            className: "senpai-glass rounded-xl bg-transparent px-3 py-2 text-sm outline-none placeholder:text-senpai-text-muted"
          }
        )
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-senpai-amber", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => create.mutate(),
          disabled: create.isPending,
          className: "mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-senpai-violet to-senpai-fuchsia px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white disabled:opacity-50",
          children: [
            create.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "h-4 w-4" }),
            "Add ban"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 space-y-2", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center py-10 text-senpai-text-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) }) : bans.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-8 text-center text-sm text-senpai-text-muted", children: "No active bans." }) : bans.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "senpai-glass flex items-center justify-between gap-4 rounded-xl px-4 py-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate font-mono text-xs text-senpai-text-dim", children: b.device_hash !== "n/a" ? `device:${String(b.device_hash).slice(0, 16)}…` : `user:${b.user_id}` }),
        b.reason && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-senpai-text-muted", children: b.reason })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => revoke.mutate(b.id),
          className: "senpai-glass grid h-9 w-9 place-items-center rounded-full text-senpai-text-dim hover:text-white",
          "aria-label": "Revoke ban",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
        }
      )
    ] }, b.id)) })
  ] });
}
function AdminGate() {
  const {
    loading,
    isAdmin,
    user
  } = useAuth();
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid min-h-[60vh] place-items-center text-senpai-text-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin" }) }) });
  }
  if (!user || !isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid min-h-[60vh] place-items-center px-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "mx-auto h-10 w-10 text-senpai-amber" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "senpai-mega mt-4 text-4xl senpai-grad-text-fire", children: "RESTRICTED" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-senpai-text-dim", children: "This control center is available to administrators only." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "senpai-glass mt-6 inline-block rounded-full px-5 py-2 text-sm hover:bg-white/10", children: "Back to home" })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4 sm:px-8 pt-10 pb-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-senpai-text-muted", children: "こんにちは admin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "senpai-mega mt-2 text-5xl sm:text-6xl senpai-grad-text-fire", children: "CONTROL CENTER" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-2xl text-sm text-senpai-text-dim", children: "Moderation tools for the platform. Ban abusive devices or accounts and manage active restrictions." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminBansPanel, {})
  ] }) });
}
export {
  AdminGate as component
};
