"use client";

import { X } from "lucide-react";

import { StatusBadge } from "@/components/common/status-badge";
import { useJobTask } from "@/lib/hooks/use-job-detail";
import type { TaskSummary } from "@/lib/types/task";

export function TaskDrawer({
  jobId,
  task,
  onClose,
}: {
  jobId: string;
  task: TaskSummary | null;
  onClose: () => void;
}) {
  const detail = useJobTask(jobId, task?.id ?? null);

  if (!task) return null;

  const data = detail.data;

  return (
    <div className="fixed inset-0 z-40">
      <button className="absolute inset-0 bg-slate-950/30" onClick={onClose} aria-label="Close task drawer" />
      <aside className="absolute right-0 top-0 h-full w-full max-w-xl overflow-auto border-l border-border bg-white p-5 shadow-panel">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <div className="mt-1 text-sm text-muted-foreground">
              {task.task_type} | {task.agent_type}
            </div>
          </div>
          <button className="rounded p-2 hover:bg-muted" onClick={onClose} title="Close">
            <X size={18} aria-hidden />
          </button>
        </div>

        <div className="space-y-4">
          <section className="rounded border border-border p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-medium">State</h3>
              <StatusBadge value={task.status} />
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Retry count</dt>
                <dd>{task.retry_count}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Task key</dt>
                <dd>{task.task_key}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Started</dt>
                <dd>{task.started_at ? new Date(task.started_at).toLocaleString() : "Not started"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Finished</dt>
                <dd>{task.finished_at ? new Date(task.finished_at).toLocaleString() : "Not finished"}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded border border-border p-4">
            <h3 className="mb-2 font-medium">Dependencies</h3>
            {task.depends_on.length ? (
              <div className="flex flex-wrap gap-2">
                {task.depends_on.map((dependency) => (
                  <span key={dependency} className="rounded bg-muted px-2 py-1 text-xs">
                    {dependency}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No dependencies.</div>
            )}
          </section>

          <section className="rounded border border-border p-4">
            <h3 className="mb-2 font-medium">Context Files</h3>
            {detail.isLoading ? <div className="text-sm text-muted-foreground">Loading task detail...</div> : null}
            <div className="space-y-2">
              {(data?.context_files ?? []).map((file) => (
                <div key={file} className="rounded bg-muted px-2 py-1 text-sm">
                  {file}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded border border-border p-4">
            <h3 className="mb-2 font-medium">Acceptance Criteria</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {(data?.acceptance_criteria ?? []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded border border-border p-4">
            <h3 className="mb-2 font-medium">Task Logs</h3>
            <div className="space-y-2">
              {(data?.logs ?? []).length ? null : <div className="text-sm text-muted-foreground">No task logs yet.</div>}
              {(data?.logs ?? []).map((log) => (
                <div key={log.id} className="rounded bg-muted p-2 text-sm">
                  <div className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</div>
                  {log.message}
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
