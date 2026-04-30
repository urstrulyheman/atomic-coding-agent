export type Artifact = {
  id: string;
  job_id: string;
  task_id?: string | null;
  artifact_type: string;
  storage_path: string;
  content_type?: string | null;
  metadata_json?: Record<string, unknown> | null;
  created_at: string;
};

