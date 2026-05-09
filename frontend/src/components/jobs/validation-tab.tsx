import { StatusBadge } from "@/components/common/status-badge";
import { useRerunJobValidation } from "@/lib/hooks/use-job-detail";
import type { ValidationRun } from "@/lib/types/validation";

export function ValidationTab({ jobId, runs }: { jobId: string; runs: ValidationRun[] }) {
  const rerun = useRerunJobValidation(jobId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button
          className="rounded bg-primary px-4 py-2 text-sm text-white disabled:opacity-50"
          onClick={() => rerun.mutate({ simulate_failure: false, auto_debug: true })}
          disabled={rerun.isPending}
        >
          Run validation
        </button>
        <button
          className="rounded border border-border bg-white px-4 py-2 text-sm disabled:opacity-50"
          onClick={() => rerun.mutate({ simulate_failure: true, auto_debug: true })}
          disabled={rerun.isPending}
        >
          Simulate failure + debug
        </button>
      </div>
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
                {check.exit_code !== undefined && check.exit_code !== null ? (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Exit {check.exit_code} | {check.duration_ms ?? 0} ms
                  </div>
                ) : null}
                {check.output_summary ? <div className="mt-2 text-sm text-muted-foreground">{check.output_summary}</div> : null}
                {check.failure_summary ? <div className="mt-2 text-sm text-red-600">{check.failure_summary}</div> : null}
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
