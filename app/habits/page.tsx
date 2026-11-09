import { createClient } from "@/lib/supabase/server";
import { todayIso } from "@/lib/dates";
import HabitCheckIn from "@/components/HabitCheckIn";
import NewHabitForm from "@/components/NewHabitForm";

export default async function HabitsPage() {
  const supabase = await createClient();
  const today = todayIso();

  const { data: habits } = await supabase.from("habits").select("*").eq("active", true).order("created_at");
  const { data: logs } = await supabase
    .from("habit_logs")
    .select("habit_id, value, done")
    .eq("date", today)
    .in("habit_id", (habits ?? []).map((h) => h.id).length ? (habits ?? []).map((h) => h.id) : ["00000000-0000-0000-0000-000000000000"]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Hábitos</h1>
      <NewHabitForm />
      <HabitCheckIn habits={(habits ?? []) as any} logs={(logs ?? []) as any} />
    </div>
  );
}
