-- Revoke direct browser access to the episode-servers RPC so the only path to
-- stream URLs is the guarded server function (ban + rate-limit checks). The
-- guarded path uses the service-role client, which bypasses these grants.
REVOKE EXECUTE ON FUNCTION public.get_episode_servers(uuid) FROM anon, authenticated, public;

-- The admin-only privileged functions must never be callable by anonymous
-- visitors; only signed-in users (who are then re-checked with has_role admin
-- inside the function body) may call them.
REVOKE EXECUTE ON FUNCTION public.admin_set_premium(uuid, boolean) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_set_role(uuid, app_role, boolean) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_list_users() FROM anon, public;