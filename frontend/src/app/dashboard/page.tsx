"use client";

import { useDashboardSummary } from "@/lib/hooks/use-dashboard";

export default function DashboardPage() {
  const summary = useDashboardSummary();
  const data = summary.data;
  const cards = [
    ["Active Jobs", data?.active_jobs ?? 0],
    ["Completed Jobs", data?.completed_jobs ?? 0],
    ["Failed Jobs", data?.failed_jobs ?? 0],
    ["Pending Approvals", data?.pending_approvals ?? 0],
    ["Validation Failures", data?.validation_failures ?? 0],
    ["Total Jobs", data?.total_jobs ?? 0],
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform health and operational insights.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(([label, value]) => (
          <section key={label} className="rounded border border-border bg-white p-4 shadow-panel">
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="mt-2 text-2xl font-semibold">{summary.isLoading ? "..." : value}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
