from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ValidationCheck(BaseModel):
    id: UUID
    check_type: str
    status: str
    command_text: str | None = None
    output_summary: str | None = None
    failure_summary: str | None = None


class ValidationRun(BaseModel):
    id: UUID
    job_id: UUID
    overall_status: str
    checks: list[ValidationCheck]
    created_at: datetime
    finished_at: datetime | None = None

