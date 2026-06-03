-- Allow authenticated (and anon for SSR/role checks) to execute the role helpers
-- used inside RLS policies and the client admin check. Missing EXECUTE caused
-- "permission denied for function has_role" (42501).
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_moderator(uuid) TO authenticated, anon;

-- Ensure ssv01@duck.com is a super admin (idempotent — no duplicate key error).
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE u.email = 'ssv01@duck.com'
ON CONFLICT (user_id, role) DO NOTHING;