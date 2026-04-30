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

export type TaskDetail = TaskSummary & {
  context_files: string[];
  acceptance_criteria: string[];
  risk_flags: string[];
  logs: Array<{
    id: string;
    job_id: string;
    task_id?: string | null;
    log_type: string;
    message: string;
    metadata_json?: Record<string, unknown> | null;
    created_at: string;
  }>;
  events: Array<{
    id: string;
    job_id: string;
    event_type: string;
    message: string;
    metadata_json?: Record<string, unknown> | null;
    created_at: string;
  }>;
};
