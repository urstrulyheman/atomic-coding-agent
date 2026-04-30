from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.models.enums import ApprovalDecision
from app.schemas.approvals import ApprovalDecisionRequest, ApprovalDetail
from app.services.store import store

router = APIRouter(prefix="/approvals", tags=["approvals"])


@router.get("/{approval_id}", response_model=ApprovalDetail)
def get_approval(approval_id: UUID) -> ApprovalDetail:
    approval = store.approvals.get(approval_id)
    if approval is None:
        raise HTTPException(status_code=404, detail="Approval not found")
    return approval


@router.post("/{approval_id}/approve", response_model=ApprovalDetail)
def approve_approval(approval_id: UUID, payload: ApprovalDecisionRequest) -> ApprovalDetail:
    if approval_id not in store.approvals:
        raise HTTPException(status_code=404, detail="Approval not found")
    return store.decide_approval(approval_id, ApprovalDecision.APPROVED, payload.comment)


@router.post("/{approval_id}/reject", response_model=ApprovalDetail)
def reject_approval(approval_id: UUID, payload: ApprovalDecisionRequest) -> ApprovalDetail:
    if approval_id not in store.approvals:
        raise HTTPException(status_code=404, detail="Approval not found")
    return store.decide_approval(approval_id, ApprovalDecision.REJECTED, payload.comment)

