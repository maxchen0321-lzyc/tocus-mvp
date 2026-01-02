"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase";
import { useAuth } from "@/app/providers";
import { hasSupabaseConfig } from "@/lib/env";
import { trackEvent } from "@/lib/events";

type Props = {
  open: boolean;
  mode: "login" | "signup";
  onClose: () => void;
  user: User | null;
  onSignOut: () => Promise<void>;
};

export default function AuthModal({ open, mode, onClose, user, onSignOut }: Props) {
  const { anonymousId } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;
  if (user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="glass w-full max-w-sm rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">帳號</h2>
            <button className="text-sm text-white/60" onClick={onClose}>
              關閉
            </button>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <p>已登入：{user.email}</p>
            <button className="w-full rounded-xl bg-white/10 px-4 py-2" onClick={onSignOut}>
              登出
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogin = async () => {
    if (!hasSupabaseConfig) {
      setError("請先在 .env.local 設定 Supabase keys");
      return;
    }
    if (mode !== "login") return;
    if (loading) return;
    if (!email) {
      setError("請輸入 Email");
      return;
    }
    setLoading(true);
    setError(null);
    setNotice(null);
    const { data, error: signInError } = await supabaseBrowser.auth.signInWithPassword({
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
    if (mode !== "signup") return;
    if (loading) return;
    if (!email) {
      setError("請輸入 Email");
      return;
    }
    if (password.length < 8) {
      setError("密碼至少 8 碼");
      return;
    }
    if (password !== confirmPassword) {
      setError("確認密碼不一致");
      return;
    }
    setLoading(true);
    setError(null);
    setNotice(null);
    const { data, error: signUpError } = await supabaseBrowser.auth.signUp({
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
        metadata: { method: "password", email_confirmation: true }
      });
    }
    setNotice("已寄送確認郵件，請至信箱完成驗證後再登入");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="glass w-full max-w-sm rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{mode === "login" ? "登入" : "註冊"}</h2>
          <button className="text-sm text-white/60" onClick={onClose}>
            關閉
          </button>
        </div>
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
          {mode === "signup" ? (
            <label className="block space-y-1">
              <span className="text-xs text-white/60">Confirm Password</span>
              <input
                type="password"
                className="w-full rounded-xl bg-white/10 px-3 py-2"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </label>
          ) : null}
          {error ? <p className="text-xs text-red-300">{error}</p> : null}
          {notice ? <p className="text-xs text-emerald-300">{notice}</p> : null}
          {mode === "login" ? (
            <button
              className="w-full rounded-xl bg-white/10 px-4 py-2"
              onClick={handleLogin}
              disabled={loading}
            >
              登入
            </button>
          ) : (
            <button
              className="w-full rounded-xl bg-white/10 px-4 py-2"
              onClick={handleSignUp}
              disabled={loading}
            >
              註冊
            </button>
          )}
          {notice ? (
            <button
              className="w-full rounded-xl border border-white/20 px-4 py-2 text-xs"
              onClick={onClose}
            >
              回到登入
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
