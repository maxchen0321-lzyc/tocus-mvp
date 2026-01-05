"use client";

import { formatDate } from "@/lib/utils";
import type { Topic as LegacyTopic } from "@/lib/types";
import type { Topic as MockTopic } from "@/data/mockTopics";

type Props = {
  topic: LegacyTopic | MockTopic;
  onClick?: () => void;
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

export default function TopicCard({ topic, onClick, className }: Props) {
  const meta = getTopicMeta(topic);
  return (
    <button
      className={`glass flex w-full flex-col gap-3 rounded-2xl p-5 text-left shadow-lg ${className ?? ""}`}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-center justify-between text-xs text-white/60">
        <span>{formatDate(meta.publishedAt)}</span>
        <span className="rounded-full border border-white/20 px-2 py-0.5">{meta.category}</span>
      </div>
      <h2 className="text-lg font-semibold">{meta.title}</h2>
      <div className="min-h-0 flex-1 overflow-y-auto pr-1 text-sm text-white/80">
        <p className="whitespace-pre-line">{meta.context}</p>
      </div>
    </button>
  );
}
