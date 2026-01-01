"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/app/providers";
import { hasSupabaseConfig } from "@/lib/env";
import { trackEvent } from "@/lib/events";

type Props = {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSignOut: () => Promise<void>;
};

export default function AuthModal({ open, onClose, user, onSignOut }: Props) {
  const { anonymousId } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleLogin = async () => {
    if (!hasSupabaseConfig) {
      setError("請先在 .env.local 設定 Supabase keys");
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    if (anonymousId !== "pending") {
      await trackEvent("auth_login", {
        userId: data.user?.id ?? null,
        anonymousId,
        metadata: { method: "password" }
      });
    }
    onClose();
  };

  const handleSignUp = async () => {
    if (!hasSupabaseConfig) {
      setError("請先在 .env.local 設定 Supabase keys");
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: signUpError } = await supabaseClient.auth.signUp({
      email,
      password
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (anonymousId !== "pending") {
      await trackEvent("auth_sign_up", {
        userId: data.user?.id ?? null,
        anonymousId,
        metadata: { method: "password" }
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="glass w-full max-w-sm rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">帳號</h2>
          <button className="text-sm text-white/60" onClick={onClose}>
            關閉
          </button>
        </div>
        {user ? (
          <div className="mt-4 space-y-3 text-sm">
            <p>已登入：{user.email}</p>
            <button
              className="w-full rounded-xl bg-white/10 px-4 py-2"
              onClick={onSignOut}
            >
              登出
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-3 text-sm">
            <label className="block space-y-1">
              <span className="text-xs text-white/60">Email</span>
              <input
                className="w-full rounded-xl bg-white/10 px-3 py-2"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-white/60">Password</span>
              <input
                type="password"
                className="w-full rounded-xl bg-white/10 px-3 py-2"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {error ? <p className="text-xs text-red-300">{error}</p> : null}
            <div className="flex gap-2">
              <button
                className="flex-1 rounded-xl bg-white/10 px-4 py-2"
                onClick={handleLogin}
                disabled={loading}
              >
                登入
              </button>
              <button
                className="flex-1 rounded-xl bg-white/10 px-4 py-2"
                onClick={handleSignUp}
                disabled={loading}
              >
                註冊
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
