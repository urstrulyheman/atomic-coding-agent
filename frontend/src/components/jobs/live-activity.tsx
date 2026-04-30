import type { JobEvent } from "@/lib/types/event";

export function LiveActivity({ events, connected }: { events: JobEvent[]; connected: boolean }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Live Activity</h2>
        <span className="text-xs text-muted-foreground">{connected ? "Live" : "Disconnected"}</span>
      </div>
      <div className="max-h-[500px] space-y-3 overflow-auto">
        {events.length === 0 ? (
          <div className="text-sm text-muted-foreground">No events yet.</div>
        ) : (
          events.map((event) => (
            <article key={event.id} className="rounded border border-border bg-white p-3">
              <div className="text-xs text-muted-foreground">{new Date(event.created_at).toLocaleString()}</div>
              <div className="font-medium">{event.event_type}</div>
              <div className="text-sm text-muted-foreground">{event.message}</div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

