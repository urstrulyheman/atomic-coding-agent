from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.tasks import TaskDefinition


class PlanRecord(BaseModel):
    id: UUID
    job_id: UUID
    goal: str
    tasks: list[TaskDefinition]
    risk_flags: list[str] = Field(default_factory=list)
    requires_approval: bool = False
    provider_name: str | None = None
    model: str | None = None
    model_call_id: UUID | None = None
    created_at: datetime
