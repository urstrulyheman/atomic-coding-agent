import { NewJobForm } from "@/components/jobs/new-job-form";

export default function NewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New Job</h1>
        <p className="text-sm text-muted-foreground">Describe the task, connect the repo, and start orchestration.</p>
      </div>
      <NewJobForm />
    </div>
  );
}

