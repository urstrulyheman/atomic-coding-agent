import type { JobDetail } from "@/lib/types/job";

export function JobHeader({ job }: { job: JobDetail }) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">{job.title}</h1>
      <p className="max-w-4xl text-sm text-muted-foreground">{job.request_text}</p>
      <div className="text-xs text-muted-foreground">
        {job.repo_url ?? "No repository"} | {job.base_branch} to {job.working_branch}
      </div>
    </div>
  );
}

