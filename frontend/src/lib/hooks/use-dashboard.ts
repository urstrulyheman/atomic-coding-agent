"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardSummary } from "@/lib/api/dashboard";
import { queryKeys } from "@/lib/utils/query-keys";

export function useDashboardSummary() {
  return useQuery({
    queryKey: queryKeys.dashboardSummary,
    queryFn: getDashboardSummary,
  });
}
