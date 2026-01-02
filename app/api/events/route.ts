import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { hasSupabaseConfig } from "@/lib/env";

export async function POST(request: Request) {
  if (!hasSupabaseConfig) {
    return NextResponse.json({ ok: false, error: "missing_supabase_keys" }, { status: 400 });
  }

  const body = await request.json();
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("events").insert(body);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
