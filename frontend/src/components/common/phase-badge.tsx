export function PhaseBadge({ value }: { value: string }) {
  return (
    <span className="inline-flex rounded border border-border bg-white px-2 py-1 text-xs font-medium text-muted-foreground">
      {value.replaceAll("_", " ")}
    </span>
  );
}
