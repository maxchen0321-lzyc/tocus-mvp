"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase";
import { hasSupabaseConfig } from "@/lib/env";
import { getAnonymousId } from "@/lib/identity";
import { mergeCollections } from "@/lib/db";

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
  const [mergedForUser, setMergedForUser] = useState<string | null>(null);

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
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });
    const { data: listener } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setIsLoading(false);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user?.id || anonymousId === "pending") return;
    if (mergedForUser === user.id) return;
    mergeCollections(anonymousId, user.id).then(() => {
      setMergedForUser(user.id);
    });
  }, [user?.id, anonymousId, mergedForUser]);

  const signOut = async () => {
    if (!hasSupabaseConfig) return;
    await supabaseBrowser.auth.signOut();
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
