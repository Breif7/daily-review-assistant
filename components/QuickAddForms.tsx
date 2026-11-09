"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function QuickAddTask() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, time: time || null }),
      });
      setTitle("");
      setTime("");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="HH:MM" className="input w-20" />
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a task…" className="input flex-1" />
      <button disabled={saving} className="bg-accent rounded-lg px-3 text-sm">
        +
      </button>
    </form>
  );
}

export function QuickAddPlanBlock() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("Trabajo");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !time) return;
    setSaving(true);
    try {
      await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, start_time: time, category }),
      });
      setTitle("");
      setTime("");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="HH:MM" className="input w-20" />
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a plan block…" className="input flex-1" />
      <select value={category} onChange={(e) => setCategory(e.target.value)} className="input w-28">
        <option>Trabajo</option>
        <option>Personal</option>
        <option>Descanso</option>
        <option>Ejercicio</option>
      </select>
      <button disabled={saving} className="bg-accent rounded-lg px-3 text-sm">
        +
      </button>
    </form>
  );
}

export function QuickAddNote() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      setContent("");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Quick note…" className="input flex-1" />
      <button disabled={saving} className="bg-accent rounded-lg px-3 text-sm">
        +
      </button>
    </form>
  );
}
