"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { topics } from "@/lib/data";
import { getCollections, removeCollection } from "@/lib/db";
import { trackEvent } from "@/lib/events";
import { hasSupabaseConfig } from "@/lib/env";
import { isPermanentUser, useAuth } from "@/app/providers";
import AuthModal from "@/components/auth/AuthModal";

export default function CollectionsPage() {
  const { user, anonymousId, authReady, authError, supabaseHost, signOut } = useAuth();
  const [items, setItems] = useState<string[]>([]);
  const [debug, setDebug] = useState<string>("pending");
  const [collectionError, setCollectionError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const isSignedIn = isPermanentUser(user);
  const canUseCollections = isSignedIn;
  const showDebug =
    process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_SHOW_DEBUG === "1";
  const supabaseEnvHost = (() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url) return "missing";
    try {
      return new URL(url).host;
    } catch {
      return "invalid";
    }
  })();
  const isAnonymous = Boolean(user && (user.is_anonymous || !user.email));

  useEffect(() => {
    if (!authReady) return;
    if (!isPermanentUser(user)) {
      setItems([]);
      setDebug("source=none count=0 owner=none error=auth_required");
      setCollectionError(null);
      setAuthNotice("登入後即可使用收藏功能");
      setAuthOpen(true);
      return;
    }
    trackEvent("collection_open", {
      userId: user.id,
      anonymousId,
      metadata: { entry: "page" }
    });
    getCollections(user.id).then((result) => {
      setItems(result.data.map((item) => item.topic_id));
      setDebug(
        `source=${result.source} count=${result.data.length} owner=${user.id} error=${result.error ?? "none"}`
      );
      setCollectionError(result.error);
    });
  }, [authReady, isSignedIn, user]);

  const handleRemove = async (topicId: string) => {
    if (!authReady || !isPermanentUser(user)) return;
    const result = await removeCollection(topicId, user.id);
    if (result) {
      setItems(result.data.map((item) => item.topic_id));
      setDebug(
        `source=${result.source} count=${result.data.length} owner=${user.id} error=${result.error ?? "none"}`
      );
      setCollectionError(result.error);
    }
    await trackEvent("collection_remove", {
      userId: user.id,
      anonymousId,
      topicId
    });
  };

  const list = topics.filter((topic) => items.includes(topic.id));

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 px-4 py-6 text-sm">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">收藏</h1>
        <Link className="text-xs text-white/60" href="/">
          返回首頁
        </Link>
      </div>
      {authNotice ? <p className="text-xs text-amber-200">{authNotice}</p> : null}
      {collectionError && !showDebug ? (
        <p className="text-xs text-red-300">讀取收藏失敗：{collectionError}</p>
      ) : null}
      {showDebug ? (
        <>
          <p className="text-[10px] text-white/40">ColDebug: {debug}</p>
          <p className="text-[10px] text-white/40">AuthReady: {authReady ? "true" : "false"}</p>
          <p className="text-[10px] text-white/40">UserId: {user?.id ?? "none"}</p>
          <p className="text-[10px] text-white/40">AnonymousId: {anonymousId}</p>
          <p className="text-[10px] text-white/40">
            SupabaseHost: {supabaseHost ?? "unknown"}
          </p>
          <p className="text-[10px] text-white/40">
            EnvHost: {supabaseEnvHost} · hasSupabaseConfig: {hasSupabaseConfig ? "true" : "false"}
          </p>
          <p className="text-[10px] text-white/40">
            UserEmail: {user?.email ?? "none"} · isAnonymous: {isAnonymous ? "true" : "false"}
          </p>
          {authError && !user ? (
            <p className="text-[10px] text-red-300">AuthError: {authError}</p>
          ) : null}
          {collectionError ? (
            <p className="text-[10px] text-red-300">ColError: {collectionError}</p>
          ) : null}
        </>
      ) : null}
      {!canUseCollections ? (
        <div className="glass rounded-2xl p-4 text-white/60">登入後即可使用收藏功能</div>
      ) : list.length === 0 ? (
        <div className="glass rounded-2xl p-4 text-white/60">尚未收藏任何議題</div>
      ) : (
        <div className="space-y-2">
          {list.map((topic) => (
            <div key={topic.id} className="glass flex items-center justify-between rounded-xl px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{topic.title}</p>
                <p className="text-xs text-white/60">{topic.tag}</p>
              </div>
              <button className="text-xs text-red-300" onClick={() => handleRemove(topic.id)}>
                移除收藏
              </button>
            </div>
          ))}
        </div>
      )}
      <AuthModal
        open={authOpen}
        mode="login"
        onClose={() => setAuthOpen(false)}
        user={canUseCollections ? user : null}
        onSignOut={signOut}
      />
    </div>
  );
}
