"use client";

import { formatDate } from "@/lib/utils";
import type { Topic as LegacyTopic } from "@/lib/types";
import type { Topic as MockTopic } from "@/data/mockTopics";

type Props = {
  topic: LegacyTopic | MockTopic;
  onClick?: () => void;
  isCollected?: boolean;
  onToggleCollection?: () => void;
  className?: string;
};

function getTopicMeta(topic: LegacyTopic | MockTopic) {
  if ("publishedAt" in topic) {
    return {
      title: topic.title,
      category: topic.category,
      publishedAt: topic.publishedAt,
      context: topic.context
    };
  }
  return {
    title: topic.title,
    category: topic.tag,
    publishedAt: topic.happenedAt,
    context: topic.context
  };
}

export default function TopicCard({
  topic,
  onClick,
  isCollected,
  onToggleCollection,
  className
}: Props) {
  const meta = getTopicMeta(topic);
  const isClickable = Boolean(onClick);
  const canToggleCollection = Boolean(onToggleCollection);
  return (
    <div
      className={`glass relative flex w-full flex-col gap-3 rounded-2xl p-5 text-left shadow-lg ${className ?? ""}`}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!isClickable) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <div className="flex items-center justify-between text-xs text-white/60">
        <span>{formatDate(meta.publishedAt)}</span>
      </div>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 pr-10">
        <h2 className="text-lg font-semibold">{meta.title}</h2>
        <span className="rounded-full border border-white/20 px-2 py-0.5 text-xs text-white/60">
          {meta.category}
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto pr-1 text-sm text-white/80">
        <p className="whitespace-pre-line">{meta.context}</p>
      </div>
      {canToggleCollection ? (
        <button
          type="button"
          aria-pressed={Boolean(isCollected)}
          aria-label={isCollected ? "取消收藏" : "加入收藏"}
          className={`absolute right-4 top-4 z-20 rounded-full border border-white/20 bg-black/20 p-2 transition ${
            isCollected ? "text-amber-200" : "text-white/70 hover:text-white"
          }`}
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onTouchStart={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
            onToggleCollection?.();
          }}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill={isCollected ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 4.5c0-.828.672-1.5 1.5-1.5h9c.828 0 1.5.672 1.5 1.5v15L12 16.5 6 19.5v-15z"
            />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
