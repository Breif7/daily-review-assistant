import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Upserts today's (or a given date's) check-in value for a habit.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: habit } = await supabase.from("habits").select("user_id, target_value").eq("id", id).single();
  if (!habit || habit.user_id !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { date, value } = await req.json();
  const day = date || new Date().toISOString().slice(0, 10);

  const { error } = await supabase
    .from("habit_logs")
    .upsert(
      { habit_id: id, date: day, value, done: value >= habit.target_value },
      { onConflict: "habit_id,date" }
    );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
