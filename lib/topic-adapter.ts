import type { Topic as UiTopic } from "./types";
import type { Topic as NotionTopic } from "./notion-types";
import { articles, topics as localTopics } from "./data";
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

const topicIdSet = new Set(articles.map((article) => article.topicId));

const mappedNotionTopics = mockTopics.map(mapNotionTopicToUi);
const filteredNotionTopics = mappedNotionTopics.filter((topic) => topicIdSet.has(topic.id));

export const topicsForSwipe: UiTopic[] =
  filteredNotionTopics.length > 0 ? filteredNotionTopics : localTopics;

export const topicsForSwipeMeta = {
  source: filteredNotionTopics.length > 0 ? "notion" : "local",
  topicsCount: topicsForSwipe.length,
  notionCount: mappedNotionTopics.length,
  filteredCount: filteredNotionTopics.length,
  localCount: localTopics.length,
  error: filteredNotionTopics.length > 0 ? null : "notion_topics_without_articles"
};
