"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Check, X } from "lucide-react";

import { useApproval, useApproveApproval, useRejectApproval } from "@/lib/hooks/use-approvals";

export default function ApprovalDetailPage() {
  const params = useParams<{ approvalId: string }>();
  const approvalId = params.approvalId;
  const [comment, setComment] = useState("");

  const approval = useApproval(approvalId);
  const approve = useApproveApproval(approvalId);
  const reject = useRejectApproval(approvalId);

  if (approval.isLoading) return <div>Loading approval...</div>;
  if (!approval.data) return <div>Approval not found.</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{approval.data.title}</h1>
        <p className="text-sm text-muted-foreground">{approval.data.reason}</p>
      </div>

      <section className="rounded border border-border bg-white p-4">
        <div className="mb-2 font-medium">Risk level</div>
        <div className="text-sm text-muted-foreground">{approval.data.risk_level}</div>
      </section>

      <section className="rounded border border-border bg-white p-4">
        <div className="mb-2 font-medium">Changed files</div>
        <div className="space-y-2">
          {approval.data.change_items.map((item) => (
            <div key={item.file_path} className="rounded bg-muted p-2 text-sm">
              {item.file_path}
            </div>
          ))}
        </div>
      </section>

      <textarea
        className="min-h-24 w-full rounded border border-border px-3 py-2"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Optional comment"
      />

      <div className="flex gap-3">
        <button
          className="inline-flex items-center gap-2 rounded bg-emerald-600 px-4 py-2 text-white"
          onClick={() => approve.mutate(comment)}
        >
          <Check size={16} aria-hidden />
          Approve
        </button>
        <button
          className="inline-flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-white"
          onClick={() => reject.mutate(comment)}
        >
          <X size={16} aria-hidden />
          Reject
        </button>
      </div>
    </div>
  );
}

