import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, start_time, category, date } = await req.json();
  if (!title || !start_time) {
    return NextResponse.json({ error: "title and start_time are required" }, { status: 400 });
  }

  const { error } = await supabase.from("plan_blocks").insert({
    user_id: user.id,
    title,
    start_time,
    category: category || "Trabajo",
    date: date || new Date().toISOString().slice(0, 10),
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
