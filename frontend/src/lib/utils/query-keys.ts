export const queryKeys = {
  jobs: ["jobs"] as const,
  job: (jobId: string) => ["jobs", jobId] as const,
  jobStatus: (jobId: string) => ["jobs", jobId, "status"] as const,
  jobTasks: (jobId: string) => ["jobs", jobId, "tasks"] as const,
  jobLogs: (jobId: string) => ["jobs", jobId, "logs"] as const,
  jobArtifacts: (jobId: string) => ["jobs", jobId, "artifacts"] as const,
  jobArtifactContent: (jobId: string, artifactId: string) => ["jobs", jobId, "artifacts", artifactId] as const,
  jobValidation: (jobId: string) => ["jobs", jobId, "validation"] as const,
  jobApprovals: (jobId: string) => ["jobs", jobId, "approvals"] as const,
  approvals: ["approvals"] as const,
  approval: (approvalId: string) => ["approvals", approvalId] as const,
  dashboardSummary: ["dashboard", "summary"] as const,
};
