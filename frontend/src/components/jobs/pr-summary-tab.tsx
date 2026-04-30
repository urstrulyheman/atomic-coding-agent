import type { Artifact } from "@/lib/types/artifact";

export function PRSummaryTab({ artifacts }: { artifacts: Artifact[] }) {
  const prArtifact = artifacts.find((artifact) => artifact.artifact_type === "pr_summary");

  return (
    <section className="rounded border border-border bg-white p-4">
      <h2 className="mb-2 font-semibold">PR Summary</h2>
      {prArtifact ? (
        <div className="text-sm text-muted-foreground">{prArtifact.storage_path}</div>
      ) : (
        <div className="text-sm text-muted-foreground">PR summary not generated yet.</div>
      )}
    </section>
  );
}
