export type ApprovalDetail = {
  id: string;
  job_id: string;
  title: string;
  reason: string;
  risk_level: string;
  decision: "PENDING" | "APPROVED" | "REJECTED";
  change_items: Array<{
    file_path: string;
    change_type: string;
    reason?: string | null;
  }>;
  created_at: string;
  decided_at?: string | null;
};

