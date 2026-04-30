import asyncio
import json
from uuid import UUID

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.schemas.artifacts import Artifact, ArtifactContent
from app.schemas.approvals import ApprovalDetail
from app.schemas.events import JobEvent, JobLog
from app.schemas.jobs import JobCreate, JobDetail, JobStatusSnapshot, JobSummary
from app.schemas.tasks import TaskSummary
from app.schemas.validation import ValidationRun
from app.services.orchestrator import orchestrator
from app.services.store import store

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.post("", response_model=JobDetail, status_code=201)
async def create_job(payload: JobCreate) -> JobDetail:
    return await orchestrator.create_job(payload)


@router.get("", response_model=list[JobSummary])
def list_jobs() -> list[JobSummary]:
    return store.list_jobs()


@router.get("/{job_id}", response_model=JobDetail)
def get_job(job_id: UUID) -> JobDetail:
    job = store.get_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.get("/{job_id}/status", response_model=JobStatusSnapshot)
def get_job_status(job_id: UUID) -> JobStatusSnapshot:
    if store.get_job(job_id) is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return store.status_snapshot(job_id)


@router.get("/{job_id}/tasks", response_model=list[TaskSummary])
def get_job_tasks(job_id: UUID) -> list[TaskSummary]:
    if store.get_job(job_id) is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return store.tasks[job_id]


@router.get("/{job_id}/events", response_model=list[JobEvent])
def get_job_events(job_id: UUID) -> list[JobEvent]:
    if store.get_job(job_id) is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return store.events[job_id]


@router.get("/{job_id}/events/stream")
async def stream_job_events(job_id: UUID) -> StreamingResponse:
    if store.get_job(job_id) is None:
        raise HTTPException(status_code=404, detail="Job not found")

    async def event_generator():
        cursor = 0
        while True:
            events = store.events[job_id]
            for event in events[cursor:]:
                payload = event.model_dump(mode="json")
                yield f"data: {json.dumps(payload)}\n\n"
            cursor = len(events)
            await asyncio.sleep(1)

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.get("/{job_id}/logs", response_model=list[JobLog])
def get_job_logs(job_id: UUID) -> list[JobLog]:
    if store.get_job(job_id) is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return store.logs[job_id]


@router.get("/{job_id}/artifacts", response_model=list[Artifact])
def get_job_artifacts(job_id: UUID) -> list[Artifact]:
    if store.get_job(job_id) is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return store.artifacts[job_id]


@router.get("/{job_id}/artifacts/{artifact_id}/content", response_model=ArtifactContent)
def get_job_artifact_content(job_id: UUID, artifact_id: UUID) -> ArtifactContent:
    if store.get_job(job_id) is None:
        raise HTTPException(status_code=404, detail="Job not found")
    artifact = store.get_artifact(job_id, artifact_id)
    if artifact is None:
        raise HTTPException(status_code=404, detail="Artifact not found")
    body = ""
    if artifact.metadata_json:
        body = str(artifact.metadata_json.get("body") or artifact.metadata_json.get("summary") or "")
    return ArtifactContent(artifact=artifact, body=body)


@router.get("/{job_id}/validation", response_model=list[ValidationRun])
def get_job_validation(job_id: UUID) -> list[ValidationRun]:
    if store.get_job(job_id) is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return store.validations[job_id]


@router.get("/{job_id}/approvals", response_model=list[ApprovalDetail])
def get_job_approvals(job_id: UUID) -> list[ApprovalDetail]:
    if store.get_job(job_id) is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return [approval for approval in store.approvals.values() if approval.job_id == job_id]
