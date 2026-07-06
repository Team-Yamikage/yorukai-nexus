CREATE OR REPLACE FUNCTION public.join_watch_party_by_code(_code text)
RETURNS public.watch_parties
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _party public.watch_parties;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT * INTO _party
  FROM public.watch_parties
  WHERE code = upper(trim(_code))
    AND is_active = true
  LIMIT 1;

  IF _party.id IS NULL THEN
    RAISE EXCEPTION 'watch party not found';
  END IF;

  INSERT INTO public.watch_party_members (party_id, user_id, role)
  VALUES (_party.id, auth.uid(), 'viewer')
  ON CONFLICT DO NOTHING;

  RETURN _party;
END;
$$;

REVOKE ALL ON FUNCTION public.join_watch_party_by_code(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.join_watch_party_by_code(text) TO authenticated, service_role;