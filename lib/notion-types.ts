export type ArticleBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string };

export type Article = {
  id: string;
  stance: "pro" | "con";
  title: string;
  author: string;
  publishedAt: string;
  content: ArticleBlock[];
};

export type Topic = {
  id: string;
  title: string;
  context: string;
  publishedAt: string;
  category: string;
  articles: Article[];
};
