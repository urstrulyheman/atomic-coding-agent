"use client";

import { useMemo, useState } from "react";
import { Bot, Check, KeyRound, Plus, Shield, SlidersHorizontal } from "lucide-react";

import { useCreateProvider, useProviders, useUpdateProvider } from "@/lib/hooks/use-providers";
import type { AIProvider, ProviderCapabilities, ProviderPolicy } from "@/lib/types/provider";

const capabilityLabels: Array<[keyof ProviderCapabilities, string]> = [
  ["chat", "Chat"],
  ["code", "Code"],
  ["embeddings", "Embeddings"],
  ["vision", "Vision"],
  ["tool_calling", "Tool calling"],
  ["streaming", "Streaming"],
];

const emptyCapabilities: ProviderCapabilities = {
  chat: true,
  code: true,
  embeddings: false,
  vision: false,
  tool_calling: true,
  streaming: true,
};

const emptyPolicy: ProviderPolicy = {
  allow_private_repo_code: false,
  allow_security_sensitive_tasks: false,
  max_cost_per_job_usd: null,
  require_approval_before_use: false,
};

function ProviderCard({ provider }: { provider: AIProvider }) {
  const updateProvider = useUpdateProvider();
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState(provider.base_url ?? "");
  const [defaultModel, setDefaultModel] = useState(provider.default_model);
  const [embeddingModel, setEmbeddingModel] = useState(provider.embedding_model ?? "");
  const [capabilities, setCapabilities] = useState(provider.capabilities);
  const [policy, setPolicy] = useState(provider.policy);

  function save() {
    updateProvider.mutate({
      providerId: provider.id,
      payload: {
        api_key: apiKey || undefined,
        base_url: baseUrl || null,
        default_model: defaultModel,
        embedding_model: embeddingModel || null,
        capabilities,
        policy,
      },
    });
    setApiKey("");
  }

  function toggleCapability(key: keyof ProviderCapabilities) {
    setCapabilities((current) => ({ ...current, [key]: !current[key] }));
  }

  function patchPolicy(patch: Partial<ProviderPolicy>) {
    setPolicy((current) => ({ ...current, ...patch }));
  }

  return (
    <section className="rounded-xl border border-[#e6e2da] bg-white p-5 shadow-[0_10px_35px_rgba(23,32,38,0.06)]">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-[#edf5df] p-2 text-[#56734c]">
            <Bot size={18} aria-hidden />
          </div>
          <div>
            <h2 className="font-semibold text-[#252a25]">{provider.display_name}</h2>
            <div className="text-sm text-[#777b74]">{provider.provider_type}</div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded bg-[#f3f1ed] px-2 py-1">
                {provider.api_key_configured ? `Key ${provider.api_key_preview}` : "No API key"}
              </span>
              <span className="rounded bg-[#f3f1ed] px-2 py-1">{provider.enabled ? "Enabled" : "Disabled"}</span>
            </div>
          </div>
        </div>
        <button
          className={`rounded-full px-3 py-1.5 text-sm ${
            provider.enabled ? "bg-[#1f9d55] text-white" : "bg-[#f3f1ed] text-[#686c66]"
          }`}
          onClick={() => updateProvider.mutate({ providerId: provider.id, payload: { enabled: !provider.enabled } })}
        >
          {provider.enabled ? "Enabled" : "Disabled"}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm text-[#6f736d]">API key</span>
          <div className="flex items-center gap-2 rounded border border-[#e6e2da] px-3 py-2">
            <KeyRound size={16} className="text-[#8b8f87]" aria-hidden />
            <input
              className="min-w-0 flex-1 outline-none"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder={provider.api_key_configured ? "Replace API key" : "Paste API key"}
              type="password"
            />
          </div>
        </label>
        <label className="space-y-1">
          <span className="text-sm text-[#6f736d]">Base URL</span>
          <input
            className="w-full rounded border border-[#e6e2da] px-3 py-2 outline-none"
            value={baseUrl}
            onChange={(event) => setBaseUrl(event.target.value)}
            placeholder="https://api.provider.com/v1"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-[#6f736d]">Default model</span>
          <input
            className="w-full rounded border border-[#e6e2da] px-3 py-2 outline-none"
            value={defaultModel}
            onChange={(event) => setDefaultModel(event.target.value)}
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-[#6f736d]">Embedding model</span>
          <input
            className="w-full rounded border border-[#e6e2da] px-3 py-2 outline-none"
            value={embeddingModel}
            onChange={(event) => setEmbeddingModel(event.target.value)}
            placeholder="Optional"
          />
        </label>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <SlidersHorizontal size={16} aria-hidden />
            Capabilities
          </div>
          <div className="grid grid-cols-2 gap-2">
            {capabilityLabels.map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 rounded border border-[#eeeae4] px-3 py-2 text-sm">
                <input type="checkbox" checked={capabilities[key]} onChange={() => toggleCapability(key)} />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <Shield size={16} aria-hidden />
            Policy
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={policy.allow_private_repo_code}
                onChange={() => patchPolicy({ allow_private_repo_code: !policy.allow_private_repo_code })}
              />
              Allow private repo code
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={policy.allow_security_sensitive_tasks}
                onChange={() =>
                  patchPolicy({ allow_security_sensitive_tasks: !policy.allow_security_sensitive_tasks })
                }
              />
              Allow security-sensitive tasks
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={policy.require_approval_before_use}
                onChange={() => patchPolicy({ require_approval_before_use: !policy.require_approval_before_use })}
              />
              Require approval before use
            </label>
            <label className="block space-y-1 text-sm">
              <span className="text-[#6f736d]">Max cost per job</span>
              <input
                className="w-full rounded border border-[#e6e2da] px-3 py-2 outline-none"
                type="number"
                min="0"
                step="0.01"
                value={policy.max_cost_per_job_usd ?? ""}
                onChange={(event) =>
                  patchPolicy({
                    max_cost_per_job_usd: event.target.value ? Number(event.target.value) : null,
                  })
                }
                placeholder="No limit"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          className="inline-flex items-center gap-2 rounded bg-[#1f2320] px-4 py-2 text-sm text-white disabled:opacity-50"
          onClick={save}
          disabled={updateProvider.isPending || !defaultModel}
        >
          <Check size={16} aria-hidden />
          Save provider
        </button>
      </div>
    </section>
  );
}

export function ProviderSettings() {
  const providers = useProviders();
  const createProvider = useCreateProvider();
  const customProvider = useMemo(
    () => ({
      provider_type: "custom",
      display_name: "Custom OpenAI-compatible",
      base_url: "https://api.example.com/v1",
      default_model: "custom-model",
      embedding_model: null,
      enabled: false,
      capabilities: emptyCapabilities,
      policy: emptyPolicy,
    }),
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">AI Providers</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#6f736d]">
            Configure provider keys and routing capabilities for OpenAI, Claude, Grok, Gemini, local models, or any
            OpenAI-compatible endpoint.
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded bg-[#1f2320] px-4 py-2 text-sm text-white"
          onClick={() => createProvider.mutate(customProvider)}
        >
          <Plus size={16} aria-hidden />
          Add custom provider
        </button>
      </div>

      <div className="rounded-xl border border-[#e6e2da] bg-[#fffdf9] p-4">
        <div className="grid gap-4 text-sm md:grid-cols-3">
          <div>
            <div className="text-[#8a8d86]">Routing</div>
            <div className="mt-1 font-medium">Per-task model selection</div>
          </div>
          <div>
            <div className="text-[#8a8d86]">Security</div>
            <div className="mt-1 font-medium">Masked keys and policy flags</div>
          </div>
          <div>
            <div className="text-[#8a8d86]">Compatibility</div>
            <div className="mt-1 font-medium">OpenAI-compatible base URLs</div>
          </div>
        </div>
      </div>

      {providers.isLoading ? <div>Loading providers...</div> : null}
      <div className="space-y-4">
        {(providers.data ?? []).map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </div>
  );
}

