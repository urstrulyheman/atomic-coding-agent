export type JobStatus =
  | "CREATED"
  | "QUEUED"
  | "INDEXING_REPO"
  | "PLANNING"
  | "WAITING_FOR_APPROVAL"
  | "EXECUTING"
  | "VALIDATING"
  | "REVIEWING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type WorkflowStage =
  | "intake"
  | "repo_analysis"
  | "planning"
  | "approval"
  | "execution"
  | "validation"
  | "review"
  | "output";

export type JobSummary = {
  job_id: string;
  title: string;
  status: JobStatus;
  workflow_stage: WorkflowStage;
  created_at: string;
  updated_at: string;
};

export type JobDetail = JobSummary & {
  request_text: string;
  repo_url?: string | null;
  base_branch: string;
  working_branch: string;
  policies: {
    allow_auto_apply_patch: boolean;
    require_human_for_auth_changes: boolean;
    require_human_for_db_migrations: boolean;
    require_human_for_billing_changes: boolean;
    require_human_for_file_deletes: boolean;
  };
};

export type JobCreate = {
  title: string;
  request_text: string;
  repo_url?: string;
  base_branch: string;
  working_branch?: string;
  policies?: JobDetail["policies"];
};

export type JobStatusSnapshot = {
  job_id: string;
  status: JobStatus;
  workflow_stage: WorkflowStage;
  task_counts: {
    total: number;
    pending: number;
    running: number;
    succeeded: number;
    failed: number;
  };
  approval_counts: {
    pending: number;
    approved: number;
    rejected: number;
  };
  validation_status?: string | null;
  review?: {
    score?: number | null;
    recommendation?: string | null;
  } | null;
};

