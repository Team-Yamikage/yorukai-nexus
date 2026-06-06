-- Trigger-only functions: never called directly by clients.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.prevent_profile_privilege_escalation() FROM PUBLIC, anon, authenticated;

-- Role-check helpers are used inside RLS/SECURITY DEFINER contexts, not by clients.
-- RLS evaluation runs as the policy owner, so revoking client EXECUTE does not break policies.
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_moderator(uuid) FROM PUBLIC, anon, authenticated;