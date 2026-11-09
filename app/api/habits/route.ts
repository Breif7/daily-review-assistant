import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, icon, target_value, unit } = await req.json();
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });

  const { error } = await supabase.from("habits").insert({
    user_id: user.id,
    name,
    icon: icon || "✅",
    target_value: target_value || 1,
    unit: unit || "x",
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
