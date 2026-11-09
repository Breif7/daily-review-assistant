const CATEGORY_COLOR: Record<string, string> = {
  Trabajo: "#f97316",
  Personal: "#34d399",
  Descanso: "#60a5fa",
  Ejercicio: "#f472b6",
};

export type PlanBlock = { id: string; start_time: string; title: string; category: string };

export default function PlanTimeline({ blocks }: { blocks: PlanBlock[] }) {
  if (!blocks.length) return <p className="text-sm text-gray-500">No plan blocks yet for today.</p>;

  return (
    <ul className="space-y-2">
      {blocks.map((b) => (
        <li key={b.id} className="flex items-center gap-2 text-sm">
          <span className="text-xs text-gray-500 w-12 shrink-0">{b.start_time}</span>
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: CATEGORY_COLOR[b.category] ?? "#9ca3af" }}
          />
          <span>{b.title}</span>
        </li>
      ))}
    </ul>
  );
}
