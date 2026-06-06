-- 1. Attach the existing privilege-escalation guard trigger to profiles.
--    The function existed but was never wired up, so users could self-grant premium.
DROP TRIGGER IF EXISTS prevent_profile_privilege_escalation ON public.profiles;
CREATE TRIGGER prevent_profile_privilege_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_profile_privilege_escalation();

-- 2. Allow users to revoke (delete) their own stream tokens. INSERT stays service-role only.
DROP POLICY IF EXISTS "Users can delete own stream tokens" ON public.stream_tokens;
CREATE POLICY "Users can delete own stream tokens"
  ON public.stream_tokens FOR DELETE
  USING (user_id = auth.uid());

-- 3. Restrict watch party visibility to the host (join codes were readable by everyone).
DROP POLICY IF EXISTS "Authenticated can view parties" ON public.watch_parties;
CREATE POLICY "Host can view their party"
  ON public.watch_parties FOR SELECT
  TO authenticated
  USING (host_id = auth.uid());

-- 4. Restrict watch party messages to messages in parties the user hosts.
DROP POLICY IF EXISTS "Authenticated can read party messages" ON public.watch_party_messages;
CREATE POLICY "Read messages in own party"
  ON public.watch_party_messages FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.watch_parties wp
      WHERE wp.id = watch_party_messages.party_id
        AND wp.host_id = auth.uid()
    )
  );