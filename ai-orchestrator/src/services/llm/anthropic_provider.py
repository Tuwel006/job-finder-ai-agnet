"""Anthropic LLM Provider"""

from typing import List, Optional
from langchain_anthropic import ChatAnthropic

from .base import BaseLLMProvider, LLMResponse


class AnthropicProvider(BaseLLMProvider):
    """Anthropic Claude LLM provider implementation"""

    def __init__(self, api_key: str, model: str = "claude-3-sonnet-20240229", **config):
        super().__init__(api_key, model, **config)
        self.llm = ChatAnthropic(
            model=model,
            anthropic_api_key=api_key,
            temperature=config.get("temperature", 0.7)
        )

    @property
    def provider_name(self) -> str:
        return "anthropic"

    async def generate(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> LLMResponse:
        # Convert messages format for Anthropic
        response = await self.llm.agenerate(messages, **kwargs)
        return LLMResponse(
            content=response.generations[0].text,
            model=self.model,
            usage={},
            metadata={"provider": self.provider_name}
        )

    async def embed(self, text: str) -> List[float]:
        # Anthropic doesn't have embeddings, use OpenAI fallback
        raise NotImplementedError("Anthropic does not provide embeddings API. Use OpenAI or Gemini for embeddings.")