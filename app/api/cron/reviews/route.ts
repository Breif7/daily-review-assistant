import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { generateDailyReview, generateWeeklyPlan } from "@/lib/review";
import { weekRange, todayIso } from "@/lib/dates";

// Vercel Cron hits this hourly (see vercel.json). At ~21:30 UTC it writes today's nightly
// review for every active user; on Sundays it also writes the week's plan. This is a single
// global time rather than per-user local time — see the README for the smaller-option note.
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const today = todayIso();
  const { data: users } = await supabase.from("tasks").select("user_id").eq("date", today);
  const userIds = [...new Set((users ?? []).map((u) => u.user_id))];

  const dailyResults = await Promise.allSettled(userIds.map((id) => generateDailyReview(supabase, id, today)));

  let weeklyGenerated = 0;
  if (new Date().getUTCDay() === 0) {
    const { monday } = weekRange();
    const weeklyResults = await Promise.allSettled(userIds.map((id) => generateWeeklyPlan(supabase, id, monday)));
    weeklyGenerated = weeklyResults.filter((r) => r.status === "fulfilled").length;
  }

  return NextResponse.json({
    dailyGenerated: dailyResults.filter((r) => r.status === "fulfilled").length,
    weeklyGenerated,
  });
}
