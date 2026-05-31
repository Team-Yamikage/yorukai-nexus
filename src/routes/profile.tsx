import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Crown, LogOut, Zap, Trophy } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — YORUKAI.TV" },
      { name: "description", content: "Your YORUKAI.TV profile, level and premium status." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AppShell>
      <ProfilePage />
    </AppShell>
  ),
});

function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
  });

  if (!loading && !user) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-28 text-center">
        <h1 className="senpai-mega text-6xl senpai-grad-text">PROFILE</h1>
        <p className="mt-6 text-senpai-text-dim">Sign in to view your profile.</p>
        <Link to="/auth" className="senpai-glass mt-8 inline-block rounded-full px-6 py-3 text-sm hover:bg-white/10">Sign in</Link>
      </section>
    );
  }

  const name = profile?.display_name || user?.email?.split("@")[0] || "Senpai";
  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const xpInLevel = xp % 1000;

  return (
    <section className="relative mx-auto max-w-4xl px-4 sm:px-8 pt-10 pb-32">
      <span className="senpai-sticker"><Trophy className="h-3 w-3" /> You</span>
      <h1 className="senpai-mega mt-3 text-6xl sm:text-7xl senpai-grad-text">PROFILE</h1>

      <div className="senpai-glass senpai-glass-strong mt-10 flex flex-col items-center gap-6 rounded-3xl p-8 sm:flex-row sm:items-center">
        <div className="grid h-28 w-28 flex-none place-items-center overflow-hidden rounded-full bg-gradient-to-br from-senpai-violet to-senpai-fuchsia text-4xl font-bold text-white">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={name} className="h-full w-full object-cover" />
          ) : (
            name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <h2 className="font-[var(--font-display)] text-2xl tracking-wide">{name}</h2>
            {profile?.is_premium && (
              <span className="senpai-sticker !bg-senpai-amber/85 !border-transparent !text-black"><Crown className="h-3 w-3" /> Premium</span>
            )}
          </div>
          <p className="mt-1 text-sm text-senpai-text-muted">{user?.email}</p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-senpai-text-dim">
              <span className="inline-flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-senpai-teal" /> Level {level}</span>
              <span>{xpInLevel} / 1000 XP</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-gradient-to-r from-senpai-violet to-senpai-fuchsia" style={{ width: `${(xpInLevel / 1000) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat label="Level" value={String(level)} />
        <Stat label="Total XP" value={xp.toLocaleString()} />
        <Stat label="Status" value={profile?.is_premium ? "Premium" : "Free"} />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/settings" className="senpai-glass rounded-full px-5 py-2.5 text-sm hover:bg-white/10">Settings</Link>
        <Link to="/library" className="senpai-glass rounded-full px-5 py-2.5 text-sm hover:bg-white/10">Library</Link>
        <button
          onClick={async () => { await signOut(); navigate({ to: "/" }); }}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-senpai-violet to-senpai-fuchsia px-5 py-2.5 text-sm font-semibold text-white hover:scale-[1.03] transition-transform"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="senpai-glass rounded-2xl p-5 text-center">
      <div className="font-[var(--font-display)] text-2xl tracking-wide senpai-grad-text">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-senpai-text-muted">{label}</div>
    </div>
  );
}
