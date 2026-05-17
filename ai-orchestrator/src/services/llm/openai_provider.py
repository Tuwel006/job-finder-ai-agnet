"""OpenAI LLM Provider"""

from typing import List, Optional
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

from .base import BaseLLMProvider, LLMResponse


class OpenAIProvider(BaseLLMProvider):
    """OpenAI LLM provider implementation"""

    def __init__(self, api_key: str, model: str = "gpt-4-turbo-preview", **config):
        super().__init__(api_key, model, **config)
        self.llm = ChatOpenAI(
            model=model,
            api_key=api_key,
            temperature=config.get("temperature", 0.7)
        )
        self.embeddings = OpenAIEmbeddings(
            model=config.get("embedding_model", "text-embedding-ada-002"),
            api_key=api_key
        )

    @property
    def provider_name(self) -> str:
        return "openai"

    async def generate(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> LLMResponse:
        response = await self.llm.agenerate(
            messages,
            temperature=temperature,
            max_tokens=max_tokens,
            **kwargs
        )
        return LLMResponse(
            content=response.generations[0].text,
            model=self.model,
            usage=response.llm_output.usage if hasattr(response, 'llm_output') else {},
            metadata={"provider": self.provider_name}
        )

    async def embed(self, text: str) -> List[float]:
        return await self.embeddings.aembed_query(text)