REVOKE EXECUTE ON FUNCTION public.get_episode_servers(uuid) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_episode_servers(uuid) TO service_role;