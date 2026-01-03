import type { Topic as UiTopic } from "./types";
import type { Topic as NotionTopic } from "./notion-types";
import { mockTopics } from "./mock-topics";

const summaryFromContext = (context: string) => {
  if (context.length <= 48) return context;
  return `${context.slice(0, 48)}…`;
};

export function mapNotionTopicToUi(topic: NotionTopic): UiTopic {
  return {
    id: topic.id,
    title: topic.title,
    tag: topic.category,
    happenedAt: topic.publishedAt,
    summary: summaryFromContext(topic.context),
    context: topic.context
  };
}

export const topicsForSwipe: UiTopic[] = mockTopics.map(mapNotionTopicToUi);
