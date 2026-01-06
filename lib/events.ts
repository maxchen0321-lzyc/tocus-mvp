import { hasSupabaseConfig } from "./env";
import type { EventName } from "./types";

type EventPayload = {
  userId: string | null;
  anonymousId: string;
  topicId?: string | null;
  articleId?: string | null;
  metadata?: Record<string, unknown>;
};

const LOCAL_EVENTS_KEY = "tocus_events";

export async function trackEvent(name: EventName, payload: EventPayload) {
  const event = {
    name,
    user_id: payload.userId,
    anonymous_id: payload.anonymousId,
    topic_id: payload.topicId ?? null,
    article_id: payload.articleId ?? null,
    metadata: payload.metadata ?? {},
    created_at: new Date().toISOString()
  };

  if (typeof window !== "undefined") {
    const existing = window.localStorage.getItem(LOCAL_EVENTS_KEY);
    const list = existing ? (JSON.parse(existing) as typeof event[]) : [];
    list.push(event);
    window.localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(list));
  }

  if (hasSupabaseConfig) {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event)
    });
  }
}
