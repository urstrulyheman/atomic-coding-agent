"use client";

import { Bot, GitBranch, ShieldCheck } from "lucide-react";

import type { PlanRecord } from "@/lib/types/plan";

export function PlanTab({ plan }: { plan: PlanRecord | null }) {
  if (!plan) {
    return (
      <section className="rounded border border-border bg-white p-4 text-sm text-muted-foreground">
        No planner output has been stored for this job yet.
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded border border-border bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
              <GitBranch size={16} aria-hidden />
              Planner DAG
            </div>
            <h2 className="font-semibold">{plan.goal}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {plan.tasks.length} tasks generated {new Date(plan.created_at).toLocaleString()}.
            </p>
          </div>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded border border-border px-3 py-2">
              <div className="text-xs text-muted-foreground">Provider</div>
              <div className="font-medium">{plan.provider_name ?? "Not recorded"}</div>
            </div>
            <div className="rounded border border-border px-3 py-2">
              <div className="text-xs text-muted-foreground">Model</div>
              <div className="font-medium">{plan.model ?? "Not recorded"}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-[1fr_280px]">
        <div className="space-y-3">
          {plan.tasks.map((task, index) => (
            <article key={task.task_key} className="rounded border border-border bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {task.task_type} | {task.agent_type}
                      {task.tool_name ? ` | ${task.tool_name}` : ""}
                    </div>
                  </div>
                </div>
                <DependencyList dependencies={task.depends_on} />
              </div>
              {task.risk_flags.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {task.risk_flags.map((flag) => (
                    <span key={flag} className="rounded border border-border px-2 py-1 text-xs text-muted-foreground">
                      {flag}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>

        <aside className="space-y-3">
          <section className="rounded border border-border bg-white p-4">
            <div className="mb-3 flex items-center gap-2 font-medium">
              <ShieldCheck size={16} aria-hidden />
              Risk Policy
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Approval required</span>
                <span className="font-medium">{plan.requires_approval ? "Yes" : "No"}</span>
              </div>
              <div>
                <div className="mb-2 text-muted-foreground">Flags</div>
                <div className="flex flex-wrap gap-2">
                  {plan.risk_flags.length ? (
                    plan.risk_flags.map((flag) => (
                      <span key={flag} className="rounded bg-muted px-2 py-1 text-xs">
                        {flag}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded border border-border bg-white p-4">
            <div className="mb-3 flex items-center gap-2 font-medium">
              <Bot size={16} aria-hidden />
              Audit Link
            </div>
            <div className="break-all text-sm text-muted-foreground">
              {plan.model_call_id ?? "No model call attached."}
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

function DependencyList({ dependencies }: { dependencies: string[] }) {
  if (!dependencies.length) {
    return <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">root task</span>;
  }

  return (
    <div className="flex max-w-full flex-wrap justify-end gap-2">
      {dependencies.map((dependency) => (
        <span key={dependency} className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
          after {dependency}
        </span>
      ))}
    </div>
  );
}
