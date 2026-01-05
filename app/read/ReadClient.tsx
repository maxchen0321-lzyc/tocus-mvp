"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mockTopics } from "@/data/mockTopics";
import { saveStance } from "@/lib/db";
import { trackEvent } from "@/lib/events";
import { useAuth } from "@/app/providers";
import StanceModal from "@/components/StanceModal";
import CommentSection from "@/components/CommentSection";
import ArticleRenderer from "@/components/ArticleRenderer";
import { formatDateTime } from "@/lib/utils";

export default function ReadClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, anonymousId } = useAuth();
  const [finalStanceOpen, setFinalStanceOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const showDebug =
    process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_SHOW_DEBUG === "1";

  const topicId = searchParams.get("topicId") ?? "";
  const stanceParam = searchParams.get("stance") ?? "supporting";
  const entry = searchParams.get("entry") ?? null;
  const oppositeStance = stanceParam === "supporting" ? "opposing" : "supporting";

  const topic = useMemo(() => mockTopics.find((item) => item.id === topicId), [topicId]);

  const article = useMemo(() => {
    if (!topic) return undefined;
    const targetStance = oppositeStance === "supporting" ? "con" : "pro";
    return topic.articles.find((item) => item.stance === targetStance);
  }, [topic, oppositeStance]);

  const sameStanceArticle = useMemo(
    () => {
      if (!topic || !article) return undefined;
      const sameStanceList = topic.articles.filter((item) => item.stance === article.stance);
      return sameStanceList.find((item) => item.id !== article.id);
    },
    [topic, article]
  );

  const oppositeArticle = useMemo(
    () => {
      if (!topic || !article) return undefined;
      const oppositeStanceValue = article.stance === "pro" ? "con" : "pro";
      return topic.articles.find((item) => item.stance === oppositeStanceValue);
    },
    [topic, article]
  );

  useEffect(() => {
    if (!article || anonymousId === "pending") return;
    trackEvent("article_open", {
      userId: user?.id ?? null,
      anonymousId,
      topicId,
      articleId: article.id,
      metadata: entry ? { entry } : undefined
    });
  }, [article?.id, anonymousId, user?.id, entry, topicId]);

  const handleNextSame = async () => {
    setActionError(null);
    if (!sameStanceArticle) {
      setActionError("找不到對應文章，請返回首頁再試。");
      return;
    }
    if (anonymousId === "pending") {
      setActionError("正在建立訪客身份，請稍候再試。");
      return;
    }
    await trackEvent("article_next_same", {
      userId: user?.id ?? null,
      anonymousId,
      topicId,
      articleId: sameStanceArticle.id
    });
    router.push(`/read?topicId=${topicId}&stance=${stanceParam}`);
  };

  const handleNextOpposite = async () => {
    setActionError(null);
    if (!oppositeArticle) {
      setActionError("找不到對應文章，請返回首頁再試。");
      return;
    }
    if (anonymousId === "pending") {
      setActionError("正在建立訪客身份，請稍候再試。");
      return;
    }
    await trackEvent("article_next_opposite", {
      userId: user?.id ?? null,
      anonymousId,
      topicId,
      articleId: oppositeArticle.id
    });
    const nextStanceParam = article?.stance === "pro" ? "supporting" : "opposing";
    router.push(`/read?topicId=${topicId}&stance=${nextStanceParam}`);
  };

  const handleReadComplete = async () => {
    setActionError(null);
    if (!article) {
      setActionError("找不到文章內容，請返回首頁再試。");
      return;
    }
    if (anonymousId === "pending") {
      setActionError("正在建立訪客身份，請稍候再試。");
      return;
    }
    await trackEvent("article_read_complete", {
      userId: user?.id ?? null,
      anonymousId,
      topicId,
      articleId: article.id
    });
    setFinalStanceOpen(true);
  };

  const handleFinalStance = async (value: number) => {
    if (!article) {
      setActionError("找不到文章內容，無法送出立場。");
      return;
    }
    if (anonymousId === "pending") {
      setActionError("正在建立訪客身份，請稍候再試。");
      return;
    }
    await saveStance(topicId, value, "final", anonymousId, user?.id ?? null);
    await trackEvent("stance_set_final", {
      userId: user?.id ?? null,
      anonymousId,
      topicId,
      metadata: { value }
    });
    router.push("/");
  };

  if (!article || !topic) {
    const availableArticles = topic?.articles.length ?? 0;
    const totalArticles = mockTopics.reduce((count, item) => count + item.articles.length, 0);
    const availableIds = mockTopics.slice(0, 5).map((item) => item.id).join(", ");
    return (
      <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center p-6 text-sm text-white/60">
        <div className="space-y-2 text-center">
          <p>找不到文章</p>
          {showDebug ? (
            <p className="text-xs text-white/40">
              topicId={topicId || "none"} · topicsCount={mockTopics.length} · articlesCount=
              {totalArticles} · availableArticles={availableArticles} · ids={availableIds || "none"}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 px-4 py-6">
      <div className="space-y-2">
        <p className="text-xs text-white/60">{topic.title}</p>
        <h1 className="text-2xl font-semibold">{article.title}</h1>
        <p className="text-xs text-white/50">
          {article.author} · {article.stance === "pro" ? "支持方" : "反方"}
        </p>
        <p className="text-xs text-white/50">撰寫時間：{formatDateTime(article.publishedAt)}</p>
      </div>

      <article className="glass rounded-2xl p-5">
        <ArticleRenderer blocks={article.content} />
      </article>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          className="flex-1 rounded-xl border border-white/20 py-3 text-sm"
          onClick={handleNextSame}
          disabled={!sameStanceArticle || anonymousId === "pending"}
        >
          繼續看同一方文章
        </button>
        <button
          className="flex-1 rounded-xl border border-white/20 py-3 text-sm"
          onClick={handleNextOpposite}
          disabled={!oppositeArticle || anonymousId === "pending"}
        >
          看另一方文章
        </button>
        <button
          className="flex-1 rounded-xl bg-white/10 py-3 text-sm"
          onClick={handleReadComplete}
          disabled={anonymousId === "pending"}
        >
          結束閱讀
        </button>
      </div>

      {actionError ? <p className="text-xs text-amber-200">{actionError}</p> : null}

      <CommentSection parentType="article" parentId={article.id} topicId={topicId} articleId={article.id} />

      <StanceModal
        open={finalStanceOpen}
        title="閱讀後立場更新"
        label="閱讀後你的立場"
        onConfirm={handleFinalStance}
        onClose={() => setFinalStanceOpen(false)}
        confirmDisabled={anonymousId === "pending"}
        confirmHint={anonymousId === "pending" ? "正在建立訪客身份，請稍候。" : actionError ?? undefined}
      />
    </div>
  );
}
