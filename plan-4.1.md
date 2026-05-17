# Plan 4.1: Python Environment Setup

## Overview

Set up the Python environment for the AI Orchestrator component. This includes creating a virtual environment, installing LangChain, LangGraph, and all required dependencies for the AI agents.

---

## 1. Directory Structure

```
ai-orchestrator/
├── pyproject.toml                 # Poetry project configuration
├── poetry.lock                   # Locked dependencies
├── .env.example                   # Environment variables template
├── src/
│   ├── __init__.py
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── base_agent.py         # Base class for all agents
│   │   ├── base_tool.py          # Base class for tools
│   │   └── agent_registry.py     # Agent registration singleton
│   ├── graphs/
│   │   ├── __init__.py
│   │   ├── resume_graph.py       # Resume processing workflow
│   │   ├── job_search_graph.py   # Job search workflow
│   │   ├── matching_graph.py     # Matching workflow
│   │   └── preparation_graph.py  # Preparation generation workflow
│   ├── services/
│   │   ├── __init__.py
│   │   ├── llm/
│   │   │   ├── __init__.py
│   │   │   ├── base.py           # BaseLLMProvider interface
│   │   │   ├── factory.py        # LLM Factory for provider creation
│   │   │   ├── openai_provider.py # OpenAI implementation
│   │   │   └── anthropic_provider.py # Anthropic implementation
│   │   └── embedding_service.py  # Embedding generation (uses factory)
│   └── utils/
│       ├── __init__.py
│       └── helpers.py
├── tests/
│   ├── __init__.py
│   ├── test_agents.py
│   └── test_graphs.py
└── scripts/
    └── setup.sh                  # Quick setup script
```

---

## 2. Project Configuration

### pyproject.toml
```toml
[tool.poetry]
name = "jobfind-ai-orchestrator"
version = "0.1.0"
description = "AI Orchestrator for JobFind - Resume parsing, embedding, matching"
authors = ["JobFind Team"]
readme = "README.md"

[tool.poetry.dependencies]
python = "^3.11"

# LangChain & LangGraph
langchain = "^0.1.0"
langchain-core = "^0.1.0"
langchain-openai = "^0.0.5"
langchain-anthropic = "^0.1.0"
langgraph = "^0.0.20"
langgraph-sdk = "^0.0.10"

# AI Providers
openai = "^1.10.0"
anthropic = "^0.18.0"

# Data processing
pypdf = "^4.0.0"
python-docx = "^1.1.0"
python-pptx = "^0.6.23"

# Vector store
chromadb = "^0.4.22"

# HTTP & API
httpx = "^0.26.0"
fastapi = "^0.109.0"
uvicorn = "^0.27.0"

# Utilities
pydantic = "^2.5.0"
python-dotenv = "^1.0.0"
numpy = "^1.26.0"

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.0"
pytest-asyncio = "^0.23.0"
black = "^23.12.0"
ruff = "^0.1.0"
mypy = "^1.8.0"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

---

## 3. Virtual Environment Setup

### 3.1 Create Virtual Environment
```bash
# Create using python3 -m venv (cross-platform)
python3 -m venv venv

# Or using poetry
poetry env use python3.11
```

### 3.2 Activate Environment
```bash
# Linux/macOS
source venv/bin/activate

# Windows
venv\Scripts\activate
```

---

## 4. Core Dependencies

### 4.1 LangChain Core
LangChain provides the building blocks for AI agents:
- `langchain` - Main package
- `langchain-core` - Core abstractions
- `langchain-openai` - OpenAI integration
- `langchain-anthropic` - Anthropic integration

### 4.2 LangGraph
LangGraph enables creation of multi-agent workflows with cycles:
- `langgraph` - Graph-based agent orchestration
- `langgraph-sdk` - SDK for interacting with LangGraph

### 4.3 Document Parsing
```toml
pypdf = "^4.0.0"          # PDF parsing
python-docx = "^1.1.0"   # DOCX parsing
python-pptx = "^0.6.23"  # PPT parsing (optional)
```

### 4.4 Vector Operations
```toml
chromadb = "^0.4.22"      # Vector database (local)
numpy = "^1.26.0"        # Numerical operations
```

---

## 5. Environment Variables

### .env.example
```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview

# Anthropic Configuration (optional)
ANTHROPIC_API_KEY=sk-ant-...

# Gemini Configuration
GEMINI_API_KEY=AIza...
GEMINI_MODEL=gemini-pro

# MiniMax Configuration
MINIMAX_API_KEY=eyJhbG...
MINIMAX_GROUP_ID=1234567890
MINIMAX_MODEL=abab6-chat

# Embedding Model
EMBEDDING_MODEL=text-embedding-ada-002
EMBEDDING_DIMENSIONS=1536

# Vector Store
CHROMA_HOST=localhost
CHROMA_PORT=8000

# API Configuration
API_HOST=0.0.0.0
API_PORT=8001

# Logging
LOG_LEVEL=INFO
```

---

## 6. Base Classes

### 6.1 BaseAgent
```python
# src/agents/base_agent.py
from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field

class AgentConfig(BaseModel):
    name: str
    description: str
    tools: list[str] = Field(default_factory=list)

class BaseAgent(ABC):
    def __init__(self, config: AgentConfig):
        self.config = config
        self.name = config.name
        self.description = config.description

    @abstractmethod
    async def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Main agent execution method"""
        pass

    @abstractmethod
    async def validate_input(self, input_data: Dict[str, Any]) -> bool:
        """Validate input data before processing"""
        pass
```

### 6.2 BaseTool
```python
# src/agents/base_tool.py
from abc import ABC, abstractmethod
from typing import Any, Dict

class BaseTool(ABC):
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description

    @abstractmethod
    async def execute(self, **kwargs) -> Dict[str, Any]:
        """Execute the tool with given parameters"""
        pass
```

### 6.3 AgentRegistry
```python
# src/agents/agent_registry.py
from typing import Dict, Type, Optional
from .base_agent import BaseAgent

class AgentRegistry:
    _agents: Dict[str, Type[BaseAgent]] = {}

    @classmethod
    def register(cls, name: str, agent_class: Type[BaseAgent]):
        cls._agents[name] = agent_class

    @classmethod
    def get(cls, name: str) -> Optional[Type[BaseAgent]]:
        return cls._agents.get(name)

    @classmethod
    def list_agents(cls) -> list[str]:
        return list(cls._agents.keys())
```

---

## 7. LLM Service (Factory Design Pattern)

### 7.1 LLM Provider Interface
```python
# src/services/llm/base.py
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from pydantic import BaseModel

class LLMResponse(BaseModel):
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
```

### 7.2 OpenAI Provider
```python
# src/services/llm/openai_provider.py
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
```

### 7.3 Anthropic Provider
```python
# src/services/llm/anthropic_provider.py
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
        response = await self.llm.agenerate(messages, **kwargs)
        return LLMResponse(
            content=response.generations[0].text,
            model=self.model,
            usage={},
            metadata={"provider": self.provider_name}
        )

    async def embed(self, text: str) -> List[float]:
        # Anthropic doesn't have embeddings, use OpenAI fallback
        raise NotImplementedError("Anthropic does not provide embeddings API")
```

### 7.4 Gemini Provider
```python
# src/services/llm/gemini_provider.py
from typing import List, Optional
import os
from .base import BaseLLMProvider, LLMResponse

class GeminiProvider(BaseLLMProvider):
    """Google Gemini LLM provider implementation"""

    def __init__(self, api_key: str, model: str = "gemini-pro", **config):
        super().__init__(api_key, model, **config)
        self.url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

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
        import httpx

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
                f"{self.url}?key={self.api_key}",
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
        import httpx
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
```

### 7.5 MiniMax Provider
```python
# src/services/llm/minimax_provider.py
from typing import List, Optional
import os
import hashlib
import time
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
        import httpx

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
        import httpx

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
```

### 7.4 LLM Factory
```python
# src/services/llm/factory.py
from typing import Dict, Type, Optional
from enum import Enum
import os

from .base import BaseLLMProvider, LLMResponse
from .openai_provider import OpenAIProvider
from .anthropic_provider import AnthropicProvider
from .gemini_provider import GeminiProvider
from .minimax_provider import MiniMaxProvider

class LLMProviderType(Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GEMINI = "gemini"
    MINIMAX = "minimax"
    # Future providers can be added here
    # OLLAMA = "ollama"
    # BEDROCK = "bedrock"

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

        # Create and return instance
        return provider_class(api_key=api_key, model=model or "", **config)

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
```

### 7.5 LLM Service (Uses Factory)
```python
# src/services/llm_service.py
from typing import Optional, List, Dict, Any
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
        response = await llm_service.generate(["Hello, world!"])
    """

    def __init__(self, provider: BaseLLMProvider):
        self.provider = provider

    @classmethod
    def from_env(cls, provider: Optional[str] = None):
        """Create LLM service from environment variables"""
        provider_type = provider or os.getenv("LLM_PROVIDER", "openai")
        model = os.getenv("LLM_MODEL")
        return cls(LLMFactory.create(provider_type, model=model))

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

### 7.6 Adding New LLM Providers (Extensibility)

To add a new LLM provider without modifying existing code:

**Step 1:** Create new provider file
```python
# src/services/llm/ollama_provider.py
from typing import List, Optional
from .base import BaseLLMProvider, LLMResponse

class OllamaProvider(BaseLLMProvider):
    """Ollama local LLM provider"""

    def __init__(self, api_key: str, model: str = "llama2", **config):
        super().__init__(api_key, model, **config)
        self.base_url = config.get("base_url", "http://localhost:11434")

    @property
    def provider_name(self) -> str:
        return "ollama"

    async def generate(self, messages, **kwargs) -> LLMResponse:
        # Ollama API implementation
        ...

    async def embed(self, text: str) -> List[float]:
        # Ollama embeddings implementation
        ...
```

**Step 2:** Register in LLMProviderType enum
```python
# In src/services/llm/factory.py
class LLMProviderType(Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GEMINI = "gemini"
    MINIMAX = "minimax"
    OLLAMA = "ollama"  # Add new provider
```

**Step 3:** Add to factory map
```python
# In LLMFactory.PROVIDER_MAP
PROVIDER_MAP: Dict[LLMProviderType, Type[BaseLLMProvider]] = {
    LLMProviderType.OPENAI: OpenAIProvider,
    LLMProviderType.ANTHROPIC: AnthropicProvider,
    LLMProviderType.GEMINI: GeminiProvider,
    LLMProviderType.MINIMAX: MiniMaxProvider,
    LLMProviderType.OLLAMA: OllamaProvider,  # New provider
}
```

**Usage:**
```python
# Use any provider
llm = LLMFactory.create("gemini", model="gemini-pro")
llm = LLMFactory.create("minimax", model="abab6-chat")

# From environment (uses LLM_PROVIDER env var)
llm = LLMService.from_env()
```

### 7.7 Embedding Service (Uses LLM Factory)
```python
# src/services/embedding_service.py
from typing import List
from .llm.factory import LLMFactory, LLMProviderType

class EmbeddingService:
    """
    Embedding generation service.
    Uses OpenAI embeddings by default (best for embeddings).
    """

    def __init__(self):
        # Use OpenAI for embeddings (most mature embedding API)
        self.embeddings = LLMFactory.create(
            LLMProviderType.OPENAI,
            model="text-embedding-ada-002"
        )

    async def embed_text(self, text: str) -> List[float]:
        return await self.embeddings.embed(text)

    async def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return [await self.embeddings.embed(text) for text in texts]

    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Batch embedding for multiple texts"""
        return await self.embed_documents(texts)
```

---

## 8. Installation Commands

### Full Setup Script (scripts/setup.sh)
```bash
#!/bin/bash
set -e

echo "Setting up JobFind AI Orchestrator..."

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install poetry
poetry install

# Copy environment file
cp .env.example .env

echo "Setup complete!"
echo "Activate with: source venv/bin/activate"
```

---

## 9. Verification

### 9.1 Test Imports
```bash
# Activate environment
source venv/bin/activate

# Test imports
python -c "
from langchain import LangChain
from langgraph import Graph
from langchain_openai import ChatOpenAI
from pydantic import BaseModel
print('All imports successful!')
"
```

### 9.2 Test API Key
```bash
# Set your API key
export OPENAI_API_KEY=sk-...

# Test OpenAI connection
python -c "
from langchain_openai import ChatOpenAI
llm = ChatOpenAI(model='gpt-4-turbo-preview')
response = llm.generate(['Say hello in one word'])
print(response.generations[0].text)
"
```

---

## 10. Next Steps After 4.1

- **4.2**: Agent Base Classes (BaseAgent, BaseTool, Agent Registry)
- **4.3**: Resume Parser Agent (file upload → parse → extract structured data)
- **4.4**: Embedding Agent (generate semantic embeddings)
- And so on...

---

## Next Steps

1. Review and approve this plan
2. Create the `ai-orchestrator/` directory structure
3. Set up `pyproject.toml` with all dependencies
4. Create base classes (BaseAgent, BaseTool, AgentRegistry)
5. Test the environment