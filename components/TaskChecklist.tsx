"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type TaskRow = { id: string; title: string; time: string | null; done: boolean };

export default function TaskChecklist({ tasks }: { tasks: TaskRow[] }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);

  async function toggle(t: TaskRow) {
    setPending(t.id);
    await fetch(`/api/tasks/${t.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !t.done }),
    });
    router.refresh();
    setPending(null);
  }

  if (!tasks.length) return <p className="text-sm text-gray-500">No tasks for today.</p>;

  return (
    <ul className="space-y-2">
      {tasks.map((t) => (
        <li key={t.id} className="flex items-center gap-2 text-sm">
          <button
            onClick={() => toggle(t)}
            disabled={pending === t.id}
            className={`w-4 h-4 rounded-full border-2 shrink-0 ${t.done ? "bg-accent border-accent" : "border-gray-600"}`}
          />
          {t.time && <span className="text-xs text-gray-500 w-12 shrink-0">{t.time}</span>}
          <span className={t.done ? "line-through text-gray-500" : ""}>{t.title}</span>
        </li>
      ))}
    </ul>
  );
}
