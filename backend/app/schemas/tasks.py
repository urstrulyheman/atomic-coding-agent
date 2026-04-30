from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.enums import TaskStatus


class TaskDefinition(BaseModel):
    task_key: str
    title: str
    task_type: str
    agent_type: str
    tool_name: str | None = None
    depends_on: list[str] = Field(default_factory=list)
    input_json: dict = Field(default_factory=dict)
    risk_flags: list[str] = Field(default_factory=list)


class PlannerOutput(BaseModel):
    goal: str
    tasks: list[TaskDefinition]
    risk_flags: list[str] = Field(default_factory=list)
    requires_approval: bool = False


class TaskSummary(BaseModel):
    id: UUID
    job_id: UUID
    task_key: str
    title: str
    task_type: str
    agent_type: str
    status: TaskStatus
    depends_on: list[str]
    retry_count: int = 0
    created_at: datetime
    started_at: datetime | None = None
    finished_at: datetime | None = None

