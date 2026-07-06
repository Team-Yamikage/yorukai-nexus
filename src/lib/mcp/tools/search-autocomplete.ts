import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getPublicSupabase } from "../supabase";

export default defineTool({
  name: "search_autocomplete",
  title: "Search autocomplete",
  description:
    "Return relevant YORUKAI.TV title and genre suggestions for an in-progress search query.",
  inputSchema: {
    query: z.string().trim().min(1).describe("Partial text typed by the user."),
    limit: z.number().int().min(1).max(20).optional().describe("Max suggestions per group (default 8)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, limit }) => {
    const sb = getPublicSupabase();
    const max = limit ?? 8;
    const [titles, genres] = await Promise.all([
      sb
        .from("content")
        .select("id,title,type,release_year,poster_url")
        .ilike("title", `%${query}%`)
        .order("rating", { ascending: false, nullsFirst: false })
        .limit(max),
      sb
        .from("genres")
        .select("id,name,slug")
        .ilike("name", `%${query}%`)
        .order("name", { ascending: true })
        .limit(max),
    ]);

    if (titles.error) return { content: [{ type: "text", text: titles.error.message }], isError: true };
    if (genres.error) return { content: [{ type: "text", text: genres.error.message }], isError: true };

    const result = { titles: titles.data ?? [], genres: genres.data ?? [] };
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
      structuredContent: result,
    };
  },
});