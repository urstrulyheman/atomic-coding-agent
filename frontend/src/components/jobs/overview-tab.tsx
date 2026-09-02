import type { JobDetail, JobStatusSnapshot } from "@/lib/types/job";

export function OverviewTab({ job, status }: { job: JobDetail; status: JobStatusSnapshot }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded border border-border bg-white p-4">
        <h2 className="mb-2 font-semibold">Goal</h2>
        <p className="text-sm text-muted-foreground">{job.request_text}</p>
      </section>
      <section className="rounded border border-border bg-white p-4">
        <h2 className="mb-2 font-semibold">Progress</h2>
        <div className="space-y-1 text-sm text-muted-foreground">
          <div>Total tasks: {status.task_counts.total}</div>
          <div>Succeeded: {status.task_counts.succeeded}</div>
          <div>Running: {status.task_counts.running}</div>
          <div>Failed: {status.task_counts.failed}</div>
        </div>
      </section>
      <section className="rounded border border-border bg-white p-4">
        <h2 className="mb-2 font-semibold">AI Preferences</h2>
        <div className="space-y-1 text-sm text-muted-foreground">
          <div>Provider: {job.model_preferences.provider_preference[0] ?? "Automatic routing"}</div>
          <div>Model: {job.model_preferences.model_preference[0] ?? "Provider default"}</div>
          <div>Max cost: {job.model_preferences.max_cost_usd ?? "No limit"}</div>
          <div>Private repo context: {job.model_preferences.allow_private_repo_code ? "Allowed" : "Blocked"}</div>
        </div>
      </section>
    </div>
  );
}
