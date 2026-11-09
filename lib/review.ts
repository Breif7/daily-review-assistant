import Anthropic from "@anthropic-ai/sdk";
import { SupabaseClient } from "@supabase/supabase-js";
import { weekRange } from "@/lib/dates";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/** Builds (or returns the existing) nightly review for a user and date. */
export async function generateDailyReview(supabase: SupabaseClient, userId: string, date: string) {
  const { data: existing } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", userId)
    .eq("kind", "daily")
    .eq("period_start", date)
    .maybeSingle();
  if (existing) return existing;

  const [{ data: habits }, { data: tasks }, { data: blocks }, { data: notes }] = await Promise.all([
    supabase.from("habits").select("name, target_value, unit, habit_logs!inner(value, done, date)").eq("user_id", userId).eq("habit_logs.date", date),
    supabase.from("tasks").select("title, done").eq("user_id", userId).eq("date", date),
    supabase.from("plan_blocks").select("start_time, title, category").eq("user_id", userId).eq("date", date),
    supabase.from("notes").select("content").eq("user_id", userId).eq("date", date),
  ]);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-5-5",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `You are a warm, direct personal coach reviewing someone's day (${date}).
Habits: ${JSON.stringify(habits ?? [])}
Tasks: ${JSON.stringify(tasks ?? [])}
Planned schedule: ${JSON.stringify(blocks ?? [])}
Quick notes: ${JSON.stringify((notes ?? []).map((n) => n.content))}

Write, in plain text (no markdown headers), under 150 words:
1. What went well today.
2. What didn't go well, or was skipped.
3. One specific, actionable suggestion for tomorrow.
If there's little or no data, say so briefly and encourage logging more tomorrow rather than guessing.`,
      },
    ],
  });

  const content_md = message.content.find((b) => b.type === "text")?.text ?? "";
  const { data: review, error } = await supabase
    .from("reviews")
    .insert({ user_id: userId, kind: "daily", period_start: date, content_md })
    .select()
    .single();
  if (error) throw error;
  return review;
}

/** Builds (or returns the existing) Sunday weekly plan for the week starting `weekStart`. */
export async function generateWeeklyPlan(supabase: SupabaseClient, userId: string, weekStart: string) {
  const { data: existing } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", userId)
    .eq("kind", "weekly")
    .eq("period_start", weekStart)
    .maybeSingle();
  if (existing) return existing;

  const { days } = weekRange(new Date(weekStart));
  const [{ data: dailyReviews }, { data: habitLogs }, { data: goal }] = await Promise.all([
    supabase.from("reviews").select("period_start, content_md").eq("user_id", userId).eq("kind", "daily").in("period_start", days),
    supabase.from("habit_logs").select("habit_id, date, done, habits(name)").in("date", days).eq("habits.user_id", userId),
    supabase.from("weekly_goals").select("statement").eq("user_id", userId).eq("week_start", weekStart).maybeSingle(),
  ]);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-5-5",
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content: `You are a personal coach writing a Sunday weekly plan for the week starting ${weekStart}.
This week's goal was: ${goal?.statement ?? "(none set)"}
Nightly reviews from this week: ${JSON.stringify(dailyReviews ?? [])}
Habit check-ins this week: ${JSON.stringify(habitLogs ?? [])}

Write, in plain text (no markdown headers), under 200 words:
1. A short summary of how the week went.
2. One proposed focus/goal statement for next week (a single sentence, prefixed "Next week's goal: ").
3. Any habit adjustments worth trying.
4. 2-3 suggestions for next week's plan.`,
      },
    ],
  });

  const content_md = message.content.find((b) => b.type === "text")?.text ?? "";
  const { data: review, error } = await supabase
    .from("reviews")
    .insert({ user_id: userId, kind: "weekly", period_start: weekStart, content_md })
    .select()
    .single();
  if (error) throw error;
  return review;
}
