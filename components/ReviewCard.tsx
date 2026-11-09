"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReviewCard({
  title,
  review,
  endpoint,
  body,
}: {
  title: string;
  review: { content_md: string } | null;
  endpoint: string;
  body: Record<string, string>;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not generate");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">{title}</h2>
        {!review && (
          <button onClick={generate} disabled={busy} className="text-xs bg-accent rounded-lg px-3 py-1.5">
            {busy ? "Thinking…" : "Generate"}
          </button>
        )}
      </div>
      {review ? (
        <p className="text-sm text-gray-300 whitespace-pre-wrap">{review.content_md}</p>
      ) : (
        <p className="text-sm text-gray-500">Not generated yet.</p>
      )}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
