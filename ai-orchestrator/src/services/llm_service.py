"""LLM Service - High-level service using LLM Factory"""

from typing import Optional, List, Dict, Any
import os

from .llm.base import LLMResponse
from .llm.factory import LLMFactory, LLMProviderType


class LLMService:
    """
    Main LLM service using factory pattern.

    Usage:
        # Create from environment
        llm_service = LLMService.from_env()

        # Use specific provider
        llm_service = LLMService(provider="openai", model="gpt-4-turbo-preview")

        # Generate completion
        response = await llm_service.generate([{"role": "user", "content": "Hello!"}])
    """

    def __init__(self, provider: "BaseLLMProvider"):
        self.provider = provider

    @classmethod
    def from_env(cls, provider: Optional[str] = None):
        """Create LLM service from environment variables"""
        provider_type = provider or os.getenv("LLM_PROVIDER", "openai")
        model = os.getenv("LLM_MODEL")
        llm_provider = LLMFactory.create(provider_type, model=model)
        return cls(llm_provider)

    async def generate(
        self,
        messages: List[Dict[str, str]],
        **kwargs
    ) -> LLMResponse:
        """Generate completion using the configured provider"""
        return await self.provider.generate(messages, **kwargs)

    async def embed(self, text: str) -> List[float]:
        """Generate embedding"""
        return await self.provider.embed(text)

    @property
    def provider_name(self) -> str:
        return self.provider.provider_name