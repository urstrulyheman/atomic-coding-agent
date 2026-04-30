from fastapi.testclient import TestClient

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
