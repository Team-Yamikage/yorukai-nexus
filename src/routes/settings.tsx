import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Settings as SettingsIcon, LogOut } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — YORUKAI.TV" },
      { name: "description", content: "Playback, language and accessibility preferences for YORUKAI.TV." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AppShell>
      <SettingsPage />
    </AppShell>
  ),
});

const LANGS = ["English", "Hindi", "Japanese", "Tamil", "Telugu", "Malayalam", "Kannada", "Bengali"];

function usePref(key: string, initial: string) {
  const [value, setValue] = useState(initial);
  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored !== null) setValue(stored);
  }, [key]);
  const update = (v: string) => { setValue(v); localStorage.setItem(key, v); };
  return [value, update] as const;
}

function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = usePref("yk_pref_lang", "English");
  const [autoplay, setAutoplay] = usePref("yk_pref_autoplay", "on");
  const [skipIntro, setSkipIntro] = usePref("yk_pref_skipintro", "on");
  const [reduceMotion, setReduceMotion] = usePref("yk_pref_reducemotion", "off");

  // Apply reduce-motion globally so the preference has a real effect site-wide.
  useEffect(() => {
    document.documentElement.classList.toggle("yk-reduce-motion", reduceMotion === "on");
  }, [reduceMotion]);

  return (
    <section className="relative mx-auto max-w-3xl px-4 sm:px-8 pt-10 pb-32">
      <span className="senpai-sticker"><SettingsIcon className="h-3 w-3" /> Preferences</span>
      <h1 className="senpai-mega mt-3 text-6xl sm:text-7xl senpai-grad-text-cyber">SETTINGS</h1>

      <div className="senpai-glass mt-10 rounded-3xl p-6 sm:p-8">
        <h2 className="font-[var(--font-display)] text-lg tracking-wide">Playback</h2>

        <label className="mt-5 block text-xs uppercase tracking-[0.3em] text-senpai-text-muted">Preferred audio language</label>
        <div className="mt-3 flex flex-wrap gap-2">
          {LANGS.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition ${
                lang === l
                  ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia text-white shadow-[0_0_16px_-4px_var(--senpai-fuchsia)]"
                  : "senpai-glass text-senpai-text-dim hover:text-white"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          <Toggle label="Autoplay next episode" on={autoplay === "on"} onChange={(v) => setAutoplay(v ? "on" : "off")} />
          <Toggle label="Auto skip intro" on={skipIntro === "on"} onChange={(v) => setSkipIntro(v ? "on" : "off")} />
          <Toggle label="Reduce motion" on={reduceMotion === "on"} onChange={(v) => setReduceMotion(v ? "on" : "off")} />
        </div>
      </div>

      <div className="senpai-glass mt-6 rounded-3xl p-6 sm:p-8">
        <h2 className="font-[var(--font-display)] text-lg tracking-wide">Account</h2>
        {user ? (
          <>
            <p className="mt-3 text-sm text-senpai-text-dim">{user.email}</p>
            <button
              onClick={async () => { await signOut(); navigate({ to: "/" }); }}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-senpai-violet to-senpai-fuchsia px-5 py-2.5 text-sm font-semibold text-white hover:scale-[1.03] transition-transform"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </>
        ) : (
          <Link to="/auth" className="senpai-glass mt-4 inline-block rounded-full px-5 py-2.5 text-sm hover:bg-white/10">Sign in</Link>
        )}
      </div>
    </section>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-senpai-text-dim">{label}</span>
      <button
        onClick={() => onChange(!on)}
        className={`relative h-7 w-12 rounded-full transition-colors ${on ? "bg-gradient-to-r from-senpai-violet to-senpai-fuchsia" : "bg-white/15"}`}
        aria-pressed={on}
        aria-label={label}
      >
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${on ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}
