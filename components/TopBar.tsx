"use client";

import Link from "next/link";
import { useState } from "react";
import { trackEvent } from "@/lib/events";
import { useAuth } from "@/app/providers";
import AuthModal from "./auth/AuthModal";

export default function TopBar() {
  const { user, signOut, isLoading, anonymousId, authReady, isAnonymous } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const showAccount = Boolean(user && !isAnonymous);
  const showAuthButtons = !user || isAnonymous;

  return (
    <>
      <div className="flex items-center justify-between">
        {showAccount ? (
          <button
            className="rounded-full border border-secondary/60 bg-secondary-muted px-3 py-1 text-xs text-text"
            onClick={() => setAuthMode("login")}
            disabled={isLoading}
          >
            帳號
          </button>
        ) : showAuthButtons ? (
          <div className="flex items-center gap-2">
            <button
              className="rounded-full border border-secondary/60 bg-secondary-muted px-3 py-1 text-xs text-text"
              onClick={() => setAuthMode("login")}
              disabled={isLoading}
            >
              登入
            </button>
            <button
              className="rounded-full border border-secondary/60 bg-secondary-muted px-3 py-1 text-xs text-text"
              onClick={() => setAuthMode("signup")}
              disabled={isLoading}
            >
              註冊
            </button>
            {isAnonymous ? <span className="text-[10px] text-muted/70">訪客</span> : null}
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <Link
            className="rounded-full border border-secondary/60 bg-secondary-muted px-3 py-1 text-xs text-text"
            href="/admin/metrics"
          >
            Metrics
          </Link>
          <Link
            className="rounded-full border border-secondary/60 bg-secondary-muted px-3 py-1 text-xs text-text"
            href="/collections"
            onClick={() => {
              if (!authReady || anonymousId === "pending") return;
              trackEvent("collection_open", {
                userId: user?.id ?? null,
                anonymousId,
                metadata: { entry: "header" }
              });
            }}
          >
            收藏
          </Link>
        </div>
      </div>
      <AuthModal
        open={authMode !== null}
        mode={authMode ?? "login"}
        onClose={() => setAuthMode(null)}
        user={showAccount ? user : null}
        onSignOut={signOut}
      />
    </>
  );
}
