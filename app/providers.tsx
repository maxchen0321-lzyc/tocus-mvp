"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase";
import { hasSupabaseConfig } from "@/lib/env";
import { getAnonymousId } from "@/lib/identity";

type AuthContextValue = {
  user: User | null;
  anonymousId: string;
  isLoading: boolean;
  authReady: boolean;
  authError: string | null;
  isAnonymous: boolean;
  supabaseHost: string | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [anonymousId, setAnonymousId] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [supabaseHost, setSupabaseHost] = useState<string | null>(null);

  useEffect(() => {
    setAnonymousId(getAnonymousId());
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (url) {
      try {
        setSupabaseHost(new URL(url).host);
      } catch {
        setSupabaseHost(null);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    if (!hasSupabaseConfig) {
      setUser(null);
      setIsLoading(false);
      setAuthReady(true);
      setAuthError("missing_supabase_keys");
      return () => {
        active = false;
      };
    }
    supabaseBrowser.auth.getUser().then(async ({ data, error }) => {
      if (!active) return;
      if (error) {
        setAuthError(error.message);
      }
      if (!data.user) {
        const { data: anonData, error: anonError } =
          await supabaseBrowser.auth.signInAnonymously();
        if (anonError) {
          setAuthError(anonError.message);
        }
        setUser(anonData?.user ?? null);
        setAuthReady(true);
        setIsLoading(false);
        return;
      }
      setUser(data.user ?? null);
      setIsLoading(false);
      setAuthReady(true);
    });
    const { data: listener } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setIsLoading(false);
      setAuthReady(true);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    if (!hasSupabaseConfig) return;
    await supabaseBrowser.auth.signOut();
  };

  const isAnonymous = Boolean(user && (user.is_anonymous || !user.email));

  const value = useMemo(
    () => ({
      user,
      anonymousId,
      isLoading,
      authReady,
      authError,
      isAnonymous,
      supabaseHost,
      signOut
    }),
    [user, anonymousId, isLoading, authReady, authError, isAnonymous, supabaseHost]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function isPermanentUser(user: User | null): user is User {
  return Boolean(user && user.email && !user.is_anonymous);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
