"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { ArtifactsTab } from "@/components/jobs/artifacts-tab";
import { ApprovalsTab } from "@/components/jobs/approvals-tab";
import { JobHeader } from "@/components/jobs/job-header";
import { LiveActivity } from "@/components/jobs/live-activity";
import { LogsTab } from "@/components/jobs/logs-tab";
import { OverviewTab } from "@/components/jobs/overview-tab";
import { PRSummaryTab } from "@/components/jobs/pr-summary-tab";
import { ReviewTab } from "@/components/jobs/review-tab";
import { StatusStrip } from "@/components/jobs/status-strip";
import { TasksTab } from "@/components/jobs/tasks-tab";
import { ValidationTab } from "@/components/jobs/validation-tab";
import {
  useJobArtifacts,
  useJobApprovals,
  useJobDetail,
  useJobLogs,
  useJobStatus,
  useJobTasks,
  useJobValidation,
} from "@/lib/hooks/use-job-detail";
import { useJobEvents } from "@/lib/hooks/use-job-events";

const tabs = ["overview", "tasks", "live", "approvals", "logs", "validation", "review", "artifacts", "pr-summary"] as const;

export default function JobDetailPage() {
  const params = useParams<{ jobId: string }>();
  const jobId = params.jobId;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("overview");

  const job = useJobDetail(jobId);
  const status = useJobStatus(jobId);
  const tasks = useJobTasks(jobId);
  const artifacts = useJobArtifacts(jobId);
  const approvals = useJobApprovals(jobId);
  const validation = useJobValidation(jobId);
  const logs = useJobLogs(jobId);
  const { events, connected } = useJobEvents(jobId);

  if (job.isLoading || status.isLoading) return <div>Loading...</div>;
  if (!job.data || !status.data) return <div>Job not found.</div>;

  return (
    <div className="space-y-6">
      <JobHeader job={job.data} />
      <StatusStrip status={status.data} />

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`rounded px-3 py-2 text-sm ${activeTab === tab ? "bg-primary text-white" : "bg-white text-muted-foreground"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <OverviewTab job={job.data} status={status.data} />}
      {activeTab === "tasks" && <TasksTab tasks={tasks.data ?? []} />}
      {activeTab === "live" && <LiveActivity events={events} connected={connected} />}
      {activeTab === "approvals" && <ApprovalsTab approvals={approvals.data ?? []} />}
      {activeTab === "logs" && <LogsTab logs={logs.data ?? []} />}
      {activeTab === "validation" && <ValidationTab runs={validation.data ?? []} />}
      {activeTab === "review" && (
        <ReviewTab score={status.data.review?.score} recommendation={status.data.review?.recommendation} />
      )}
      {activeTab === "artifacts" && <ArtifactsTab artifacts={artifacts.data ?? []} />}
      {activeTab === "pr-summary" && <PRSummaryTab artifacts={artifacts.data ?? []} />}
    </div>
  );
}
