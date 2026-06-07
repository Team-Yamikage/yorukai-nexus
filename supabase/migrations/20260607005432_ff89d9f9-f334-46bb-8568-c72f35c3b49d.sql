CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Admins may set any values.
  IF has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    -- New non-admin profiles always start with safe defaults.
    NEW.is_premium := false;
    NEW.xp := COALESCE(NEW.xp, 0);
    IF NEW.xp <> 0 THEN NEW.xp := 0; END IF;
    NEW.level := 1;
    RETURN NEW;
  END IF;

  -- UPDATE: preserve the protected columns from the existing row.
  IF NEW.is_premium IS DISTINCT FROM OLD.is_premium THEN
    NEW.is_premium := OLD.is_premium;
  END IF;
  IF NEW.xp IS DISTINCT FROM OLD.xp THEN
    NEW.xp := OLD.xp;
  END IF;
  IF NEW.level IS DISTINCT FROM OLD.level THEN
    NEW.level := OLD.level;
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS prevent_profile_privilege_escalation_trg ON public.profiles;
CREATE TRIGGER prevent_profile_privilege_escalation_trg
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_profile_privilege_escalation();