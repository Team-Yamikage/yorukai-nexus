import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getPublicSupabase } from "../supabase";

export default defineTool({
  name: "search_content",
  title: "Search content",
  description:
    "Search the YORUKAI.TV catalog of anime, movies, and series by title. Returns matching titles with id, type, year, rating, and description.",
  inputSchema: {
    query: z.string().min(1).describe("Search text matched against titles."),
    limit: z.number().int().min(1).max(50).optional().describe("Max results (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, limit }) => {
    const sb = getPublicSupabase();
    const { data, error } = await sb
      .from("content")
      .select("id,title,type,status,rating,release_year,language,description")
      .ilike("title", `%${query}%`)
      .order("rating", { ascending: false, nullsFirst: false })
      .limit(limit ?? 10);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { results: data ?? [] },
    };
  },
});
