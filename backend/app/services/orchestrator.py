import asyncio
from uuid import UUID

from app.models.enums import JobStatus, TaskStatus, WorkflowStage
from app.schemas.approvals import ApprovalChangeItem
from app.schemas.jobs import JobCreate, JobDetail
from app.services.store import default_plan, store


class OrchestratorService:
    async def create_job(self, payload: JobCreate) -> JobDetail:
        job = store.create_job(payload)
        asyncio.create_task(self._run_mvp_workflow(job.job_id))
        return job

    async def _run_mvp_workflow(self, job_id: UUID) -> None:
        await asyncio.sleep(0.2)
        job = store.get_job(job_id)
        if job is None:
            return

        store.update_job_state(job_id, JobStatus.PLANNING, WorkflowStage.PLANNING)
        plan = default_plan(job.request_text)
        store.create_plan_tasks(job_id, plan)
        store.update_job_state(job_id, JobStatus.INDEXING_REPO, WorkflowStage.REPO_ANALYSIS)
        store.add_event(job_id, "repo.indexing_started", "Collecting repository structure and stack signals.")
        await self._complete_task(job_id, "analyze_repo", "Repository analysis completed.")

        store.update_job_state(job_id, JobStatus.PLANNING, WorkflowStage.PLANNING)
        await self._complete_task(job_id, "design_changes", "Planner produced a JSON DAG.")

        store.update_job_state(job_id, JobStatus.WAITING_FOR_APPROVAL, WorkflowStage.APPROVAL)
        store.create_approval(
            job_id,
            "Approve generated implementation plan",
            "The workflow will apply code changes, generate tests, and run validation gates.",
            "medium",
            [
                ApprovalChangeItem(file_path="backend/app/**", reason="Control-plane orchestration API"),
                ApprovalChangeItem(file_path="frontend/src/**", reason="Job tracking interface"),
            ],
        )
        await asyncio.sleep(0.3)

        store.update_job_state(job_id, JobStatus.EXECUTING, WorkflowStage.EXECUTION)
        await self._complete_task(job_id, "implement_backend", "Backend worker completed patch bundle.")
        await self._complete_task(job_id, "implement_frontend", "Frontend worker completed UI patch bundle.")
        await self._complete_task(job_id, "write_tests", "Test worker generated validation coverage.")

        store.update_job_state(job_id, JobStatus.VALIDATING, WorkflowStage.VALIDATION)
        await self._complete_task(job_id, "validate", "Validation gates passed.")
        store.add_validation(job_id)

        store.update_job_state(job_id, JobStatus.REVIEWING, WorkflowStage.REVIEW)
        store.add_event(job_id, "review.completed", "Reviewer scored the patch and prepared handoff notes.")
        store.add_pr_artifact(job_id)

        store.update_job_state(job_id, JobStatus.COMPLETED, WorkflowStage.OUTPUT)
        store.add_event(job_id, "job.completed", "Job completed with PR summary artifact.")

    async def _complete_task(self, job_id: UUID, task_key: str, message: str) -> None:
        await asyncio.sleep(0.25)
        try:
            task = store.update_task(job_id, task_key, TaskStatus.RUNNING)
            store.add_event(job_id, "task.started", f"{task.title} started.", {"task_key": task_key})
            await asyncio.sleep(0.25)
            task = store.update_task(job_id, task_key, TaskStatus.SUCCEEDED)
            store.add_event(job_id, "task.completed", message, {"task_key": task_key})
            store.add_log(job_id, "task", message, task_id=task.id)
        except KeyError:
            # The first analysis task is emitted before the full planner DAG is persisted.
            pass


orchestrator = OrchestratorService()
