"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/app/providers";
import AuthModal from "./auth/AuthModal";

type Props = {
  onOpenCollection: () => void;
};

export default function TopBar({ onOpenCollection }: Props) {
  const { user, signOut, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

  return (
    <>
      <div className="flex items-center justify-between">
        {user ? (
          <button
            className="rounded-full border border-white/20 px-3 py-1 text-xs"
            onClick={() => setAuthMode("login")}
            disabled={isLoading}
          >
            帳號
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              className="rounded-full border border-white/20 px-3 py-1 text-xs"
              onClick={() => setAuthMode("login")}
              disabled={isLoading}
            >
              登入
            </button>
            <button
              className="rounded-full border border-white/20 px-3 py-1 text-xs"
              onClick={() => setAuthMode("signup")}
              disabled={isLoading}
            >
              註冊
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Link
            className="rounded-full border border-white/20 px-3 py-1 text-xs"
            href="/admin/metrics"
          >
            Metrics
          </Link>
          <button
            className="rounded-full border border-white/20 px-3 py-1 text-xs"
            onClick={onOpenCollection}
          >
            收藏
          </button>
        </div>
      </div>
      <AuthModal
        open={authMode !== null}
        mode={authMode ?? "login"}
        onClose={() => setAuthMode(null)}
        user={user}
        onSignOut={signOut}
      />
    </>
  );
}
