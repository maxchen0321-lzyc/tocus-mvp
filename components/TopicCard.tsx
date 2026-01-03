"use client";

import { formatDate } from "@/lib/utils";
import type { Topic as LegacyTopic } from "@/lib/types";
import type { Topic as MockTopic } from "@/lib/notion-types";

type Props = {
  topic: LegacyTopic | MockTopic;
  onClick?: () => void;
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

export default function TopicCard({ topic, onClick }: Props) {
  const meta = getTopicMeta(topic);
  return (
    <button
      className="glass w-full rounded-2xl p-5 text-left shadow-lg"
      onClick={onClick}
      type="button"
    >
      <div className="flex items-center justify-between text-xs text-white/60">
        <span>{formatDate(meta.publishedAt)}</span>
        <span className="rounded-full border border-white/20 px-2 py-0.5">{meta.category}</span>
      </div>
      <h2 className="mt-3 text-lg font-semibold">{meta.title}</h2>
      <p className="mt-2 text-sm text-white/80 line-clamp-3">{meta.context}</p>
    </button>
  );
}
