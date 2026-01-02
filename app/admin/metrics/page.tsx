import { getSupabaseServerClient } from "@/lib/supabase";
import { hasSupabaseConfig } from "@/lib/env";

type EventRow = {
  name: string;
  user_id: string | null;
  anonymous_id: string | null;
  topic_id: string | null;
  article_id: string | null;
  created_at: string;
};

type StanceRow = {
  user_id: string | null;
  anonymous_id: string | null;
  topic_id: string;
  value: number;
  phase: "initial" | "final";
  created_at: string;
};

export default async function AdminMetricsPage() {
  if (!hasSupabaseConfig) {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center p-6 text-sm text-white/60">
        請先在 .env.local 設定 Supabase keys
      </div>
    );
  }

  const supabase = getSupabaseServerClient();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const since = startOfDay.toISOString();

  const { data: events } = await supabase
    .from("events")
    .select("name,user_id,anonymous_id,topic_id,article_id,created_at")
    .gte("created_at", since);
  const { data: stances } = await supabase
    .from("stances")
    .select("user_id,anonymous_id,topic_id,value,phase,created_at")
    .gte("created_at", since);

  const eventRows = (events ?? []) as EventRow[];
  const stanceRows = (stances ?? []) as StanceRow[];

  const dauSet = new Set(
    eventRows.map((event) => event.user_id ?? event.anonymous_id ?? "unknown")
  );
  const dau = dauSet.size;

  const swipeLeft = eventRows.filter((event) => event.name === "topic_swipe_left").length;
  const swipeRight = eventRows.filter((event) => event.name === "topic_swipe_right").length;
  const swipeTotal = swipeLeft + swipeRight;
  const rightSwipeRate = swipeTotal === 0 ? 0 : swipeRight / swipeTotal;

  const impressions = eventRows.filter((event) => event.name === "topic_impression").length;
  const collectionRate = impressions === 0 ? 0 : swipeRight / impressions;

  const articleOpen = eventRows.filter((event) => event.name === "article_open").length;
  const articleComplete = eventRows.filter((event) => event.name === "article_read_complete").length;
  const readCompleteRate = articleOpen === 0 ? 0 : articleComplete / articleOpen;

  const stanceMap = new Map<string, { initial?: number; final?: number }>();
  for (const stance of stanceRows) {
    const key = `${stance.user_id ?? stance.anonymous_id ?? "anon"}:${stance.topic_id}`;
    const entry = stanceMap.get(key) ?? {};
    if (stance.phase === "initial") entry.initial = stance.value;
    if (stance.phase === "final") entry.final = stance.value;
    stanceMap.set(key, entry);
  }
  const deltas = Array.from(stanceMap.values())
    .filter((entry) => entry.initial != null && entry.final != null)
    .map((entry) => Math.abs((entry.final ?? 0) - (entry.initial ?? 0)));
  const stanceDeltaAvg =
    deltas.length === 0 ? 0 : deltas.reduce((sum, value) => sum + value, 0) / deltas.length;

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 px-4 py-6 text-sm">
      <h1 className="text-xl font-semibold">/admin/metrics</h1>
      <p className="text-xs text-white/60">日期：{startOfDay.toLocaleDateString("zh-TW")}</p>
      <div className="glass rounded-2xl p-4">
        <ul className="space-y-2">
          <li>DAU: {dau}</li>
          <li>滑卡數: {swipeTotal}</li>
          <li>右滑率: {(rightSwipeRate * 100).toFixed(1)}%</li>
          <li>收藏率: {(collectionRate * 100).toFixed(1)}%</li>
          <li>閱讀完成率: {(readCompleteRate * 100).toFixed(1)}%</li>
          <li>立場變動幅度 (avg): {stanceDeltaAvg.toFixed(1)}</li>
        </ul>
      </div>
    </div>
  );
}
