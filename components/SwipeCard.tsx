"use client";

import { useRef } from "react";
import type { Topic } from "@/lib/types";
import TopicCard from "./TopicCard";

type Props = {
  topic: Topic;
  onOpen: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isCollected: boolean;
};

export default function SwipeCard({ topic, onOpen, onSwipeLeft, onSwipeRight, isCollected }: Props) {
  const startX = useRef<number | null>(null);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    startX.current = event.clientX;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current == null) return;
    const delta = event.clientX - startX.current;
    startX.current = null;
    if (Math.abs(delta) < 60) return;
    if (delta > 0) {
      onSwipeRight();
    } else {
      onSwipeLeft();
    }
  };

  return (
    <div
      className="space-y-4"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <TopicCard topic={topic} onClick={onOpen} />
      <div className="flex gap-3 text-sm">
        <button className="flex-1 rounded-xl border border-white/20 py-3" onClick={onSwipeLeft}>
          左滑：不喜歡
        </button>
        <button className="flex-1 rounded-xl bg-white/10 py-3" onClick={onSwipeRight}>
          右滑：{isCollected ? "已收藏" : "喜歡"}
        </button>
      </div>
    </div>
  );
}
