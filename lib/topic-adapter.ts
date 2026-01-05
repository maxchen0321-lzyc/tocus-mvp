import type { Topic as UiTopic } from "./types";
import type { Topic as NotionTopic } from "@/data/mockTopics";

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

export const adaptNotionTopics = (topics: NotionTopic[]) => {
  const mapped = topics.map(mapNotionTopicToUi);
  const filtered = mapped.filter((topic) => topic.id && topic.title);

  return {
    topics: filtered,
    adapterCountBeforeFilter: mapped.length,
    adapterCountAfterFilter: filtered.length
  };
};
