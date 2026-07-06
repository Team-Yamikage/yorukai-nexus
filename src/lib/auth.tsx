import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Profile = {
  is_premium: boolean;
  display_name?: string | null;
  avatar_url?: string | null;
} | null;

function googleProfile(user: User | null) {
  const meta = (user?.user_metadata ?? {}) as Record<string, string | undefined>;
  return {
    name: meta.full_name || meta.name || meta.display_name || user?.email?.split("@")[0] || null,
    avatar: meta.avatar_url || meta.picture || null,
  };
}

type Ctx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  profile: Profile;
  signOut: () => Promise<void>;
};

const AuthCtx = createContext<Ctx>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  isPremium: false,
  profile: null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<Profile>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setAuthLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Resolve profile + admin role whenever the user changes. Ads wait for this
  // state so premium users never see a flash of ad scripts while auth hydrates.
  useEffect(() => {
    const uid = session?.user?.id;
    if (!uid) {
      setIsAdmin(false);
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    let active = true;
    setProfileLoading(true);

    Promise.all([
      supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("is_premium,display_name,avatar_url")
        .eq("user_id", uid)
        .maybeSingle(),
    ])
      .then(([roleRes, profileRes]) => {
        if (!active) return;
        setIsAdmin(!!roleRes.data);
        const nextProfile = (profileRes.data as Profile) ?? null;
        setProfile(nextProfile);
        const google = googleProfile(session.user);
        if (
          nextProfile &&
          ((google.name && nextProfile.display_name !== google.name) ||
            (google.avatar && nextProfile.avatar_url !== google.avatar))
        ) {
          supabase
            .from("profiles")
            .update({ display_name: google.name, avatar_url: google.avatar } as never)
            .eq("user_id", uid)
            .then(() => {});
          setProfile({ ...nextProfile, display_name: google.name, avatar_url: google.avatar });
        }
      })
      .finally(() => {
        if (active) setProfileLoading(false);
      });

    return () => {
      active = false;
    };
  }, [session?.user?.id]);

  const loading = authLoading || profileLoading;

  return (
    <AuthCtx.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        isAdmin,
        isPremium: !!profile?.is_premium,
        profile,
        signOut: async () => {
          await supabase.auth.signOut();
        },
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
