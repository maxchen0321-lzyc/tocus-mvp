"use client";

import { formatDate } from "@/lib/utils";
import type { Topic } from "@/lib/types";

type Props = {
  topic: Topic;
  onClick: () => void;
};

export default function TopicCard({ topic, onClick }: Props) {
  return (
    <button
      className="glass w-full rounded-2xl p-5 text-left shadow-lg"
      onClick={onClick}
    >
      <div className="flex items-center justify-between text-xs text-white/60">
        <span>{formatDate(topic.happenedAt)}</span>
        <span className="rounded-full border border-white/20 px-2 py-0.5">{topic.tag}</span>
      </div>
      <h2 className="mt-3 text-lg font-semibold">{topic.title}</h2>
      <p className="mt-2 text-sm text-white/80">{topic.summary}</p>
      <p className="mt-2 text-xs text-white/60">{topic.context}</p>
      <p className="mt-4 text-xs text-white/40">點擊設定立場後閱讀</p>
    </button>
  );
}
