import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Inicio", icon: "🏠" },
  { href: "/weekly", label: "Plan semanal", icon: "📅" },
  { href: "/habits", label: "Hábitos", icon: "🔥" },
  { href: "/stats", label: "Estadísticas", icon: "📊" },
  { href: "/notes", label: "Notas", icon: "📝" },
];

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-border p-4 hidden sm:block">
      <div className="font-semibold text-lg mb-6 px-2">✨ Daily Review</div>
      <nav className="flex flex-col gap-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-bg hover:text-white transition"
          >
            <span>{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
