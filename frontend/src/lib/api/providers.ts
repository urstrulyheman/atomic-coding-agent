import { api } from "./client";
import type {
  AIProvider,
  AIProviderCreate,
  AIProviderUpdate,
  ModelRoutingProfile,
  ModelRoutingProfileUpdate,
} from "@/lib/types/provider";

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

export function getRoutingProfile() {
  return api<ModelRoutingProfile>("/providers/routing-profile");
}

export function updateRoutingProfile(payload: ModelRoutingProfileUpdate) {
  return api<ModelRoutingProfile>("/providers/routing-profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
