# JobFind - Module Breakdown (Task List)

Based on SPEC.md and PLANS.md architecture. Each module will be planned in detail when you approve it.

---

## How This Works

1. Select a module from the list below
2. I will create detailed step-by-step implementation plan for that module
3. You review and approve (or request changes)
4. I implement the module
5. Repeat

---

## Module List

### Phase 1: Infrastructure Foundation
- [ ] **1.1** Project Scaffolding (Root workspace, backend, frontend structure)
- [ ] **1.2** Backend Setup (Fastify, TypeScript, Prisma, dependencies)
- [ ] **1.3** Frontend Setup (Next.js 14, Tailwind, shadcn/ui, dependencies)
- [ ] **1.4** Database Setup (PostgreSQL + pgvector, Redis, Prisma schema)
- [ ] **1.5** Core Backend Infrastructure (Logger, Config, Errors, Base classes)
- [ ] **1.6** Environment Configuration (.env files, Docker setup)

### Phase 2: API Gateway (Fastify)
- [ ] **2.1** Auth Module - User registration, login, JWT tokens
- [ ] **2.2** Auth Module - OAuth (Google, LinkedIn, GitHub) strategies
- [ ] **2.3** Auth Module - Protected routes, middleware
- [ ] **2.4** Backend Server Setup - CORS, compression, rate limiting, error handling
- [ ] **2.5** Health check and basic routing structure

### Phase 3: Frontend Foundation
- [ ] **3.1** Frontend Auth Pages (Login, Register with forms)
- [ ] **3.2** Frontend Auth Store (Zustand state management)
- [ ] **3.3** Dashboard Layout (Sidebar, Header, Navigation)
- [ ] **3.4** Dashboard Pages (Dashboard home, Jobs, Matches, Preparation, Settings)
- [ ] **3.5** API Client setup (Axios interceptors)

### Phase 4: AI Orchestrator (Python + LangGraph)
- [ ] **4.1** Python Environment Setup (virtualenv, LangChain, LangGraph, dependencies)
- [ ] **4.2** Agent Base Classes (BaseAgent, BaseTool, Agent Registry)
- [ ] **4.3** Resume Parser Agent (file upload → parse → extract structured data)
- [ ] **4.4** Embedding Agent (generate semantic embeddings)
- [ ] **4.5** Query Generator Agent (natural language → platform-specific queries)
- [ ] **4.6** Match Calculator Agent (semantic similarity scoring)
- [ ] **4.7** Preparation Agent (interview questions, tips generation)
- [ ] **4.8** LangGraph Workflows (resume_graph, job_search_graph, matching_graph, preparation_graph)

### Phase 5: Job Search Engine (MCP + Playwright)
- [ ] **5.1** MCP Server Setup (browser automation infrastructure)
- [ ] **5.2** Playwright Configuration (scroll engine, page navigation)
- [ ] **5.3** Google Job Provider (search + extract)
- [ ] **5.4** LinkedIn Job Provider (search + extract)
- [ ] **5.5** Indeed Job Provider (search + extract)
- [ ] **5.6** Wellfound Job Provider (search + extract)
- [ ] **5.7** Job Aggregator (parallel search + deduplication)
- [ ] **5.8** Validation Engine (fake/expired job filtering)

### Phase 6: Integration
- [ ] **6.1** Backend ↔ AI Orchestrator Integration (API communication)
- [ ] **6.2** Backend ↔ Job Search Engine Integration
- [ ] **6.3** Frontend ↔ Backend API Integration (all endpoints)
- [ ] **6.4** Resume Upload Flow (Frontend → Backend → AI → Database)
- [ ] **6.5** Job Search Flow (Frontend → Backend → Job Engine → AI → Frontend)
- [ ] **6.6** Matching Flow (AI Match Calculator integration)

### Phase 7: Polish
- [ ] **7.1** WebSocket Setup (real-time updates)
- [ ] **7.2** Analytics Dashboard
- [ ] **7.3** File Delete Flow (physical file deletion after parsing)
- [ ] **7.4** User Data Deletion (GDPR compliance - user-controlled)
- [ ] **7.5** Performance Optimization
- [ ] **7.6** Mobile Responsiveness

---

## Architecture Reference

```
┌──────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                           │
│                    TypeScript + Tailwind + shadcn/ui                │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                       API GATEWAY (Fastify/TS)                       │
│                        TypeScript + Prisma                           │
└──────────────────────────────────────────────────────────────────────┘
                                  │
              ┌───────────────────┴───────────────────┐
              ▼                                       ▼
┌─────────────────────────┐               ┌─────────────────────────────┐
│   AI ORCHESTRATOR       │               │    JOB SEARCH ENGINE        │
│   (Python + LangGraph)  │               │    (MCP + Playwright)       │
│                         │               │                             │
│   • Resume Parser       │               │    • Google MCP             │
│   • Query Generator     │               │    • LinkedIn MCP           │
│   • Match Calculator    │               │    • Indeed MCP             │
│   • Preparation Agent   │               │    • Wellfound MCP          │
│                         │               │                             │
│   LangGraph Graphs:     │               │    Deduplication Engine     │
│   - resume_graph       │               │    Validation Engine        │
│   - job_search_graph   │               │                             │
│   - matching_graph     │               │                             │
│   - preparation_graph   │               │                             │
└─────────────────────────┘               └─────────────────────────────┘
              │                                       │
              └───────────────────┬───────────────────┘
                                  ▼
              ┌─────────────────────────────────────────┐
              │          DATABASE / CACHE               │
              │   PostgreSQL + pgvector + Redis        │
              └─────────────────────────────────────────┘
```

---

## Tech Stack Summary

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind, shadcn/ui, Zustand, Framer Motion |
| API Gateway | Fastify, TypeScript, Prisma, Zod |
| Database | PostgreSQL, Prisma ORM, pgvector |
| Cache/Queue | Redis, BullMQ |
| AI Orchestration | Python, LangChain, LangGraph |
| AI Embedding | OpenAI (ada-002) / Anthropic |
| Browser Automation | Playwright, MCP |
| Auth | JWT + Refresh tokens, OAuth 2.0 |

---

## Next Step

Tell me which module you want to start with (e.g., "1.1" or "2.1"), and I will create a detailed implementation plan for your review.