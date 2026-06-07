-- 1. banned_devices
CREATE TABLE public.banned_devices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_hash text NOT NULL,
  user_id uuid,
  reason text,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone
);
CREATE INDEX idx_banned_devices_device_hash ON public.banned_devices (device_hash);
CREATE INDEX idx_banned_devices_user_id ON public.banned_devices (user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.banned_devices TO authenticated;
GRANT ALL ON public.banned_devices TO service_role;

ALTER TABLE public.banned_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view bans" ON public.banned_devices
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert bans" ON public.banned_devices
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update bans" ON public.banned_devices
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete bans" ON public.banned_devices
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. endpoint_hits (ad-hoc rate limiting)
CREATE TABLE public.endpoint_hits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bucket_key text NOT NULL,
  window_start timestamp with time zone NOT NULL,
  count integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (bucket_key, window_start)
);
CREATE INDEX idx_endpoint_hits_window ON public.endpoint_hits (window_start);

GRANT ALL ON public.endpoint_hits TO service_role;

ALTER TABLE public.endpoint_hits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read endpoint hits" ON public.endpoint_hits
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. has_active_ban helper
CREATE OR REPLACE FUNCTION public.has_active_ban(_device_hash text, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.banned_devices
    WHERE (device_hash = _device_hash OR (_user_id IS NOT NULL AND user_id = _user_id))
      AND (expires_at IS NULL OR expires_at > now())
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_active_ban(text, uuid) FROM public, anon, authenticated;

-- 4. stream_tokens INSERT/UPDATE policies (were missing)
CREATE POLICY "Users can insert own stream tokens" ON public.stream_tokens
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own stream tokens" ON public.stream_tokens
  FOR UPDATE TO authenticated USING (user_id = auth.uid());