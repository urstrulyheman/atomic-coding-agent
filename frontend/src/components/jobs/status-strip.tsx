import { PhaseBadge } from "@/components/common/phase-badge";
import { StatusBadge } from "@/components/common/status-badge";
import type { JobStatusSnapshot } from "@/lib/types/job";

export function StatusStrip({ status }: { status: JobStatusSnapshot }) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded border border-border bg-white p-4 shadow-panel">
      <StatusBadge value={status.status} />
      <PhaseBadge value={status.workflow_stage} />
      <span className="text-sm">Tasks: {status.task_counts.succeeded}/{status.task_counts.total}</span>
      <span className="text-sm">Running: {status.task_counts.running}</span>
      <span className="text-sm">Pending approvals: {status.approval_counts.pending}</span>
      <span className="text-sm">Validation: {status.validation_status ?? "pending"}</span>
    </div>
  );
}

