from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class Artifact(BaseModel):
    id: UUID
    job_id: UUID
    task_id: UUID | None = None
    artifact_type: str
    storage_path: str
    content_type: str | None = None
    metadata_json: dict | None = None
    created_at: datetime

