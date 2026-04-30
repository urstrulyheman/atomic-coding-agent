"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { approveApproval, getApproval, rejectApproval } from "@/lib/api/approvals";
import { queryKeys } from "@/lib/utils/query-keys";

export function useApproval(approvalId: string) {
  return useQuery({
    queryKey: queryKeys.approval(approvalId),
    queryFn: () => getApproval(approvalId),
    enabled: Boolean(approvalId),
  });
}

export function useApproveApproval(approvalId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (comment?: string) => approveApproval(approvalId, comment),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.approval(approvalId) }),
  });
}

export function useRejectApproval(approvalId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (comment?: string) => rejectApproval(approvalId, comment),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.approval(approvalId) }),
  });
}

