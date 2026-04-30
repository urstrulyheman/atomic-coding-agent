import { clsx } from "clsx";

const tone: Record<string, string> = {
  COMPLETED: "bg-emerald-100 text-emerald-800",
  SUCCEEDED: "bg-emerald-100 text-emerald-800",
  RUNNING: "bg-blue-100 text-blue-800",
  EXECUTING: "bg-blue-100 text-blue-800",
  VALIDATING: "bg-indigo-100 text-indigo-800",
  WAITING_FOR_APPROVAL: "bg-amber-100 text-amber-800",
  FAILED: "bg-red-100 text-red-800",
  CANCELLED: "bg-slate-200 text-slate-700",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <span className={clsx("inline-flex rounded px-2 py-1 text-xs font-medium", tone[value] ?? "bg-muted text-muted-foreground")}>
      {value.replaceAll("_", " ")}
    </span>
  );
}

