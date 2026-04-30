from enum import StrEnum


class JobStatus(StrEnum):
    CREATED = "CREATED"
    QUEUED = "QUEUED"
    INDEXING_REPO = "INDEXING_REPO"
    PLANNING = "PLANNING"
    WAITING_FOR_APPROVAL = "WAITING_FOR_APPROVAL"
    EXECUTING = "EXECUTING"
    VALIDATING = "VALIDATING"
    REVIEWING = "REVIEWING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class WorkflowStage(StrEnum):
    INTAKE = "intake"
    REPO_ANALYSIS = "repo_analysis"
    PLANNING = "planning"
    APPROVAL = "approval"
    EXECUTION = "execution"
    VALIDATION = "validation"
    REVIEW = "review"
    OUTPUT = "output"


class TaskStatus(StrEnum):
    PENDING = "PENDING"
    READY = "READY"
    RUNNING = "RUNNING"
    BLOCKED = "BLOCKED"
    RETRYING = "RETRYING"
    SUCCEEDED = "SUCCEEDED"
    FAILED = "FAILED"
    SKIPPED = "SKIPPED"
    CANCELLED = "CANCELLED"


class ApprovalDecision(StrEnum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

