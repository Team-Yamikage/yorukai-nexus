import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Admin-only report: lists every episode that has zero rows in video_servers,
 * so admins can quickly spot titles missing playable servers. Runs server-side
 * as the authenticated admin; a role check guards access.
 */
export const missingServersReportFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    // All episodes with their content title.
    const { data: episodes, error: epErr } = await context.supabase
      .from("episodes")
      .select("id, title, episode_number, content_id, content:content_id(id, title)")
      .order("episode_number", { ascending: true })
      .limit(5000);
    if (epErr) throw epErr;

    // Episode ids that DO have at least one server.
    const { data: servers, error: svErr } = await context.supabase
      .from("video_servers")
      .select("episode_id")
      .limit(20000);
    if (svErr) throw svErr;

    const withServers = new Set((servers ?? []).map((s) => s.episode_id));

    const missing = (episodes ?? [])
      .filter((e) => !withServers.has(e.id))
      .map((e) => ({
        id: e.id,
        title: e.title,
        episodeNumber: e.episode_number,
        contentId: e.content_id,
        // supabase returns the joined relation as an object or array depending on FK cardinality
        contentTitle:
          (Array.isArray(e.content) ? e.content[0]?.title : (e.content as { title?: string } | null)?.title) ??
          "Unknown",
      }));

    // Group by content for a readable report.
    const byContent = new Map<
      string,
      { contentId: string; contentTitle: string; episodes: typeof missing }
    >();
    for (const m of missing) {
      const key = m.contentId ?? "unknown";
      if (!byContent.has(key)) {
        byContent.set(key, { contentId: m.contentId, contentTitle: m.contentTitle, episodes: [] });
      }
      byContent.get(key)!.episodes.push(m);
    }

    return {
      totalEpisodes: episodes?.length ?? 0,
      missingCount: missing.length,
      groups: Array.from(byContent.values()).sort(
        (a, b) => b.episodes.length - a.episodes.length,
      ),
    };
  });

export const missingServersQuery = () =>
  queryOptions({
    queryKey: ["missing-servers-report"],
    queryFn: () => missingServersReportFn(),
    staleTime: 30_000,
  });
