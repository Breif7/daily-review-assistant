import { createClient } from "@/lib/supabase/server";
import { weekRange, todayIso } from "@/lib/dates";
import WeekStrip from "@/components/WeekStrip";
import ProgressRing from "@/components/ProgressRing";
import HabitCheckIn from "@/components/HabitCheckIn";
import WeeklyGoal from "@/components/WeeklyGoal";
import TaskChecklist from "@/components/TaskChecklist";
import PlanTimeline from "@/components/PlanTimeline";
import ReviewCard from "@/components/ReviewCard";
import { QuickAddTask, QuickAddPlanBlock } from "@/components/QuickAddForms";

export default async function DashboardPage() {
  const supabase = await createClient();
  const today = todayIso();
  const { monday, days } = weekRange();

  const [
    { data: habits },
    { data: todayLogs },
    { data: tasks },
    { data: blocks },
    { data: goal },
    { data: dailyReview },
    { data: weekTaskRows },
  ] = await Promise.all([
    supabase.from("habits").select("*").eq("active", true).order("created_at"),
    supabase.from("habit_logs").select("habit_id, value, done").eq("date", today),
    supabase.from("tasks").select("*").eq("date", today).order("time"),
    supabase.from("plan_blocks").select("*").eq("date", today).order("start_time"),
    supabase.from("weekly_goals").select("statement, progress").eq("week_start", monday).maybeSingle(),
    supabase.from("reviews").select("content_md").eq("kind", "daily").eq("period_start", today).maybeSingle(),
    supabase.from("tasks").select("date, done").in("date", days),
  ]);

  const completionByDay: Record<string, boolean> = {};
  for (const d of days) {
    const dayTasks = (weekTaskRows ?? []).filter((t) => t.date === d);
    completionByDay[d] = dayTasks.length > 0 && dayTasks.every((t) => t.done);
  }

  const doneToday = (tasks ?? []).filter((t) => t.done).length;

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Esta semana</h1>
            <p className="text-xs text-gray-500">
              {new Date().toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <ProgressRing done={doneToday} total={tasks?.length ?? 0} />
        </div>
        <div className="mt-4">
          <WeekStrip days={days} completion={completionByDay} />
        </div>
      </div>

      <WeeklyGoal weekStart={monday} goal={goal ?? null} />

      <div>
        <h2 className="font-semibold mb-3">Tus hábitos de hoy</h2>
        <HabitCheckIn habits={(habits ?? []) as any} logs={(todayLogs ?? []) as any} />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-3">Plan de hoy</h2>
          <div className="space-y-3">
            <QuickAddPlanBlock />
            <PlanTimeline blocks={(blocks ?? []) as any} />
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-3">Tareas de hoy</h2>
          <div className="space-y-3">
            <QuickAddTask />
            <TaskChecklist tasks={(tasks ?? []) as any} />
          </div>
        </div>
      </div>

      <ReviewCard title="🌙 Revisión nocturna" review={dailyReview ?? null} endpoint="/api/reviews/daily" body={{ date: today }} />
    </div>
  );
}
