import { api } from "./client";
import type { ApprovalDetail } from "@/lib/types/approval";
import type { Artifact } from "@/lib/types/artifact";
import type { JobEvent } from "@/lib/types/event";
import type { JobCreate, JobDetail, JobStatusSnapshot, JobSummary } from "@/lib/types/job";
import type { TaskSummary } from "@/lib/types/task";
import type { ValidationRun } from "@/lib/types/validation";

export function createJob(payload: JobCreate) {
  return api<JobDetail>("/jobs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getJobs() {
  return api<JobSummary[]>("/jobs");
}

export function getJob(jobId: string) {
  return api<JobDetail>(`/jobs/${jobId}`);
}

export function getJobStatus(jobId: string) {
  return api<JobStatusSnapshot>(`/jobs/${jobId}/status`);
}

export function getJobTasks(jobId: string) {
  return api<TaskSummary[]>(`/jobs/${jobId}/tasks`);
}

export type JobLog = {
  id: string;
  job_id: string;
  task_id?: string | null;
  log_type: string;
  message: string;
  metadata_json?: Record<string, unknown> | null;
  created_at: string;
};

export function getJobLogs(jobId: string) {
  return api<JobLog[]>(`/jobs/${jobId}/logs`);
}

export function getJobArtifacts(jobId: string) {
  return api<Artifact[]>(`/jobs/${jobId}/artifacts`);
}

export function getJobValidation(jobId: string) {
  return api<ValidationRun[]>(`/jobs/${jobId}/validation`);
}

export function getJobEvents(jobId: string) {
  return api<JobEvent[]>(`/jobs/${jobId}/events`);
}

export function getJobApprovals(jobId: string) {
  return api<ApprovalDetail[]>(`/jobs/${jobId}/approvals`);
}
