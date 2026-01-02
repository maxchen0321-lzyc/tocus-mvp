"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { topics } from "@/lib/data";
import { getCollections, removeCollection } from "@/lib/db";
import { trackEvent } from "@/lib/events";
import { useAuth } from "@/app/providers";
import { formatDate } from "@/lib/utils";

export default function CollectionsPage() {
  const { user, anonymousId } = useAuth();
  const [items, setItems] = useState<string[]>([]);
  const [debug, setDebug] = useState<string>("pending");

  useEffect(() => {
    if (anonymousId === "pending") return;
    getCollections(anonymousId, user?.id ?? null).then((result) => {
      setItems(result.data.map((item) => item.topic_id));
      setDebug(
        `source=${result.source} count=${result.data.length} owner=${user?.id ?? anonymousId} error=${result.error ?? "none"}`
      );
    });
  }, [anonymousId, user?.id]);

  const handleRemove = async (topicId: string) => {
    if (anonymousId === "pending") return;
    const result = await removeCollection(topicId, anonymousId, user?.id ?? null);
    if (result) {
      setItems(result.data.map((item) => item.topic_id));
      setDebug(
        `source=${result.source} count=${result.data.length} owner=${user?.id ?? anonymousId} error=${result.error ?? "none"}`
      );
    }
    await trackEvent("collection_remove", {
      userId: user?.id ?? null,
      anonymousId,
      topicId
    });
  };

  const list = topics.filter((topic) => items.includes(topic.id));

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 px-4 py-6 text-sm">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">收藏</h1>
        <Link className="text-xs text-white/60" href="/">
          返回首頁
        </Link>
      </div>
      <p className="text-[10px] text-white/40">ColDebug: {debug}</p>
      {list.length === 0 ? (
        <div className="glass rounded-2xl p-4 text-white/60">尚未收藏任何議題</div>
      ) : (
        <div className="space-y-3">
          {list.map((topic) => (
            <div key={topic.id} className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>{formatDate(topic.happenedAt)}</span>
                <span className="rounded-full border border-white/20 px-2 py-0.5">
                  {topic.tag}
                </span>
              </div>
              <h2 className="mt-2 text-base font-semibold">{topic.title}</h2>
              <p className="mt-2 text-sm text-white/80">{topic.summary}</p>
              <button
                className="mt-3 text-xs text-red-300"
                onClick={() => handleRemove(topic.id)}
              >
                移除收藏
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
