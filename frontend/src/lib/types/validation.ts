export type ValidationCheck = {
  id: string;
  check_type: string;
  status: string;
  command_text?: string | null;
  output_summary?: string | null;
  failure_summary?: string | null;
};

export type ValidationRun = {
  id: string;
  job_id: string;
  overall_status: string;
  checks: ValidationCheck[];
  created_at: string;
  finished_at?: string | null;
};

