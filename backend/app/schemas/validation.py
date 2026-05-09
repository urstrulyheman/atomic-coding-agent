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
    exit_code: int | None = None
    duration_ms: int | None = None
    stdout: str | None = None
    stderr: str | None = None


class ValidationRun(BaseModel):
    id: UUID
    job_id: UUID
    overall_status: str
    checks: list[ValidationCheck]
    created_at: datetime
    finished_at: datetime | None = None


class ValidationRunRequest(BaseModel):
    simulate_failure: bool = False
    auto_debug: bool = True
