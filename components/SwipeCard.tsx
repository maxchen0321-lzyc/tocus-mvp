"use client";

import { useRef, useState } from "react";
import type { Topic } from "@/lib/types";
import TopicCard from "./TopicCard";

type SwipeMeta = {
  dx: number;
  threshold: number;
  inputType: "touch" | "mouse";
};

type Props = {
  topic: Topic;
  onOpen: () => void;
  onSwipeLeft: (meta: SwipeMeta) => void;
  onSwipeRight: (meta: SwipeMeta) => void;
  isCollected: boolean;
};

export default function SwipeCard({ topic, onOpen, onSwipeLeft, onSwipeRight, isCollected }: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const startX = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);
  const pointerId = useRef<number | null>(null);
  const inputType = useRef<SwipeMeta["inputType"]>("touch");
  const suppressClick = useRef(false);
  const dragged = useRef(false);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);

  const threshold = Math.max((cardRef.current?.clientWidth ?? 0) * 0.25, 120);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerId.current = event.pointerId;
    inputType.current = event.pointerType === "mouse" ? "mouse" : "touch";
    startX.current = event.clientX;
    startTime.current = Date.now();
    dragged.current = false;
    setDragging(false);
    cardRef.current?.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== event.pointerId || startX.current == null) return;
    const delta = event.clientX - startX.current;
    if (Math.abs(delta) > 10) {
      dragged.current = true;
      setDragging(true);
    }
    setDx(delta);
  };

  const resetCard = () => {
    setDx(0);
    setDragging(false);
    dragged.current = false;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== event.pointerId || startX.current == null) return;
    const delta = event.clientX - startX.current;
    const duration = startTime.current ? Date.now() - startTime.current : 0;
    const meta: SwipeMeta = {
      dx: delta,
      threshold,
      inputType: inputType.current
    };
    startX.current = null;
    startTime.current = null;
    pointerId.current = null;
    cardRef.current?.releasePointerCapture(event.pointerId);
    if (Math.abs(delta) >= threshold) {
      suppressClick.current = true;
      window.setTimeout(() => {
        suppressClick.current = false;
      }, 0);
      resetCard();
      if (delta > 0) {
        onSwipeRight(meta);
      } else {
        onSwipeLeft(meta);
      }
      return;
    }
    if (!dragged.current && Math.abs(delta) < 10 && duration < 350) {
      suppressClick.current = true;
      window.setTimeout(() => {
        suppressClick.current = false;
      }, 0);
      resetCard();
      onOpen();
      return;
    }
    resetCard();
  };

  const handleCardClick = () => {
    if (suppressClick.current || dragging || dragged.current) return;
    onOpen();
  };

  const opacity = 1 - Math.min(Math.abs(dx) / (threshold * 1.5), 0.35);

  return (
    <div className="space-y-4">
      <div
        ref={cardRef}
        className="touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={resetCard}
        style={{
          transform: `translateX(${dx}px) rotate(${dx / 25}deg)`,
          opacity,
          transition: dragging ? "none" : "transform 200ms ease, opacity 200ms ease"
        }}
      >
        <TopicCard topic={topic} onClick={handleCardClick} />
      </div>
      <div className="flex gap-3 text-sm">
        <button
          className="flex-1 rounded-xl border border-white/20 py-3"
          onClick={() => onSwipeLeft({ dx: -threshold, threshold, inputType: "touch" })}
        >
          左滑：不喜歡
        </button>
        <button
          className="flex-1 rounded-xl bg-white/10 py-3"
          onClick={() => onSwipeRight({ dx: threshold, threshold, inputType: "touch" })}
        >
          右滑：{isCollected ? "已收藏" : "喜歡"}
        </button>
      </div>
    </div>
  );
}
