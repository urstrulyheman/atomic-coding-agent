"use client";

import { useState } from "react";
import { Bot, Play } from "lucide-react";

import { useCreateJobModelCall } from "@/lib/hooks/use-job-detail";
import type { ModelCallResult } from "@/lib/types/model-call";

export function ModelCallsTab({
  jobId,
  requestText,
  calls,
}: {
  jobId: string;
  requestText: string;
  calls: ModelCallResult[];
}) {
  const createCall = useCreateJobModelCall(jobId);
  const [purpose, setPurpose] = useState("planning");

  function runDryCall() {
    createCall.mutate({
      job_id: jobId,
      purpose,
      prompt: requestText || "Plan this coding task.",
      provider_preference: purpose === "debug" ? ["anthropic", "openai", "xai"] : ["openai", "anthropic", "xai"],
      model_preference: [],
      response_schema: purpose === "planning" ? "planner_output_v1" : null,
      max_cost_usd: 1,
      allow_private_repo_code: false,
      dry_run: true,
    });
  }

  return (
    <div className="space-y-4">
      <section className="rounded border border-border bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Model Gateway</h2>
            <p className="text-sm text-muted-foreground">
              Dry-run provider routing and audit records before live provider calls are enabled.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="rounded border border-border bg-white px-3 py-2 text-sm"
              value={purpose}
              onChange={(event) => setPurpose(event.target.value)}
            >
              <option value="planning">planning</option>
              <option value="coding">coding</option>
              <option value="review">review</option>
              <option value="debug">debug</option>
              <option value="summarize">summarize</option>
            </select>
            <button
              className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm text-white disabled:opacity-50"
              onClick={runDryCall}
              disabled={createCall.isPending}
            >
              <Play size={16} aria-hidden />
              Dry run
            </button>
          </div>
        </div>
      </section>

      <div className="space-y-3">
        {calls.length === 0 ? <div className="text-sm text-muted-foreground">No model calls recorded.</div> : null}
        {calls.map((call) => (
          <article key={call.id} className="rounded border border-border bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="rounded bg-muted p-2 text-primary">
                  <Bot size={17} aria-hidden />
                </div>
                <div>
                  <div className="font-medium">
                    {call.provider_name} / {call.model}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {call.purpose} | {call.status} | {new Date(call.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <div>
                  {call.input_tokens + call.output_tokens} tokens | ${call.estimated_cost_usd.toFixed(6)}
                </div>
                <div>{call.latency_ms} ms</div>
              </div>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">Prompt</div>
                <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded bg-muted p-3 text-xs">
                  {call.prompt_preview}
                </pre>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">Response</div>
                <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded bg-muted p-3 text-xs">
                  {call.response_preview}
                </pre>
              </div>
            </div>
            {call.metadata_json.route_reason ? (
              <div className="mt-3 text-xs text-muted-foreground">Route: {String(call.metadata_json.route_reason)}</div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
