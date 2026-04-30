from collections import defaultdict
from datetime import UTC, datetime
from uuid import UUID, uuid4

from app.models.enums import ApprovalDecision, JobStatus, TaskStatus, WorkflowStage
from app.schemas.approvals import ApprovalChangeItem, ApprovalDetail
from app.schemas.artifacts import Artifact
from app.schemas.dashboard import DashboardSummary
from app.schemas.events import JobEvent, JobLog
from app.schemas.jobs import (
    ApprovalCounts,
    JobCreate,
    JobDetail,
    JobStatusSnapshot,
    JobSummary,
    ReviewSnapshot,
    TaskCounts,
)
from app.schemas.tasks import PlannerOutput, TaskDefinition, TaskSummary
from app.schemas.validation import ValidationCheck, ValidationRun


def now() -> datetime:
    return datetime.now(UTC)


class InMemoryStore:
    def __init__(self) -> None:
        self.jobs: dict[UUID, JobDetail] = {}
        self.tasks: dict[UUID, list[TaskSummary]] = defaultdict(list)
        self.events: dict[UUID, list[JobEvent]] = defaultdict(list)
        self.logs: dict[UUID, list[JobLog]] = defaultdict(list)
        self.artifacts: dict[UUID, list[Artifact]] = defaultdict(list)
        self.validations: dict[UUID, list[ValidationRun]] = defaultdict(list)
        self.approvals: dict[UUID, ApprovalDetail] = {}

    def create_job(self, payload: JobCreate) -> JobDetail:
        job_id = uuid4()
        timestamp = now()
        working_branch = payload.working_branch or f"agent/{job_id.hex[:8]}"
        job = JobDetail(
            job_id=job_id,
            title=payload.title,
            request_text=payload.request_text,
            repo_url=payload.repo_url,
            base_branch=payload.base_branch,
            working_branch=working_branch,
            policies=payload.policies,
            status=JobStatus.CREATED,
            workflow_stage=WorkflowStage.INTAKE,
            created_at=timestamp,
            updated_at=timestamp,
        )
        self.jobs[job_id] = job
        self.add_event(job_id, "job.created", "Job accepted and queued for orchestration.")
        self.add_log(job_id, "system", "Created job record.")
        return job

    def list_jobs(self) -> list[JobSummary]:
        return [
            JobSummary(
                job_id=job.job_id,
                title=job.title,
                status=job.status,
                workflow_stage=job.workflow_stage,
                created_at=job.created_at,
                updated_at=job.updated_at,
            )
            for job in sorted(self.jobs.values(), key=lambda item: item.created_at, reverse=True)
        ]

    def get_job(self, job_id: UUID) -> JobDetail | None:
        return self.jobs.get(job_id)

    def update_job_state(
        self,
        job_id: UUID,
        status: JobStatus | None = None,
        stage: WorkflowStage | None = None,
    ) -> JobDetail:
        job = self.jobs[job_id]
        updated = job.model_copy(
            update={
                "status": status or job.status,
                "workflow_stage": stage or job.workflow_stage,
                "updated_at": now(),
            }
        )
        self.jobs[job_id] = updated
        return updated

    def add_event(
        self,
        job_id: UUID,
        event_type: str,
        message: str,
        metadata_json: dict | None = None,
    ) -> JobEvent:
        event = JobEvent(
            id=uuid4(),
            job_id=job_id,
            event_type=event_type,
            message=message,
            metadata_json=metadata_json,
            created_at=now(),
        )
        self.events[job_id].append(event)
        return event

    def add_log(
        self,
        job_id: UUID,
        log_type: str,
        message: str,
        task_id: UUID | None = None,
        metadata_json: dict | None = None,
    ) -> JobLog:
        log = JobLog(
            id=uuid4(),
            job_id=job_id,
            task_id=task_id,
            log_type=log_type,
            message=message,
            metadata_json=metadata_json,
            created_at=now(),
        )
        self.logs[job_id].append(log)
        return log

    def create_plan_tasks(self, job_id: UUID, plan: PlannerOutput) -> list[TaskSummary]:
        created: list[TaskSummary] = []
        for definition in plan.tasks:
            task = TaskSummary(
                id=uuid4(),
                job_id=job_id,
                task_key=definition.task_key,
                title=definition.title,
                task_type=definition.task_type,
                agent_type=definition.agent_type,
                status=TaskStatus.PENDING if definition.depends_on else TaskStatus.READY,
                depends_on=definition.depends_on,
                created_at=now(),
            )
            created.append(task)
        self.tasks[job_id] = created
        self.add_event(job_id, "plan.generated", f"Generated {len(created)} orchestration tasks.")
        self.add_log(job_id, "planner", "Persisted planner DAG.", metadata_json=plan.model_dump())
        return created

    def update_task(self, job_id: UUID, task_key: str, status: TaskStatus) -> TaskSummary:
        current = self.tasks[job_id]
        next_tasks: list[TaskSummary] = []
        updated_task: TaskSummary | None = None
        for task in current:
            if task.task_key == task_key:
                changes: dict = {"status": status}
                if status == TaskStatus.RUNNING:
                    changes["started_at"] = now()
                if status in {TaskStatus.SUCCEEDED, TaskStatus.FAILED, TaskStatus.CANCELLED}:
                    changes["finished_at"] = now()
                updated_task = task.model_copy(update=changes)
                next_tasks.append(updated_task)
            else:
                next_tasks.append(task)
        self.tasks[job_id] = self._unlock_ready_tasks(next_tasks)
        if updated_task is None:
            raise KeyError(task_key)
        return updated_task

    def _unlock_ready_tasks(self, tasks: list[TaskSummary]) -> list[TaskSummary]:
        succeeded = {task.task_key for task in tasks if task.status == TaskStatus.SUCCEEDED}
        unlocked: list[TaskSummary] = []
        for task in tasks:
            if task.status == TaskStatus.PENDING and all(dep in succeeded for dep in task.depends_on):
                unlocked.append(task.model_copy(update={"status": TaskStatus.READY}))
            else:
                unlocked.append(task)
        return unlocked

    def create_approval(
        self,
        job_id: UUID,
        title: str,
        reason: str,
        risk_level: str,
        change_items: list[ApprovalChangeItem],
    ) -> ApprovalDetail:
        approval = ApprovalDetail(
            id=uuid4(),
            job_id=job_id,
            title=title,
            reason=reason,
            risk_level=risk_level,
            decision=ApprovalDecision.PENDING,
            change_items=change_items,
            created_at=now(),
        )
        self.approvals[approval.id] = approval
        self.add_event(job_id, "approval.requested", title, {"approval_id": str(approval.id)})
        return approval

    def decide_approval(self, approval_id: UUID, decision: ApprovalDecision, comment: str | None) -> ApprovalDetail:
        approval = self.approvals[approval_id]
        updated = approval.model_copy(update={"decision": decision, "decided_at": now()})
        self.approvals[approval_id] = updated
        self.add_event(updated.job_id, f"approval.{decision.lower()}", comment or f"Approval {decision.lower()}.")
        return updated

    def add_validation(self, job_id: UUID) -> ValidationRun:
        run = ValidationRun(
            id=uuid4(),
            job_id=job_id,
            overall_status="passed",
            checks=[
                ValidationCheck(id=uuid4(), check_type="lint", status="passed", command_text="npm run lint"),
                ValidationCheck(id=uuid4(), check_type="tests", status="passed", command_text="pytest"),
                ValidationCheck(id=uuid4(), check_type="build", status="passed", command_text="npm run build"),
            ],
            created_at=now(),
            finished_at=now(),
        )
        self.validations[job_id].append(run)
        return run

    def add_pr_artifact(self, job_id: UUID) -> Artifact:
        job = self.jobs[job_id]
        summary = Artifact(
            id=uuid4(),
            job_id=job_id,
            artifact_type="pr_summary",
            storage_path=f"artifacts/{job_id}/pr-summary.md",
            content_type="text/markdown",
            metadata_json={
                "summary": "MVP orchestration patch is ready for review.",
                "body": (
                    f"# PR Summary\n\n"
                    f"## Goal\n{job.request_text}\n\n"
                    f"## Changes\n"
                    f"- Created a planner DAG for the requested coding work.\n"
                    f"- Ran backend, frontend, test, and validation task stages.\n"
                    f"- Produced approval and validation records for auditability.\n\n"
                    f"## Validation\nAll configured MVP validation checks passed.\n"
                ),
            },
            created_at=now(),
        )
        diff_body = (
            "diff --git a/backend/app/services/orchestrator.py b/backend/app/services/orchestrator.py\n"
            "index 1f4a111..9b7c222 100644\n"
            "--- a/backend/app/services/orchestrator.py\n"
            "+++ b/backend/app/services/orchestrator.py\n"
            "@@ -1,5 +1,8 @@\n"
            " class OrchestratorService:\n"
            "+    # Generated by the coding workflow after validation passes.\n"
            "+    # Real workers will replace this synthetic patch in production.\n"
            "     async def create_job(self, payload: JobCreate) -> JobDetail:\n"
            "         job = store.create_job(payload)\n"
            "         asyncio.create_task(self._run_mvp_workflow(job.job_id))\n"
            "diff --git a/frontend/src/components/jobs/artifacts-tab.tsx b/frontend/src/components/jobs/artifacts-tab.tsx\n"
            "index 8a2b333..4d5e444 100644\n"
            "--- a/frontend/src/components/jobs/artifacts-tab.tsx\n"
            "+++ b/frontend/src/components/jobs/artifacts-tab.tsx\n"
            "@@ -1,4 +1,6 @@\n"
            " import type { Artifact } from \"@/lib/types/artifact\";\n"
            "+import { DiffViewer } from \"@/components/jobs/diff-viewer\";\n"
            "+\n"
            " export function ArtifactsTab({ artifacts }: { artifacts: Artifact[] }) {\n"
            "-  return <div />;\n"
            "+  return <DiffViewer artifact={artifacts[0]} />;\n"
            " }\n"
        )
        diff = Artifact(
            id=uuid4(),
            job_id=job_id,
            artifact_type="diff",
            storage_path=f"artifacts/{job_id}/changes.diff",
            content_type="text/x-diff",
            metadata_json={
                "summary": "Patch bundle diff",
                "body": diff_body,
                "files_changed": 2,
                "additions": 5,
                "deletions": 1,
            },
            created_at=now(),
        )
        self.artifacts[job_id].extend([summary, diff])
        return summary

    def get_artifact(self, job_id: UUID, artifact_id: UUID) -> Artifact | None:
        for artifact in self.artifacts[job_id]:
            if artifact.id == artifact_id:
                return artifact
        return None

    def list_approvals(self) -> list[ApprovalDetail]:
        return sorted(self.approvals.values(), key=lambda item: item.created_at, reverse=True)

    def dashboard_summary(self) -> DashboardSummary:
        validations = [run for runs in self.validations.values() for run in runs]
        return DashboardSummary(
            active_jobs=sum(
                job.status
                in {
                    JobStatus.CREATED,
                    JobStatus.QUEUED,
                    JobStatus.INDEXING_REPO,
                    JobStatus.PLANNING,
                    JobStatus.WAITING_FOR_APPROVAL,
                    JobStatus.EXECUTING,
                    JobStatus.VALIDATING,
                    JobStatus.REVIEWING,
                }
                for job in self.jobs.values()
            ),
            completed_jobs=sum(job.status == JobStatus.COMPLETED for job in self.jobs.values()),
            failed_jobs=sum(job.status == JobStatus.FAILED for job in self.jobs.values()),
            pending_approvals=sum(item.decision == ApprovalDecision.PENDING for item in self.approvals.values()),
            validation_failures=sum(run.overall_status == "failed" for run in validations),
            total_jobs=len(self.jobs),
        )

    def status_snapshot(self, job_id: UUID) -> JobStatusSnapshot:
        job = self.jobs[job_id]
        tasks = self.tasks[job_id]
        approvals = [item for item in self.approvals.values() if item.job_id == job_id]
        return JobStatusSnapshot(
            job_id=job_id,
            status=job.status,
            workflow_stage=job.workflow_stage,
            task_counts=TaskCounts(
                total=len(tasks),
                pending=sum(task.status in {TaskStatus.PENDING, TaskStatus.READY, TaskStatus.BLOCKED} for task in tasks),
                running=sum(task.status == TaskStatus.RUNNING for task in tasks),
                succeeded=sum(task.status == TaskStatus.SUCCEEDED for task in tasks),
                failed=sum(task.status == TaskStatus.FAILED for task in tasks),
            ),
            approval_counts=ApprovalCounts(
                pending=sum(item.decision == ApprovalDecision.PENDING for item in approvals),
                approved=sum(item.decision == ApprovalDecision.APPROVED for item in approvals),
                rejected=sum(item.decision == ApprovalDecision.REJECTED for item in approvals),
            ),
            validation_status=self.validations[job_id][-1].overall_status if self.validations[job_id] else None,
            review=ReviewSnapshot(score=0.88, recommendation="Ready for human review.")
            if job.status == JobStatus.COMPLETED
            else None,
        )


store = InMemoryStore()


def default_plan(goal: str) -> PlannerOutput:
    return PlannerOutput(
        goal=goal,
        requires_approval=True,
        risk_flags=["repo_write", "validation_required"],
        tasks=[
            TaskDefinition(
                task_key="analyze_repo",
                title="Analyze repository",
                task_type="repo_analysis",
                agent_type="repo-worker",
                tool_name="repo_indexer",
            ),
            TaskDefinition(
                task_key="design_changes",
                title="Design implementation plan",
                task_type="design",
                agent_type="planner-worker",
                depends_on=["analyze_repo"],
            ),
            TaskDefinition(
                task_key="implement_backend",
                title="Implement backend changes",
                task_type="backend_implementation",
                agent_type="backend-worker",
                depends_on=["design_changes"],
            ),
            TaskDefinition(
                task_key="implement_frontend",
                title="Implement frontend changes",
                task_type="frontend_implementation",
                agent_type="frontend-worker",
                depends_on=["design_changes"],
            ),
            TaskDefinition(
                task_key="write_tests",
                title="Write and update tests",
                task_type="test_generation",
                agent_type="test-worker",
                depends_on=["implement_backend", "implement_frontend"],
            ),
            TaskDefinition(
                task_key="validate",
                title="Run validation gates",
                task_type="validation",
                agent_type="validator-worker",
                depends_on=["write_tests"],
            ),
        ],
    )
