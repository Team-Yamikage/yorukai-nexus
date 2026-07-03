import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth";
import { missingServersQuery } from "@/lib/api/reports.functions";

export const Route = createFileRoute("/reports/episodes")({
  head: () => ({ meta: [{ title: "Missing Servers Report — YORUKAI.TV" }] }),
  component: ReportGate,
});

function ReportGate() {
  const { loading, isAdmin, user } = useAuth();

  if (loading) {
    return (
      <AppShell>
        <div className="grid min-h-[60vh] place-items-center text-senpai-text-muted">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (!user || !isAdmin) {
    return (
      <AppShell>
        <div className="grid min-h-[60vh] place-items-center px-6 text-center">
          <div>
            <ShieldAlert className="mx-auto h-10 w-10 text-senpai-amber" />
            <h1 className="senpai-mega mt-4 text-4xl senpai-grad-text-fire">RESTRICTED</h1>
            <p className="mt-3 text-sm text-senpai-text-dim">
              This report is available to administrators only.
            </p>
            <Link to="/" className="senpai-glass mt-6 inline-block rounded-full px-5 py-2 text-sm hover:bg-white/10">
              Back to home
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return <ReportView />;
}

function ReportView() {
  const { data, isLoading, error } = useQuery(missingServersQuery());

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="senpai-mega text-4xl senpai-grad-text-fire">MISSING SERVERS</h1>
        <p className="mt-2 text-sm text-senpai-text-dim">
          Episodes with zero playable entries in <code>video_servers</code>.
        </p>

        {isLoading && (
          <div className="mt-10 grid place-items-center text-senpai-text-muted">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300 ring-1 ring-red-500/30">
            {error instanceof Error ? error.message : "Failed to load report."}
          </div>
        )}

        {data && (
          <>
            <div className="mt-6 flex flex-wrap gap-4">
              <Stat label="Total episodes" value={data.totalEpisodes} />
              <Stat label="Missing servers" value={data.missingCount} accent />
              <Stat label="Titles affected" value={data.groups.length} />
            </div>

            {data.missingCount === 0 ? (
              <div className="mt-10 flex items-center gap-3 rounded-xl bg-emerald-500/10 px-4 py-4 text-emerald-300 ring-1 ring-emerald-500/30">
                <CheckCircle2 className="h-5 w-5" />
                Every episode has at least one playable server. 🎉
              </div>
            ) : (
              <div className="mt-8 space-y-6">
                {data.groups.map((g) => (
                  <div key={g.contentId} className="senpai-glass rounded-2xl p-5">
                    <div className="flex items-center justify-between gap-4">
                      <Link
                        to="/detail/$id"
                        params={{ id: g.contentId ?? "" }}
                        className="text-lg font-semibold text-senpai-text hover:text-senpai-fuchsia"
                      >
                        {g.contentTitle}
                      </Link>
                      <span className="flex items-center gap-1.5 rounded-full bg-senpai-amber/10 px-3 py-1 text-xs font-medium text-senpai-amber ring-1 ring-senpai-amber/30">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {g.episodes.length} missing
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {g.episodes.map((e) => (
                        <Link
                          key={e.id}
                          to="/watch/$id"
                          params={{ id: e.id }}
                          className="rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-senpai-text-dim ring-1 ring-white/10 hover:bg-white/10 hover:text-senpai-text"
                          title={e.title ?? undefined}
                        >
                          EP {e.episodeNumber}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="senpai-glass rounded-xl px-5 py-3">
      <div className={`text-2xl font-bold ${accent ? "text-senpai-amber" : "text-senpai-text"}`}>
        {value.toLocaleString()}
      </div>
      <div className="text-[11px] uppercase tracking-widest text-senpai-text-muted">{label}</div>
    </div>
  );
}
