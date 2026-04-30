import { api } from "./client";
import type { DashboardSummary } from "@/lib/types/dashboard";

export function getDashboardSummary() {
  return api<DashboardSummary>("/dashboard/summary");
}
