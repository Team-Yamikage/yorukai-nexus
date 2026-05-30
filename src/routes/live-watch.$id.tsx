import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Tv } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { HlsPlayer } from "@/components/HlsPlayer";
import { ShareButton } from "@/components/ShareButton";
import { liveChannelsQuery } from "@/lib/api/iptv.functions";

export const Route = createFileRoute("/live-watch/$id")({
  head: () => ({ meta: [{ title: "Live — YORUKAI.TV" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(liveChannelsQuery),
  component: () => (
    <AppShell>
      <LiveWatch />
    </AppShell>
  ),
});

function LiveWatch() {
  const { id } = Route.useParams();
  const { data: channels } = useSuspenseQuery(liveChannelsQuery);
  const channel = channels.find((c) => c.id === id);
  const related = channels
    .filter((c) => c.id !== id && c.categories.some((x) => channel?.categories.includes(x)))
    .slice(0, 12);

  if (!channel) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="senpai-mega text-5xl senpai-grad-text-fire">OFF AIR</h1>
        <p className="mt-4 text-senpai-text-dim">This channel is not available.</p>
        <Link to="/live-tv" className="senpai-glass mt-6 inline-block rounded-full px-5 py-2 text-sm">Back to Live TV</Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-8 pt-6 pb-32">
      <div className="flex items-center justify-between gap-3">
        <Link to="/live-tv" className="senpai-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/10">
          <ArrowLeft className="h-4 w-4" /> Live TV
        </Link>
        <ShareButton title={channel.name} />
      </div>

      <div className="senpai-glass-strong mt-4 overflow-hidden rounded-3xl ring-1 ring-senpai-violet/30 shadow-[0_30px_120px_-30px_var(--senpai-violet)]">
        <div className="aspect-video bg-black">
          <HlsPlayer url={channel.url} poster={channel.logo} className="h-full w-full" />
        </div>
        <div className="flex items-center gap-3 border-t border-senpai-border p-4 sm:p-6">
          <div className="grid h-12 w-12 flex-none place-items-center overflow-hidden rounded-xl bg-white/5">
            {channel.logo ? <img src={channel.logo} alt="" className="h-full w-full object-contain p-1" /> : <Tv className="h-6 w-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-senpai-fuchsia" />
              <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-senpai-fuchsia">Now playing · Live</span>
            </div>
            <h1 className="font-[var(--font-display)] text-xl tracking-wide">{channel.name}</h1>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <div className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-senpai-text-muted">Up next</div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {related.map((c) => (
              <Link key={c.id} to="/live-watch/$id" params={{ id: c.id }} className="senpai-glass flex flex-col items-center gap-2 rounded-2xl p-3 text-center hover:bg-white/5">
                <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-white/5">
                  {c.logo ? <img src={c.logo} alt="" loading="lazy" className="h-full w-full object-contain p-1" /> : <Tv className="h-5 w-5" />}
                </div>
                <span className="line-clamp-2 text-[11px] font-semibold">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
