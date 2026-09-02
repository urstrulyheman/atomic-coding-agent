from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ProviderCapabilities(BaseModel):
    chat: bool = True
    code: bool = True
    embeddings: bool = False
    vision: bool = False
    tool_calling: bool = True
    streaming: bool = True


class ProviderPolicy(BaseModel):
    allow_private_repo_code: bool = False
    allow_security_sensitive_tasks: bool = False
    max_cost_per_job_usd: float | None = Field(default=None, ge=0)
    require_approval_before_use: bool = False


class AIProviderCreate(BaseModel):
    provider_type: str = Field(min_length=1, max_length=80)
    display_name: str = Field(min_length=1, max_length=120)
    api_key: str | None = Field(default=None, max_length=4096)
    base_url: str | None = Field(default=None, max_length=400)
    default_model: str = Field(min_length=1, max_length=160)
    embedding_model: str | None = Field(default=None, max_length=160)
    enabled: bool = True
    capabilities: ProviderCapabilities = Field(default_factory=ProviderCapabilities)
    policy: ProviderPolicy = Field(default_factory=ProviderPolicy)


class AIProviderUpdate(BaseModel):
    display_name: str | None = Field(default=None, min_length=1, max_length=120)
    api_key: str | None = Field(default=None, max_length=4096)
    base_url: str | None = Field(default=None, max_length=400)
    default_model: str | None = Field(default=None, min_length=1, max_length=160)
    embedding_model: str | None = Field(default=None, max_length=160)
    enabled: bool | None = None
    capabilities: ProviderCapabilities | None = None
    policy: ProviderPolicy | None = None


class AIProviderPublic(BaseModel):
    id: UUID
    provider_type: str
    display_name: str
    base_url: str | None
    default_model: str
    embedding_model: str | None
    enabled: bool
    api_key_configured: bool
    api_key_preview: str | None
    capabilities: ProviderCapabilities
    policy: ProviderPolicy
    created_at: datetime
    updated_at: datetime


class ModelRoutingProfile(BaseModel):
    planning: list[str] = Field(default_factory=lambda: ["openai", "anthropic", "xai", "google", "openrouter", "local"])
    coding: list[str] = Field(default_factory=lambda: ["anthropic", "openai", "xai", "openrouter", "local", "google"])
    review: list[str] = Field(default_factory=lambda: ["openai", "anthropic", "google", "xai", "openrouter", "local"])
    debug: list[str] = Field(default_factory=lambda: ["anthropic", "openai", "xai", "openrouter", "local", "google"])
    summarize: list[str] = Field(default_factory=lambda: ["openai", "anthropic", "google", "openrouter", "xai", "local"])
    allow_fallback_to_any_enabled: bool = True


class ModelRoutingProfileUpdate(BaseModel):
    planning: list[str] | None = None
    coding: list[str] | None = None
    review: list[str] | None = None
    debug: list[str] | None = None
    summarize: list[str] | None = None
    allow_fallback_to_any_enabled: bool | None = None
