# JobFind AI Orchestrator

AI Orchestration layer for JobFind platform using LangChain and LangGraph.

## Features

- **Resume Parsing**: Extract structured data from PDF/DOCX files
- **Embedding Generation**: Semantic embeddings via OpenAI, Gemini, MiniMax
- **Job Matching**: Cosine similarity matching between resumes and jobs
- **Preparation Generation**: AI-generated interview questions and tips

## Providers Supported

- OpenAI (GPT-4, Embeddings)
- Anthropic (Claude)
- Google Gemini
- MiniMax

## Installation

```bash
# Create virtual environment
python3 -m venv venv

# Activate
source venv/bin/activate

# Install dependencies
pip install poetry
poetry install

# Copy environment file
cp .env.example .env

# Configure your API keys in .env
```

## Usage

```python
from src.services.llm.factory import LLMFactory, LLMProviderType
from src.services.llm_service import LLMService

# Create LLM service from environment
llm = LLMService.from_env()

# Or create specific provider
llm = LLMFactory.create("openai", model="gpt-4-turbo-preview")

# Generate completion
response = await llm.generate([{"role": "user", "content": "Hello!"}])
print(response.content)
```

## Architecture

```
src/
├── agents/           # AI agents (Resume Parser, Matcher, etc.)
├── graphs/          # LangGraph workflows
├── services/        # LLM, Embedding services
└── utils/           # Helper functions
```

## License

MIT