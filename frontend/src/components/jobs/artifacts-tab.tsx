import type { Artifact } from "@/lib/types/artifact";

export function ArtifactsTab({ artifacts }: { artifacts: Artifact[] }) {
  return (
    <div className="space-y-3">
      {artifacts.length === 0 ? <div className="text-sm text-muted-foreground">No artifacts yet.</div> : null}
      {artifacts.map((artifact) => (
        <article key={artifact.id} className="rounded border border-border bg-white p-4">
          <div className="font-medium">{artifact.artifact_type}</div>
          <div className="text-sm text-muted-foreground">{artifact.storage_path}</div>
          <div className="text-xs text-muted-foreground">{artifact.content_type ?? "unknown"}</div>
        </article>
      ))}
    </div>
  );
}

