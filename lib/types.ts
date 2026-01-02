export type Topic = {
  id: string;
  title: string;
  tag: string;
  happenedAt: string;
  summary: string;
  context: string;
};

export type Article = {
  id: string;
  topicId: string;
  stance: "supporting" | "opposing";
  title: string;
  content: string;
  author: string;
  createdAt: string;
};

export type Comment = {
  id: string;
  parentType: "topic" | "article";
  parentId: string;
  userId?: string | null;
  anonymousId: string;
  content: string;
  createdAt: string;
};

export type EventName =
  | "auth_sign_up"
  | "auth_login"
  | "topic_impression"
  | "topic_swipe_left"
  | "topic_swipe_right"
  | "collection_open"
  | "collection_remove"
  | "stance_set_initial"
  | "stance_set_final"
  | "article_open"
  | "article_read_complete"
  | "article_next_same"
  | "article_next_opposite"
  | "comment_create";
