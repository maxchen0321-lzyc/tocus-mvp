"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { topics, articles } from "@/lib/data";
import { addCollection, getCollections, saveStance } from "@/lib/db";
import { trackEvent } from "@/lib/events";
import { useAuth } from "../providers";
import SwipeCard from "@/components/SwipeCard";
import TopBar from "@/components/TopBar";
import StanceModal from "@/components/StanceModal";
import CollectionDrawer from "@/components/CollectionDrawer";

export default function HomeClient() {
  const router = useRouter();
  const { user, anonymousId } = useAuth();
  const [index, setIndex] = useState(0);
  const [stanceOpen, setStanceOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [collectionIds, setCollectionIds] = useState<string[]>([]);
  const impressions = useRef(new Set<string>());

  const currentTopic = topics[index];

  useEffect(() => {
    if (anonymousId === "pending") return;
    getCollections(anonymousId, user?.id ?? null).then((data) =>
      setCollectionIds(data.map((item) => item.topic_id))
    );
  }, [anonymousId, user?.id]);

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
    if (!currentTopic || anonymousId === "pending") return;
    if (direction === "right") {
      await addCollection(currentTopic.id, anonymousId, user?.id ?? null);
      setCollectionIds((prev) =>
        prev.includes(currentTopic.id) ? prev : [...prev, currentTopic.id]
      );
    }
    await trackEvent(direction === "right" ? "topic_swipe_right" : "topic_swipe_left", {
      userId: user?.id ?? null,
      anonymousId,
      topicId: currentTopic.id,
      metadata: meta
    });
    setIndex((prev) => (prev + 1) % topics.length);
  };

  const handleOpenTopic = () => {
    setStanceOpen(true);
  };

  const handleConfirmStance = async (value: number) => {
    if (!currentTopic || anonymousId === "pending") return;
    setStanceOpen(false);
    await saveStance(currentTopic.id, value, "initial", anonymousId, user?.id ?? null);
    await trackEvent("stance_set_initial", {
      userId: user?.id ?? null,
      anonymousId,
      topicId: currentTopic.id,
      metadata: { value }
    });
    const stance = value >= 0 ? "supporting" : "opposing";
    const opposite = stance === "supporting" ? "opposing" : "supporting";
    const target = articles.find(
      (article) => article.topicId === currentTopic.id && article.stance === opposite
    );
    if (target) {
      router.push(`/read?topicId=${currentTopic.id}&stance=${stance}`);
    }
  };

  const isCollected = useMemo(
    () => (currentTopic ? collectionIds.includes(currentTopic.id) : false),
    [currentTopic, collectionIds]
  );

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 px-4 py-6">
      <TopBar onOpenCollection={() => setCollectionOpen(true)} />
      {currentTopic ? (
        <div className="space-y-4">
          <SwipeCard
            topic={currentTopic}
            onOpen={handleOpenTopic}
            onSwipeLeft={(meta) => handleSwipe("left", meta)}
            onSwipeRight={(meta) => handleSwipe("right", meta)}
            isCollected={isCollected}
          />
          <p className="text-xs text-white/50">
            目前卡片 {index + 1}/{topics.length}
          </p>
        </div>
      ) : (
        <div className="glass rounded-2xl p-6 text-center text-sm text-white/60">
          暫無議題
        </div>
      )}
      <StanceModal
        open={stanceOpen}
        title="請設定你的立場"
        onConfirm={handleConfirmStance}
        onClose={() => setStanceOpen(false)}
      />
      <CollectionDrawer open={collectionOpen} onClose={() => setCollectionOpen(false)} />
    </div>
  );
}
