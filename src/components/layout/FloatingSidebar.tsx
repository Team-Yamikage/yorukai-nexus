import { Link, useRouterState } from "@tanstack/react-router";
import { Library, Tags, Bookmark, UserCircle2, Settings, Shield } from "lucide-react";

const ITEMS = [
  { to: "/library", label: "Library", icon: Library },
  { to: "/genres", label: "Genres", icon: Tags },
  { to: "/library", label: "Watchlist", icon: Bookmark, hash: "watchlist" },
  { to: "/profile", label: "Profile", icon: UserCircle2 },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/admin", label: "Admin", icon: Shield, accent: true },
] as const;

export function FloatingSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="pointer-events-none fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <div className="senpai-glass senpai-glass-strong pointer-events-auto flex flex-col items-center gap-1 rounded-2xl p-2">
        {ITEMS.map((item) => {
          const active = path === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`group relative grid h-11 w-11 place-items-center rounded-xl transition-all ${
                active
                  ? "bg-gradient-to-br from-senpai-violet to-senpai-violet-2 text-white shadow-[0_0_20px_-4px_var(--senpai-violet)]"
                  : item.accent
                  ? "text-senpai-amber hover:bg-senpai-amber/10"
                  : "text-senpai-text-dim hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-senpai-bg-3 px-2 py-1 text-[11px] font-medium uppercase tracking-wider opacity-0 ring-1 ring-senpai-border-strong transition-opacity group-hover:opacity-100">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
