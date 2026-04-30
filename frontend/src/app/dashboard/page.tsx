export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform health and operational insights.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {["Active Jobs", "Failed Jobs", "Pending Approvals", "Validation Failures"].map((item) => (
          <section key={item} className="rounded border border-border bg-white p-4 shadow-panel">
            <div className="text-sm text-muted-foreground">{item}</div>
            <div className="mt-2 text-2xl font-semibold">0</div>
          </section>
        ))}
      </div>
    </div>
  );
}
