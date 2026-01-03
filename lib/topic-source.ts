import type { Topic as UiTopic, Article } from "./types";
import { articles, topics as fallbackTopics } from "./data";
import { mockTopics } from "./mock-topics";
import { adaptNotionTopics } from "./topic-adapter";

export type TopicDataSource = "notion" | "supabase" | "fallback_old_seed";

export type TopicSourceDiagnostics = {
  source: TopicDataSource;
  topicsCount: number;
  adapterCountBeforeFilter: number;
  adapterCountAfterFilter: number;
  truncated: boolean;
  limit: number | null;
  truncatedReason: string | null;
};

const parseTopicLimit = (value: string | undefined) => {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
};

const buildTopicState = () => {
  const adapted = adaptNotionTopics(mockTopics);
  const hasNotionTopics = adapted.topics.length > 0;
  const source: TopicDataSource = hasNotionTopics ? "notion" : "fallback_old_seed";
  const baseTopics = hasNotionTopics ? adapted.topics : fallbackTopics;
  const limit = parseTopicLimit(process.env.NEXT_PUBLIC_TOPIC_LIMIT);
  const truncated = limit !== null && baseTopics.length > limit;
  const swipeTopics = limit ? baseTopics.slice(0, limit) : baseTopics;

  const diagnostics: TopicSourceDiagnostics = {
    source,
    topicsCount: swipeTopics.length,
    adapterCountBeforeFilter: adapted.adapterCountBeforeFilter,
    adapterCountAfterFilter: adapted.adapterCountAfterFilter,
    truncated,
    limit,
    truncatedReason: truncated ? "env_limit" : null
  };

  return {
    swipeTopics,
    allTopics: baseTopics,
    diagnostics
  };
};

const topicState = buildTopicState();

export const getSwipeTopics = (): UiTopic[] => topicState.swipeTopics;

export const getTopicById = (id: string): UiTopic | undefined =>
  topicState.allTopics.find((topic) => topic.id === id);

export const getTopicSourceDiagnostics = (): TopicSourceDiagnostics =>
  topicState.diagnostics;

export const getOppositeArticleForTopic = (
  topicId: string,
  stance: Article["stance"]
): Article | undefined => {
  const opposite = stance === "supporting" ? "opposing" : "supporting";
  return articles.find(
    (article) => article.topicId === topicId && article.stance === opposite
  );
};
