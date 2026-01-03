import { hasSupabaseConfig } from "./env";
import { supabaseBrowser } from "./supabase";
import type { Comment } from "./types";

const COMMENTS_KEY = "tocus_comments";
const STANCES_KEY = "tocus_stances";

export type CollectionRecord = {
  topic_id: string;
  user_id: string;
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

export type DbResult<T> = {
  data: T;
  error: string | null;
  source: "supabase" | "local";
};

export async function getCollections(
  userId: string | null
): Promise<DbResult<CollectionRecord[]>> {
  if (!hasSupabaseConfig) {
    return { data: [], error: "missing_supabase_keys", source: "local" };
  }
  if (!userId) {
    return { data: [], error: "missing_user_id", source: "supabase" };
  }
  const { data, error } = await supabaseBrowser
    .from("collections")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    console.error("getCollections error", error);
  }
  return {
    data: (data ?? []) as CollectionRecord[],
    error: error?.message ?? null,
    source: "supabase"
  };
}

export async function addCollection(
  topicId: string,
  userId: string | null
): Promise<DbResult<CollectionRecord[]>> {
  console.log("addCollection called", { topicId, userId });
  if (!hasSupabaseConfig) {
    return { data: [], error: "missing_supabase_keys", source: "local" };
  }
  if (!userId) {
    return { data: [], error: "missing_user_id", source: "supabase" };
  }
  const record = {
    topic_id: topicId,
    user_id: userId
  };
  const { error: insertError } = await supabaseBrowser
    .from("collections")
    .upsert(record, { onConflict: "user_id,topic_id" });
  if (insertError) {
    console.error("addCollection insert error", insertError);
    return { data: [], error: insertError.message, source: "supabase" };
  }
  return getCollections(userId);
}

export async function removeCollection(
  topicId: string,
  userId: string | null
): Promise<DbResult<CollectionRecord[]>> {
  if (!hasSupabaseConfig) {
    return { data: [], error: "missing_supabase_keys", source: "local" };
  }
  if (!userId) {
    return { data: [], error: "missing_user_id", source: "supabase" };
  }
  const { error } = await supabaseBrowser
    .from("collections")
    .delete()
    .match({ topic_id: topicId, user_id: userId });
  if (error) {
    console.error("removeCollection error", error);
    return { data: [], error: error.message, source: "supabase" };
  }
  return getCollections(userId);
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
