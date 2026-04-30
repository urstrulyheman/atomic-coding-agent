import Link from "next/link";

import { StatusBadge } from "@/components/common/status-badge";
import type { ApprovalDetail } from "@/lib/types/approval";

export function ApprovalsTab({ approvals }: { approvals: ApprovalDetail[] }) {
  return (
    <div className="space-y-3">
      {approvals.length === 0 ? <div className="text-sm text-muted-foreground">No approvals requested.</div> : null}
      {approvals.map((approval) => (
        <article key={approval.id} className="rounded border border-border bg-white p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link href={`/approvals/${approval.id}`} className="font-medium hover:underline">
                {approval.title}
              </Link>
              <div className="text-sm text-muted-foreground">{approval.reason}</div>
              <div className="mt-2 text-xs text-muted-foreground">Risk: {approval.risk_level}</div>
            </div>
            <StatusBadge value={approval.decision} />
          </div>
        </article>
      ))}
    </div>
  );
}
