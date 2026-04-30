export function ReviewTab({ score, recommendation }: { score?: number | null; recommendation?: string | null }) {
  return (
    <section className="rounded border border-border bg-white p-4">
      <h2 className="mb-2 font-semibold">Review</h2>
      <div className="text-sm text-muted-foreground">Score: {score ?? "pending"}</div>
      <div className="text-sm text-muted-foreground">Recommendation: {recommendation ?? "pending"}</div>
    </section>
  );
}

