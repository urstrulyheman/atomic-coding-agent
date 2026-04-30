from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class JobEvent(BaseModel):
    id: UUID
    job_id: UUID
    event_type: str
    message: str
    metadata_json: dict | None = None
    created_at: datetime


class JobLog(BaseModel):
    id: UUID
    job_id: UUID
    task_id: UUID | None = None
    log_type: str
    message: str
    metadata_json: dict | None = None
    created_at: datetime

