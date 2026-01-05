"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSwipeTopics, getTopicSourceDiagnostics } from "@/lib/topic-source";
import { addCollection, getCollections, saveStance } from "@/lib/db";
import { trackEvent } from "@/lib/events";
import { useAuth } from "../providers";
import SwipeCard from "@/components/SwipeCard";
import TopBar from "@/components/TopBar";
import StanceModal from "@/components/StanceModal";

export default function HomeClient() {
  const router = useRouter();
  const { user, anonymousId, authReady, authError, supabaseHost } = useAuth();
  const [index, setIndex] = useState(0);
  const [stanceOpen, setStanceOpen] = useState(false);
  const [collectionIds, setCollectionIds] = useState<string[]>([]);
  const [collectionDebug, setCollectionDebug] = useState<string>("pending");
  const impressions = useRef(new Set<string>());
  const swipeTopics = getSwipeTopics();
  const topicDiagnostics = getTopicSourceDiagnostics();
  const [stanceError, setStanceError] = useState<string | null>(null);

  const currentTopic = swipeTopics[index];

  useEffect(() => {
    if (!authReady) return;
    getCollections(user?.id ?? null).then((result) => {
      setCollectionIds(result.data.map((item) => item.topic_id));
      setCollectionDebug(
        `source=${result.source} count=${result.data.length} owner=${user?.id ?? "none"} error=${result.error ?? "none"}`
      );
    });
  }, [authReady, user?.id]);

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
    if (direction === "right") {
      const result = await addCollection(currentTopic.id, user?.id ?? null);
      if (result) {
        setCollectionIds(result.data.map((item) => item.topic_id));
        setCollectionDebug(
          `source=${result.source} count=${result.data.length} owner=${user?.id ?? "none"} error=${result.error ?? "none"}`
        );
      }
    }
    await trackEvent(direction === "right" ? "topic_swipe_right" : "topic_swipe_left", {
      userId: user?.id ?? null,
      anonymousId,
      topicId: currentTopic.id,
      metadata: meta
    });
    setIndex((prev) => (prev + 1) % swipeTopics.length);
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
    if (anonymousId === "pending") {
      setStanceError("正在建立訪客身份，請稍候再試。");
      return;
    }
    setStanceOpen(false);
    await saveStance(currentTopic.id, value, "initial", anonymousId, user?.id ?? null);
    await trackEvent("stance_set_initial", {
      userId: user?.id ?? null,
      anonymousId,
      topicId: currentTopic.id,
      metadata: { value }
    });
    const stance = value >= 0 ? "supporting" : "opposing";
    router.push(`/read?topicId=${currentTopic.id}&stance=${stance}&entry=card_click`);
  };

  const isCollected = useMemo(
    () => (currentTopic ? collectionIds.includes(currentTopic.id) : false),
    [currentTopic, collectionIds]
  );

  const showDebug =
    process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_SHOW_DEBUG === "1";

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-xl flex-col gap-4 px-4 py-6">
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
              />
            </div>
            <p className="text-xs text-white/50">
              目前卡片 {index + 1}/{swipeTopics.length}
            </p>
            {showDebug ? (
              <>
                <p className="text-[10px] text-white/40">ColDebug: {collectionDebug}</p>
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
        confirmDisabled={anonymousId === "pending"}
        confirmHint={stanceError ?? (anonymousId === "pending" ? "正在建立訪客身份，請稍候。" : undefined)}
      />
    </div>
  );
}
