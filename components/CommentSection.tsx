"use client";

import { useEffect, useState } from "react";
import type { Comment } from "@/lib/types";
import { createComment, listComments } from "@/lib/db";
import { trackEvent } from "@/lib/events";
import { useAuth } from "@/app/providers";

type Props = {
  parentType: Comment["parentType"];
  parentId: string;
  topicId?: string;
  articleId?: string;
  onClose?: () => void;
};

export default function CommentSection({
  parentType,
  parentId,
  topicId,
  articleId,
  onClose
}: Props) {
  const { user, anonymousId } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!parentId) return;
    listComments(parentType, parentId).then(setComments);
  }, [parentId, parentType]);

  const handleCreateComment = async () => {
    if (!commentText.trim() || anonymousId === "pending") return;
    const comment: Comment = {
      id: crypto.randomUUID(),
      parentType,
      parentId,
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
      topicId,
      articleId
    });
  };

  return (
    <section className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">留言區</h2>
        {onClose ? (
          <button className="text-xs text-white/60" onClick={onClose}>
            收合
          </button>
        ) : null}
      </div>
      <div className="mt-3 space-y-2">
        <textarea
          className="w-full rounded-xl bg-white/10 p-3 text-sm"
          rows={3}
          placeholder="留下你的想法"
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
        />
        <button className="rounded-xl bg-white/10 px-4 py-2 text-sm" onClick={handleCreateComment}>
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
  );
}
