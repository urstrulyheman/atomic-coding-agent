from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.models.enums import ApprovalDecision


class ApprovalChangeItem(BaseModel):
    file_path: str
    change_type: str = "modify"
    reason: str | None = None


class ApprovalDetail(BaseModel):
    id: UUID
    job_id: UUID
    title: str
    reason: str
    risk_level: str
    decision: ApprovalDecision
    change_items: list[ApprovalChangeItem]
    created_at: datetime
    decided_at: datetime | None = None


class ApprovalDecisionRequest(BaseModel):
    comment: str | None = None
