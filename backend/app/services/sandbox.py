import subprocess
import time
from pathlib import Path

from app.schemas.sandbox import SandboxCommand, SandboxCommandResult


class LocalSandboxRunner:
    """Local controlled runner; replace this adapter with Docker later."""

    allowed_executables = {"python", "node", "npm", "npx"}

    def __init__(self, workspace_root: Path | None = None) -> None:
        self.workspace_root = workspace_root or Path(__file__).resolve().parents[3]

    def run(self, request: SandboxCommand) -> SandboxCommandResult:
        executable = Path(request.command[0]).name.lower()
        executable = executable.removesuffix(".exe").removesuffix(".cmd").removesuffix(".ps1")
        if executable not in self.allowed_executables:
            raise ValueError(f"Command executable is not allowed: {request.command[0]}")

        cwd = self._resolve_cwd(request.cwd)
        started = time.perf_counter()
        try:
            completed = subprocess.run(
                request.command,
                cwd=cwd,
                env={**request.env} if request.env else None,
                capture_output=True,
                text=True,
                timeout=request.timeout_seconds,
                shell=False,
            )
            duration_ms = int((time.perf_counter() - started) * 1000)
            return SandboxCommandResult(
                command=request.command,
                cwd=str(cwd),
                exit_code=completed.returncode,
                stdout=completed.stdout[-8000:],
                stderr=completed.stderr[-8000:],
                duration_ms=duration_ms,
            )
        except subprocess.TimeoutExpired as exc:
            duration_ms = int((time.perf_counter() - started) * 1000)
            return SandboxCommandResult(
                command=request.command,
                cwd=str(cwd),
                exit_code=124,
                stdout=(exc.stdout or "")[-8000:] if isinstance(exc.stdout, str) else "",
                stderr=(exc.stderr or "Command timed out.")[-8000:] if isinstance(exc.stderr, str) else "Command timed out.",
                duration_ms=duration_ms,
                timed_out=True,
            )

    def _resolve_cwd(self, cwd: str | None) -> Path:
        target = self.workspace_root if cwd is None else (self.workspace_root / cwd)
        resolved = target.resolve()
        if resolved != self.workspace_root and self.workspace_root not in resolved.parents:
            raise ValueError("Sandbox cwd must stay inside the workspace")
        return resolved


sandbox_runner = LocalSandboxRunner()

