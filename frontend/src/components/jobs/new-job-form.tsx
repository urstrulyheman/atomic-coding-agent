"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bot, Play } from "lucide-react";

import { useCreateJob } from "@/lib/hooks/use-jobs";
import { useProviders } from "@/lib/hooks/use-providers";

export function NewJobForm() {
  const router = useRouter();
  const createJob = useCreateJob();
  const providers = useProviders();
  const [title, setTitle] = useState("");
  const [requestText, setRequestText] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [baseBranch, setBaseBranch] = useState("main");
  const [workingBranch, setWorkingBranch] = useState("");
  const [providerType, setProviderType] = useState("");
  const [modelName, setModelName] = useState("");
  const [maxCostUsd, setMaxCostUsd] = useState("1");
  const [allowPrivateRepoCode, setAllowPrivateRepoCode] = useState(false);
  const enabledProviders = (providers.data ?? []).filter((provider) => provider.enabled);
  const selectedProvider = enabledProviders.find((provider) => provider.provider_type === providerType);

  async function onSubmit() {
    const result = await createJob.mutateAsync({
      title,
      request_text: requestText,
      repo_url: repoUrl || undefined,
      base_branch: baseBranch,
      working_branch: workingBranch || undefined,
      model_preferences: {
        provider_preference: providerType ? [providerType] : [],
        model_preference: modelName ? [modelName] : [],
        max_cost_usd: maxCostUsd ? Number(maxCostUsd) : null,
        allow_private_repo_code: allowPrivateRepoCode,
        dry_run: true,
      },
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
      <section className="rounded border border-border bg-muted/30 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium">
          <Bot size={16} aria-hidden />
          AI provider
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm text-muted-foreground">Provider</span>
            <select
              className="w-full rounded border border-border bg-white px-3 py-2"
              value={providerType}
              onChange={(event) => {
                const nextProviderType = event.target.value;
                const nextProvider = enabledProviders.find(
                  (provider) => provider.provider_type === nextProviderType,
                );
                setProviderType(nextProviderType);
                setModelName(nextProvider?.default_model ?? "");
              }}
            >
              <option value="">Automatic routing</option>
              {enabledProviders.map((provider) => (
                <option key={provider.id} value={provider.provider_type}>
                  {provider.display_name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sm text-muted-foreground">Planning model</span>
            <input
              className="w-full rounded border border-border px-3 py-2"
              value={modelName}
              onChange={(event) => setModelName(event.target.value)}
              placeholder={selectedProvider?.default_model ?? "Use provider default"}
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-muted-foreground">Max cost</span>
            <input
              className="w-full rounded border border-border px-3 py-2"
              type="number"
              min="0"
              step="0.01"
              value={maxCostUsd}
              onChange={(event) => setMaxCostUsd(event.target.value)}
              placeholder="No limit"
            />
          </label>
          <label className="flex items-center gap-2 pt-6 text-sm">
            <input
              type="checkbox"
              checked={allowPrivateRepoCode}
              onChange={() => setAllowPrivateRepoCode((current) => !current)}
            />
            Allow private repo code in model context
          </label>
        </div>
      </section>
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
