"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type Habit = { id: string; name: string; icon: string; target_value: number; unit: string };
export type HabitLog = { habit_id: string; value: number; done: boolean };

export default function HabitCheckIn({ habits, logs }: { habits: Habit[]; logs: HabitLog[] }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const logByHabit = new Map(logs.map((l) => [l.habit_id, l]));

  async function bump(habit: Habit) {
    const current = logByHabit.get(habit.id)?.value ?? 0;
    const next = current >= habit.target_value ? 0 : current + 1;
    setPending(habit.id);
    await fetch(`/api/habits/${habit.id}/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: next }),
    });
    router.refresh();
    setPending(null);
  }

  if (!habits.length) return <p className="text-sm text-gray-500">No habits yet — add one on the Hábitos page.</p>;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {habits.map((h) => {
        const log = logByHabit.get(h.id);
        const done = log?.done ?? false;
        return (
          <button
            key={h.id}
            onClick={() => bump(h)}
            disabled={pending === h.id}
            className={`card flex flex-col items-center gap-1 py-3 ${done ? "border-good" : ""}`}
          >
            <span className="text-xl">{h.icon}</span>
            <span className="text-xs text-gray-300 truncate w-full text-center">{h.name}</span>
            <span className={`text-xs ${done ? "text-good" : "text-gray-500"}`}>
              {log?.value ?? 0}/{h.target_value} {h.unit}
            </span>
          </button>
        );
      })}
    </div>
  );
}
