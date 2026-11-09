"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WeeklyGoal({
  weekStart,
  goal,
}: {
  weekStart: string;
  goal: { statement: string; progress: number } | null;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(!goal);
  const [statement, setStatement] = useState(goal?.statement ?? "");
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!statement.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/weekly-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ week_start: weekStart, statement }),
      });
      setEditing(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <form onSubmit={save} className="card flex gap-2">
        <input
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          placeholder="This week's focus…"
          className="input flex-1"
        />
        <button disabled={saving} className="bg-accent rounded-lg px-3 text-sm">
          Save
        </button>
      </form>
    );
  }

  const pct = Math.round((goal!.progress ?? 0) * 100);
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm">🎯 {goal!.statement}</span>
        <button onClick={() => setEditing(true)} className="text-xs text-gray-500 hover:text-accent">
          Edit
        </button>
      </div>
      <div className="h-2 bg-border rounded-full overflow-hidden">
        <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
