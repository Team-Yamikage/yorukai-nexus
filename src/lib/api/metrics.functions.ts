import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MetricInput = z.object({
  source: z.string().min(1).max(64),
  name: z.string().min(1).max(96),
  value: z.number().finite().optional(),
  labels: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

function logMetric(source: string, name: string, labels: Record<string, unknown>) {
  try {
    console.info(`[metric] ${source}.${name} ${JSON.stringify(labels)}`);
  } catch {
    /* metrics must never throw */
  }
}

export const recordAppMetric = createServerFn({ method: "POST" })
  .inputValidator((d) => MetricInput.parse(d))
  .handler(async ({ data }) => {
    logMetric(data.source, data.name, data.labels ?? {});
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("app_metrics" as never).insert({
        event_source: data.source,
        event_name: data.name,
        metric_value: data.value ?? 1,
        labels: data.labels ?? {},
      } as never);
    } catch (e) {
      console.warn("[metric] persist_failed", String(e));
    }
    return { ok: true };
  });
