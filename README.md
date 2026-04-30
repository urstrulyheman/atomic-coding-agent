# Atomic Coding Agent

MVP implementation of the orchestration plan in `coding (1).txt`.

The repo is split into:

- `backend`: FastAPI control plane with typed job, task, approval, event, artifact, and validation contracts.
- `frontend`: Next.js dashboard for creating jobs and watching orchestration progress.

## Backend

```powershell
cd backend
python -m pip install -r requirements.txt --target .deps
$env:PYTHONPATH='.deps;.'
python -m uvicorn app.main:app --reload --port 8010
```

Health check:

```powershell
Invoke-RestMethod http://localhost:8010/health
```

## Frontend

```powershell
cd frontend
npm install
$env:NEXT_PUBLIC_API_BASE_URL='http://127.0.0.1:8010/api/v1'
npx next dev -p 3001
```

Open `http://localhost:3001`.

## Implemented Flow

1. Create a coding job.
2. Persist a planner-style task DAG.
3. Emit lifecycle events and logs.
4. Expose job status, tasks, validation runs, artifacts, and approvals.
5. Stream live events with Server-Sent Events.
6. Render job detail tabs and approval actions in the UI.

This is intentionally an MVP control plane. The in-memory orchestration service is shaped so it can later be replaced by Temporal workers while keeping the API contracts stable.
