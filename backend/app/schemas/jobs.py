from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.enums import JobStatus, WorkflowStage


class JobPolicies(BaseModel):
    allow_auto_apply_patch: bool = False
    require_human_for_auth_changes: bool = True
    require_human_for_db_migrations: bool = True
    require_human_for_billing_changes: bool = True
    require_human_for_file_deletes: bool = True


class JobCreate(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    request_text: str = Field(min_length=1)
    repo_url: str | None = None
    base_branch: str = "main"
    working_branch: str | None = None
    policies: JobPolicies = Field(default_factory=JobPolicies)


class JobSummary(BaseModel):
    job_id: UUID
    title: str
    status: JobStatus
    workflow_stage: WorkflowStage
    created_at: datetime
    updated_at: datetime


class JobDetail(JobSummary):
    request_text: str
    repo_url: str | None
    base_branch: str
    working_branch: str
    policies: JobPolicies


class TaskCounts(BaseModel):
    total: int = 0
    pending: int = 0
    running: int = 0
    succeeded: int = 0
    failed: int = 0


class ApprovalCounts(BaseModel):
    pending: int = 0
    approved: int = 0
    rejected: int = 0


class ReviewSnapshot(BaseModel):
    score: float | None = None
    recommendation: str | None = None


class JobStatusSnapshot(BaseModel):
    job_id: UUID
    status: JobStatus
    workflow_stage: WorkflowStage
    task_counts: TaskCounts
    approval_counts: ApprovalCounts
    validation_status: str | None = None
    review: ReviewSnapshot | None = None

