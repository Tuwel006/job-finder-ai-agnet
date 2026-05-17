"""Google Gemini LLM Provider"""

from typing import List, Optional
import httpx

from .base import BaseLLMProvider, LLMResponse


class GeminiProvider(BaseLLMProvider):
    """Google Gemini LLM provider implementation"""

    def __init__(self, api_key: str, model: str = "gemini-pro", **config):
        super().__init__(api_key, model, **config)
        self.base_url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

    @property
    def provider_name(self) -> str:
        return "gemini"

    async def generate(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> LLMResponse:
        # Convert messages to Gemini format
        contents = []
        for msg in messages:
            role = "model" if msg.get("role") == "assistant" else "user"
            contents.append({
                "role": role,
                "parts": [{"text": msg.get("content", "")}]
            })

        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens or 2048,
            }
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}?key={self.api_key}",
                json=payload,
                timeout=60.0
            )
            response.raise_for_status()
            data = response.json()

        content = data["candidates"][0]["content"]["parts"][0]["text"]
        return LLMResponse(
            content=content,
            model=self.model,
            usage={},
            metadata={"provider": self.provider_name}
        )

    async def embed(self, text: str) -> List[float]:
        """Use Gemini embeddings API"""
        embed_url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:embedContent"
        payload = {
            "content": {"parts": [{"text": text}]},
            "taskType": "SEMANTIC_RETRIEVAL"
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{embed_url}?key={self.api_key}",
                json=payload,
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
        # Return embedding values
        return data["embedding"]["values"]