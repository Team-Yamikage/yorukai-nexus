import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getUserSupabase, requireMcpUser } from "../supabase";

function authError() {
  return { content: [{ type: "text" as const, text: "Connect your YORUKAI.TV account first." }], isError: true };
}

export const createWatchParty = defineTool({
  name: "create_watch_party",
  title: "Create watch party",
  description: "Create a signed-in user's live watch-party session for a selected episode.",
  inputSchema: {
    episodeId: z.string().uuid().describe("Episode id to watch together."),
  },
  annotations: { readOnlyHint: false, idempotentHint: false, openWorldHint: false },
  handler: async ({ episodeId }, ctx: ToolContext) => {
    const user = requireMcpUser(ctx);
    if (!user) return authError();
    const sb = getUserSupabase(ctx);
    const { data, error } = await sb.rpc("create_watch_party", { _episode_id: episodeId });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const result = { party: data, viewerUserId: user.userId };
    return { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result };
  },
});

export const joinWatchParty = defineTool({
  name: "join_watch_party",
  title: "Join watch party",
  description: "Join an active YORUKAI.TV watch-party session using its invite code.",
  inputSchema: {
    code: z.string().trim().min(4).max(16).describe("Watch-party invite code."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ code }, ctx: ToolContext) => {
    const user = requireMcpUser(ctx);
    if (!user) return authError();
    const sb = getUserSupabase(ctx);
    const { data, error } = await sb.rpc("join_watch_party_by_code", { _code: code });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const result = { party: data, viewerUserId: user.userId };
    return { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result };
  },
});

export const fetchWatchParty = defineTool({
  name: "fetch_watch_party",
  title: "Fetch watch party",
  description: "Fetch a signed-in user's accessible watch-party session, membership, and recent sync events.",
  inputSchema: {
    partyId: z.string().uuid().describe("Watch-party session id."),
    eventLimit: z.number().int().min(1).max(50).optional().describe("Max recent events (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ partyId, eventLimit }, ctx: ToolContext) => {
    const user = requireMcpUser(ctx);
    if (!user) return authError();
    const sb = getUserSupabase(ctx);
    const [party, members, events] = await Promise.all([
      sb.from("watch_parties").select("id,code,content_id,episode_id,host_id,is_active,created_at,updated_at").eq("id", partyId).maybeSingle(),
      sb.from("watch_party_members").select("user_id,role,joined_at").eq("party_id", partyId),
      sb
        .from("watch_party_events")
        .select("event_type,event_payload,user_id,created_at")
        .eq("party_id", partyId)
        .order("created_at", { ascending: false })
        .limit(eventLimit ?? 20),
    ]);

    if (party.error) return { content: [{ type: "text", text: party.error.message }], isError: true };
    if (!party.data) return { content: [{ type: "text", text: "Watch party not found or not accessible." }], isError: true };
    if (members.error) return { content: [{ type: "text", text: members.error.message }], isError: true };
    if (events.error) return { content: [{ type: "text", text: events.error.message }], isError: true };

    const result = {
      party: party.data,
      viewerUserId: user.userId,
      visibleMembers: members.data ?? [],
      recentEvents: (events.data ?? []).reverse(),
    };
    return { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result };
  },
});