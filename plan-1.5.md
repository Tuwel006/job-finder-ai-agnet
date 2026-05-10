# Module 1.5: Core Backend Infrastructure - Detailed Plan

## Overview
Set up core backend infrastructure including Logger, Config, Error handling, shared types, constants, and base classes for the TypeScript backend.

## Prerequisites
- Backend scaffolding completed (Module 1.2)
- Database schema created (Module 1.4)

## Deliverables
- `backend/src/core/base/logger.ts` - Pino logger with pretty printing
- `backend/src/core/base/config.ts` - Environment configuration
- `backend/src/core/base/errors.ts` - Custom error classes
- `backend/src/core/shared/types.ts` - Shared TypeScript interfaces
- `backend/src/core/shared/constants.ts` - Application constants
- `backend/src/core/interfaces/` - Interface contracts for all services
- `backend/src/core/abstractions/` - Abstract base classes

---

## Step-by-Step Implementation

### Step 1.5.1: Create Logger

**Action:** Create `src/core/base/logger.ts` with Pino logger

```bash
cd job-find/backend
cat > src/core/base/logger.ts << 'EOF'
import pino from 'pino'

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = pino({
  level: isDevelopment ? 'debug' : 'info',
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
})

export const createChildLogger = (context: Record<string, unknown>) => {
  return logger.child(context)
}
EOF
```

---

### Step 1.5.2: Create Config

**Action:** Create `src/core/base/config.ts` with environment config

```bash
cd job-find/backend
cat > src/core/base/config.ts << 'EOF'
import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  // OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  OAUTH_CALLBACK_URL: z.string().default('http://localhost:3001/api/auth/oauth'),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error('Invalid environment variables:', parsedEnv.error.format())
  process.exit(1)
}

const env = parsedEnv.data

const config = {
  nodeEnv: env.NODE_ENV,
  port: parseInt(env.PORT, 10),
  database: {
    url: env.DATABASE_URL,
  },
  redis: {
    url: env.REDIS_URL,
  },
  jwt: {
    secret: env.JWT_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  frontend: {
    url: env.FRONTEND_URL,
  },
  oauth: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID || '',
      clientSecret: env.GOOGLE_CLIENT_SECRET || '',
    },
    linkedin: {
      clientId: env.LINKEDIN_CLIENT_ID || '',
      clientSecret: env.LINKEDIN_CLIENT_SECRET || '',
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID || '',
      clientSecret: env.GITHUB_CLIENT_SECRET || '',
    },
    callbackUrl: env.OAUTH_CALLBACK_URL,
  },
}

export default config
EOF
```

---

### Step 1.5.3: Create Error Classes

**Action:** Create `src/core/base/errors.ts` with custom error classes

```bash
cd job-find/backend
cat > src/core/base/errors.ts << 'EOF'
export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404)
  }
}

export class ValidationError extends AppError {
  public readonly errors: Record<string, string[]>

  constructor(message: string, errors: Record<string, string[]> = {}) {
    super(message, 400)
    this.errors = errors
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409)
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500, false)
  }
}
EOF
```

---

### Step 1.5.4: Create Shared Types

**Action:** Create `src/core/shared/types.ts` with shared interfaces

```bash
cd job-find/backend
cat > src/core/shared/types.ts << 'EOF'
// ============================================
// Base Types
// ============================================

export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ============================================
// Resume Types
// ============================================

export interface Experience {
  title: string
  company: string
  duration: string
  description?: string
}

export interface Project {
  name: string
  description?: string
  technologies: string[]
}

export interface Education {
  degree: string
  institution: string
  year?: string
}

export interface ParsedResume {
  skills: string[]
  experience: Experience[]
  projects: Project[]
  education: Education[]
  keywords: string[]
  summary?: string
}

// ============================================
// Job Types
// ============================================

export interface SearchQuery {
  text: string
  location?: string
  remote?: boolean
  salaryMin?: number
  salaryMax?: number
  experienceLevel?: string
  employmentType?: string
}

export interface Job {
  id: string
  externalId: string
  source: string
  title: string
  company: string
  location?: string
  salaryRange?: string
  description?: string
  applyUrl: string
  logoUrl?: string
  keywords: string[]
  expiresAt?: Date
  isExpired: boolean
  isFake?: boolean
  metadata?: Record<string, unknown>
}

// ============================================
// Match Types
// ============================================

export interface MatchResult {
  id: string
  job: Job
  similarityScore: number
  matchReasons: string[]
  isSaved: boolean
  isApplied: boolean
  appliedAt?: Date
  createdAt: Date
}

// ============================================
// User Types
// ============================================

export interface User {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  provider: string
  createdAt: Date
  updatedAt: Date
}

export interface TokenPayload {
  id: string
  type: 'access' | 'refresh'
}
EOF
```

---

### Step 1.5.5: Create Constants

**Action:** Create `src/core/shared/constants.ts` with application constants

```bash
cd job-find/backend
cat > src/core/shared/constants.ts << 'EOF'
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const

export const JOB_SOURCES = {
  GOOGLE: 'google',
  LINKEDIN: 'linkedin',
  INDEED: 'indeed',
  WELLFOUND: 'wellfound',
} as const

export const PREPARATION_TYPES = {
  QUESTIONS: 'questions',
  TIPS: 'tips',
  COMPANY: 'company',
  RESUME_TAILORING: 'resume_tailoring',
} as const

export const AUTH_PROVIDERS = {
  EMAIL: 'email',
  GOOGLE: 'google',
  LINKEDIN: 'linkedin',
  GITHUB: 'github',
} as const

export const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  INVALID_CREDENTIALS: 'Invalid credentials',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  TOKEN_EXPIRED: 'Token expired',
  TOKEN_INVALID: 'Invalid token',
  UNAUTHORIZED: 'Please log in to continue',
  FORBIDDEN: 'You do not have permission to perform this action',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
} as const

export const SUCCESS_MESSAGES = {
  REGISTER_SUCCESS: 'Registration successful',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  DATA_DELETED: 'Data deleted successfully',
  JOB_SAVED: 'Job saved successfully',
  JOB_APPLIED: 'Job marked as applied',
} as const

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const

export const FILE_LIMITS = {
  MAX_RESUME_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_RESUME_TYPES: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const
EOF
```

---

### Step 1.5.6: Create Interface Contracts

**Action:** Create interface contracts in `src/core/interfaces/`

```bash
cd job-find/backend

# IResumeParser interface
cat > src/core/interfaces/i_resume_parser.ts << 'EOF'
import type { ParsedResume } from '../shared/types.js'

export interface IResumeParser {
  parse(fileBuffer: Buffer, fileName: string): Promise<ParsedResume>
  generateEmbedding(parsedResume: ParsedResume): Promise<number[]>
}
EOF

# IJobProvider interface
cat > src/core/interfaces/i_job_provider.ts << 'EOF'
import type { Job, SearchQuery } from '../shared/types.js'

export interface IJobProvider {
  name: string
  searchJobs(query: SearchQuery): Promise<Job[]>
  extractJobDetails(url: string): Promise<Job>
}
EOF

# IEmbeddingProvider interface
cat > src/core/interfaces/i_embedding_provider.ts << 'EOF'
export interface IEmbeddingProvider {
  generateEmbedding(text: string): Promise<number[]>
  generateEmbeddings(texts: string[]): Promise<number[][]>
}
EOF

# IMatchingService interface
cat > src/core/interfaces/i_matching_service.ts << 'EOF'
import type { Job, ParsedResume, MatchResult } from '../shared/types.js'

export interface MatchResultWithScore extends MatchResult {
  similarityScore: number
  matchReasons: string[]
}

export interface IMatchingService {
  calculateMatch(parsedResume: ParsedResume, job: Job): Promise<MatchResultWithScore>
  findMatchingJobs(parsedResume: ParsedResume, jobs: Job[]): Promise<MatchResultWithScore[]>
}
EOF

# IAgent interface
cat > src/core/interfaces/i_agent.ts << 'EOF'
export interface AgentResult {
  success: boolean
  data?: unknown
  error?: string
}

export interface IAgent {
  run(input: unknown): Promise<AgentResult>
  validate(input: unknown): Promise<boolean>
}
EOF
```

---

### Step 1.5.7: Create Abstract Base Classes

**Action:** Create abstract base classes in `src/core/abstractions/`

```bash
cd job-find/backend

# BaseService
cat > src/core/abstractions/base_service.ts << 'EOF'
import { logger } from '../base/logger.js'

export abstract class BaseService {
  protected readonly logger = logger

  constructor(serviceName: string) {
    this.logger = logger.child({ service: serviceName })
  }

  protected logInfo(message: string, meta?: Record<string, unknown>) {
    this.logger.info(meta, message)
  }

  protected logError(message: string, error?: Error, meta?: Record<string, unknown>) {
    this.logger.error({ ...meta, error: error?.message, stack: error?.stack }, message)
  }

  protected logDebug(message: string, meta?: Record<string, unknown>) {
    this.logger.debug(meta, message)
  }
}
EOF

# BaseProvider
cat > src/core/abstractions/base_provider.ts << 'EOF'
import type { IJobProvider } from '../interfaces/i_job_provider.js'
import { BaseService } from './base_service.js'

export abstract class BaseProvider extends BaseService implements IJobProvider {
  abstract readonly name: string

  abstract searchJobs(query: unknown): Promise<unknown[]>
  abstract extractJobDetails(url: string): Promise<unknown>
}
EOF

# BaseAgent
cat > src/core/abstractions/base_agent.ts << 'EOF'
import type { IAgent, AgentResult } from '../interfaces/i_agent.js'
import { BaseService } from './base_service.js'

export abstract class BaseAgent extends BaseService implements IAgent {
  abstract run(input: unknown): Promise<AgentResult>

  async validate(_input: unknown): Promise<boolean> {
    return true
  }

  protected success(data: unknown): AgentResult {
    return { success: true, data }
  }

  protected failure(error: string): AgentResult {
    return { success: false, error }
  }
}
EOF
```

---

### Step 1.5.8: Create Event Definitions

**Action:** Create event definitions in `src/core/events/`

```bash
cd job-find/backend

cat > src/core/events/resume_uploaded.ts << 'EOF'
export interface ResumeUploadedEvent {
  userId: string
  fileName: string
  fileSize: number
  timestamp: Date
}
EOF

cat > src/core/events/resume_parsed.ts << 'EOF'
import type { ParsedResume } from '../shared/types.js'

export interface ResumeParsedEvent {
  profileId: string
  userId: string
  parsedData: ParsedResume
  timestamp: Date
}
EOF

cat > src/core/events/jobs_fetched.ts << 'EOF'
export interface JobsFetchedEvent {
  searchId: string
  userId: string
  provider: string
  count: number
  timestamp: Date
}
EOF

cat > src/core/events/matching_completed.ts << 'EOF'
export interface MatchingCompletedEvent {
  userId: string
  matchCount: number
  timestamp: Date
}
EOF

cat > src/core/events/preparation_generated.ts << 'EOF'
export interface PreparationGeneratedEvent {
  userId: string
  jobId: string
  type: string
  timestamp: Date
}
EOF
```

---

### Step 1.5.9: Create index files for exports

**Action:** Create barrel export files for cleaner imports

```bash
cd job-find/backend

# Core exports
cat > src/core/base/index.ts << 'EOF'
export * from './logger.js'
export * from './config.js'
export * from './errors.js'
EOF

cat > src/core/shared/index.ts << 'EOF'
export * from './types.js'
export * from './constants.js'
EOF

cat > src/core/interfaces/index.ts << 'EOF'
export * from './i_resume_parser.js'
export * from './i_job_provider.js'
export * from './i_embedding_provider.js'
export * from './i_matching_service.js'
export * from './i_agent.js'
EOF

cat > src/core/abstractions/index.ts << 'EOF'
export * from './base_service.js'
export * from './base_provider.js'
export * from './base_agent.js'
EOF
```

---

## Verification Steps

```bash
cd job-find/backend

# Type check all files
npx tsc --noEmit

# Verify files exist
ls -la src/core/base/
ls -la src/core/shared/
ls -la src/core/interfaces/
ls -la src/core/abstractions/
ls -la src/core/events/
```

---

## Expected File Structure

```
backend/src/core/
├── base/
│   ├── logger.ts
│   ├── config.ts
│   ├── errors.ts
│   └── index.ts
├── shared/
│   ├── types.ts
│   ├── constants.ts
│   └── index.ts
├── interfaces/
│   ├── i_resume_parser.ts
│   ├── i_job_provider.ts
│   ├── i_embedding_provider.ts
│   ├── i_matching_service.ts
│   ├── i_agent.ts
│   └── index.ts
├── abstractions/
│   ├── base_service.ts
│   ├── base_provider.ts
│   ├── base_agent.ts
│   └── index.ts
└── events/
    ├── resume_uploaded.ts
    ├── resume_parsed.ts
    ├── jobs_fetched.ts
    ├── matching_completed.ts
    └── preparation_generated.ts
```

---

## Notes

- Logger uses Pino with pretty printing in development
- Config is validated using Zod for type safety
- Error classes follow standard HTTP status codes
- Interfaces define contracts for future AI Orchestrator and Job Provider implementations
- Base classes provide common functionality and logging

---

## Ready to Proceed?

If this plan looks good, say "approve" and I will implement module 1.5.

If you want changes, tell me what to modify.