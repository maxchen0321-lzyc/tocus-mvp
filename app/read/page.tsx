"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { articles, topics } from "@/lib/data";
import { saveStance } from "@/lib/db";
import { trackEvent } from "@/lib/events";
import { useAuth } from "@/app/providers";
import StanceModal from "@/components/StanceModal";
import CommentSection from "@/components/CommentSection";
import { formatDateTime } from "@/lib/utils";

export default function ReadPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, anonymousId } = useAuth();
  const [finalStanceOpen, setFinalStanceOpen] = useState(false);

  const topicId = searchParams.get("topicId") ?? "";
  const stanceParam = searchParams.get("stance") ?? "supporting";
  const oppositeStance = stanceParam === "supporting" ? "opposing" : "supporting";

  const topic = topics.find((item) => item.id === topicId);
  const article = useMemo(
    () => articles.find((item) => item.topicId === topicId && item.stance === oppositeStance),
    [topicId, oppositeStance]
  );

  const sameStanceArticle = useMemo(
    () => articles.find((item) => item.topicId === topicId && item.stance === article?.stance),
    [topicId, article?.stance]
  );
  const oppositeArticle = useMemo(
    () =>
      articles.find(
        (item) =>
          item.topicId === topicId &&
          item.stance === (article?.stance === "supporting" ? "opposing" : "supporting")
      ),
    [topicId, article?.stance]
  );

  useEffect(() => {
    if (!article || anonymousId === "pending") return;
    trackEvent("article_open", {
      userId: user?.id ?? null,
      anonymousId,
      topicId: article.topicId,
      articleId: article.id
    });
  }, [article?.id, anonymousId, user?.id]);

  const handleNextSame = async () => {
    if (!sameStanceArticle || !topic || anonymousId === "pending") return;
    await trackEvent("article_next_same", {
      userId: user?.id ?? null,
      anonymousId,
      topicId: topic.id,
      articleId: sameStanceArticle.id
    });
    router.push(`/read?topicId=${topic.id}&stance=${stanceParam}`);
  };

  const handleNextOpposite = async () => {
    if (!oppositeArticle || !topic || anonymousId === "pending") return;
    await trackEvent("article_next_opposite", {
      userId: user?.id ?? null,
      anonymousId,
      topicId: topic.id,
      articleId: oppositeArticle.id
    });
    router.push(`/read?topicId=${topic.id}&stance=${article?.stance ?? stanceParam}`);
  };

  const handleReadComplete = async () => {
    if (!article || anonymousId === "pending") return;
    await trackEvent("article_read_complete", {
      userId: user?.id ?? null,
      anonymousId,
      topicId: article.topicId,
      articleId: article.id
    });
    setFinalStanceOpen(true);
  };

  const handleFinalStance = async (value: number) => {
    if (!article || anonymousId === "pending") return;
    await saveStance(article.topicId, value, "final", anonymousId, user?.id ?? null);
    await trackEvent("stance_set_final", {
      userId: user?.id ?? null,
      anonymousId,
      topicId: article.topicId,
      metadata: { value }
    });
    router.push("/");
  };

  if (!article || !topic) {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center p-6 text-sm text-white/60">
        找不到文章
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 px-4 py-6">
      <div className="space-y-2">
        <p className="text-xs text-white/60">{topic.title}</p>
        <h1 className="text-2xl font-semibold">{article.title}</h1>
        <p className="text-xs text-white/50">
          {article.author} · {article.stance === "supporting" ? "支持方" : "反方"}
        </p>
        <p className="text-xs text-white/50">撰寫時間：{formatDateTime(article.createdAt)}</p>
      </div>
      <article className="glass rounded-2xl p-5 text-sm leading-7 text-white/90">
        {article.content}
      </article>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button className="flex-1 rounded-xl border border-white/20 py-3 text-sm" onClick={handleNextSame}>
          繼續看同一方文章
        </button>
        <button
          className="flex-1 rounded-xl border border-white/20 py-3 text-sm"
          onClick={handleNextOpposite}
        >
          看另一方文章
        </button>
        <button className="flex-1 rounded-xl bg-white/10 py-3 text-sm" onClick={handleReadComplete}>
          結束閱讀
        </button>
      </div>
      <CommentSection
        parentType="article"
        parentId={article.id}
        topicId={article.topicId}
        articleId={article.id}
      />
      <StanceModal
        open={finalStanceOpen}
        title="閱讀後立場更新"
        label="閱讀後你的立場"
        onConfirm={handleFinalStance}
        onClose={() => setFinalStanceOpen(false)}
      />
    </div>
  );
}
