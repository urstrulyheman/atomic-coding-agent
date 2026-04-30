"use client";

import { useEffect, useState } from "react";

import { eventStreamUrl } from "@/lib/api/client";
import { getJobEvents } from "@/lib/api/jobs";
import type { JobEvent } from "@/lib/types/event";

export function useJobEvents(jobId: string) {
  const [events, setEvents] = useState<JobEvent[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    getJobEvents(jobId).then(setEvents).catch(() => setEvents([]));

    const stream = new EventSource(eventStreamUrl(`/jobs/${jobId}/events/stream`));
    stream.onopen = () => setConnected(true);
    stream.onerror = () => setConnected(false);
    stream.onmessage = (message) => {
      const event = JSON.parse(message.data) as JobEvent;
      setEvents((current) => (current.some((item) => item.id === event.id) ? current : [...current, event]));
    };

    return () => {
      stream.close();
      setConnected(false);
    };
  }, [jobId]);

  return { events, connected };
}

