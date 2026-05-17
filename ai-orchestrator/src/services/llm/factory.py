"""LLM Factory for creating provider instances"""

from typing import Dict, Type, Optional
from enum import Enum
import os

from .base import BaseLLMProvider, LLMResponse
from .openai_provider import OpenAIProvider
from .anthropic_provider import AnthropicProvider
from .gemini_provider import GeminiProvider
from .minimax_provider import MiniMaxProvider


class LLMProviderType(Enum):
    """Supported LLM providers"""
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GEMINI = "gemini"
    MINIMAX = "minimax"


class LLMFactory:
    """
    Factory for creating LLM provider instances.

    Supports adding new providers without modifying existing code:
    1. Create new provider class implementing BaseLLMProvider
    2. Add to PROVIDER_MAP below
    3. Register in LLMProviderType enum if needed
    """

    PROVIDER_MAP: Dict[LLMProviderType, Type[BaseLLMProvider]] = {
        LLMProviderType.OPENAI: OpenAIProvider,
        LLMProviderType.ANTHROPIC: AnthropicProvider,
        LLMProviderType.GEMINI: GeminiProvider,
        LLMProviderType.MINIMAX: MiniMaxProvider,
    }

    @classmethod
    def create(
        cls,
        provider: LLMProviderType | str,
        model: Optional[str] = None,
        api_key: Optional[str] = None,
        **config
    ) -> BaseLLMProvider:
        """
        Create an LLM provider instance.

        Args:
            provider: Provider type (string or LLMProviderType enum)
            model: Model name (uses default if not specified)
            api_key: API key (uses env var if not specified)
            **config: Additional provider-specific configuration

        Returns:
            BaseLLMProvider instance

        Example:
            # Using enum
            llm = LLMFactory.create(LLMProviderType.OPENAI, model="gpt-4")

            # Using string
            llm = LLMFactory.create("openai", model="gpt-4-turbo-preview")

            # With custom config
            llm = LLMFactory.create("openai", temperature=0.5, max_tokens=1000)
        """
        # Convert string to enum if needed
        if isinstance(provider, str):
            provider = LLMProviderType(provider.lower())

        # Get provider class
        provider_class = cls.PROVIDER_MAP.get(provider)
        if not provider_class:
            available = [p.value for p in cls.PROVIDER_MAP.keys()]
            raise ValueError(
                f"Unknown provider: {provider}. Available: {available}"
            )

        # Get API key from env if not provided
        if api_key is None:
            env_key_map = {
                LLMProviderType.OPENAI: "OPENAI_API_KEY",
                LLMProviderType.ANTHROPIC: "ANTHROPIC_API_KEY",
                LLMProviderType.GEMINI: "GEMINI_API_KEY",
                LLMProviderType.MINIMAX: "MINIMAX_API_KEY",
            }
            env_var = env_key_map.get(provider, "OPENAI_API_KEY")
            api_key = os.getenv(env_var)
            if not api_key:
                raise ValueError(f"API key not found. Set {env_var} environment variable.")

        # Get default model from env if not provided
        if model is None:
            model = cls._get_default_model(provider)

        # Create and return instance
        return provider_class(api_key=api_key, model=model, **config)

    @classmethod
    def _get_default_model(cls, provider: LLMProviderType) -> str:
        """Get default model for provider from environment"""
        defaults = {
            LLMProviderType.OPENAI: os.getenv("OPENAI_MODEL", "gpt-4-turbo-preview"),
            LLMProviderType.ANTHROPIC: os.getenv("ANTHROPIC_MODEL", "claude-3-sonnet-20240229"),
            LLMProviderType.GEMINI: os.getenv("GEMINI_MODEL", "gemini-pro"),
            LLMProviderType.MINIMAX: os.getenv("MINIMAX_MODEL", "abab6-chat"),
        }
        return defaults.get(provider, "")

    @classmethod
    def register_provider(
        cls,
        provider_type: LLMProviderType,
        provider_class: Type[BaseLLMProvider]
    ):
        """
        Register a new provider at runtime.

        This allows adding providers without modifying this file.

        Example:
            class CustomProvider(BaseLLMProvider):
                ...

            LLMFactory.register_provider(LLMProviderType.CUSTOM, CustomProvider)
        """
        cls.PROVIDER_MAP[provider_type] = provider_class

    @classmethod
    def list_providers(cls) -> list[str]:
        """List all registered provider names"""
        return [p.value for p in cls.PROVIDER_MAP.keys()]