"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewHabitForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("✅");
  const [target, setTarget] = useState("1");
  const [unit, setUnit] = useState("x");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, icon, target_value: parseFloat(target), unit }),
      });
      setName("");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="card grid sm:grid-cols-5 gap-2 items-end">
      <label className="text-xs text-gray-400">
        Icon
        <input value={icon} onChange={(e) => setIcon(e.target.value)} className="input mt-1" />
      </label>
      <label className="text-xs text-gray-400 sm:col-span-2">
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} className="input mt-1" placeholder="Water" />
      </label>
      <label className="text-xs text-gray-400">
        Target
        <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} className="input mt-1" />
      </label>
      <label className="text-xs text-gray-400">
        Unit
        <input value={unit} onChange={(e) => setUnit(e.target.value)} className="input mt-1" placeholder="L" />
      </label>
      <button disabled={saving} className="bg-accent rounded-lg py-2 text-sm font-medium sm:col-span-5">
        {saving ? "Saving…" : "+ Add habit"}
      </button>
    </form>
  );
}
