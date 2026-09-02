from app.schemas.model_calls import ModelCallRequest, ModelRouteDecision
from app.schemas.providers import AIProviderPublic
from app.services.store import store


class ModelRouter:
    def route(self, request: ModelCallRequest) -> ModelRouteDecision:
        providers = [provider for provider in store.list_providers() if provider.enabled]
        providers = self._filter_policy(providers, request)
        if not providers:
            raise ValueError("No enabled AI provider satisfies the request policy.")

        provider = self._select_provider(providers, request)
        model = self._select_model(provider, request)
        return ModelRouteDecision(
            provider_id=provider.id,
            provider_type=provider.provider_type,
            provider_name=provider.display_name,
            model=model,
            reason=self._reason(provider, request),
        )

    def _filter_policy(
        self,
        providers: list[AIProviderPublic],
        request: ModelCallRequest,
    ) -> list[AIProviderPublic]:
        filtered: list[AIProviderPublic] = []
        for provider in providers:
            if request.allow_private_repo_code and not provider.policy.allow_private_repo_code:
                continue
            if request.max_cost_usd is not None and provider.policy.max_cost_per_job_usd is not None:
                if provider.policy.max_cost_per_job_usd < request.max_cost_usd:
                    continue
            filtered.append(provider)
        return filtered

    def _select_provider(
        self,
        providers: list[AIProviderPublic],
        request: ModelCallRequest,
    ) -> AIProviderPublic:
        for preferred_type in request.provider_preference:
            for provider in providers:
                if provider.provider_type == preferred_type:
                    return provider

        routing_profile = store.get_routing_profile()
        purpose_priority = {
            "planning": routing_profile.planning,
            "coding": routing_profile.coding,
            "review": routing_profile.review,
            "debug": routing_profile.debug,
            "summarize": routing_profile.summarize,
        }
        for provider_type in purpose_priority.get(request.purpose, []):
            for provider in providers:
                if provider.provider_type == provider_type:
                    return provider
        if not routing_profile.allow_fallback_to_any_enabled:
            raise ValueError(f"No enabled AI provider matches the {request.purpose} routing profile.")
        return providers[0]

    def _select_model(self, provider: AIProviderPublic, request: ModelCallRequest) -> str:
        for model in request.model_preference:
            if model:
                return model
        return provider.default_model

    def _reason(self, provider: AIProviderPublic, request: ModelCallRequest) -> str:
        if provider.provider_type in request.provider_preference:
            return "Matched explicit provider preference."
        return f"Selected enabled provider for {request.purpose} workload."


model_router = ModelRouter()
