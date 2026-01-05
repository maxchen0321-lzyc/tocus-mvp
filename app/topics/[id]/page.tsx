"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import TopicDetail from "@/components/TopicDetail";
import { mockTopics } from "@/data/mockTopics";

export default function TopicDetailPage() {
  const params = useParams<{ id: string }>();
  const topic = mockTopics.find((item) => item.id === params.id);

  if (!topic) {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center p-6 text-sm text-white/60">
        找不到議題
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 px-4 py-6">
      <Link className="text-xs text-white/60" href="/">
        返回首頁
      </Link>
      <TopicDetail topic={topic} />
    </div>
  );
}
