import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MetricInput = z.object({
  source: z.string().min(1).max(64),
  name: z.string().min(1).max(96),
  value: z.number().finite().optional(),
  labels: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

function logMetric(source: string, name: string, value: number, labels: Record<string, unknown>) {
  try {
    console.info(`[metric] ${source}.${name}=${value} ${JSON.stringify(labels)}`);
  } catch {
    /* metrics must never throw */
  }
}

/**
 * Lightweight telemetry endpoint. This deliberately does NOT write to the
 * database: an unauthenticated public endpoint must never be able to inject
 * arbitrary rows into app_metrics via the service-role key. Telemetry is
 * emitted to the server logs only, which is enough to confirm playback
 * retries / fallback decisions and that no episode gets stuck loading.
 */
export const recordAppMetric = createServerFn({ method: "POST" })
  .inputValidator((d) => MetricInput.parse(d))
  .handler(async ({ data }) => {
    logMetric(data.source, data.name, data.value ?? 1, data.labels ?? {});
    return { ok: true };
  });
