const DOW = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function WeekStrip({ days, completion }: { days: string[]; completion: Record<string, boolean> }) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div className="flex justify-between">
      {days.map((d, i) => (
        <div key={d} className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-500">{DOW[i]}</span>
          <span className="text-xs text-gray-400">{Number(d.slice(8, 10))}</span>
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              d === today
                ? "bg-accent text-white"
                : completion[d]
                ? "bg-good/20 text-good border border-good"
                : "border border-border text-gray-600"
            }`}
          >
            {completion[d] ? "✓" : ""}
          </div>
        </div>
      ))}
    </div>
  );
}
