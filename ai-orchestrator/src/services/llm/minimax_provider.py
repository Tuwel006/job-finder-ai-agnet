"""MiniMax LLM Provider"""

from typing import List, Optional
import os
import hashlib
import time
import httpx

from .base import BaseLLMProvider, LLMResponse


class MiniMaxProvider(BaseLLMProvider):
    """MiniMax AI LLM provider implementation"""

    def __init__(self, api_key: str, model: str = "abab6-chat", **config):
        super().__init__(api_key, model, **config)
        self.group_id = config.get("group_id") or os.getenv("MINIMAX_GROUP_ID")
        if not self.group_id:
            raise ValueError("MiniMax requires group_id. Set MINIMAX_GROUP_ID env variable.")

    @property
    def provider_name(self) -> str:
        return "minimax"

    def _generate_signature(self, timestamp: int) -> str:
        """Generate MiniMax API signature"""
        message = f"{self.api_key}{timestamp}"
        return hashlib.sha256(message.encode()).hexdigest()

    async def generate(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> LLMResponse:
        timestamp = int(time.time())
        signature = self._generate_signature(timestamp)

        # Convert messages to MiniMax format
        minmax_messages = []
        for msg in messages:
            minmax_messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })

        payload = {
            "model": self.model,
            "messages": minmax_messages,
            "temperature": temperature,
            "max_tokens": max_tokens or 2048,
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
            "X-Auth-Signature": signature,
            "X-Auth-Timestamp": str(timestamp),
            "X-Group-Id": self.group_id,
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.minimax.chat/v1/text/chatcompletion_pro",
                json=payload,
                headers=headers,
                timeout=60.0
            )
            response.raise_for_status()
            data = response.json()

        content = data["choices"][0]["messages"][0]["text"]
        return LLMResponse(
            content=content,
            model=self.model,
            usage={
                "prompt_tokens": data.get("usage", {}).get("prompt_tokens", 0),
                "completion_tokens": data.get("usage", {}).get("completion_tokens", 0),
            },
            metadata={"provider": self.provider_name}
        )

    async def embed(self, text: str) -> List[float]:
        """MiniMax embeddings API"""
        payload = {
            "model": "embo-01",
            "texts": [text]
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
            "X-Group-Id": self.group_id,
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.minimax.chat/v1/embeddings",
                json=payload,
                headers=headers,
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()

        return data["data"][0]["embedding"]