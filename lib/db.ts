import { hasSupabaseConfig } from "./env";
import { supabaseBrowser } from "./supabase";
import type { Comment } from "./types";

const COLLECTIONS_KEY = "tocus_collections";
const COMMENTS_KEY = "tocus_comments";
const STANCES_KEY = "tocus_stances";

type CollectionRecord = {
  topic_id: string;
  user_id: string | null;
  anonymous_id: string;
  created_at: string;
};

type StanceRecord = {
  topic_id: string;
  user_id: string | null;
  anonymous_id: string;
  value: number;
  phase: "initial" | "final";
  created_at: string;
};

export async function getCollections(anonymousId: string, userId: string | null) {
  if (!hasSupabaseConfig) {
    if (typeof window === "undefined") return [];
    const existing = window.localStorage.getItem(COLLECTIONS_KEY);
    const list = existing ? (JSON.parse(existing) as CollectionRecord[]) : [];
    return list.filter((item) =>
      userId ? item.user_id === userId : item.anonymous_id === anonymousId
    );
  }
  const query = supabaseBrowser.from("collections").select("*");
  const { data } =
    userId == null
      ? await query.eq("anonymous_id", anonymousId)
      : await query.or(`user_id.eq.${userId},anonymous_id.eq.${anonymousId}`);
  return data ?? [];
}

export async function mergeCollections(anonymousId: string, userId: string) {
  if (!hasSupabaseConfig) {
    if (typeof window === "undefined") return;
    const existing = window.localStorage.getItem(COLLECTIONS_KEY);
    const list = existing ? (JSON.parse(existing) as CollectionRecord[]) : [];
    const updated = list.map((item) =>
      item.anonymous_id === anonymousId ? { ...item, user_id: userId } : item
    );
    const deduped = updated.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (other) =>
            other.topic_id === item.topic_id &&
            other.user_id === item.user_id &&
            other.anonymous_id === item.anonymous_id
        )
    );
    window.localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(deduped));
    return;
  }

  const { data: anonCollections } = await supabaseBrowser
    .from("collections")
    .select("*")
    .eq("anonymous_id", anonymousId)
    .is("user_id", null);
  const { data: userCollections } = await supabaseBrowser
    .from("collections")
    .select("*")
    .eq("user_id", userId);

  const userTopicIds = new Set((userCollections ?? []).map((item) => item.topic_id));
  for (const record of anonCollections ?? []) {
    if (userTopicIds.has(record.topic_id)) {
      await supabaseBrowser.from("collections").delete().match({ id: record.id });
    } else {
      await supabaseBrowser
        .from("collections")
        .update({ user_id: userId })
        .match({ id: record.id });
    }
  }
}

export async function addCollection(
  topicId: string,
  anonymousId: string,
  userId: string | null
) {
  const record: CollectionRecord = {
    topic_id: topicId,
    anonymous_id: anonymousId,
    user_id: userId,
    created_at: new Date().toISOString()
  };

  if (!hasSupabaseConfig) {
    if (typeof window === "undefined") return;
    const existing = window.localStorage.getItem(COLLECTIONS_KEY);
    const list = existing ? (JSON.parse(existing) as CollectionRecord[]) : [];
    if (!list.find((item) => item.topic_id === topicId)) {
      list.push(record);
      window.localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(list));
    }
    return;
  }

  await supabaseBrowser.from("collections").insert(record);
}

export async function removeCollection(
  topicId: string,
  anonymousId: string,
  userId: string | null
) {
  if (!hasSupabaseConfig) {
    if (typeof window === "undefined") return;
    const existing = window.localStorage.getItem(COLLECTIONS_KEY);
    const list = existing ? (JSON.parse(existing) as CollectionRecord[]) : [];
    const next = list.filter((item) => item.topic_id !== topicId);
    window.localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(next));
    return;
  }

  const query = supabaseBrowser.from("collections").delete().match({ topic_id: topicId });
  if (userId == null) {
    await query.eq("anonymous_id", anonymousId).is("user_id", null);
  } else {
    await query.match({ user_id: userId, anonymous_id: anonymousId });
  }
}

export async function saveStance(
  topicId: string,
  value: number,
  phase: "initial" | "final",
  anonymousId: string,
  userId: string | null
) {
  const record: StanceRecord = {
    topic_id: topicId,
    value,
    phase,
    anonymous_id: anonymousId,
    user_id: userId,
    created_at: new Date().toISOString()
  };

  if (!hasSupabaseConfig) {
    if (typeof window === "undefined") return;
    const existing = window.localStorage.getItem(STANCES_KEY);
    const list = existing ? (JSON.parse(existing) as StanceRecord[]) : [];
    list.push(record);
    window.localStorage.setItem(STANCES_KEY, JSON.stringify(list));
    return;
  }

  await supabaseBrowser.from("stances").insert(record);
}

export async function listComments(parentType: Comment["parentType"], parentId: string) {
  if (!hasSupabaseConfig) {
    if (typeof window === "undefined") return [];
    const existing = window.localStorage.getItem(COMMENTS_KEY);
    const list = existing ? (JSON.parse(existing) as Comment[]) : [];
    return list.filter((comment) => comment.parentType === parentType && comment.parentId === parentId);
  }

  const { data } = await supabaseBrowser
    .from("comments")
    .select("*")
    .match({ parent_type: parentType, parent_id: parentId })
    .order("created_at", { ascending: false });
  return (
    data?.map((item) => ({
      id: item.id as string,
      parentType: item.parent_type as Comment["parentType"],
      parentId: item.parent_id as string,
      userId: item.user_id as string | null,
      anonymousId: item.anonymous_id as string,
      content: item.content as string,
      createdAt: item.created_at as string
    })) ?? []
  );
}

export async function createComment(comment: Comment) {
  if (!hasSupabaseConfig) {
    if (typeof window === "undefined") return;
    const existing = window.localStorage.getItem(COMMENTS_KEY);
    const list = existing ? (JSON.parse(existing) as Comment[]) : [];
    list.unshift(comment);
    window.localStorage.setItem(COMMENTS_KEY, JSON.stringify(list));
    return;
  }

  await supabaseBrowser.from("comments").insert({
    id: comment.id,
    parent_type: comment.parentType,
    parent_id: comment.parentId,
    user_id: comment.userId,
    anonymous_id: comment.anonymousId,
    content: comment.content,
    created_at: comment.createdAt
  });
}
