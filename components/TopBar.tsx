"use client";

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
        <button
          className="rounded-full border border-white/20 px-3 py-1 text-xs"
          onClick={onOpenCollection}
        >
          收藏
        </button>
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
