from uuid import UUID

from fastapi.testclient import TestClient
from app.services.store import store

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
