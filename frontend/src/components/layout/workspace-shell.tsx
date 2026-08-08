"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bot,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Code2,
  FileText,
  Folder,
  GitBranch,
  Gauge,
  History,
  Loader2,
  MessageSquarePlus,
  PanelRight,
  Play,
  Search,
  Settings,
  Square,
  TerminalSquare,
} from "lucide-react";

import { useJobArtifacts, useJobStatus, useJobTasks } from "@/lib/hooks/use-job-detail";

const projects = [
  {
    name: "Atomic-coding-agent",
    items: [
      { label: "Update implementation plan", href: "/jobs" },
      { label: "Provider-agnostic design", href: "/dashboard" },
    ],
  },
  {
    name: "Atomic-chat",
    items: [{ label: "Build chat coin MVP", href: "/jobs" }],
  },
  {
    name: "FinanceHub",
    items: [{ label: "Draft roadmap", href: "/dashboard" }],
  },
  {
    name: "Orca",
    items: [{ label: "Split inference services", href: "/approvals" }],
  },
];

const nav = [
  { label: "New chat", href: "/new", icon: MessageSquarePlus },
  { label: "Search", href: "/jobs", icon: Search },
  { label: "Automations", href: "/dashboard", icon: Clock },
  { label: "AI Providers", href: "/settings/providers", icon: Settings },
];

function getJobId(pathname: string) {
  const match = pathname.match(/^\/jobs\/([^/]+)/);
  return match?.[1] ?? null;
}

function ProgressRail({ pathname }: { pathname: string }) {
  const jobId = getJobId(pathname);
  const status = useJobStatus(jobId ?? "");
  const tasks = useJobTasks(jobId ?? "");
  const artifacts = useJobArtifacts(jobId ?? "");
  const hasJob = Boolean(jobId);

  const taskList = tasks.data ?? [];
  const changedFiles = artifacts.data?.find((artifact) => artifact.artifact_type === "diff")?.metadata_json?.files_changed;
  const additions = artifacts.data?.find((artifact) => artifact.artifact_type === "diff")?.metadata_json?.additions;
  const deletions = artifacts.data?.find((artifact) => artifact.artifact_type === "diff")?.metadata_json?.deletions;

  return (
    <aside className="hidden w-[360px] shrink-0 border-l border-[#ece9e3] bg-[#fbfaf7] px-5 py-5 xl:block">
      <div className="sticky top-5 space-y-5">
        <section className="rounded-2xl border border-[#ece9e3] bg-white/80 p-4 shadow-[0_10px_30px_rgba(23,32,38,0.06)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-[#8a8a83]">Progress</h2>
            <PanelRight size={16} className="text-[#9b9b95]" aria-hidden />
          </div>
          {hasJob ? (
            <div className="space-y-3">
              {taskList.length ? null : <div className="text-sm text-[#8a8a83]">Waiting for task graph...</div>}
              {taskList.map((task) => {
                const done = task.status === "SUCCEEDED";
                const running = task.status === "RUNNING";
                return (
                  <div key={task.id} className="flex gap-3 text-sm">
                    {done ? (
                      <CheckCircle2 size={17} className="mt-0.5 text-[#2aa867]" aria-hidden />
                    ) : running ? (
                      <Loader2 size={17} className="mt-0.5 animate-spin text-[#7c8f3c]" aria-hidden />
                    ) : (
                      <Circle size={17} className="mt-0.5 text-[#a7a7a0]" aria-hidden />
                    )}
                    <div>
                      <div className="text-[#5e625d]">{task.title}</div>
                      <div className="text-xs text-[#969992]">{task.status.replaceAll("_", " ")}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3 text-sm text-[#777b74]">
              <div className="flex gap-3">
                <Circle size={17} className="mt-0.5" aria-hidden />
                Select or create a job
              </div>
              <div className="flex gap-3">
                <Circle size={17} className="mt-0.5" aria-hidden />
                Review orchestration progress
              </div>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[#ece9e3] bg-white/80 p-4">
          <h2 className="mb-4 text-sm font-medium text-[#8a8a83]">Branch details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#3e423d]">
                <FileText size={16} aria-hidden />
                Changes
              </span>
              <span>
                <span className="text-[#1f9d55]">+{String(additions ?? 0)}</span>{" "}
                <span className="text-[#c94b4b]">-{String(deletions ?? 0)}</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-[#777b74]">
              <span className="flex items-center gap-2">
                <GitBranch size={16} aria-hidden />
                Branch
              </span>
              <span>{status.data?.workflow_stage ?? "main"}</span>
            </div>
            <div className="flex items-center justify-between text-[#777b74]">
              <span className="flex items-center gap-2">
                <Code2 size={16} aria-hidden />
                Files
              </span>
              <span>{String(changedFiles ?? 0)}</span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#ece9e3] bg-white/80 p-4">
          <h2 className="mb-4 text-sm font-medium text-[#8a8a83]">Artifacts</h2>
          <div className="space-y-3">
            {(artifacts.data ?? []).slice(0, 5).map((artifact) => (
              <div key={artifact.id} className="flex items-center gap-2 text-sm text-[#5f625e]">
                <FileText size={16} aria-hidden />
                <span className="truncate">{artifact.storage_path.split("/").at(-1)}</span>
              </div>
            ))}
            {hasJob && !artifacts.data?.length ? <div className="text-sm text-[#8a8a83]">No artifacts yet.</div> : null}
          </div>
        </section>
      </div>
    </aside>
  );
}

function LeftSidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden w-[320px] shrink-0 border-r border-[#dfe8d6] bg-[#f0f8df] lg:flex lg:flex-col">
      <div className="flex items-center gap-4 px-5 py-4 text-sm text-[#7b8176]">
        <span className="h-3 w-3 rounded border border-[#8f9887]" />
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
      </div>

      <nav className="space-y-1 px-3">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.label} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#5e6758] hover:bg-white/60">
              <Icon size={16} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-7 px-5 text-sm text-[#9aa38f]">Projects</div>
      <div className="mt-2 flex-1 space-y-3 overflow-auto px-3 pb-4">
        {projects.map((project) => (
          <div key={project.name}>
            <div className="flex items-center gap-2 px-2 py-2 text-sm text-[#717b6a]">
              <Folder size={16} aria-hidden />
              <span className="truncate">{project.name}</span>
            </div>
            <div className="space-y-1 pl-5">
              {project.items.map((item) => {
                const active = pathname === item.href || (item.href === "/jobs" && pathname.startsWith("/jobs"));
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                      active ? "bg-[#dfeccf] text-[#394238]" : "text-[#5f675b] hover:bg-white/60"
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    {active ? <Circle size={12} className="text-[#85937c]" aria-hidden /> : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Link href="/settings/providers" className="flex items-center gap-3 border-t border-[#dfe8d6] px-5 py-4 text-sm text-[#4f594b]">
        <Settings size={16} aria-hidden />
        Settings
      </Link>
    </aside>
  );
}

function TopBar({ pathname }: { pathname: string }) {
  const title = pathname.startsWith("/settings/providers")
    ? "AI provider settings"
    : pathname.startsWith("/new")
    ? "New coding job"
    : pathname.startsWith("/approvals")
      ? "Approvals"
      : pathname.startsWith("/dashboard")
        ? "Platform dashboard"
        : "Update implementation plan";

  return (
    <header className="flex h-14 items-center justify-between border-b border-[#ece9e3] bg-white/95 px-5">
      <div className="flex items-center gap-3">
        <Bot size={18} className="text-[#5c6f52]" aria-hidden />
        <h1 className="text-sm font-semibold text-[#2f332f]">{title}</h1>
      </div>
      <div className="flex items-center gap-2 text-[#8d908a]">
        <button className="rounded-md p-2 hover:bg-[#f3f1ed]" title="Run">
          <Play size={16} aria-hidden />
        </button>
        <button className="rounded-md p-2 hover:bg-[#f3f1ed]" title="Activity">
          <Activity size={16} aria-hidden />
        </button>
        <button className="rounded-md p-2 hover:bg-[#f3f1ed]" title="Terminal">
          <TerminalSquare size={16} aria-hidden />
        </button>
        <button className="rounded-md p-2 hover:bg-[#f3f1ed]" title="History">
          <History size={16} aria-hidden />
        </button>
      </div>
    </header>
  );
}

function Composer() {
  return (
    <div className="pointer-events-none fixed bottom-5 left-0 right-0 z-30 flex justify-center px-4 lg:left-[320px] xl:right-[360px]">
      <div className="pointer-events-auto w-full max-w-4xl rounded-2xl border border-[#e5e1da] bg-white/95 p-3 shadow-[0_18px_60px_rgba(23,32,38,0.16)] backdrop-blur">
        <div className="mb-2 flex items-center justify-between border-b border-[#efede8] pb-2 text-sm">
          <span className="text-[#8c8e88]">Ask for follow-up changes</span>
          <Link href="/jobs" className="text-[#3f463d] hover:underline">
            Review changes
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-md p-2 text-[#8a8d86] hover:bg-[#f3f1ed]" title="Add context">
            <MessageSquarePlus size={18} aria-hidden />
          </button>
          <div className="flex-1 text-sm text-[#b0b0aa]">Describe the next change or ask the agent to rerun checks</div>
          <button className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[#6f736d] hover:bg-[#f3f1ed]">
            <Gauge size={16} aria-hidden />
            Medium
            <ChevronDown size={14} aria-hidden />
          </button>
          <button className="rounded-full bg-[#1f2320] p-2 text-white" title="Stop">
            <Square size={15} fill="currentColor" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#fbfaf7]">
      <LeftSidebar pathname={pathname} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar pathname={pathname} />
        <div className="flex min-h-0 flex-1">
          <main className="min-w-0 flex-1 overflow-auto px-6 pb-40 pt-6">
            <div className="mx-auto max-w-5xl">{children}</div>
          </main>
          <ProgressRail pathname={pathname} />
        </div>
      </div>
      <Composer />
    </div>
  );
}
