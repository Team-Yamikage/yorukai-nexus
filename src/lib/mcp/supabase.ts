import { createClient } from "@supabase/supabase-js";

/**
 * Server publishable Supabase client for MCP tools. Read-only public data only,
 * protected by the tables' anon SELECT policies. Created lazily inside handlers
 * so no env is read at module load (import-safe for build/cold-start).
 */
export function getPublicSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase env not configured");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
