import type { Topic as UiTopic, Article } from "./types";
import type { Topic as NotionTopic, Article as NotionArticle } from "./notion-types";
import { articles as fallbackArticles, topics as fallbackTopics } from "./data";
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

const mapNotionBlocksToContent = (blocks: NotionArticle["content"]) =>
  blocks
    .map((block) => (block.type === "heading" ? `## ${block.text}` : block.text))
    .join("\n\n");

const mapNotionArticlesToUi = (topics: NotionTopic[]): Article[] =>
  topics.flatMap((topic) =>
    topic.articles.map((article) => ({
      id: article.id,
      topicId: topic.id,
      stance: article.stance === "pro" ? "supporting" : "opposing",
      title: article.title,
      content: mapNotionBlocksToContent(article.content),
      author: article.author,
      createdAt: article.publishedAt
    }))
  );

const buildTopicState = () => {
  const adapted = adaptNotionTopics(mockTopics);
  const hasNotionTopics = adapted.topics.length > 0;
  const source: TopicDataSource = hasNotionTopics ? "notion" : "fallback_old_seed";
  const baseTopics = hasNotionTopics ? adapted.topics : fallbackTopics;
  const baseArticles = hasNotionTopics ? mapNotionArticlesToUi(mockTopics) : fallbackArticles;
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
    allArticles: baseArticles,
    diagnostics
  };
};

const topicState = buildTopicState();

export const getSwipeTopics = (): UiTopic[] => topicState.swipeTopics;

export const getTopicById = (id: string): UiTopic | undefined =>
  topicState.allTopics.find((topic) => topic.id === id);

export const getTopicSourceDiagnostics = (): TopicSourceDiagnostics =>
  topicState.diagnostics;

export const getArticleByTopicAndStance = (
  topicId: string,
  stance: Article["stance"]
): Article | undefined =>
  topicState.allArticles.find(
    (article) => article.topicId === topicId && article.stance === stance
  );

export const getArticlesForTopic = (topicId: string): Article[] =>
  topicState.allArticles.filter((article) => article.topicId === topicId);

export const getOppositeArticleForTopic = (
  topicId: string,
  stance: Article["stance"]
): Article | undefined => {
  const opposite = stance === "supporting" ? "opposing" : "supporting";
  return getArticleByTopicAndStance(topicId, opposite);
};
