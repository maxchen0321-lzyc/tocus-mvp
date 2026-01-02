"use client";

import { useEffect, useState } from "react";
import { topics } from "@/lib/data";
import { getCollections, removeCollection } from "@/lib/db";
import { trackEvent } from "@/lib/events";
import { useAuth } from "@/app/providers";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CollectionDrawer({ open, onClose }: Props) {
  const { user, anonymousId } = useAuth();
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    if (anonymousId !== "pending") {
      getCollections(anonymousId, user?.id ?? null).then((result) => {
        setItems(result.data.map((item) => item.topic_id));
        if (result.error) {
          console.error("collection drawer getCollections error", result.error);
        }
      });
    }
    if (anonymousId !== "pending") {
      trackEvent("collection_open", {
        userId: user?.id ?? null,
        anonymousId
      });
    }
  }, [open, anonymousId, user?.id]);

  if (!open) return null;

  const handleRemove = async (topicId: string) => {
    if (anonymousId === "pending") return;
    const result = await removeCollection(topicId, anonymousId, user?.id ?? null);
    if (result) {
      setItems(result.data.map((item) => item.topic_id));
      if (result.error) {
        console.error("collection drawer remove error", result.error);
      }
    }
    if (anonymousId !== "pending") {
      await trackEvent("collection_remove", {
        userId: user?.id ?? null,
        anonymousId,
        topicId
      });
    }
  };

  const list = topics.filter((topic) => items.includes(topic.id));

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60">
      <div className="glass h-full w-full max-w-sm p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">收藏</h2>
          <button className="text-sm text-white/60" onClick={onClose}>
            關閉
          </button>
        </div>
        <div className="mt-4 space-y-3 text-sm">
          {list.length === 0 ? (
            <p className="text-white/60">尚未收藏任何議題</p>
          ) : (
            list.map((topic) => (
              <div key={topic.id} className="rounded-xl border border-white/10 p-3">
                <p className="text-sm font-semibold">{topic.title}</p>
                <p className="text-xs text-white/60">{topic.tag}</p>
                <button
                  className="mt-2 text-xs text-red-300"
                  onClick={() => handleRemove(topic.id)}
                >
                  移除收藏
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
