from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ModelCallRequest(BaseModel):
    job_id: UUID
    task_id: UUID | None = None
    purpose: str = Field(min_length=1, max_length=80)
    prompt: str = Field(min_length=1)
    provider_preference: list[str] = Field(default_factory=list)
    model_preference: list[str] = Field(default_factory=list)
    response_schema: str | None = None
    max_cost_usd: float | None = Field(default=None, ge=0)
    allow_private_repo_code: bool = False
    dry_run: bool = True


class ModelCallResult(BaseModel):
    id: UUID
    job_id: UUID
    task_id: UUID | None = None
    provider_id: UUID
    provider_type: str
    provider_name: str
    model: str
    purpose: str
    status: str
    prompt_preview: str
    response_preview: str
    input_tokens: int
    output_tokens: int
    estimated_cost_usd: float
    latency_ms: int
    error_message: str | None = None
    metadata_json: dict = Field(default_factory=dict)
    created_at: datetime


class ModelRouteDecision(BaseModel):
    provider_id: UUID
    provider_type: str
    provider_name: str
    model: str
    reason: str

