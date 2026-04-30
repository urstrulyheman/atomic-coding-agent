export type JobEvent = {
  id: string;
  job_id: string;
  event_type: string;
  message: string;
  metadata_json?: Record<string, unknown> | null;
  created_at: string;
};

