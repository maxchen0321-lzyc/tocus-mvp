"use client";

import type { ArticleBlock } from "@/data/mockTopics";

type Props = {
  blocks: ArticleBlock[];
};

export default function ArticleRenderer({ blocks }: Props) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h3 key={`${block.text}-${index}`} className="text-lg font-semibold text-white">
              {block.text}
            </h3>
          );
        }
        return (
          <p key={`${block.text}-${index}`} className="text-sm leading-7 text-white/90">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
