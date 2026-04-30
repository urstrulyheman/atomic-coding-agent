"use client";

import Link from "next/link";

import { StatusBadge } from "@/components/common/status-badge";
import { useApprovals } from "@/lib/hooks/use-approvals";

export default function ApprovalsPage() {
  const approvals = useApprovals();

  if (approvals.isLoading) return <div>Loading approvals...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Approvals</h1>
        <p className="text-sm text-muted-foreground">Review human checkpoints before risky workflow steps continue.</p>
      </div>

      <div className="space-y-3">
        {approvals.data?.length ? null : (
          <div className="rounded border border-border bg-white p-6 text-sm text-muted-foreground">No approvals requested.</div>
        )}
        {approvals.data?.map((approval) => (
          <article key={approval.id} className="rounded border border-border bg-white p-4 shadow-panel">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link href={`/approvals/${approval.id}`} className="font-medium hover:underline">
                  {approval.title}
                </Link>
                <div className="mt-1 text-sm text-muted-foreground">{approval.reason}</div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Job {approval.job_id} | Risk {approval.risk_level}
                </div>
              </div>
              <StatusBadge value={approval.decision} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
