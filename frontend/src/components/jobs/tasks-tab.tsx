import { StatusBadge } from "@/components/common/status-badge";
import type { TaskSummary } from "@/lib/types/task";

export function TasksTab({ tasks }: { tasks: TaskSummary[] }) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <article key={task.id} className="rounded border border-border bg-white p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-medium">{task.title}</div>
              <div className="text-sm text-muted-foreground">
                {task.task_type} | {task.agent_type}
              </div>
              {task.depends_on.length > 0 ? (
                <div className="mt-2 text-xs text-muted-foreground">Depends on: {task.depends_on.join(", ")}</div>
              ) : null}
            </div>
            <StatusBadge value={task.status} />
          </div>
        </article>
      ))}
    </div>
  );
}

