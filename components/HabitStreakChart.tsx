"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function HabitStreakChart({ data }: { data: { date: string; completed: number }[] }) {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#332a21" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} tickFormatter={(d) => d.slice(5)} />
          <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#9ca3af" }} />
          <Tooltip contentStyle={{ background: "#1f1a15", border: "1px solid #332a21", borderRadius: 8 }} />
          <Bar dataKey="completed" fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
