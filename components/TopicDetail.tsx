"use client";

import { useEffect, useMemo, useState } from "react";
import type { Topic } from "@/data/mockTopics";
import { formatDate } from "@/lib/utils";
import ArticleRenderer from "./ArticleRenderer";

type Props = {
  topic: Topic;
};

export default function TopicDetail({ topic }: Props) {
  const [stance, setStance] = useState<"pro" | "con">("pro");
  const [articleId, setArticleId] = useState<string | null>(null);

  const stanceArticles = useMemo(
    () => topic.articles.filter((item) => item.stance === stance),
    [topic.articles, stance]
  );

  useEffect(() => {
    if (!stanceArticles.length) {
      setArticleId(null);
      return;
    }
    setArticleId(stanceArticles[0].id);
  }, [stanceArticles]);

  const article = useMemo(() => {
    if (!stanceArticles.length) {
      return topic.articles[0];
    }
    if (!articleId) return stanceArticles[0];
    return stanceArticles.find((item) => item.id === articleId) ?? stanceArticles[0];
  }, [stanceArticles, articleId, topic.articles]);

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
        <div className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">{article.title}</h2>
            <p className="text-xs text-white/60">
              {article.author} · {formatDate(article.publishedAt)}
            </p>
          </div>
          {stanceArticles.length > 1 ? (
            <label className="block space-y-1 text-xs text-white/60">
              <span>切換同立場文章</span>
              <select
                className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm text-white"
                value={articleId ?? ""}
                onChange={(event) => setArticleId(event.target.value)}
              >
                {stanceArticles.map((item) => (
                  <option key={item.id} value={item.id} className="text-black">
                    {item.title}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
        <div className="mt-4">
          <ArticleRenderer blocks={article.content} />
        </div>
      </div>
    </div>
  );
}
