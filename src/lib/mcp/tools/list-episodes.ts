import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getPublicSupabase } from "../supabase";

export default defineTool({
  name: "list_episodes",
  title: "List episodes",
  description:
    "List episodes for a YORUKAI.TV title and include whether each episode currently has playable video servers.",
  inputSchema: {
    contentId: z.string().uuid().describe("The title/content id."),
    limit: z.number().int().min(1).max(300).optional().describe("Max episodes (default 200)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ contentId, limit }) => {
    const sb = getPublicSupabase();
    const { data: episodes, error } = await sb
      .from("episodes")
      .select("id,content_id,season_number,episode_number,title,thumbnail_url,duration_seconds,description")
      .eq("content_id", contentId)
      .order("season_number", { ascending: true })
      .order("episode_number", { ascending: true })
      .limit(limit ?? 200);

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const rows = await Promise.all(
      (episodes ?? []).map(async (episode) => {
        const { data: hasPlayableVideoServers } = await sb.rpc("episode_has_playable_servers", {
          _episode_id: episode.id,
        });
        return { ...episode, hasPlayableVideoServers: hasPlayableVideoServers === true };
      }),
    );

    return {
      content: [{ type: "text", text: JSON.stringify(rows) }],
      structuredContent: { episodes: rows },
    };
  },
});