import type { Topic, Article } from "./types";

export const topics: Topic[] = [
  {
    id: "topic-1",
    title: "都市道路是否應全面實施 30 km/h 限速？",
    tag: "交通安全",
    happenedAt: "2024-07-02",
    summary: "多個城市正在試行降低市區道路速限，以降低行人事故。",
    context: "支持者認為可降低致死率，反對者擔心交通效率與物流成本。"
  },
  {
    id: "topic-2",
    title: "政府是否應補貼生成式 AI 產業？",
    tag: "科技產業",
    happenedAt: "2024-07-15",
    summary: "產官學聯盟提出 AI 基礎建設補助方案。",
    context: "支持者認為能提升國際競爭力，反對者擔心資源錯置與壟斷。"
  },
  {
    id: "topic-3",
    title: "公立高中是否應取消早自習？",
    tag: "教育政策",
    happenedAt: "2024-08-01",
    summary: "多所學校試行晚到校政策，關注學生睡眠。",
    context: "支持者強調身心健康，反對者擔心升學準備不足。"
  }
];

export const articles: Article[] = [
  {
    id: "article-1",
    topicId: "topic-1",
    stance: "supporting",
    title: "限速 30 提升行人安全的證據",
    content:
      "國際研究顯示，當車速降低至 30 km/h，行人死亡率顯著下降。城市設計應以人為本，降低衝突風險。",
    author: "城市安全聯盟"
  },
  {
    id: "article-2",
    topicId: "topic-1",
    stance: "opposing",
    title: "交通效率與物流需要更彈性的限速",
    content:
      "全面限速可能延長通勤與配送時間。應該針對學校與高風險區域限速，而非一刀切。",
    author: "物流協會"
  },
  {
    id: "article-3",
    topicId: "topic-2",
    stance: "supporting",
    title: "AI 補貼是國家競爭力的關鍵投資",
    content:
      "生成式 AI 需要龐大算力與人才，政府補助能降低企業門檻，加速技術落地。",
    author: "科技政策研究院"
  },
  {
    id: "article-4",
    topicId: "topic-2",
    stance: "opposing",
    title: "市場應決定 AI 產業走向",
    content:
      "政府補貼可能形成壟斷與資源錯配，應透過創新基金與市場競爭來篩選。",
    author: "自由市場聯盟"
  },
  {
    id: "article-5",
    topicId: "topic-3",
    stance: "supporting",
    title: "取消早自習改善學生睡眠品質",
    content:
      "研究顯示青少年需要更長睡眠，晚到校可改善注意力與心理健康。",
    author: "教育心理學會"
  },
  {
    id: "article-6",
    topicId: "topic-3",
    stance: "opposing",
    title: "早自習是升學準備的必要訓練",
    content:
      "取消早自習可能導致學習時間不足，影響競爭力與自律訓練。",
    author: "升學家長聯盟"
  }
];
