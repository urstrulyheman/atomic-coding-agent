"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { JobsTable } from "@/components/jobs/jobs-table";
import { useJobs } from "@/lib/hooks/use-jobs";

export default function JobsPage() {
  const jobs = useJobs();

  if (jobs.isLoading) return <div>Loading jobs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Jobs</h1>
          <p className="text-sm text-muted-foreground">Track orchestration runs across repositories and tasks.</p>
        </div>
        <Link href="/new" className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm text-white">
          <Plus size={16} aria-hidden />
          New Job
        </Link>
      </div>
      {jobs.data?.length ? <JobsTable jobs={jobs.data} /> : <div className="rounded border border-border bg-white p-6">No jobs found.</div>}
    </div>
  );
}
