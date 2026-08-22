from uuid import UUID

from app.schemas.model_calls import ModelCallRequest
from app.schemas.tasks import PlannerOutput
from app.services.model_gateway import model_gateway
from app.services.store import default_plan, store


class PlannerService:
    def generate_plan(self, job_id: UUID) -> PlannerOutput:
        job = store.get_job(job_id)
        if job is None:
            raise ValueError("Job not found")

        model_call = model_gateway.invoke(
            ModelCallRequest(
                job_id=job_id,
                purpose="planning",
                prompt=job.request_text,
                provider_preference=["openai", "anthropic", "xai"],
                response_schema="planner_output_v1",
                dry_run=True,
            )
        )
        plan = default_plan(job.request_text)
        self._validate_plan(plan)
        store.add_plan(job_id, plan, model_call)
        return plan

    def _validate_plan(self, plan: PlannerOutput) -> None:
        task_keys = [task.task_key for task in plan.tasks]
        unique_keys = set(task_keys)
        if len(unique_keys) != len(task_keys):
            raise ValueError("Planner produced duplicate task keys")

        for task in plan.tasks:
            if task.task_key in task.depends_on:
                raise ValueError(f"Task {task.task_key} cannot depend on itself")
            missing_dependencies = [dependency for dependency in task.depends_on if dependency not in unique_keys]
            if missing_dependencies:
                raise ValueError(
                    f"Task {task.task_key} has unknown dependencies: {', '.join(missing_dependencies)}"
                )


planner_service = PlannerService()
