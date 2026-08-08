"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createProvider, getProviders, updateProvider } from "@/lib/api/providers";
import type { AIProviderCreate, AIProviderUpdate } from "@/lib/types/provider";
import { queryKeys } from "@/lib/utils/query-keys";

export function useProviders() {
  return useQuery({
    queryKey: queryKeys.providers,
    queryFn: getProviders,
  });
}

export function useCreateProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AIProviderCreate) => createProvider(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.providers }),
  });
}

export function useUpdateProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ providerId, payload }: { providerId: string; payload: AIProviderUpdate }) =>
      updateProvider(providerId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.providers }),
  });
}

