export type ProviderCapabilities = {
  chat: boolean;
  code: boolean;
  embeddings: boolean;
  vision: boolean;
  tool_calling: boolean;
  streaming: boolean;
};

export type ProviderPolicy = {
  allow_private_repo_code: boolean;
  allow_security_sensitive_tasks: boolean;
  max_cost_per_job_usd?: number | null;
  require_approval_before_use: boolean;
};

export type AIProvider = {
  id: string;
  provider_type: string;
  display_name: string;
  base_url?: string | null;
  default_model: string;
  embedding_model?: string | null;
  enabled: boolean;
  api_key_configured: boolean;
  api_key_preview?: string | null;
  capabilities: ProviderCapabilities;
  policy: ProviderPolicy;
  created_at: string;
  updated_at: string;
};

export type AIProviderCreate = {
  provider_type: string;
  display_name: string;
  api_key?: string | null;
  base_url?: string | null;
  default_model: string;
  embedding_model?: string | null;
  enabled: boolean;
  capabilities: ProviderCapabilities;
  policy: ProviderPolicy;
};

export type AIProviderUpdate = Partial<AIProviderCreate>;

export type ModelRoutingProfile = {
  planning: string[];
  coding: string[];
  review: string[];
  debug: string[];
  summarize: string[];
  allow_fallback_to_any_enabled: boolean;
};

export type ModelRoutingProfileUpdate = Partial<ModelRoutingProfile>;
