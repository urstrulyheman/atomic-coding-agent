"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getJob,
  getJobApprovals,
  getJobArtifacts,
  getJobArtifactContent,
  getJobLogs,
  getJobStatus,
  getJobTask,
  getJobTasks,
  getJobValidation,
} from "@/lib/api/jobs";
import { queryKeys } from "@/lib/utils/query-keys";

export function useJobDetail(jobId: string) {
  return useQuery({
    queryKey: queryKeys.job(jobId),
    queryFn: () => getJob(jobId),
    enabled: Boolean(jobId),
  });
}

export function useJobStatus(jobId: string) {
  return useQuery({
    queryKey: queryKeys.jobStatus(jobId),
    queryFn: () => getJobStatus(jobId),
    enabled: Boolean(jobId),
  });
}

export function useJobTasks(jobId: string) {
  return useQuery({
    queryKey: queryKeys.jobTasks(jobId),
    queryFn: () => getJobTasks(jobId),
    enabled: Boolean(jobId),
  });
}

export function useJobTask(jobId: string, taskId: string | null) {
  return useQuery({
    queryKey: queryKeys.jobTask(jobId, taskId ?? ""),
    queryFn: () => getJobTask(jobId, taskId ?? ""),
    enabled: Boolean(jobId && taskId),
  });
}

export function useJobLogs(jobId: string) {
  return useQuery({
    queryKey: queryKeys.jobLogs(jobId),
    queryFn: () => getJobLogs(jobId),
    enabled: Boolean(jobId),
  });
}

export function useJobArtifacts(jobId: string) {
  return useQuery({
    queryKey: queryKeys.jobArtifacts(jobId),
    queryFn: () => getJobArtifacts(jobId),
    enabled: Boolean(jobId),
  });
}

export function useJobArtifactContent(jobId: string, artifactId: string | null) {
  return useQuery({
    queryKey: queryKeys.jobArtifactContent(jobId, artifactId ?? ""),
    queryFn: () => getJobArtifactContent(jobId, artifactId ?? ""),
    enabled: Boolean(jobId && artifactId),
  });
}

export function useJobValidation(jobId: string) {
  return useQuery({
    queryKey: queryKeys.jobValidation(jobId),
    queryFn: () => getJobValidation(jobId),
    enabled: Boolean(jobId),
  });
}

export function useJobApprovals(jobId: string) {
  return useQuery({
    queryKey: queryKeys.jobApprovals(jobId),
    queryFn: () => getJobApprovals(jobId),
    enabled: Boolean(jobId),
  });
}
