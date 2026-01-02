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
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <button
          className="rounded-full border border-white/20 px-3 py-1 text-xs"
          onClick={() => setAuthOpen(true)}
          disabled={isLoading}
        >
          {user ? "帳號" : "登入"}
        </button>
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
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        user={user}
        onSignOut={signOut}
      />
    </>
  );
}
