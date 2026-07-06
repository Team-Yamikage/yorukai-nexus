import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — YORUKAI.TV" },
      { name: "description", content: "Stream beyond. Sign in to YORUKAI.TV with Google." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    next: typeof search.next === "string" && search.next.startsWith("/") && !search.next.startsWith("//")
      ? search.next
      : undefined,
  }),
  component: AuthPage,
});

const img = (s: string) => `https://picsum.photos/seed/${s}/1400/1800`;

function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const { user } = useAuth();

  // Already signed in → go home
  useEffect(() => {
    if (user) navigate({ to: (next ?? "/") as never });
  }, [user, navigate, next]);

  const signInWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth${next ? `?next=${encodeURIComponent(next)}` : ""}` },
      });
      if (error) throw error;
      // Redirect handled by Supabase OAuth flow.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setLoading(false);
    }
  };

  return (
    <div className="senpai-root senpai-scrollbar relative grid min-h-dvh grid-cols-1 lg:grid-cols-[6fr_4fr]">
      {/* LEFT — cinematic artwork */}
      <section className="relative isolate hidden overflow-hidden lg:block">
        <img src={img("yk-auth-hero")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-senpai-bg via-senpai-bg/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(161,107,255,0.45),transparent_55%)]" />
        <div className="absolute inset-0 senpai-halftone opacity-20" />

        {Array.from({ length: 14 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-senpai-teal shadow-[0_0_12px_var(--senpai-teal)]"
            style={{ left: `${(i * 73) % 100}%`, top: `${(i * 41) % 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-gradient-to-br from-senpai-violet via-senpai-fuchsia to-senpai-teal font-[var(--font-mega)] text-white">
              夜
            </div>
            <div>
              <div className="font-[var(--font-display)] text-xl tracking-wider">YORUKAI<span className="text-senpai-fuchsia">.</span>TV</div>
              <div className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-senpai-text-muted">stream beyond</div>
            </div>
          </Link>

          <div>
            <span className="font-[var(--font-hand)] text-3xl text-senpai-teal">welcome back, senpai ✦</span>
            <h1 className="senpai-mega mt-3 text-6xl xl:text-7xl 2xl:text-[110px]">
              <span className="senpai-grad-text">ANIME</span>
              <br />
              <span className="senpai-stroke-text">MOVIES</span>
              <br />
              <span className="senpai-grad-text-fire">LIVE TV</span>
              <br />
              <span className="senpai-grad-text-cyber">MANGA</span>
            </h1>
            <p className="mt-6 max-w-md text-sm text-senpai-text-dim">
              One pass. Every screen. Four worlds of story streaming in 4K HDR with simulcasts from Tokyo.
            </p>
          </div>

          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-senpai-text-muted">
            <span>夜界 · est. 2026</span>
            <span className="text-senpai-teal">● 12,847 streaming now</span>
          </div>
        </div>
      </section>

      {/* RIGHT — glass auth */}
      <section className="relative flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="pointer-events-none absolute inset-0 senpai-bg-grid opacity-40" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="senpai-glass senpai-glass-strong senpai-card-shadow relative w-full max-w-md rounded-2xl p-7 sm:p-8"
        >
          <div className="lg:hidden mb-6 flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-senpai-violet to-senpai-fuchsia font-[var(--font-mega)] text-white text-sm">夜</div>
            <span className="font-[var(--font-display)] tracking-wider">YORUKAI.TV</span>
          </div>

          <div className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.35em] text-senpai-text-muted">
            Access Terminal
          </div>
          <h2 className="senpai-mega mt-2 text-4xl">
            <span className="senpai-grad-text">Sign In</span>
          </h2>
          <p className="mt-3 text-sm text-senpai-text-dim">
            Continue with your Google account to start streaming.
          </p>

          {error && (
            <div className="mt-5 rounded-xl bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300 ring-1 ring-red-500/30">{error}</div>
          )}

          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3 font-semibold text-gray-800 shadow-[0_12px_40px_-12px_rgba(255,255,255,0.35)] transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-700" />
            ) : (
              <>
                <GoogleGlyph />
                Continue with Google
              </>
            )}
          </button>

          <p className="mt-6 text-center text-xs text-senpai-text-muted">
            By continuing you agree to the <span className="text-senpai-text-dim underline-offset-4 hover:underline">Terms</span> &{" "}
            <span className="text-senpai-text-dim underline-offset-4 hover:underline">Privacy</span>.
          </p>
        </motion.div>
      </section>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
