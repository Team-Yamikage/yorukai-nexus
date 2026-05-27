import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function StubPage({
  kicker, title, copy, gradient = "violet",
}: {
  kicker: string;
  title: string;
  copy: string;
  gradient?: "violet" | "fire" | "cyber";
}) {
  const grad =
    gradient === "fire" ? "senpai-grad-text-fire" : gradient === "cyber" ? "senpai-grad-text-cyber" : "senpai-grad-text";
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-8 pt-16 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="senpai-sticker"><Sparkles className="h-3 w-3" /> {kicker}</span>
        <h1 className={`senpai-mega mt-4 text-[14vw] sm:text-7xl md:text-8xl ${grad}`}>{title}</h1>
        <p className="mt-6 max-w-xl text-senpai-text-dim">{copy}</p>

        <div className="senpai-glass senpai-glass-strong mt-12 rounded-2xl p-8">
          <div className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-senpai-text-muted">Coming online</div>
          <p className="mt-3 text-sm text-senpai-text-dim">
            This deck is wired into your Supabase schema. The full UI for this surface ships in the next pass —
            cinematic, animated, AAA. In the meantime, jump back to the{" "}
            <Link to="/" className="text-senpai-teal underline-offset-4 hover:underline">home grid</Link>.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
