"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Play } from "lucide-react";

import { useCreateJob } from "@/lib/hooks/use-jobs";

export function NewJobForm() {
  const router = useRouter();
  const createJob = useCreateJob();
  const [title, setTitle] = useState("");
  const [requestText, setRequestText] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [baseBranch, setBaseBranch] = useState("main");
  const [workingBranch, setWorkingBranch] = useState("");

  async function onSubmit() {
    const result = await createJob.mutateAsync({
      title,
      request_text: requestText,
      repo_url: repoUrl || undefined,
      base_branch: baseBranch,
      working_branch: workingBranch || undefined,
    });
    router.push(`/jobs/${result.job_id}`);
  }

  return (
    <div className="max-w-3xl space-y-4 rounded border border-border bg-white p-5 shadow-panel">
      <input
        className="w-full rounded border border-border px-3 py-2"
        placeholder="Job title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <textarea
        className="min-h-40 w-full rounded border border-border px-3 py-2"
        placeholder="Describe the coding task"
        value={requestText}
        onChange={(event) => setRequestText(event.target.value)}
      />
      <input
        className="w-full rounded border border-border px-3 py-2"
        placeholder="Repository URL"
        value={repoUrl}
        onChange={(event) => setRepoUrl(event.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className="rounded border border-border px-3 py-2"
          value={baseBranch}
          onChange={(event) => setBaseBranch(event.target.value)}
          placeholder="Base branch"
        />
        <input
          className="rounded border border-border px-3 py-2"
          value={workingBranch}
          onChange={(event) => setWorkingBranch(event.target.value)}
          placeholder="Working branch"
        />
      </div>
      <button
        className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-white disabled:opacity-50"
        onClick={onSubmit}
        disabled={createJob.isPending || !title || !requestText}
        title="Create job"
      >
        <Play size={16} aria-hidden />
        {createJob.isPending ? "Creating" : "Create Job"}
      </button>
    </div>
  );
}

