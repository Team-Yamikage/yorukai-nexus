CREATE TABLE IF NOT EXISTS public.app_metrics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_source text NOT NULL,
  event_name text NOT NULL,
  metric_value numeric NOT NULL DEFAULT 1,
  labels jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.app_metrics TO authenticated;
GRANT ALL ON public.app_metrics TO service_role;

ALTER TABLE public.app_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read app metrics" ON public.app_metrics;
CREATE POLICY "Admins can read app metrics"
  ON public.app_metrics
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_app_metrics_source_name_created
  ON public.app_metrics (event_source, event_name, created_at DESC);