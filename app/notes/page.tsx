import { createClient } from "@/lib/supabase/server";
import { QuickAddNote } from "@/components/QuickAddForms";

export default async function NotesPage() {
  const supabase = await createClient();
  const { data: notes } = await supabase.from("notes").select("*").order("date", { ascending: false }).limit(100);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Notas</h1>
      <QuickAddNote />
      <div className="space-y-2">
        {(notes ?? []).map((n) => (
          <div key={n.id} className="card">
            <div className="text-xs text-gray-500 mb-1">{n.date}</div>
            <p className="text-sm">{n.content}</p>
          </div>
        ))}
        {!notes?.length && <p className="text-sm text-gray-500">No notes yet.</p>}
      </div>
    </div>
  );
}
