CREATE OR REPLACE FUNCTION public.get_episode_servers(_episode_id uuid)
 RETURNS TABLE(id uuid, episode_id uuid, server_name text, quality text, language text, embed_url text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT
    id,
    episode_id,
    server_name,
    quality,
    language,
    stream_url AS embed_url
  FROM public.video_servers
  WHERE episode_id = _episode_id
    -- Exclude poster/image rows that are not actually playable video
    AND stream_url !~* '\.(webp|jpg|jpeg|png|gif|svg)(\?|$)'
    AND stream_url ~* '^https?://'
$function$;

GRANT EXECUTE ON FUNCTION public.get_episode_servers(uuid) TO anon, authenticated;