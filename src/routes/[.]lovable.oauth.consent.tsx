import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type OAuthDetails = {
  client?: { name?: string } | null;
  redirect_url?: string;
  redirect_to?: string;
};

type OAuthDecision = { redirect_url?: string; redirect_to?: string };

type SupabaseOAuth = {
  getAuthorizationDetails: (authorizationId: string) => Promise<{ data: OAuthDetails | null; error: Error | null }>;
  approveAuthorization: (authorizationId: string) => Promise<{ data: OAuthDecision | null; error: Error | null }>;
  denyAuthorization: (authorizationId: string) => Promise<{ data: OAuthDecision | null; error: Error | null }>;
};

function oauthApi(): SupabaseOAuth {
  const oauth = (supabase.auth as unknown as { oauth?: SupabaseOAuth }).oauth;
  if (!oauth) throw new Error("Supabase OAuth server is not available yet.");
  return oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    authorization_id: typeof search.authorization_id === "string" ? search.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    const next = location.pathname + location.searchStr;
    if (!data.session) throw redirect({ to: "/auth", search: { next } });
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauthApi().getAuthorizationDetails(authorizationId);
    if (error) throw error;
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="grid min-h-dvh place-items-center bg-senpai-bg p-6 text-white">
      <section className="senpai-glass max-w-lg rounded-2xl p-6 text-center">
        <h1 className="senpai-mega text-3xl senpai-grad-text-fire">Connection failed</h1>
        <p className="mt-3 text-sm text-senpai-text-dim">{String((error as Error)?.message ?? error)}</p>
      </section>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientName = details?.client?.name ?? "this app";

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauthApi().approveAuthorization(authorization_id)
      : await oauthApi().denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-senpai-bg p-6 text-white">
      <section className="senpai-glass senpai-glass-strong max-w-xl rounded-2xl p-7 text-center">
        <div className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.35em] text-senpai-text-muted">Agent integration</div>
        <h1 className="senpai-mega mt-3 text-4xl senpai-grad-text">Connect {clientName}</h1>
        <p className="mt-4 text-sm text-senpai-text-dim">
          This lets {clientName} use YORUKAI.TV tools with your signed-in account.
        </p>
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
        <div className="mt-7 flex justify-center gap-3">
          <button disabled={busy} onClick={() => decide(false)} className="senpai-glass rounded-full px-5 py-2.5 text-sm hover:bg-white/10 disabled:opacity-60">Deny</button>
          <button disabled={busy} onClick={() => decide(true)} className="rounded-full bg-gradient-to-r from-senpai-violet to-senpai-fuchsia px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60">Approve</button>
        </div>
      </section>
    </main>
  );
}