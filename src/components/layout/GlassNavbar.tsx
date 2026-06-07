import { Link, useRouterState } from "@tanstack/react-router";
import { Search, Bell, User } from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/browse", label: "Browse" },
  { to: "/live-tv", label: "Live TV" },
  { to: "/manga", label: "Manga" },
] as const;

export function GlassNavbar() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav className="senpai-glass senpai-glass-strong mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl px-4 py-2.5 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <div className="absolute inset-0 rounded-md bg-gradient-to-br from-senpai-violet via-senpai-fuchsia to-senpai-teal blur-md opacity-70" />
            <div className="relative grid h-full w-full place-items-center rounded-md bg-senpai-bg-3 font-[var(--font-mega)] text-xs text-white">夜</div>
          </div>
          <div className="hidden sm:block leading-none">
            <div className="font-[var(--font-display)] text-lg tracking-wider">YORUKAI<span className="text-senpai-fuchsia">.</span>TV</div>
            <div className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-senpai-text-muted">stream beyond</div>
          </div>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    active ? "text-white" : "text-senpai-text-dim hover:text-white"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-senpai-violet/30 to-senpai-fuchsia/30 ring-1 ring-senpai-violet/50" />
                  )}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            to="/search"
            className="senpai-glass group flex items-center gap-2 rounded-full px-3 py-2 text-sm text-senpai-text-muted transition-all hover:text-white hover:ring-1 hover:ring-senpai-violet/60"
          >
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline text-xs uppercase tracking-widest">Search</span>
          </Link>
          <button className="senpai-glass relative grid h-9 w-9 place-items-center rounded-full text-senpai-text-dim hover:text-white">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-senpai-fuchsia shadow-[0_0_8px_var(--senpai-fuchsia)]" />
          </button>
          <Link
            to="/auth"
            className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-senpai-violet to-senpai-violet-2 text-white shadow-[0_8px_24px_-8px_var(--senpai-violet)]"
          >
            <User className="h-4 w-4" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
