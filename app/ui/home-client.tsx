"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSwipeTopics, getTopicSourceDiagnostics } from "@/lib/topic-source";
import { addCollection, getCollections, removeCollection, saveStance } from "@/lib/db";
import { trackEvent } from "@/lib/events";
import { stanceValueToLabel, stanceValueToScore, stanceValueToUserStance } from "@/lib/stance";
import { isPermanentUser, useAuth } from "../providers";
import SwipeCard from "@/components/SwipeCard";
import TopBar from "@/components/TopBar";
import StanceModal from "@/components/StanceModal";

export default function HomeClient() {
  const router = useRouter();
  const { user, anonymousId, authReady, authError, supabaseHost } = useAuth();
  const isSignedIn = isPermanentUser(user);
  const [index, setIndex] = useState(0);
  const [stanceOpen, setStanceOpen] = useState(false);
  const [collectionIds, setCollectionIds] = useState<string[]>([]);
  const [collectionDebug, setCollectionDebug] = useState<string>("pending");
  const [collectionError, setCollectionError] = useState<string | null>(null);
  const [collectionDiag, setCollectionDiag] = useState<string | null>(null);
  const impressions = useRef(new Set<string>());
  const swipeTopics = getSwipeTopics();
  const topicDiagnostics = getTopicSourceDiagnostics();
  const [stanceError, setStanceError] = useState<string | null>(null);

  const currentTopic = swipeTopics[index];

  useEffect(() => {
    if (!authReady) return;
    if (!isPermanentUser(user)) {
      setCollectionIds([]);
      setCollectionDebug("source=none count=0 owner=none error=auth_required");
      setCollectionError(null);
      return;
    }
    getCollections(user.id).then((result) => {
      setCollectionIds(result.data.map((item) => item.topic_id));
      setCollectionDebug(
        `source=${result.source} count=${result.data.length} owner=${user.id} error=${result.error ?? "none"}`
      );
      setCollectionError(result.error);
    });
  }, [authReady, isSignedIn, user]);

  useEffect(() => {
    if (!currentTopic || anonymousId === "pending") return;
    if (impressions.current.has(currentTopic.id)) return;
    impressions.current.add(currentTopic.id);
    trackEvent("topic_impression", {
      userId: user?.id ?? null,
      anonymousId,
      topicId: currentTopic.id
    });
  }, [currentTopic?.id, anonymousId, user?.id]);

  const handleSwipe = async (
    direction: "left" | "right",
    meta?: { dx: number; threshold: number; inputType: "touch" | "mouse" }
  ) => {
    if (!currentTopic || !authReady) return;
    await trackEvent(direction === "right" ? "topic_swipe_right" : "topic_swipe_left", {
      userId: user?.id ?? null,
      anonymousId,
      topicId: currentTopic.id,
      metadata: direction === "right" ? { ...meta, action: "open_stance" } : meta
    });
    if (direction === "left") {
      setIndex((prev) => (prev + 1) % swipeTopics.length);
    } else {
      handleOpenTopic();
    }
  };

  const handleOpenTopic = () => {
    setStanceError(null);
    setStanceOpen(true);
  };

  const handleConfirmStance = async (value: number) => {
    if (!currentTopic) {
      setStanceError("找不到議題，請重新整理後再試。");
      return;
    }
    if (!authReady) {
      setStanceError("登入狀態尚未完成，請稍候再試。");
      return;
    }
    if (anonymousId === "pending") {
      setStanceError("正在建立訪客身份，請稍候再試。");
      return;
    }
    setStanceOpen(false);
    const stanceValue = value;
    const stanceScore = stanceValueToScore(stanceValue);
    const stanceLabel = stanceValueToLabel(stanceValue);
    const userStanceRaw = stanceValueToUserStance(stanceValue);
    const userStance = userStanceRaw === "neutral" ? "supporting" : userStanceRaw;
    await saveStance(currentTopic.id, stanceScore, "initial", anonymousId, user?.id ?? null);
    await trackEvent("stance_set_initial", {
      userId: user?.id ?? null,
      anonymousId,
      topicId: currentTopic.id,
      metadata: {
        value: stanceScore,
        stance_value: stanceValue,
        stance_label: stanceLabel,
        userStance
      }
    });
    const view = userStance === "supporting" ? "opposing" : "supporting";
    router.push(
      `/read?topicId=${currentTopic.id}&userStance=${userStance}&view=${view}&entry=stance_initial`
    );
  };

  const isCollected = useMemo(
    () => (currentTopic ? collectionIds.includes(currentTopic.id) : false),
    [currentTopic, collectionIds]
  );

  const handleToggleCollection = async () => {
    if (!currentTopic || !authReady || anonymousId === "pending") return;
    if (!isPermanentUser(user)) {
      window.dispatchEvent(
        new CustomEvent("auth:open", {
          detail: { mode: "login", message: "登入後即可使用收藏功能" }
        })
      );
      return;
    }
    const userId = user.id;
    const payload = { topic_id: currentTopic.id, user_id: userId };
    if (showDebug) {
      setCollectionDiag(
        `user=${userId} email=${user.email ?? "none"} payload=${JSON.stringify(payload)}`
      );
    }
    const action = collectionIds.includes(currentTopic.id) ? "remove" : "add";
    const result =
      action === "add"
        ? await addCollection(currentTopic.id, userId)
        : await removeCollection(currentTopic.id, userId);
    if (result) {
      setCollectionIds(result.data.map((item) => item.topic_id));
      setCollectionDebug(
        `source=${result.source} count=${result.data.length} owner=${userId} error=${result.error ?? "none"}`
      );
      setCollectionError(result.error);
      if (showDebug) {
        setCollectionDiag((prev) =>
          [
            prev,
            `response=${JSON.stringify({
              error: result.error ?? null,
              debug: result.debug ?? null
            })}`
          ]
            .filter(Boolean)
            .join(" ")
        );
      }
    }
    await trackEvent(action === "add" ? "collection_add" : "collection_remove", {
      userId,
      anonymousId,
      topicId: currentTopic.id
    });
  };

  const showDebug =
    process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_SHOW_DEBUG === "1";

  return (
    <div className="mx-auto flex h-[100dvh] max-w-xl flex-col gap-4 overflow-hidden overflow-x-hidden px-4 py-6">
      <TopBar />
      {showDebug ? (
        <p className="text-[10px] text-white/50">
          DataSource: {topicDiagnostics.source} · TopicsCount: {topicDiagnostics.topicsCount} ·
          AdapterCountBeforeFilter: {topicDiagnostics.adapterCountBeforeFilter} ·
          AdapterCountAfterFilter: {topicDiagnostics.adapterCountAfterFilter} · Limit:{" "}
          {topicDiagnostics.limit ?? "none"} · Truncated:{" "}
          {topicDiagnostics.truncated ? "true" : "false"} · Reason:{" "}
          {topicDiagnostics.truncatedReason ?? "none"}
        </p>
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {currentTopic ? (
          <>
            <div className="min-h-0 flex-1">
              <SwipeCard
                topic={currentTopic}
                onOpen={handleOpenTopic}
                onSwipeLeft={(meta) => handleSwipe("left", meta)}
                onSwipeRight={(meta) => handleSwipe("right", meta)}
                isCollected={isCollected}
                onToggleCollection={handleToggleCollection}
              />
            </div>
            <p className="text-xs text-white/50">
              目前卡片 {index + 1}/{swipeTopics.length}
            </p>
            {showDebug ? (
              <>
                <p className="text-[10px] text-white/40">ColDebug: {collectionDebug}</p>
                {collectionError ? (
                  <p className="text-[10px] text-red-300">ColError: {collectionError}</p>
                ) : null}
                {collectionDiag ? (
                  <p className="text-[10px] text-white/40">ColDiag: {collectionDiag}</p>
                ) : null}
                <p className="text-[10px] text-white/40">
                  AuthReady: {authReady ? "true" : "false"}
                </p>
                <p className="text-[10px] text-white/40">UserId: {user?.id ?? "none"}</p>
                <p className="text-[10px] text-white/40">AnonymousId: {anonymousId}</p>
                <p className="text-[10px] text-white/40">
                  SupabaseHost: {supabaseHost ?? "unknown"}
                </p>
                {authError && !user ? (
                  <p className="text-[10px] text-red-300">AuthError: {authError}</p>
                ) : null}
              </>
            ) : null}
          </>
        ) : (
          <div className="glass rounded-2xl p-6 text-center text-sm text-white/60">
            暫無議題
          </div>
        )}
      </div>
      <StanceModal
        open={stanceOpen}
        title="請設定你的立場"
        onConfirm={handleConfirmStance}
        onClose={() => setStanceOpen(false)}
        confirmDisabled={!authReady || !currentTopic || anonymousId === "pending"}
        confirmHint={
          stanceError ??
          (!authReady
            ? "登入狀態尚未完成，請稍候。"
            : anonymousId === "pending"
            ? "正在建立訪客身份，請稍候。"
            : undefined)
        }
      />
    </div>
  );
}
