"use client";

import { useMemo, useState } from "react";
import type { Topic } from "@/lib/notion-types";
import { formatDate } from "@/lib/utils";
import ArticleRenderer from "./ArticleRenderer";

type Props = {
  topic: Topic;
};

export default function TopicDetail({ topic }: Props) {
  const [stance, setStance] = useState<"pro" | "con">("pro");

  const article = useMemo(
    () => topic.articles.find((item) => item.stance === stance) ?? topic.articles[0],
    [topic.articles, stance]
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="rounded-full border border-white/20 px-2 py-0.5 text-xs text-white/70">
          {topic.category}
        </span>
        <h1 className="text-2xl font-semibold">{topic.title}</h1>
        <p className="text-xs text-white/60">發布時間：{formatDate(topic.publishedAt)}</p>
        <p className="text-sm text-white/80">{topic.context}</p>
      </div>

      <div className="flex gap-2">
        <button
          className={`flex-1 rounded-xl border px-3 py-2 text-xs ${
            stance === "pro" ? "border-white/40 bg-white/10" : "border-white/10"
          }`}
          onClick={() => setStance("pro")}
        >
          正方文章
        </button>
        <button
          className={`flex-1 rounded-xl border px-3 py-2 text-xs ${
            stance === "con" ? "border-white/40 bg-white/10" : "border-white/10"
          }`}
          onClick={() => setStance("con")}
        >
          反方文章
        </button>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{article.title}</h2>
          <p className="text-xs text-white/60">
            {article.author} · {formatDate(article.publishedAt)}
          </p>
        </div>
        <div className="mt-4">
          <ArticleRenderer blocks={article.content} />
        </div>
      </div>
    </div>
  );
}
