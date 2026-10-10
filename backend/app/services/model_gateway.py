import time
from uuid import UUID, uuid4

from app.models.enums import ApprovalDecision
from app.schemas.approvals import ApprovalChangeItem
from app.schemas.model_calls import ModelCallRequest, ModelCallResult, ModelRouteDecision
from app.services.model_router import model_router
from app.services.store import now, store


class ModelGateway:
    def invoke(self, request: ModelCallRequest) -> ModelCallResult:
        started = time.perf_counter()
        route = model_router.route(request)
        provider = store.get_provider(route.provider_id)
        if provider is None:
            raise ValueError("Selected AI provider no longer exists.")
        approval = store.find_provider_approval(request.job_id, route.provider_id)
        if provider.policy.require_approval_before_use and approval is None:
            approval = store.create_approval(
                request.job_id,
                f"Approve AI provider: {route.provider_name}",
                f"{route.provider_name} requires approval before model calls can run for this job.",
                "medium",
                [
                    ApprovalChangeItem(
                        file_path=f"provider:{route.provider_type}",
                        change_type="provider_use",
                        reason=f"Use {route.model} for {request.purpose}.",
                    )
                ],
                {
                    "approval_type": "provider_use",
                    "provider_id": str(route.provider_id),
                    "provider_type": route.provider_type,
                    "model": route.model,
                    "purpose": request.purpose,
                },
            )
        if provider.policy.require_approval_before_use and approval and approval.decision != ApprovalDecision.APPROVED:
            return self._approval_required_result(request, route, approval.id, started)

        response = self._dry_run_response(request, route.model)
        latency_ms = int((time.perf_counter() - started) * 1000)
        input_tokens = max(1, len(request.prompt.split()))
        output_tokens = max(1, len(response.split()))
        result = ModelCallResult(
            id=uuid4(),
            job_id=request.job_id,
            task_id=request.task_id,
            provider_id=route.provider_id,
            provider_type=route.provider_type,
            provider_name=route.provider_name,
            model=route.model,
            purpose=request.purpose,
            status="dry_run" if request.dry_run else "queued",
            prompt_preview=request.prompt[:500],
            response_preview=response[:1000],
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            estimated_cost_usd=round((input_tokens + output_tokens) * 0.000002, 6),
            latency_ms=latency_ms,
            metadata_json={
                "route_reason": route.reason,
                "response_schema": request.response_schema,
                "dry_run": request.dry_run,
            },
            created_at=now(),
        )
        store.add_model_call(result)
        store.add_event(
            request.job_id,
            "model_call.recorded",
            f"{route.provider_name} selected for {request.purpose}.",
            {"model_call_id": str(result.id), "provider_type": route.provider_type, "model": route.model},
        )
        return result

    def _approval_required_result(
        self,
        request: ModelCallRequest,
        route: ModelRouteDecision,
        approval_id: UUID,
        started: float,
    ) -> ModelCallResult:
        latency_ms = int((time.perf_counter() - started) * 1000)
        result = ModelCallResult(
            id=uuid4(),
            job_id=request.job_id,
            task_id=request.task_id,
            provider_id=route.provider_id,
            provider_type=route.provider_type,
            provider_name=route.provider_name,
            model=route.model,
            purpose=request.purpose,
            status="approval_required",
            prompt_preview=request.prompt[:500],
            response_preview="Provider approval is required before this model call can run.",
            input_tokens=max(1, len(request.prompt.split())),
            output_tokens=0,
            estimated_cost_usd=0,
            latency_ms=latency_ms,
            metadata_json={
                "route_reason": route.reason,
                "response_schema": request.response_schema,
                "dry_run": request.dry_run,
                "approval_id": str(approval_id),
            },
            created_at=now(),
        )
        store.add_model_call(result)
        store.add_event(
            request.job_id,
            "model_call.approval_required",
            f"{route.provider_name} requires approval before {request.purpose}.",
            {"model_call_id": str(result.id), "approval_id": str(approval_id)},
        )
        return result

    def _dry_run_response(self, request: ModelCallRequest, model: str) -> str:
        if request.purpose == "planning":
            return (
                "{"
                f'"goal":"{request.prompt[:120]}",'
                '"tasks":["analyze_repo","design_changes","implement","validate"],'
                f'"model":"{model}",'
                '"mode":"dry_run"'
                "}"
            )
        return f"Dry-run {request.purpose} response generated by route target {model}."


model_gateway = ModelGateway()
