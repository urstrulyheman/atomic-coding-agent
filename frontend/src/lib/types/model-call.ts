export type ModelCallRequest = {
  job_id: string;
  task_id?: string | null;
  purpose: string;
  prompt: string;
  provider_preference: string[];
  model_preference: string[];
  response_schema?: string | null;
  max_cost_usd?: number | null;
  allow_private_repo_code: boolean;
  dry_run: boolean;
};

export type ModelCallResult = {
  id: string;
  job_id: string;
  task_id?: string | null;
  provider_id: string;
  provider_type: string;
  provider_name: string;
  model: string;
  purpose: string;
  status: string;
  prompt_preview: string;
  response_preview: string;
  input_tokens: number;
  output_tokens: number;
  estimated_cost_usd: number;
  latency_ms: number;
  error_message?: string | null;
  metadata_json: Record<string, unknown>;
  created_at: string;
};

