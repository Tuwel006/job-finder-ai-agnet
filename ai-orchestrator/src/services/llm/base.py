"""Base LLM Provider interface"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class LLMResponse(BaseModel):
    """Standardized LLM response"""
    content: str
    model: str
    usage: Dict[str, int]
    metadata: Dict[str, Any] = {}


class BaseLLMProvider(ABC):
    """Abstract base class for LLM providers"""

    def __init__(self, api_key: str, model: str, **config):
        self.api_key = api_key
        self.model = model
        self.config = config

    @abstractmethod
    async def generate(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> LLMResponse:
        """Generate completion from messages"""
        pass

    @abstractmethod
    async def embed(self, text: str) -> List[float]:
        """Generate embedding for text"""
        pass

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Return provider name for identification"""
        pass