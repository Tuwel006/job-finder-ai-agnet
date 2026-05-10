# JobFind - AI-Powered Job Search Platform

## 1. Concept & Vision

**JobFind** is a privacy-first, AI-powered job search platform that transforms resume uploads into intelligent job matches without storing sensitive personal data. Users upload their resume, which is immediately parsed into structured metadata, the physical file is deleted instantly, and only the parsed data + embeddings persist as user history until the user chooses to delete it.

The platform feels like having a senior engineer friend who:
- Instantly understands your skills from your resume
- Knows exactly what's hot in the job market right now
- Searches everywhere (LinkedIn, Google, company career pages) like a human would
- Only shows you real, relevant opportunities — no spam, no fake listings
- Immediately deletes your physical resume file but keeps your parsed data for your convenience

**Core Principle**: Upload → Parse → Delete File → Store Parsed Data (user-controlled deletion)

---

## 2. Design Language

### Color Palette
- **Primary**: `#0A2540` (Deep Navy) — trust, professionalism
- **Secondary**: `#00D4AA` (Mint Green) — growth, success, fresh
- **Accent**: `#635BFF` (Soft Purple) — AI, intelligence
- **Background**: `#F8FAFC` (Cool White)
- **Surface**: `#FFFFFF`
- **Text Primary**: `#1E293B`
- **Text Secondary**: `#64748B`
- **Error**: `#DC2626`
- **Warning**: `#F59E0B`
- **Success**: `#10B981`

### Typography
- **Font**: `Inter` (variable) — modern, highly readable
- **Headings**: Inter 700, tracking tight
- **Body**: Inter 400/500, 16px base
- **Mono**: `JetBrains Mono` — for code/technical content

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96
- Border radius: 8px (cards), 12px (modals), 24px (pills)
- Shadows: layered soft shadows for depth

### Motion Philosophy
- Micro-interactions: 150ms ease-out
- Page transitions: 300ms ease-in-out
- Skeleton loaders with subtle pulse
- Staggered list reveals (50ms delay between items)
- Spring physics for interactive elements

### Visual Assets
- Icons: Lucide React (consistent stroke weight)
- Illustrations: Abstract geometric shapes for empty states
- Gradient accents on key CTAs
- Subtle grid patterns for backgrounds

---

## 3. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                           │
│                    TypeScript + Tailwind + shadcn/ui                │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                       API GATEWAY (TypeScript)                       │
│                        Fastify + TypeScript                          │
└──────────────────────────────────────────────────────────────────────┘
                                  │
              ┌───────────────────┴───────────────────┐
              ▼                                       ▼
┌─────────────────────────┐               ┌─────────────────────────────┐
│   AI ORCHESTRATOR       │               │    JOB SEARCH ENGINE        │
│   (Python + LangGraph)  │               │    (MCP Browsers)           │
│                         │               │                             │
│   - Resume Parser       │               │    - Google MCP             │
│   - Query Generator     │               │    - LinkedIn MCP           │
│   - Match Calculator     │               │    - Indeed MCP             │
│   - Preparation Agent   │               │    - Wellfound MCP          │
└─────────────────────────┘               └─────────────────────────────┘
```

---

## 4. Core Data Flow

### Resume Processing Flow
```
User Upload Resume (PDF/DOCX file)
       ↓
[API Gateway] Validate file (PDF/DOCX, <5MB)
       ↓
[AI Orchestrator] Parse immediately
       ↓
Extract: skills[], experience[], projects[], education[], keywords[]
       ↓
Generate semantic embedding
       ↓
DELETE physical resume file instantly ← FILE NEVER STORED
       ↓
Store ONLY parsed data as user history:
  - parsed_json (structured metadata) ← persists until user deletes
  - embedding (vector) ← persists until user deletes
  - resume_score (float)
  - created_at
       ↓
User can delete their data anytime via "Delete My Data"
```

### Job Search Flow
```
User Search Request
       ↓
[Query Enhancement Agent] Generate platform-specific queries
       ↓
[Job Aggregator] Distribute to all providers
       ↓
[Browser MCP Layer] Execute searches
       ↓
[Scroll Engine] Dynamic page loading
       ↓
[Job Extractor] AI-powered field extraction
       ↓
[Deduplication Engine] Hash + semantic dedup
       ↓
[Validation Engine] Fake/expired job filtering
       ↓
[Matching Engine] Semantic similarity scoring
       ↓
Return ranked results to user
```

---

## 5. Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),  -- NULL for OAuth-only users
  name VARCHAR(255),
  avatar_url VARCHAR(1000),
  provider VARCHAR(50) DEFAULT 'email',  -- 'email', 'google', 'linkedin', 'github'
  provider_id VARCHAR(255),  -- OAuth provider user ID
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  UNIQUE(provider, provider_id)  -- Prevent duplicate OAuth accounts
);
```

### Resume Profiles Table (User-controlled persistence)
```sql
CREATE TABLE resume_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  parsed_json JSONB NOT NULL,
  embedding VECTOR(1536),
  resume_score FLOAT,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP  -- NULL means active, user controls deletion
);
CREATE INDEX idx_resume_profiles_user ON resume_profiles(user_id);
```

### Jobs Table
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id VARCHAR(500),
  source VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  company VARCHAR(500) NOT NULL,
  location VARCHAR(500),
  salary_range VARCHAR(100),
  description TEXT,
  apply_url TEXT NOT NULL,
  logo_url VARCHAR(1000),
  keywords TEXT[],
  embedding VECTOR(1536),
  created_at TIMESTAMP DEFAULT NOW(),
  fetched_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  is_expired BOOLEAN DEFAULT false,
  is_fake BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  UNIQUE(external_id, source)
);
CREATE INDEX idx_jobs_embedding ON jobs USING ivfflat(embedding);
CREATE INDEX idx_jobs_expires ON jobs(expires_at);
```

### Job Searches Table
```sql
CREATE TABLE job_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  query_text TEXT NOT NULL,
  generated_queries TEXT[],
  filters JSONB,
  results_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Matches Table
```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  resume_profile_id UUID REFERENCES resume_profiles(id),
  job_id UUID REFERENCES jobs(id),
  similarity_score FLOAT NOT NULL,
  match_reasons TEXT[],
  is_saved BOOLEAN DEFAULT false,
  is_applied BOOLEAN DEFAULT false,
  applied_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_matches_user ON matches(user_id);
CREATE INDEX idx_matches_job ON matches(job_id);
```

### Preparation Materials Table
```sql
CREATE TABLE preparation_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  job_id UUID REFERENCES jobs(id),
  type VARCHAR(50) NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 6. Module Architecture

### Backend Structure
```
backend/
├── core/
│   ├── interfaces/          # Contracts for all services
│   │   ├── i_resume_parser.ts
│   │   ├── i_job_provider.ts
│   │   ├── i_embedding_provider.ts
│   │   ├── i_matching_service.ts
│   │   └── i_agent.ts
│   ├── abstractions/         # Abstract base classes
│   │   ├── base_agent.ts
│   │   ├── base_provider.ts
│   │   └── base_service.ts
│   ├── base/                 # Shared utilities
│   │   ├── logger.ts
│   │   ├── config.ts
│   │   └── errors.ts
│   ├── events/              # Event definitions
│   │   ├── resume_uploaded.ts
│   │   ├── resume_parsed.ts
│   │   ├── jobs_fetched.ts
│   │   ├── matching_completed.ts
│   │   └── preparation_generated.ts
│   └── shared/
│       ├── types.ts
│       └── constants.ts
│
├── modules/
│   ├── auth/
│   │   ├── auth_controller.ts
│   │   ├── auth_service.ts
│   │   ├── auth_repository.ts
│   │   ├── oauth_service.ts         # OAuth providers management
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   ├── login.dto.ts
│   │   │   └── auth-response.dto.ts
│   │   ├── strategies/
│   │   │   ├── google.strategy.ts
│   │   │   ├── linkedin.strategy.ts
│   │   │   └── github.strategy.ts
│   │   └── auth_router.ts
│   │
│   ├── resume/
│   │   ├── resume_controller.ts
│   │   ├── resume_service.ts
│   │   ├── resume_repository.ts
│   │   ├── dto/
│   │   └── resume_router.ts
│   │
│   ├── jobs/
│   │   ├── jobs_controller.ts
│   │   ├── jobs_service.ts
│   │   ├── jobs_repository.ts
│   │   ├── dto/
│   │   └── jobs_router.ts
│   │
│   ├── matching/
│   │   ├── matching_controller.ts
│   │   ├── matching_service.ts
│   │   ├── matching_repository.ts
│   │   └── matching_router.ts
│   │
│   ├── preparation/
│   │   ├── preparation_controller.ts
│   │   ├── preparation_service.ts
│   │   ├── preparation_repository.ts
│   │   └── preparation_router.ts
│   │
│   └── analytics/
│       ├── analytics_service.ts
│       └── analytics_router.ts
│
├── infrastructure/
│   ├── db/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── redis/
│   │       └── redis_client.ts
│   ├── queues/
│   │   └── bullmq/
│   │       ├── job_queue.ts
│   │       └── workers/
│   ├── websocket/
│   │   └── ws_handler.ts
│   └── storage/
│       └── file_handler.ts
│
├── plugins/
│   ├── providers/
│   │   ├── google/
│   │   │   └── google_provider.ts
│   │   ├── linkedin/
│   │   │   └── linkedin_provider.ts
│   │   ├── indeed/
│   │   │   └── indeed_provider.ts
│   │   └── wellfound/
│   │       └── wellfound_provider.ts
│   └── browser/
│       ├── playwright/
│       │   └── scroll_engine.ts
│       └── mcp/
│           ├── mcp_client.ts
│           └── tool_definitions.ts
│
└── app/
    ├── server.ts
    ├── routes.ts
    └── middleware/
```

### Frontend Structure
```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── jobs/
│   │   ├── matches/
│   │   ├── preparation/
│   │   └── settings/
│   ├── api/
│   └── layout.tsx
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── auth/
│   ├── jobs/
│   ├── resume/
│   ├── matching/
│   └── shared/
├── hooks/
├── lib/
│   ├── api.ts
│   ├── utils.ts
│   └── constants.ts
├── stores/
│   ├── auth_store.ts
│   ├── jobs_store.ts
│   └── resume_store.ts
└── types/
```

---

## 7. AI Service Architecture

### Agent Registry Pattern
```python
# Python AI layer
class AgentRegistry:
    """Central registry for all AI agents"""
    _agents: Dict[str, BaseAgent] = {}

    @classmethod
    def register(cls, name: str, agent: BaseAgent):
        cls._agents[name] = agent

    @classmethod
    def get_agent(cls, name: str) -> BaseAgent:
        return cls._agents[name]

    @classmethod
    def list_agents(cls) -> List[str]:
        return list(cls._agents.keys())
```

### LangGraph Graphs (Separate)
1. **resume_graph**: Upload → Parse → Embed → Delete
2. **job_search_graph**: Query Gen → Provider Search → Extract → Dedupe → Validate
3. **matching_graph**: Score → Rank → Filter → Return
4. **preparation_graph**: Analyze Job → Generate Questions → Generate Tips

### Event-Driven Communication
```typescript
// Events emitted by modules
interface ResumeUploadedEvent {
  userId: string;
  fileName: string;
  timestamp: Date;
}

interface ResumeParsedEvent {
  profileId: string;
  parsedData: ParsedResume;
  embedding: number[];
}

interface JobsFetchedEvent {
  searchId: string;
  provider: string;
  count: number;
}

interface MatchingCompletedEvent {
  userId: string;
  matchCount: number;
  topMatches: Match[];
}
```

---

## 8. MCP Job Provider System

### Interface
```typescript
interface IJobProvider {
  name: string;
  searchJobs(query: SearchQuery): Promise<Job[]>;
  extractJobDetails(url: string): Promise<JobDetail>;
}
```

### Provider Implementations
1. **GoogleProvider**: Search via Google, extract from results
2. **LinkedInProvider**: LinkedIn job search with filters
3. **IndeedProvider**: Indeed aggregate search
4. **WellfoundProvider**: Wellfound startup jobs

### Job Aggregator
```typescript
class JobAggregator {
  constructor(private providers: IJobProvider[]) {}

  async searchAll(query: SearchQuery): Promise<Job[]> {
    const results = await Promise.all(
      this.providers.map(p => p.searchJobs(query))
    );
    return this.deduplicate(results.flat());
  }

  private deduplicate(jobs: Job[]): Job[] {
    // Hash-based + semantic deduplication
  }
}
```

---

## 9. API Endpoints

### Auth Module
- `POST /api/auth/register` - User registration (email/password)
- `POST /api/auth/login` - User login (email/password)
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user
- `GET /api/auth/oauth/:provider` - Initiate OAuth flow (Google, LinkedIn, GitHub)
- `GET /api/auth/oauth/:provider/callback` - OAuth callback handler
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password
- `DELETE /api/auth/account` - Delete user account (user-controlled)

### Resume Module
- `POST /api/resume/upload` - Upload and parse resume
- `GET /api/resume/profile` - Get current user's resume profile
- `DELETE /api/resume/profile` - Delete resume profile immediately
- `GET /api/resume/status` - Check parsing status

### Jobs Module
- `POST /api/jobs/search` - Start job search
- `GET /api/jobs/search/:id` - Get search results
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs/validate` - Validate job真实性
- `GET /api/jobs/sources` - Get available sources

### Matching Module
- `POST /api/matching/match` - Run matching for user
- `GET /api/matching/matches` - Get user's matches
- `PUT /api/matching/matches/:id` - Update match (save/apply)
- `DELETE /api/matching/matches/:id` - Dismiss match

### Preparation Module
- `POST /api/preparation/generate` - Generate prep materials
- `GET /api/preparation/job/:jobId` - Get prep for job
- `GET /api/preparation/types` - Get available prep types

---

## 10. Security & Privacy

### Data Retention Policy
- **Resume files (PDF/DOCX)**: **Immediately deleted** after parsing — never stored
- **Parsed resume data**: Stored as user history until user explicitly deletes
- **Embeddings**: Stored with parsed data, deleted when user deletes their history
- **Job matches**: Persisted until user dismisses them
- User has full control to delete all their data anytime via "Delete My Data" feature

### Compliance
- GDPR compliant — no persistent raw PII storage
- User consent for data storage (user controls deletion)
- Data export endpoint for user data portability
- Right to deletion (instant — user-controlled)

### Security Measures
- JWT with short expiry + refresh tokens
- OAuth 2.0 support (Google, LinkedIn, GitHub)
- Secure password hashing (bcrypt with cost factor)
- Rate limiting on all endpoints
- File upload validation (type, size, malware scan)
- Input sanitization
- HTTPS everywhere
- CSP headers
- CSRF protection for OAuth callbacks
- State parameter validation for OAuth flow

---

## 11. Data Cleanup System

### User-Controlled Deletion
Resume profile data persists until the user explicitly deletes it via "Delete My Data" feature.

### Job Listings TTL (Still needed)
Fetched job listings still have expiration dates since they come from external sources:

```python
# Background job every hour
class JobCleanupWorker:
    async def cleanup_expired_jobs(self):
        """Delete expired job listings from external sources"""
        expired = await db.jobs.find_many(
            where={"expires_at": {"lt": datetime.now()}}
        )
        for job in expired:
            await db.jobs.update(
                where={"id": job.id},
                data={"is_expired": true}
            )
```

---

## 12. Implementation Phases

### Phase 1: Foundation
- [ ] Project scaffolding (frontend + backend)
- [ ] Database schema (Prisma)
- [ ] Auth module (register, login, JWT)
- [ ] Basic API structure with Fastify

### Phase 2: Resume Processing
- [ ] File upload endpoint
- [ ] Resume parser agent (Python/LangGraph)
- [ ] Embedding generation
- [ ] Physical file deletion immediately after parsing
- [ ] User-controlled data deletion endpoint

### Phase 3: Job Search Engine
- [ ] MCP browser setup
- [ ] Google provider implementation
- [ ] LinkedIn provider implementation
- [ ] Deduplication engine

### Phase 4: Matching
- [ ] Semantic matching service
- [ ] Match ranking
- [ ] Save/dismiss functionality

### Phase 5: Preparation
- [ ] Interview question generation
- [ ] Resume tailoring
- [ ] Company research

### Phase 6: Polish
- [ ] Real-time updates (WebSocket)
- [ ] Analytics dashboard
- [ ] Performance optimization
- [ ] Mobile responsive

---

## 13. Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind, shadcn/ui, Zustand, Framer Motion |
| API Gateway | Fastify, TypeScript, Zod |
| Database | PostgreSQL, Prisma ORM, pgvector |
| Cache/Queue | Redis, BullMQ |
| AI (Orchestration) | Python, LangGraph, LangChain |
| AI (Embedding) | OpenAI (ada-002) / Anthropic |
| Browser Automation | Playwright, MCP |
| File Storage | Local (ephemeral) - no S3 initially |
| Auth | JWT + Refresh tokens, OAuth 2.0 (Google, LinkedIn, GitHub) |
