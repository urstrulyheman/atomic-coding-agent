export type TaskStatus =
  | "PENDING"
  | "READY"
  | "RUNNING"
  | "BLOCKED"
  | "RETRYING"
  | "SUCCEEDED"
  | "FAILED"
  | "SKIPPED"
  | "CANCELLED";

export type TaskSummary = {
  id: string;
  job_id: string;
  task_key: string;
  title: string;
  task_type: string;
  agent_type: string;
  status: TaskStatus;
  depends_on: string[];
  retry_count: number;
  created_at: string;
  started_at?: string | null;
  finished_at?: string | null;
};

