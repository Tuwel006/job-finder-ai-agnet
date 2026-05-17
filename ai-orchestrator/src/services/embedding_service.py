"""Embedding Service using LLM Factory"""

from typing import List
import os

from .llm.factory import LLMFactory, LLMProviderType


class EmbeddingService:
    """
    Embedding generation service.
    Uses OpenAI embeddings by default (most mature embedding API).
    Can be configured to use Gemini or MiniMax.
    """

    def __init__(self, provider: str = "openai"):
        self._provider_name = provider
        # Use OpenAI for embeddings (most mature embedding API)
        # Can switch to gemini if needed
        self.embeddings = LLMFactory.create(
            provider,
            model=os.getenv("EMBEDDING_MODEL", "text-embedding-ada-002")
        )

    async def embed_text(self, text: str) -> List[float]:
        """Generate embedding for a single text"""
        return await self.embeddings.embed(text)

    async def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts"""
        return [await self.embeddings.embed(text) for text in texts]

    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Batch embedding for multiple texts"""
        return await self.embed_documents(texts)