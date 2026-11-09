import { createClient } from "@/lib/supabase/server";
import HabitStreakChart from "@/components/HabitStreakChart";

function last30Days() {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });
}

export default async function StatsPage() {
  const supabase = await createClient();
  const days = last30Days();

  const { data: habits } = await supabase.from("habits").select("id, name, icon").eq("active", true);
  const { data: logs } = await supabase
    .from("habit_logs")
    .select("habit_id, date, done")
    .gte("date", days[0])
    .in("habit_id", (habits ?? []).map((h) => h.id).length ? (habits ?? []).map((h) => h.id) : ["00000000-0000-0000-0000-000000000000"]);

  const chartData = days.map((date) => ({
    date,
    completed: (logs ?? []).filter((l) => l.date === date && l.done).length,
  }));

  const streaks = (habits ?? []).map((h) => {
    const doneDays = new Set((logs ?? []).filter((l) => l.habit_id === h.id && l.done).map((l) => l.date));
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (doneDays.has(days[i])) streak++;
      else break;
    }
    const rate = days.length ? Math.round((doneDays.size / days.length) * 100) : 0;
    return { ...h, streak, rate };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Estadísticas</h1>

      <div className="card">
        <h2 className="font-semibold mb-3">Hábitos completados por día (últimos 30 días)</h2>
        <HabitStreakChart data={chartData} />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {streaks.map((h) => (
          <div key={h.id} className="card">
            <div className="text-sm">{h.icon} {h.name}</div>
            <div className="text-2xl font-semibold mt-1">{h.streak}🔥</div>
            <div className="text-xs text-gray-500">{h.rate}% últimos 30 días</div>
          </div>
        ))}
        {!streaks.length && <p className="text-sm text-gray-500 col-span-full">No habits yet.</p>}
      </div>
    </div>
  );
}
