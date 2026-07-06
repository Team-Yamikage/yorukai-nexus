import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getUserEntitlements, getUserSupabase, requireMcpUser } from "../supabase";

function authError() {
  return { content: [{ type: "text" as const, text: "Connect your YORUKAI.TV account first." }], isError: true };
}

function premiumError() {
  return { content: [{ type: "text" as const, text: "This action requires premium playback entitlement." }], isError: true };
}

export const getContinueWatching = defineTool({
  name: "get_continue_watching",
  title: "Get continue watching",
  description: "Fetch the signed-in user's continue-watching list with playback entitlement status.",
  inputSchema: {
    limit: z.number().int().min(1).max(50).optional().describe("Max items (default 20)."),
    requirePremium: z.boolean().optional().describe("When true, return an error unless the user is premium."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, requirePremium }, ctx: ToolContext) => {
    const user = requireMcpUser(ctx);
    if (!user) return authError();
    const sb = getUserSupabase(ctx);
    const entitlements = await getUserEntitlements(ctx);
    if (requirePremium && !entitlements.isPremium) return premiumError();

    const { data: history, error } = await sb
      .from("watch_history")
      .select("episode_id,progress_seconds,total_seconds,completed,last_watched_at")
      .order("last_watched_at", { ascending: false })
      .limit(limit ?? 20);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const episodeIds = (history ?? []).map((h) => h.episode_id);
    const { data: episodes } = episodeIds.length
      ? await sb.from("episodes").select("id,content_id,season_number,episode_number,title,thumbnail_url,duration_seconds").in("id", episodeIds)
      : { data: [] };
    const contentIds = Array.from(new Set((episodes ?? []).map((episode) => episode.content_id)));
    const { data: content } = contentIds.length
      ? await sb.from("content").select("id,title,type,poster_url,banner_url,language").in("id", contentIds)
      : { data: [] };

    const episodeMap = new Map((episodes ?? []).map((episode) => [episode.id, episode]));
    const contentMap = new Map((content ?? []).map((item) => [item.id, item]));
    const items = (history ?? []).map((row) => {
      const episode = episodeMap.get(row.episode_id) ?? null;
      return {
        ...row,
        episode,
        content: episode ? contentMap.get(episode.content_id) ?? null : null,
      };
    });

    const result = { entitlements, items };
    return { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result };
  },
});

export const getFavorites = defineTool({
  name: "get_favorites",
  title: "Get favorites",
  description: "Fetch the signed-in user's favorite/watchlist titles with playback entitlement status.",
  inputSchema: {
    limit: z.number().int().min(1).max(100).optional().describe("Max titles (default 50)."),
    requirePremium: z.boolean().optional().describe("When true, return an error unless the user is premium."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, requirePremium }, ctx: ToolContext) => {
    const user = requireMcpUser(ctx);
    if (!user) return authError();
    const sb = getUserSupabase(ctx);
    const entitlements = await getUserEntitlements(ctx);
    if (requirePremium && !entitlements.isPremium) return premiumError();

    const { data: watchlist, error } = await sb
      .from("watchlist")
      .select("content_id,created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 50);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const ids = (watchlist ?? []).map((row) => row.content_id);
    const { data: titles } = ids.length
      ? await sb.from("content").select("id,title,type,status,rating,release_year,poster_url,banner_url,language,description").in("id", ids)
      : { data: [] };
    const titleMap = new Map((titles ?? []).map((title) => [title.id, title]));
    const items = (watchlist ?? []).map((row) => ({ ...row, title: titleMap.get(row.content_id) ?? null }));

    const result = { entitlements, items };
    return { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result };
  },
});