import { useEffect, type ReactNode } from "react";
import { GlassNavbar } from "./GlassNavbar";
import { FloatingSidebar } from "./FloatingSidebar";

export function AppShell({ children }: { children: ReactNode }) {
  // Apply the saved "reduce motion" preference on every page load.
  useEffect(() => {
    const reduce = localStorage.getItem("yk_pref_reducemotion") === "on";
    document.documentElement.classList.toggle("yk-reduce-motion", reduce);
  }, []);

  return (
    <div className="senpai-root senpai-scrollbar relative">
      {/* Atmospheric layers */}
      <div className="pointer-events-none fixed inset-0 -z-10 senpai-bg-grid" />
      <div className="pointer-events-none fixed -top-40 left-1/2 -z-10 h-[60vh] w-[120vw] -translate-x-1/2 senpai-aurora" />
      <GlassNavbar />
      <FloatingSidebar />
      <main className="relative lg:pl-20">{children}</main>
      <footer className="relative mt-32 border-t border-senpai-border px-6 py-10 text-center text-xs uppercase tracking-[0.3em] text-senpai-text-muted">
        <span className="font-[var(--font-jp)]">夜界</span> · YORUKAI.TV · stream beyond
      </footer>
    </div>
  );
}
