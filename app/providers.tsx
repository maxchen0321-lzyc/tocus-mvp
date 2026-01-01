"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabaseClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/env";
import { getAnonymousId } from "@/lib/identity";

type AuthContextValue = {
  user: User | null;
  anonymousId: string;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [anonymousId, setAnonymousId] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAnonymousId(getAnonymousId());
  }, []);

  useEffect(() => {
    let active = true;
    if (!hasSupabaseConfig) {
      setUser(null);
      setIsLoading(false);
      return () => {
        active = false;
      };
    }
    supabaseClient.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });
    const { data: listener } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setIsLoading(false);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    if (!hasSupabaseConfig) return;
    await supabaseClient.auth.signOut();
  };

  const value = useMemo(
    () => ({ user, anonymousId, isLoading, signOut }),
    [user, anonymousId, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
