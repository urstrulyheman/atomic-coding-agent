import type { ArtifactContent } from "@/lib/types/artifact";

type DiffLine = {
  id: string;
  type: "file" | "hunk" | "add" | "remove" | "context";
  text: string;
};

function parseDiff(body: string): DiffLine[] {
  return body.split("\n").map((line, index) => {
    if (line.startsWith("diff --git")) return { id: `${index}`, type: "file", text: line };
    if (line.startsWith("@@")) return { id: `${index}`, type: "hunk", text: line };
    if (line.startsWith("+") && !line.startsWith("+++")) return { id: `${index}`, type: "add", text: line };
    if (line.startsWith("-") && !line.startsWith("---")) return { id: `${index}`, type: "remove", text: line };
    return { id: `${index}`, type: "context", text: line };
  });
}

const lineStyles: Record<DiffLine["type"], string> = {
  file: "bg-slate-900 text-white",
  hunk: "bg-blue-50 text-blue-800",
  add: "bg-emerald-50 text-emerald-900",
  remove: "bg-red-50 text-red-900",
  context: "bg-white text-foreground",
};

export function DiffViewer({ content }: { content: ArtifactContent }) {
  const lines = parseDiff(content.body);
  const additions = content.artifact.metadata_json?.additions;
  const deletions = content.artifact.metadata_json?.deletions;
  const filesChanged = content.artifact.metadata_json?.files_changed;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span>{String(filesChanged ?? 0)} files</span>
        <span className="text-emerald-700">+{String(additions ?? 0)}</span>
        <span className="text-red-700">-{String(deletions ?? 0)}</span>
      </div>
      <div className="max-h-[560px] overflow-auto rounded border border-border bg-white font-mono text-xs">
        {lines.map((line, index) => (
          <div key={line.id} className={`grid grid-cols-[56px_1fr] ${lineStyles[line.type]}`}>
            <div className="select-none border-r border-border/70 px-2 py-1 text-right text-muted-foreground">{index + 1}</div>
            <pre className="overflow-x-auto whitespace-pre px-3 py-1">{line.text || " "}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
