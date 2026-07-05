import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getPublicSupabase } from "../supabase";

export default defineTool({
  name: "list_genres",
  title: "List genres",
  description: "List the content genres available on YORUKAI.TV.",
  inputSchema: {
    limit: z.number().int().min(1).max(100).optional().describe("Max genres (default 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }) => {
    const sb = getPublicSupabase();
    const { data, error } = await sb
      .from("genres")
      .select("id,name,slug")
      .order("name")
      .limit(limit ?? 50);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { genres: data ?? [] },
    };
  },
});
