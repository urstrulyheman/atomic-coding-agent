import { useState } from "react";

import { StatusBadge } from "@/components/common/status-badge";
import { TaskDrawer } from "@/components/jobs/task-drawer";
import type { TaskSummary } from "@/lib/types/task";

export function TasksTab({ jobId, tasks }: { jobId: string; tasks: TaskSummary[] }) {
  const [selectedTask, setSelectedTask] = useState<TaskSummary | null>(null);

  return (
    <>
      <div className="space-y-3">
        {tasks.map((task) => (
          <button
            key={task.id}
            className="block w-full rounded border border-border bg-white p-4 text-left hover:border-primary"
            onClick={() => setSelectedTask(task)}
          >
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
          </button>
        ))}
      </div>
      <TaskDrawer jobId={jobId} task={selectedTask} onClose={() => setSelectedTask(null)} />
    </>
  );
}
