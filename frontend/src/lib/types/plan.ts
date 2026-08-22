export type PlanTask = {
  task_key: string;
  title: string;
  task_type: string;
  agent_type: string;
  tool_name?: string | null;
  depends_on: string[];
  input_json: Record<string, unknown>;
  risk_flags: string[];
};

export type PlanRecord = {
  id: string;
  job_id: string;
  goal: string;
  tasks: PlanTask[];
  risk_flags: string[];
  requires_approval: boolean;
  provider_name?: string | null;
  model?: string | null;
  model_call_id?: string | null;
  created_at: string;
};
