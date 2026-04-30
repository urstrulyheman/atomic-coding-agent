import { api } from "./client";
import type { ApprovalDetail } from "@/lib/types/approval";

export function getApproval(approvalId: string) {
  return api<ApprovalDetail>(`/approvals/${approvalId}`);
}

export function getApprovals() {
  return api<ApprovalDetail[]>("/approvals");
}

export function approveApproval(approvalId: string, comment?: string) {
  return api<ApprovalDetail>(`/approvals/${approvalId}/approve`, {
    method: "POST",
    body: JSON.stringify({ comment }),
  });
}

export function rejectApproval(approvalId: string, comment?: string) {
  return api<ApprovalDetail>(`/approvals/${approvalId}/reject`, {
    method: "POST",
    body: JSON.stringify({ comment }),
  });
}
