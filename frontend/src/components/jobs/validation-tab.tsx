import { StatusBadge } from "@/components/common/status-badge";
import type { ValidationRun } from "@/lib/types/validation";

export function ValidationTab({ runs }: { runs: ValidationRun[] }) {
  return (
    <div className="space-y-6">
      {runs.length === 0 ? <div className="text-sm text-muted-foreground">No validation runs yet.</div> : null}
      {runs.map((run) => (
        <section key={run.id} className="rounded border border-border bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Validation Run</h2>
            <StatusBadge value={run.overall_status.toUpperCase()} />
          </div>
          <div className="space-y-2">
            {run.checks.map((check) => (
              <article key={check.id} className="rounded border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{check.check_type}</div>
                  <StatusBadge value={check.status.toUpperCase()} />
                </div>
                <div className="text-sm text-muted-foreground">{check.command_text ?? "No command"}</div>
                {check.failure_summary ? <div className="mt-2 text-sm text-red-600">{check.failure_summary}</div> : null}
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

