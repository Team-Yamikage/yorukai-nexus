import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — YORUKAI.TV" },
      { name: "description", content: "Stream beyond. Sign in or join YORUKAI.TV." },
    ],
  }),
  component: AuthPage,
});

const img = (s: string) => `https://picsum.photos/seed/${s}/1400/1800`;

function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");

  return (
    <div className="senpai-root senpai-scrollbar relative grid min-h-dvh grid-cols-1 lg:grid-cols-[6fr_4fr]">
      {/* LEFT — cinematic artwork */}
      <section className="relative isolate hidden overflow-hidden lg:block">
        <img src={img("yk-auth-hero")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-senpai-bg via-senpai-bg/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(161,107,255,0.45),transparent_55%)]" />
        <div className="absolute inset-0 senpai-halftone opacity-20" />

        {/* Floating particles */}
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
            {tab === "login" ? <span className="senpai-grad-text">Sign In</span> : <span className="senpai-grad-text-cyber">Join</span>}
          </h2>

          <div className="mt-6 grid grid-cols-2 rounded-full bg-white/5 p-1 ring-1 ring-senpai-border">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="relative rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest"
              >
                {tab === t && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-senpai-violet to-senpai-fuchsia shadow-[0_8px_24px_-8px_var(--senpai-fuchsia)]"
                  />
                )}
                <span className={`relative ${tab === t ? "text-white" : "text-senpai-text-muted"}`}>
                  {t === "login" ? "Login" : "Sign up"}
                </span>
              </button>
            ))}
          </div>

          <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            {tab === "signup" && (
              <Field label="Display name" placeholder="senpai_07" icon={<UserGlyph />} />
            )}
            <Field label="Email" type="email" placeholder="you@beyond.tv" icon={<Mail className="h-4 w-4" />} />
            <Field label="Password" type="password" placeholder="••••••••" icon={<Lock className="h-4 w-4" />} />

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-senpai-violet via-senpai-fuchsia to-senpai-pink py-3 font-semibold text-white shadow-[0_12px_40px_-12px_var(--senpai-fuchsia)] transition-transform hover:scale-[1.01]"
            >
              {tab === "login" ? "Enter the night" : "Create account"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-senpai-text-muted">
            <span className="h-px flex-1 bg-senpai-border-strong" /> or continue with <span className="h-px flex-1 bg-senpai-border-strong" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <OAuth icon={<ChromeIcon className="h-4 w-4" />} label="Google" />
            <OAuth icon={<Github className="h-4 w-4" />} label="GitHub" />
          </div>

          <p className="mt-6 text-center text-xs text-senpai-text-muted">
            By continuing you agree to the <span className="text-senpai-text-dim underline-offset-4 hover:underline">Terms</span> &{" "}
            <span className="text-senpai-text-dim underline-offset-4 hover:underline">Privacy</span>.
          </p>
        </motion.div>
      </section>
    </div>
  );
}

function Field({
  label, type = "text", placeholder, icon,
}: { label: string; type?: string; placeholder?: string; icon: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-senpai-text-muted">{label}</span>
      <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-white/5 px-3.5 py-2.5 ring-1 ring-senpai-border transition-all focus-within:bg-white/10 focus-within:ring-senpai-violet focus-within:shadow-[0_0_0_4px_rgba(161,107,255,0.18)]">
        <span className="text-senpai-text-muted">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-white placeholder:text-senpai-text-muted/70 outline-none"
        />
      </div>
    </label>
  );
}

function OAuth({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="senpai-glass flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10">
      {icon} {label}
    </button>
  );
}

function UserGlyph() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
    </svg>
  );
}
