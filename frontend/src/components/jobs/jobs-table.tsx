import Link from "next/link";

import { PhaseBadge } from "@/components/common/phase-badge";
import { StatusBadge } from "@/components/common/status-badge";
import type { JobSummary } from "@/lib/types/job";

export function JobsTable({ jobs }: { jobs: JobSummary[] }) {
  return (
    <div className="overflow-hidden rounded border border-border bg-white shadow-panel">
      <table className="w-full text-left">
        <thead className="bg-muted text-sm">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Phase</th>
            <th className="px-4 py-3">Updated</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.job_id} className="border-t border-border">
              <td className="px-4 py-3">
                <Link href={`/jobs/${job.job_id}`} className="font-medium hover:underline">
                  {job.title}
                </Link>
              </td>
              <td className="px-4 py-3">
                <StatusBadge value={job.status} />
              </td>
              <td className="px-4 py-3">
                <PhaseBadge value={job.workflow_stage} />
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(job.updated_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

