import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getPublicSupabase } from "../supabase";

export default defineTool({
  name: "get_content_details",
  title: "Get content details",
  description:
    "Get full details for a single YORUKAI.TV title by its id, including its episode list (season, episode number, and title).",
  inputSchema: {
    id: z.string().min(1).describe("The content id returned by search_content."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }) => {
    const sb = getPublicSupabase();
    const { data: content, error } = await sb
      .from("content")
      .select(
        "id,title,type,status,rating,release_year,language,description,duration_minutes",
      )
      .eq("id", id)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!content)
      return { content: [{ type: "text", text: "No content found for that id." }], isError: true };

    const { data: episodes } = await sb
      .from("episodes")
      .select("id,season_number,episode_number,title")
      .eq("content_id", id)
      .order("season_number", { ascending: true })
      .order("episode_number", { ascending: true });

    const result = { ...content, episodes: episodes ?? [] };
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
      structuredContent: result,
    };
  },
});
