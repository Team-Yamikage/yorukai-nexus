import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Ban, Trash2, Loader2 } from "lucide-react";
import { bansQuery, createBanFn, revokeBanFn } from "@/lib/api/admin-bans.functions";

/** Admin panel: ban devices/accounts and revoke active bans. */
export function AdminBansPanel() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(bansQuery());
  const createBan = useServerFn(createBanFn);
  const revokeBan = useServerFn(revokeBanFn);

  const [deviceHash, setDeviceHash] = useState("");
  const [userId, setUserId] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const create = useMutation({
    mutationFn: () =>
      createBan({
        data: {
          deviceHash: deviceHash.trim() || undefined,
          userId: userId.trim() || undefined,
          reason: reason.trim() || undefined,
        },
      }),
    onSuccess: () => {
      setDeviceHash("");
      setUserId("");
      setReason("");
      setError(null);
      qc.invalidateQueries({ queryKey: ["admin-bans"] });
    },
    onError: (e: any) => setError(e?.message ?? "Failed to create ban"),
  });

  const revoke = useMutation({
    mutationFn: (id: string) => revokeBan({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-bans"] }),
  });

  const bans = data?.bans ?? [];

  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center gap-2">
        <Ban className="h-5 w-5 text-senpai-fuchsia" />
        <h2 className="font-[var(--font-display)] text-2xl tracking-wide text-white">Device bans</h2>
      </div>

      <div className="senpai-glass rounded-2xl p-4 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            value={deviceHash}
            onChange={(e) => setDeviceHash(e.target.value)}
            placeholder="Device hash"
            className="senpai-glass rounded-xl bg-transparent px-3 py-2 text-sm outline-none placeholder:text-senpai-text-muted"
          />
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User id (uuid)"
            className="senpai-glass rounded-xl bg-transparent px-3 py-2 text-sm outline-none placeholder:text-senpai-text-muted"
          />
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (optional)"
            className="senpai-glass rounded-xl bg-transparent px-3 py-2 text-sm outline-none placeholder:text-senpai-text-muted"
          />
        </div>
        {error && <p className="mt-2 text-xs text-senpai-amber">{error}</p>}
        <button
          onClick={() => create.mutate()}
          disabled={create.isPending}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-senpai-violet to-senpai-fuchsia px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white disabled:opacity-50"
        >
          {create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
          Add ban
        </button>
      </div>

      <div className="mt-6 space-y-2">
        {isLoading ? (
          <div className="grid place-items-center py-10 text-senpai-text-muted"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : bans.length === 0 ? (
          <p className="py-8 text-center text-sm text-senpai-text-muted">No active bans.</p>
        ) : (
          bans.map((b: any) => (
            <div key={b.id} className="senpai-glass flex items-center justify-between gap-4 rounded-xl px-4 py-3 text-sm">
              <div className="min-w-0">
                <div className="truncate font-mono text-xs text-senpai-text-dim">
                  {b.device_hash !== "n/a" ? `device:${String(b.device_hash).slice(0, 16)}…` : `user:${b.user_id}`}
                </div>
                {b.reason && <div className="text-xs text-senpai-text-muted">{b.reason}</div>}
              </div>
              <button
                onClick={() => revoke.mutate(b.id)}
                className="senpai-glass grid h-9 w-9 place-items-center rounded-full text-senpai-text-dim hover:text-white"
                aria-label="Revoke ban"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
