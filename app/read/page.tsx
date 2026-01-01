"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { articles, topics } from "@/lib/data";
import { createComment, listComments, saveStance } from "@/lib/db";
import { trackEvent } from "@/lib/events";
import { useAuth } from "@/app/providers";
import type { Comment } from "@/lib/types";
import StanceModal from "@/components/StanceModal";

export default function ReadPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, anonymousId } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsOpen, setCommentsOpen] = useState(false);
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

  useEffect(() => {
    if (!article) return;
    listComments("article", article.id).then(setComments);
  }, [article?.id]);

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

  const handleCreateComment = async () => {
    if (!article || !commentText.trim() || anonymousId === "pending") return;
    const comment: Comment = {
      id: crypto.randomUUID(),
      parentType: "article",
      parentId: article.id,
      userId: user?.id ?? null,
      anonymousId,
      content: commentText.trim(),
      createdAt: new Date().toISOString()
    };
    await createComment(comment);
    setComments((prev) => [comment, ...prev]);
    setCommentText("");
    await trackEvent("comment_create", {
      userId: user?.id ?? null,
      anonymousId,
      topicId: article.topicId,
      articleId: article.id
    });
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
      </div>
      <article className="glass rounded-2xl p-5 text-sm leading-7 text-white/90">
        {article.content}
      </article>
      {commentsOpen ? (
        <section className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">留言區</h2>
            <button
              className="text-xs text-white/60"
              onClick={() => setCommentsOpen(false)}
            >
              收合
            </button>
          </div>
          <div className="mt-3 space-y-2">
            <textarea
              className="w-full rounded-xl bg-white/10 p-3 text-sm"
              rows={3}
              placeholder="留下你的想法"
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
            />
            <button
              className="rounded-xl bg-white/10 px-4 py-2 text-sm"
              onClick={handleCreateComment}
            >
              送出留言
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {comments.length === 0 ? (
              <p className="text-xs text-white/50">尚無留言</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="rounded-xl border border-white/10 p-3 text-xs">
                  <p className="text-white/70">{comment.content}</p>
                  <p className="mt-2 text-[10px] text-white/40">
                    {new Date(comment.createdAt).toLocaleString("zh-TW")}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      ) : null}
      <div className="sticky bottom-4 mt-auto space-y-3">
        <button className="w-full rounded-xl border border-white/20 py-3 text-sm" onClick={handleNextSame}>
          繼續看同一方文章
        </button>
        <button
          className="w-full rounded-xl border border-white/20 py-3 text-sm"
          onClick={handleNextOpposite}
        >
          看反方文章
        </button>
        <button
          className="w-full rounded-xl border border-white/20 py-3 text-sm"
          onClick={() => setCommentsOpen(true)}
        >
          留言區
        </button>
        <button className="w-full rounded-xl bg-white/10 py-3 text-sm" onClick={handleReadComplete}>
          結束閱讀
        </button>
      </div>
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
