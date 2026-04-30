"use client";

import { FileText } from "lucide-react";
import { useState } from "react";

import type { Artifact } from "@/lib/types/artifact";
import { DiffViewer } from "@/components/jobs/diff-viewer";
import { useJobArtifactContent } from "@/lib/hooks/use-job-detail";

export function ArtifactsTab({ artifacts }: { artifacts: Artifact[] }) {
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
  const selectedArtifact = selectedArtifactId ?? artifacts[0]?.id ?? null;
  const content = useJobArtifactContent(artifacts[0]?.job_id ?? "", selectedArtifact);

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <div className="space-y-3">
        {artifacts.length === 0 ? <div className="text-sm text-muted-foreground">No artifacts yet.</div> : null}
        {artifacts.map((artifact) => (
          <button
            key={artifact.id}
            className={`block w-full rounded border border-border bg-white p-4 text-left ${
              selectedArtifact === artifact.id ? "outline outline-2 outline-primary" : ""
            }`}
            onClick={() => setSelectedArtifactId(artifact.id)}
          >
            <div className="flex items-center gap-2 font-medium">
              <FileText size={16} aria-hidden />
              {artifact.artifact_type}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{artifact.storage_path}</div>
            <div className="mt-2 text-xs text-muted-foreground">{artifact.content_type ?? "unknown"}</div>
          </button>
        ))}
      </div>

      <section className="min-h-80 rounded border border-border bg-white p-4">
        <h2 className="mb-3 font-semibold">Preview</h2>
        {content.isLoading ? <div className="text-sm text-muted-foreground">Loading artifact...</div> : null}
        {content.data?.artifact.artifact_type === "diff" ? (
          <DiffViewer content={content.data} />
        ) : content.data ? (
          <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap rounded bg-muted p-3 text-sm">{content.data.body}</pre>
        ) : (
          <div className="text-sm text-muted-foreground">Select an artifact to preview.</div>
        )}
      </section>
    </div>
  );
}
