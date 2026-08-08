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

