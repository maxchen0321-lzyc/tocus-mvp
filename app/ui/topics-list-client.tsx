"use client";

import Link from "next/link";
import { mockTopics } from "@/data/mockTopics";
import TopicCard from "@/components/TopicCard";
import TopBar from "@/components/TopBar";

export default function TopicsListClient() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 px-4 py-6">
      <TopBar />
      <div className="space-y-4">
        {mockTopics.map((topic) => (
          <Link key={topic.id} href={`/topics/${topic.id}`}>
            <TopicCard topic={topic} />
          </Link>
        ))}
      </div>
    </div>
  );
}
