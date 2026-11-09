import { createClient } from "@/lib/supabase/server";
import { weekRange } from "@/lib/dates";
import ReviewCard from "@/components/ReviewCard";
import WeeklyGoal from "@/components/WeeklyGoal";

export default async function WeeklyPage() {
  const supabase = await createClient();
  const { monday, days } = weekRange();

  const [{ data: goal }, { data: weeklyReview }, { data: dailyReviews }] = await Promise.all([
    supabase.from("weekly_goals").select("statement, progress").eq("week_start", monday).maybeSingle(),
    supabase.from("reviews").select("content_md").eq("kind", "weekly").eq("period_start", monday).maybeSingle(),
    supabase.from("reviews").select("period_start, content_md").eq("kind", "daily").in("period_start", days).order("period_start"),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Plan semanal</h1>
      <WeeklyGoal weekStart={monday} goal={goal ?? null} />
      <ReviewCard title="🗓️ Plan de la semana (domingo)" review={weeklyReview ?? null} endpoint="/api/reviews/weekly" body={{ weekStart: monday }} />

      <div>
        <h2 className="font-semibold mb-3">Revisiones de la semana</h2>
        <div className="space-y-3">
          {(dailyReviews ?? []).map((r) => (
            <div key={r.period_start} className="card">
              <div className="text-xs text-gray-500 mb-1">{r.period_start}</div>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{r.content_md}</p>
            </div>
          ))}
          {!dailyReviews?.length && <p className="text-sm text-gray-500">No nightly reviews yet this week.</p>}
        </div>
      </div>
    </div>
  );
}
