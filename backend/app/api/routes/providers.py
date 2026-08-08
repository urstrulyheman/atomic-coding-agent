from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.schemas.providers import AIProviderCreate, AIProviderPublic, AIProviderUpdate
from app.services.store import store

router = APIRouter(prefix="/providers", tags=["providers"])


@router.get("", response_model=list[AIProviderPublic])
def list_providers() -> list[AIProviderPublic]:
    return store.list_providers()


@router.post("", response_model=AIProviderPublic, status_code=201)
def create_provider(payload: AIProviderCreate) -> AIProviderPublic:
    return store.create_provider(payload)


@router.get("/{provider_id}", response_model=AIProviderPublic)
def get_provider(provider_id: UUID) -> AIProviderPublic:
    provider = store.get_provider(provider_id)
    if provider is None:
        raise HTTPException(status_code=404, detail="Provider not found")
    return provider


@router.patch("/{provider_id}", response_model=AIProviderPublic)
def update_provider(provider_id: UUID, payload: AIProviderUpdate) -> AIProviderPublic:
    provider = store.update_provider(provider_id, payload)
    if provider is None:
        raise HTTPException(status_code=404, detail="Provider not found")
    return provider
