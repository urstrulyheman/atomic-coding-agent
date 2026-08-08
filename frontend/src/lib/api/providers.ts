import { api } from "./client";
import type { AIProvider, AIProviderCreate, AIProviderUpdate } from "@/lib/types/provider";

export function getProviders() {
  return api<AIProvider[]>("/providers");
}

export function createProvider(payload: AIProviderCreate) {
  return api<AIProvider>("/providers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProvider(providerId: string, payload: AIProviderUpdate) {
  return api<AIProvider>(`/providers/${providerId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

