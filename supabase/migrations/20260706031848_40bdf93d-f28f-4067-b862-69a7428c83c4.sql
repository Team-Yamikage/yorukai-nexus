CREATE OR REPLACE FUNCTION public.episode_has_playable_servers(_episode_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.video_servers
    WHERE episode_id = _episode_id
      AND stream_url ~* '^https?://'
      AND stream_url !~* '\.(webp|jpg|jpeg|png|gif|svg)(\?|$)'
  )
$$;

REVOKE ALL ON FUNCTION public.episode_has_playable_servers(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.episode_has_playable_servers(uuid) TO anon, authenticated, service_role;

CREATE UNIQUE INDEX IF NOT EXISTS watch_parties_code_key ON public.watch_parties (code);

CREATE OR REPLACE FUNCTION public.create_watch_party(_episode_id uuid)
RETURNS public.watch_parties
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _content_id uuid;
  _code text;
  _party public.watch_parties;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT content_id INTO _content_id
  FROM public.episodes
  WHERE id = _episode_id;

  IF _content_id IS NULL THEN
    RAISE EXCEPTION 'episode not found';
  END IF;

  FOR i IN 1..8 LOOP
    _code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    BEGIN
      INSERT INTO public.watch_parties (host_id, content_id, episode_id, code, is_active)
      VALUES (auth.uid(), _content_id, _episode_id, _code, true)
      RETURNING * INTO _party;

      INSERT INTO public.watch_party_members (party_id, user_id, role)
      VALUES (_party.id, auth.uid(), 'host')
      ON CONFLICT DO NOTHING;

      RETURN _party;
    EXCEPTION WHEN unique_violation THEN
      -- Try another invite code.
    END;
  END LOOP;

  RAISE EXCEPTION 'could not create unique party code';
END;
$$;

REVOKE ALL ON FUNCTION public.create_watch_party(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_watch_party(uuid) TO authenticated, service_role;