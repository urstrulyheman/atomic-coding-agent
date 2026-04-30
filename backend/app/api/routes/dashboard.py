from fastapi import APIRouter

from app.schemas.dashboard import DashboardSummary
from app.services.store import store

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary() -> DashboardSummary:
    return store.dashboard_summary()
