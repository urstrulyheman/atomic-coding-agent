from pydantic import BaseModel


class DashboardSummary(BaseModel):
    active_jobs: int
    completed_jobs: int
    failed_jobs: int
    pending_approvals: int
    validation_failures: int
    total_jobs: int

