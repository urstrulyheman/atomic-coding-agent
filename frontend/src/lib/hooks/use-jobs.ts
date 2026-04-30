"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createJob, getJobs } from "@/lib/api/jobs";
import type { JobCreate } from "@/lib/types/job";
import { queryKeys } from "@/lib/utils/query-keys";

export function useJobs() {
  return useQuery({
    queryKey: queryKeys.jobs,
    queryFn: getJobs,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: JobCreate) => createJob(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.jobs }),
  });
}

