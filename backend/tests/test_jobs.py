from uuid import UUID

from fastapi.testclient import TestClient
from app.services.store import default_plan, store

from app.main import app


client = TestClient(app)


def test_create_and_read_job():
    response = client.post(
        "/api/v1/jobs",
        json={
            "title": "Add forgot password",
            "request_text": "Add forgot-password flow with tests.",
            "repo_url": "https://github.com/example/app",
        },
    )

    assert response.status_code == 201
    job = response.json()
    assert job["title"] == "Add forgot password"

    status_response = client.get(f"/api/v1/jobs/{job['job_id']}/status")
    assert status_response.status_code == 200
    assert status_response.json()["job_id"] == job["job_id"]


def test_dashboard_and_approval_list_endpoints():
    response = client.post(
        "/api/v1/jobs",
        json={
            "title": "Dashboard smoke",
            "request_text": "Exercise aggregate endpoints.",
            "repo_url": "https://github.com/example/app",
        },
    )

    assert response.status_code == 201

    dashboard = client.get("/api/v1/dashboard/summary")
    assert dashboard.status_code == 200
    assert dashboard.json()["total_jobs"] >= 1

    approvals = client.get("/api/v1/approvals")
    assert approvals.status_code == 200
    assert isinstance(approvals.json(), list)


def test_completed_job_exposes_diff_artifact():
    response = client.post(
        "/api/v1/jobs",
        json={
            "title": "Diff smoke",
            "request_text": "Exercise artifact preview endpoints.",
            "repo_url": "https://github.com/example/app",
        },
    )
    assert response.status_code == 201
    job_id = response.json()["job_id"]

    store.add_pr_artifact(UUID(job_id))

    artifacts = client.get(f"/api/v1/jobs/{job_id}/artifacts")
    assert artifacts.status_code == 200
    diff_artifact = next(item for item in artifacts.json() if item["artifact_type"] == "diff")

    content = client.get(f"/api/v1/jobs/{job_id}/artifacts/{diff_artifact['id']}/content")
    assert content.status_code == 200
    assert "diff --git" in content.json()["body"]


def test_task_detail_endpoint_returns_context():
    response = client.post(
        "/api/v1/jobs",
        json={
            "title": "Task detail smoke",
            "request_text": "Exercise task detail endpoint.",
            "repo_url": "https://github.com/example/app",
        },
    )
    assert response.status_code == 201
    job_id = response.json()["job_id"]
    store.create_plan_tasks(UUID(job_id), default_plan("Exercise task detail endpoint."))

    tasks = client.get(f"/api/v1/jobs/{job_id}/tasks")
    assert tasks.status_code == 200
    task_id = tasks.json()[0]["id"]

    detail = client.get(f"/api/v1/jobs/{job_id}/tasks/{task_id}")
    assert detail.status_code == 200
    assert detail.json()["id"] == task_id
    assert detail.json()["acceptance_criteria"]


def test_validation_rerun_can_debug_and_recover():
    response = client.post(
        "/api/v1/jobs",
        json={
            "title": "Validation debug smoke",
            "request_text": "Exercise sandbox validation and debug retry.",
            "repo_url": "https://github.com/example/app",
        },
    )
    assert response.status_code == 201
    job_id = response.json()["job_id"]

    rerun = client.post(
        f"/api/v1/jobs/{job_id}/validation/rerun",
        json={"simulate_failure": True, "auto_debug": True},
    )
    assert rerun.status_code == 200
    runs = rerun.json()
    assert runs[0]["overall_status"] == "failed"
    assert runs[-1]["overall_status"] == "passed"

    artifacts = client.get(f"/api/v1/jobs/{job_id}/artifacts")
    assert artifacts.status_code == 200
    assert any(item["artifact_type"] == "debug_report" for item in artifacts.json())


def test_ai_provider_configuration_masks_keys():
    providers = client.get("/api/v1/providers")
    assert providers.status_code == 200
    assert len(providers.json()) >= 1

    create = client.post(
        "/api/v1/providers",
        json={
            "provider_type": "custom",
            "display_name": "Custom Test Provider",
            "api_key": "sk-test-secret-value",
            "base_url": "https://api.example.com/v1",
            "default_model": "custom-code-model",
            "enabled": True,
        },
    )
    assert create.status_code == 201
    created = create.json()
    assert created["api_key_configured"] is True
    assert "secret" not in (created["api_key_preview"] or "")

    update = client.patch(
        f"/api/v1/providers/{created['id']}",
        json={"enabled": False, "default_model": "custom-code-model-v2"},
    )
    assert update.status_code == 200
    assert update.json()["enabled"] is False
    assert update.json()["default_model"] == "custom-code-model-v2"


def test_model_call_dry_run_is_routed_and_audited():
    response = client.post(
        "/api/v1/jobs",
        json={
            "title": "Model gateway smoke",
            "request_text": "Plan a small API change.",
            "repo_url": "https://github.com/example/app",
        },
    )
    assert response.status_code == 201
    job_id = response.json()["job_id"]

    model_call = client.post(
        f"/api/v1/jobs/{job_id}/model-calls",
        json={
            "job_id": job_id,
            "purpose": "planning",
            "prompt": "Plan a small API change.",
            "provider_preference": ["openai"],
            "model_preference": [],
            "response_schema": "planner_output_v1",
            "max_cost_usd": 1,
            "allow_private_repo_code": False,
            "dry_run": True,
        },
    )
    assert model_call.status_code == 201
    body = model_call.json()
    assert body["provider_type"] == "openai"
    assert body["status"] == "dry_run"

    calls = client.get(f"/api/v1/jobs/{job_id}/model-calls")
    assert calls.status_code == 200
    assert any(item["id"] == body["id"] for item in calls.json())
