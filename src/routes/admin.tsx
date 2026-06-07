import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { AdminBansPanel } from "@/components/admin/AdminBansPanel";
import { useAuth } from "@/lib/auth";
import { Loader2, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — YORUKAI.TV" }] }),
  component: AdminGate,
});

function AdminGate() {
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
              This control center is available to administrators only.
            </p>
            <Link to="/" className="senpai-glass mt-6 inline-block rounded-full px-5 py-2 text-sm hover:bg-white/10">
              Back to home
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 sm:px-8 pt-10 pb-32">
        <div className="mb-10">
          <div className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-senpai-text-muted">こんにちは admin</div>
          <h1 className="senpai-mega mt-2 text-5xl sm:text-6xl senpai-grad-text-fire">CONTROL CENTER</h1>
          <p className="mt-3 max-w-2xl text-sm text-senpai-text-dim">
            Moderation tools for the platform. Ban abusive devices or accounts and manage active restrictions.
          </p>
        </div>
        <AdminBansPanel />
      </div>
    </AppShell>
  );
}
