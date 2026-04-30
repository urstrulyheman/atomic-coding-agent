import type { JobLog } from "@/lib/api/jobs";

export function LogsTab({ logs }: { logs: JobLog[] }) {
  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <article key={log.id} className="rounded border border-border bg-white p-3">
          <div className="text-xs text-muted-foreground">
            {new Date(log.created_at).toLocaleString()} | {log.log_type}
          </div>
          <div className="font-medium">{log.message}</div>
          {log.metadata_json ? (
            <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">{JSON.stringify(log.metadata_json, null, 2)}</pre>
          ) : null}
        </article>
      ))}
    </div>
  );
}

