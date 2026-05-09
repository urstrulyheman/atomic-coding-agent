from uuid import UUID, uuid4

from app.models.enums import JobStatus, WorkflowStage
from app.schemas.sandbox import SandboxCommand
from app.schemas.validation import ValidationCheck, ValidationRun
from app.services.sandbox import sandbox_runner
from app.services.store import now, store


class ValidationRunnerService:
    def run_validation_cycle(
        self,
        job_id: UUID,
        simulate_failure: bool = False,
        auto_debug: bool = True,
    ) -> list[ValidationRun]:
        store.update_job_state(job_id, JobStatus.VALIDATING, WorkflowStage.VALIDATION)
        store.add_event(job_id, "validation.started", "Sandbox validation started.")

        first_run = self._run_once(job_id, simulate_failure=simulate_failure, label="primary")
        runs = [first_run]

        if first_run.overall_status == "failed" and auto_debug:
            store.add_event(job_id, "debug.retry_requested", "Validation failed; debug loop generated a repair plan.")
            store.add_debug_artifact(job_id, first_run)
            repair_run = self._run_once(job_id, simulate_failure=False, label="repair")
            runs.append(repair_run)

        latest = runs[-1]
        if latest.overall_status == "passed":
            store.add_event(job_id, "validation.completed", "Validation passed after sandbox execution.")
        else:
            store.update_job_state(job_id, JobStatus.FAILED, WorkflowStage.VALIDATION)
            store.add_event(job_id, "validation.failed", "Validation failed after debug attempts.")

        return runs

    def _run_once(self, job_id: UUID, simulate_failure: bool, label: str) -> ValidationRun:
        commands = self._commands(simulate_failure)
        checks: list[ValidationCheck] = []
        for check_type, command in commands:
            result = sandbox_runner.run(command)
            status = "passed" if result.exit_code == 0 else "failed"
            check = ValidationCheck(
                id=uuid4(),
                check_type=f"{label}:{check_type}",
                status=status,
                command_text=" ".join(result.command),
                output_summary=(result.stdout or result.stderr).strip()[:500] or "No output.",
                failure_summary=(result.stderr or result.stdout).strip()[:500] if status == "failed" else None,
                exit_code=result.exit_code,
                duration_ms=result.duration_ms,
                stdout=result.stdout,
                stderr=result.stderr,
            )
            checks.append(check)
            store.add_log(
                job_id,
                "validation",
                f"{check.check_type} {status} with exit code {result.exit_code}.",
                metadata_json=result.model_dump(),
            )

        run = ValidationRun(
            id=uuid4(),
            job_id=job_id,
            overall_status="passed" if all(check.status == "passed" for check in checks) else "failed",
            checks=checks,
            created_at=now(),
            finished_at=now(),
        )
        store.add_validation_run(run)
        return run

    def _commands(self, simulate_failure: bool) -> list[tuple[str, SandboxCommand]]:
        if simulate_failure:
            return [
                (
                    "simulated_test",
                    SandboxCommand(
                        command=[
                            "python",
                            "-c",
                            "import sys; print('simulated failing test output'); sys.exit(1)",
                        ],
                        timeout_seconds=10,
                    ),
                )
            ]
        return [
            (
                "python_runtime",
                SandboxCommand(command=["python", "--version"], timeout_seconds=10),
            ),
            (
                "node_runtime",
                SandboxCommand(command=["node", "--version"], timeout_seconds=10),
            ),
        ]


validation_runner = ValidationRunnerService()
