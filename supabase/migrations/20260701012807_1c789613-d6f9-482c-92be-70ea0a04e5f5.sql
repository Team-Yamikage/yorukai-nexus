CREATE TABLE IF NOT EXISTS public.watch_party_members (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  party_id uuid NOT NULL REFERENCES public.watch_parties(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member',
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (party_id, user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.watch_party_members TO authenticated;
GRANT ALL ON public.watch_party_members TO service_role;

ALTER TABLE public.watch_party_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.can_access_watch_party(_party_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.watch_parties wp
    WHERE wp.id = _party_id
      AND wp.is_active = true
      AND wp.host_id = _user_id
  )
  OR EXISTS (
    SELECT 1
    FROM public.watch_party_members wpm
    WHERE wpm.party_id = _party_id
      AND wpm.user_id = _user_id
  )
$$;

REVOKE EXECUTE ON FUNCTION public.can_access_watch_party(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.can_access_watch_party(uuid, uuid) TO authenticated, service_role;

DROP POLICY IF EXISTS "Members can view party memberships" ON public.watch_party_members;
CREATE POLICY "Members can view party memberships"
  ON public.watch_party_members
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.watch_parties wp
      WHERE wp.id = watch_party_members.party_id
        AND wp.host_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can join active parties" ON public.watch_party_members;
CREATE POLICY "Users can join active parties"
  ON public.watch_party_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.watch_parties wp
      WHERE wp.id = party_id
        AND wp.is_active = true
    )
  );

DROP POLICY IF EXISTS "Hosts can manage party memberships" ON public.watch_party_members;
CREATE POLICY "Hosts can manage party memberships"
  ON public.watch_party_members
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.watch_parties wp
      WHERE wp.id = watch_party_members.party_id
        AND wp.host_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.watch_parties wp
      WHERE wp.id = watch_party_members.party_id
        AND wp.host_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Members can leave parties" ON public.watch_party_members;
CREATE POLICY "Members can leave parties"
  ON public.watch_party_members
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.watch_parties wp
      WHERE wp.id = watch_party_members.party_id
        AND wp.host_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Host can view their party" ON public.watch_parties;
DROP POLICY IF EXISTS "Authorized users can view parties" ON public.watch_parties;
CREATE POLICY "Authorized users can view parties"
  ON public.watch_parties
  FOR SELECT
  TO authenticated
  USING (public.can_access_watch_party(id, auth.uid()));

DROP POLICY IF EXISTS "Host can update their party" ON public.watch_parties;
DROP POLICY IF EXISTS "Hosts can update their parties" ON public.watch_parties;
CREATE POLICY "Hosts can update their parties"
  ON public.watch_parties
  FOR UPDATE
  TO authenticated
  USING (host_id = auth.uid())
  WITH CHECK (host_id = auth.uid());

DROP POLICY IF EXISTS "Read messages in own party" ON public.watch_party_messages;
DROP POLICY IF EXISTS "Authorized users can read party messages" ON public.watch_party_messages;
CREATE POLICY "Authorized users can read party messages"
  ON public.watch_party_messages
  FOR SELECT
  TO authenticated
  USING (public.can_access_watch_party(party_id, auth.uid()));

DROP POLICY IF EXISTS "Authenticated send messages as self" ON public.watch_party_messages;
DROP POLICY IF EXISTS "Authorized users can send party messages" ON public.watch_party_messages;
CREATE POLICY "Authorized users can send party messages"
  ON public.watch_party_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND public.can_access_watch_party(party_id, auth.uid())
  );

CREATE TABLE IF NOT EXISTS public.watch_party_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  party_id uuid NOT NULL REFERENCES public.watch_parties(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  event_type text NOT NULL,
  event_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.watch_party_events TO authenticated;
GRANT ALL ON public.watch_party_events TO service_role;

ALTER TABLE public.watch_party_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authorized users can read party events" ON public.watch_party_events;
CREATE POLICY "Authorized users can read party events"
  ON public.watch_party_events
  FOR SELECT
  TO authenticated
  USING (public.can_access_watch_party(party_id, auth.uid()));

DROP POLICY IF EXISTS "Authorized users can send party events" ON public.watch_party_events;
CREATE POLICY "Authorized users can send party events"
  ON public.watch_party_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND public.can_access_watch_party(party_id, auth.uid())
    AND event_type IN ('play', 'pause', 'seek', 'sync', 'heartbeat')
  );

DROP POLICY IF EXISTS "Hosts can delete party events" ON public.watch_party_events;
CREATE POLICY "Hosts can delete party events"
  ON public.watch_party_events
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.watch_parties wp
      WHERE wp.id = watch_party_events.party_id
        AND wp.host_id = auth.uid()
    )
  );

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.watch_party_messages;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.watch_party_events;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;