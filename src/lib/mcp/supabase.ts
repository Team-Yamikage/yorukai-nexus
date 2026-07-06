import { createClient } from "@supabase/supabase-js";
import type { ToolContext } from "@lovable.dev/mcp-js";
import type { Database } from "@/integrations/supabase/types";

function getSupabaseEnv() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env not configured");
  return { url, key };
}

/**
 * Server publishable Supabase client for MCP tools. Read-only public data only,
 * protected by the tables' anon SELECT policies. Created lazily inside handlers
 * so no env is read at module load (import-safe for build/cold-start).
 */
export function getPublicSupabase() {
  const { url, key } = getSupabaseEnv();
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function requireMcpUser(ctx: ToolContext): { userId: string; email?: string } | null {
  const userId = ctx.getUserId();
  const token = ctx.getToken();
  if (!ctx.isAuthenticated() || !userId || !token) return null;
  return { userId, email: ctx.getUserEmail() };
}

export function getUserSupabase(ctx: ToolContext) {
  const token = ctx.getToken();
  if (!token) throw new Error("Not authenticated");
  const { url, key } = getSupabaseEnv();
  return createClient<Database>(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getUserEntitlements(ctx: ToolContext) {
  const user = requireMcpUser(ctx);
  if (!user) return { isAuthenticated: false, isPremium: false, adFreePlayback: false, canPlay: false };
  const sb = getUserSupabase(ctx);
  const { data } = await sb
    .from("profiles")
    .select("is_premium")
    .eq("user_id", user.userId)
    .maybeSingle();
  const isPremium = data?.is_premium === true;
  return {
    isAuthenticated: true,
    isPremium,
    adFreePlayback: isPremium,
    canPlay: true,
  };
}
