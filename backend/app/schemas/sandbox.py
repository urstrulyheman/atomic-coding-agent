from pydantic import BaseModel, Field


class SandboxCommand(BaseModel):
    command: list[str] = Field(min_length=1)
    cwd: str | None = None
    timeout_seconds: int = Field(default=30, ge=1, le=300)
    env: dict[str, str] = Field(default_factory=dict)


class SandboxCommandResult(BaseModel):
    command: list[str]
    cwd: str
    exit_code: int
    stdout: str
    stderr: str
    duration_ms: int
    timed_out: bool = False

