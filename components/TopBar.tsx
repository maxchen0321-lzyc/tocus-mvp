"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/events";
import { isPermanentUser, useAuth } from "@/app/providers";
import AuthModal from "./auth/AuthModal";

export default function TopBar() {
  const router = useRouter();
  const { user, signOut, isLoading, anonymousId, authReady, isAnonymous } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const isSignedIn = isPermanentUser(user);
  const showAccount = isSignedIn;
  const showAuthButtons = !isSignedIn;
  const canUseCollections = isSignedIn;

  useEffect(() => {
    const handleAuthOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: "login" | "signup"; message?: string }>).detail;
      if (detail?.message) {
        setAuthNotice(detail.message);
        window.setTimeout(() => setAuthNotice(null), 3000);
      }
      setAuthMode(detail?.mode ?? "login");
    };
    window.addEventListener("auth:open", handleAuthOpen as EventListener);
    return () => {
      window.removeEventListener("auth:open", handleAuthOpen as EventListener);
    };
  }, []);

  const openAuthNotice = (message: string) => {
    setAuthNotice(message);
    window.setTimeout(() => setAuthNotice(null), 3000);
    setAuthMode("login");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        {showAccount ? (
          <button
            className="rounded-full border border-white/20 px-3 py-1 text-xs"
            onClick={() => setAuthMode("login")}
            disabled={isLoading}
          >
            帳號
          </button>
        ) : showAuthButtons ? (
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
            {isAnonymous ? <span className="text-[10px] text-white/50">訪客</span> : null}
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <Link
            className="rounded-full border border-white/20 px-3 py-1 text-xs"
            href="/admin/metrics"
          >
            Metrics
          </Link>
          <button
            className="rounded-full border border-white/20 px-3 py-1 text-xs"
            onClick={() => {
              if (!authReady || anonymousId === "pending") return;
              if (!canUseCollections) {
                openAuthNotice("登入後即可使用收藏功能");
                return;
              }
              trackEvent("collection_open", {
                userId: user?.id ?? null,
                anonymousId,
                metadata: { entry: "header" }
              });
              router.push("/collections");
            }}
          >
            收藏
          </button>
        </div>
      </div>
      {authNotice ? (
        <p className="mt-2 text-[10px] text-amber-200">{authNotice}</p>
      ) : null}
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
