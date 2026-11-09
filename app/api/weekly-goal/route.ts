import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { week_start, statement, progress } = await req.json();
  if (!week_start || !statement) {
    return NextResponse.json({ error: "week_start and statement are required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("weekly_goals")
    .upsert(
      { user_id: user.id, week_start, statement, ...(progress != null ? { progress } : {}) },
      { onConflict: "user_id,week_start" }
    );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
