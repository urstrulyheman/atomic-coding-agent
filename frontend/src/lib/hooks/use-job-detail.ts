"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getJob,
  getJobApprovals,
  getJobArtifacts,
  getJobArtifactContent,
  getJobLogs,
  getJobModelCalls,
  getJobStatus,
  getJobTask,
  getJobTasks,
  getJobValidation,
  rerunJobValidation,
  createJobModelCall,
} from "@/lib/api/jobs";
import type { ModelCallRequest } from "@/lib/types/model-call";
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

export function useJobModelCalls(jobId: string) {
  return useQuery({
    queryKey: queryKeys.jobModelCalls(jobId),
    queryFn: () => getJobModelCalls(jobId),
    enabled: Boolean(jobId),
  });
}

export function useCreateJobModelCall(jobId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ModelCallRequest) => createJobModelCall(jobId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobModelCalls(jobId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobLogs(jobId) });
    },
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

export function useRerunJobValidation(jobId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { simulate_failure: boolean; auto_debug: boolean }) => rerunJobValidation(jobId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobValidation(jobId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobArtifacts(jobId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobLogs(jobId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobStatus(jobId) });
    },
  });
}

export function useJobApprovals(jobId: string) {
  return useQuery({
    queryKey: queryKeys.jobApprovals(jobId),
    queryFn: () => getJobApprovals(jobId),
    enabled: Boolean(jobId),
  });
}
