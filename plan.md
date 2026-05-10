# JobFind - Complete Implementation Plan

This plan details every step to build the JobFind AI-powered job search platform. Follow each step in order. Commands shown should be run in your terminal.

---

## Table of Contents

1. [Phase 1: Project Foundation](#phase-1-project-foundation)
2. [Phase 2: Database Setup](#phase-2-database-setup)
3. [Phase 3: Core Infrastructure](#phase-3-core-infrastructure)
4. [Phase 4: Authentication Module](#phase-4-authentication-module)
5. [Phase 5: Backend Server Setup](#phase-5-backend-server-setup)
6. [Phase 6: Frontend Setup](#phase-6-frontend-setup)
7. [Phase 7: Frontend Auth Pages](#phase-7-frontend-auth-pages)
8. [Phase 8: Dashboard Layout](#phase-8-dashboard-layout)
9. [Phase 9: Testing & Verification](#phase-9-testing--verification)
10. [Phase 10-15: Future Phases](#phase-10-future-phases)

---

## Phase 1: Project Foundation

### Step 1.1: Create Project Structure

Create the root project directory structure:

```bash
# Create main project directory
mkdir -p job-find
cd job-find

# Create backend and frontend directories
mkdir -p backend frontend

# Verify structure
ls -la
```

### Step 1.2: Initialize Root package.json

Create npm workspaces configuration at root:

```bash
cd job-find

# Create root package.json with workspaces
cat > package.json << 'EOF'
{
  "name": "job-find",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "backend",
    "frontend"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "npm run dev --workspace=backend",
    "dev:frontend": "npm run dev --workspace=frontend",
    "build": "npm run build --workspace=backend && npm run build --workspace=frontend"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF

# Install root dependencies
npm install
```

### Step 1.3: Initialize Backend

Set up the backend package:

```bash
cd job-find/backend

# Create package.json
cat > package.json << 'EOF'
{
  "name": "backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/app/server.ts",
    "build": "tsc",
    "start": "node dist/app/server.js",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  }
}
EOF

# Install backend dependencies one by one
npm install fastify@^4.26.0
npm install @fastify/cors@^8.5.0
npm install @fastify/compress@^6.5.0
npm install @fastify/jwt@^8.0.0
npm install @fastify/rate-limit@^9.1.0
npm install @fastify/websocket@^10.0.1
npm install @fastify/passport@^2.4.0
npm install @fastify/oauth2@^7.6.0
npm install @prisma/client@^5.10.0
npm install zod@^3.22.4
npm install bcrypt@^5.1.1
npm install ioredis@^5.3.2
npm install bullmq@^5.1.0
npm install pino@^8.18.0
npm install pino-pretty@^10.3.1
npm install uuid@^9.0.1
npm install dotenv@^16.4.1

# Install dev dependencies
npm install -D typescript@^5.3.3
npm install -D @types/node@^20.11.0
npm install -D @types/bcrypt@^5.0.2
npm install -D @types/uuid@^9.0.8
npm install -D prisma@^5.10.0
npm install -D tsx@^4.7.0
npm install -D vitest@^1.2.0
```

### Step 1.4: Create Backend TypeScript Config

```bash
cd job-find/backend

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
```

### Step 1.5: Create Backend Directory Structure

```bash
cd job-find/backend

# Create all directories
mkdir -p src/core/interfaces
mkdir -p src/core/abstractions
mkdir -p src/core/base
mkdir -p src/core/events
mkdir -p src/core/shared
mkdir -p src/modules/auth/dto
mkdir -p src/modules/auth/strategies
mkdir -p src/modules/resume/dto
mkdir -p src/modules/jobs/dto
mkdir -p src/modules/matching/dto
mkdir -p src/modules/preparation/dto
mkdir -p src/modules/analytics
mkdir -p src/infrastructure/db/prisma
mkdir -p src/infrastructure/db/redis
mkdir -p src/infrastructure/queues/bullmq/workers
mkdir -p src/infrastructure/websocket
mkdir -p src/infrastructure/storage
mkdir -p src/plugins/providers/google
mkdir -p src/plugins/providers/linkedin
mkdir -p src/plugins/providers/indeed
mkdir -p src/plugins/providers/wellfound
mkdir -p src/plugins/browser/playwright
mkdir -p src/plugins/browser/mcp
mkdir -p src/app/middleware

# Verify structure
find src -type d | head -50
```

### Step 1.6: Create Backend .env.example

```bash
cd job-find/backend

cat > .env.example << 'EOF'
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/jobfind?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-in-production"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
LINKEDIN_CLIENT_ID=""
LINKEDIN_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# OAuth Callbacks (update for production)
OAUTH_CALLBACK_URL="http://localhost:3001/api/auth/oauth"

# Server
PORT=3001
NODE_ENV="development"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"
EOF

# Create actual .env file for development
cp .env.example .env
```

### Step 1.7: Initialize Frontend

```bash
cd job-find/frontend

# Create package.json
cat > package.json << 'EOF'
{
  "name": "frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
EOF

# Install frontend dependencies
npm install next@^14.1.0
npm install react@^18.2.0
npm install react-dom@^18.2.0
npm install @tanstack/react-query@^5.17.0
npm install zustand@^4.5.0
npm install axios@^1.6.5
npm install zod@^3.22.4
npm install react-hook-form@^7.50.0
npm install @hookform/resolvers@^3.3.4
npm install framer-motion@^10.18.0
npm install clsx@^2.1.0
npm install tailwind-merge@^2.2.0
npm install class-variance-authority@^0.7.0
npm install lucide-react@^0.323.0
npm install @radix-ui/react-dialog@^1.0.5
npm install @radix-ui/react-dropdown-menu@^2.0.6
npm install @radix-ui/react-label@^2.0.2
npm install @radix-ui/react-slot@^1.0.2
npm install @radix-ui/react-toast@^1.1.5
npm install react-hot-toast@^2.4.1

# Install dev dependencies
npm install -D typescript@^5.3.3
npm install -D @types/node@^20.11.0
npm install -D @types/react@^18.2.48
npm install -D @types/react-dom@^18.2.18
npm install -D tailwindcss@^3.4.1
npm install -D postcss@^8.4.33
npm install -D autoprefixer@^10.4.17
npm install -D eslint@^8.56.0
npm install -D eslint-config-next@^14.1.0
```

### Step 1.8: Create Frontend TypeScript Config

```bash
cd job-find/frontend

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF
```

### Step 1.9: Create Frontend Config Files

```bash
cd job-find/frontend

# Create next.config.js
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
}

module.exports = nextConfig
EOF

# Create postcss.config.js
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Create tailwind.config.ts
cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A2540',
        secondary: '#00D4AA',
        accent: '#635BFF',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        'text-primary': '#1E293B',
        'text-secondary': '#64748B',
        error: '#DC2626',
        warning: '#F59E0B',
        success: '#10B981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'card': '8px',
        'modal': '12px',
        'pill': '24px',
      },
    },
  },
  plugins: [],
}
export default config
EOF

# Create .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
```

### Step 1.10: Create Frontend Directory Structure

```bash
cd job-find/frontend

# Create all directories
mkdir -p src/app/\(auth\)/login
mkdir -p src/app/\(auth\)/register
mkdir -p src/app/\(dashboard\)/dashboard
mkdir -p src/app/\(dashboard\)/jobs
mkdir -p src/app/\(dashboard\)/matches
mkdir -p src/app/\(dashboard\)/preparation
mkdir -p src/app/\(dashboard\)/settings
mkdir -p src/components/ui
mkdir -p src/components/auth
mkdir -p src/components/jobs
mkdir -p src/components/resume
mkdir -p src/components/matching
mkdir -p src/components/shared
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p src/stores
mkdir -p src/types

# Verify structure
find src -type d | head -40
```

---

## Phase 2: Database Setup

### Step 2.1: Install PostgreSQL and pgvector

**If using Docker:**

```bash
# Run PostgreSQL with pgvector extension
docker run -d \
  --name jobfind-postgres \
  -e POSTGRES_USER=jobfind \
  -e POSTGRES_PASSWORD=jobfindpass \
  -e POSTGRES_DB=jobfind \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:15

# Wait for PostgreSQL to start, then enable pgvector
docker exec jobfind-postgres psql -U jobfind -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

**If using local PostgreSQL:**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE jobfind;

# Connect to database
\c jobfind

# Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

# Verify
\dx
```

### Step 2.2: Install Redis

```bash
# Using Docker
docker run -d \
  --name jobfind-redis \
  -p 6379:6379 \
  redis:7-alpine

# Or install locally
# Ubuntu/Debian:
sudo apt update
sudo apt install redis-server

# Start Redis
sudo systemctl start redis-server
```

### Step 2.3: Create Prisma Schema

```bash
cd job-find/backend

cat > src/infrastructure/db/prisma/schema.prisma << 'EOF'
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
}

extension pgvector

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String?
  name         String?
  avatarUrl    String?
  provider     String    @default("email")
  providerId   String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  isActive     Boolean   @default(true)
  settings     Json      @default("{}")

  resumeProfiles   ResumeProfile[]
  jobSearches      JobSearch[]
  matches          Match[]
  preparationMaterials PreparationMaterial[]

  @@unique([provider, providerId])
  @@index([email])
}

model ResumeProfile {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  parsedJson  Json
  embedding   Unsupported("vector(1536)")?
  resumeScore Float?
  createdAt   DateTime  @default(now())
  deletedAt   DateTime?

  matches Match[]

  @@index([userId])
}

model Job {
  id          String    @id @default(uuid())
  externalId  String
  source      String
  title       String
  company     String
  location    String?
  salaryRange String?
  description String?
  applyUrl    String
  logoUrl     String?
  keywords    String[]
  embedding   Unsupported("vector(1536)")?
  createdAt   DateTime  @default(now())
  fetchedAt   DateTime  @default(now())
  expiresAt   DateTime?
  isExpired   Boolean   @default(false)
  isFake      Boolean   @default(false)
  metadata    Json      @default("{}")

  searches            JobSearch[]
  matches             Match[]
  preparationMaterials PreparationMaterial[]

  @@unique([externalId, source])
  @@index([source])
  @@index([expiresAt])
}

model JobSearch {
  id               String   @id @default(uuid())
  userId           String
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  queryText        String
  generatedQueries String[]
  filters          Json?
  resultsCount     Int?
  createdAt        DateTime @default(now())

  jobId String?
  job   Job?    @relation(fields: [jobId], references: [id])

  @@index([userId])
  @@index([createdAt])
}

model Match {
  id               String   @id @default(uuid())
  userId           String
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  resumeProfileId  String
  resumeProfile    ResumeProfile @relation(fields: [resumeProfileId], references: [id], onDelete: Cascade)
  jobId            String
  job              Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  similarityScore  Float
  matchReasons     String[]
  isSaved          Boolean  @default(false)
  isApplied        Boolean  @default(false)
  appliedAt        DateTime?
  createdAt        DateTime @default(now())

  @@index([userId])
  @@index([jobId])
  @@index([similarityScore])
}

model PreparationMaterial {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  jobId     String
  job       Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  type      String
  content   Json
  createdAt DateTime @default(now())

  @@unique([userId, jobId, type])
  @@index([userId])
  @@index([jobId])
}
EOF
```

### Step 2.4: Push Schema to Database

```bash
cd job-find/backend

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Verify in database
# psql -U jobfind -c "\dt"
```

---

## Phase 3: Core Infrastructure

### Step 3.1: Create Logger

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

### Step 3.2: Create Config

```bash
cd job-find/backend

cat > src/core/base/config.ts << 'EOF'
import dotenv from 'dotenv'

dotenv.config()

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),

  database: {
    url: process.env.DATABASE_URL!,
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  jwt: {
    secret: process.env.JWT_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    expiresIn: '15m',
    refreshExpiresIn: '7d',
  },

  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID || '',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
    callbackUrl: process.env.OAUTH_CALLBACK_URL || 'http://localhost:3001/api/auth/oauth',
  },

  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
}

export default config
EOF
```

### Step 3.3: Create Error Classes

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
EOF
```

### Step 3.4: Create Shared Types

```bash
cd job-find/backend

cat > src/core/shared/types.ts << 'EOF'
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

export interface SearchQuery {
  text: string
  location?: string
  remote?: boolean
  salaryMin?: number
  salaryMax?: number
  experienceLevel?: string
  employmentType?: string
}

export interface ParsedResume {
  skills: string[]
  experience: Experience[]
  projects: Project[]
  education: Education[]
  keywords: string[]
  summary?: string
}

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
}

export interface Match {
  id: string
  job: Job
  similarityScore: number
  matchReasons: string[]
  isSaved: boolean
  isApplied: boolean
}
EOF
```

### Step 3.5: Create Constants

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
} as const

export const SUCCESS_MESSAGES = {
  REGISTER_SUCCESS: 'Registration successful',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  DATA_DELETED: 'Data deleted successfully',
} as const
EOF
```

### Step 3.6: Create Interface Contracts

```bash
cd job-find/backend

# Create IResumeParser interface
cat > src/core/interfaces/i_resume_parser.ts << 'EOF'
import type { ParsedResume } from '../shared/types.js'

export interface IResumeParser {
  parse(fileBuffer: Buffer, fileName: string): Promise<ParsedResume>
  generateEmbedding(parsedResume: ParsedResume): Promise<number[]>
}
EOF

# Create IJobProvider interface
cat > src/core/interfaces/i_job_provider.ts << 'EOF'
import type { Job, SearchQuery } from '../shared/types.js'

export interface IJobProvider {
  name: string
  searchJobs(query: SearchQuery): Promise<Job[]>
  extractJobDetails(url: string): Promise<Job>
}
EOF

# Create IEmbeddingProvider interface
cat > src/core/interfaces/i_embedding_provider.ts << 'EOF'
export interface IEmbeddingProvider {
  generateEmbedding(text: string): Promise<number[]>
  generateEmbeddings(texts: string[]): Promise<number[][]>
}
EOF

# Create IMatchingService interface
cat > src/core/interfaces/i_matching_service.ts << 'EOF'
import type { Job, ParsedResume } from '../shared/types.js'

export interface MatchResult {
  job: Job
  similarityScore: number
  matchReasons: string[]
}

export interface IMatchingService {
  calculateMatch(parsedResume: ParsedResume, job: Job): Promise<MatchResult>
  findMatchingJobs(parsedResume: ParsedResume, jobs: Job[]): Promise<MatchResult[]>
}
EOF
EOF
```

---

## Phase 4: Authentication Module

### Step 4.1: Create Auth DTOs

```bash
cd job-find/backend

# Create register DTO
cat > src/modules/auth/dto/register.dto.ts << 'EOF'
import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
})

export type RegisterDto = z.infer<typeof registerSchema>

export const registerResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    provider: z.string(),
  }),
  accessToken: z.string(),
  refreshToken: z.string(),
})
EOF

# Create login DTO
cat > src/modules/auth/dto/login.dto.ts << 'EOF'
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginDto = z.infer<typeof loginSchema>
EOF

# Create auth-response DTO
cat > src/modules/auth/dto/auth-response.dto.ts << 'EOF'
import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  provider: z.string(),
  createdAt: z.date(),
})

export const tokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export const authResponseSchema = z.object({
  user: userSchema,
  ...tokenResponseSchema.shape,
})

export type UserResponse = z.infer<typeof userSchema>
export type AuthResponse = z.infer<typeof authResponseSchema>
EOF
```

### Step 4.2: Create Auth Repository

```bash
cd job-find/backend

cat > src/modules/auth/auth_repository.ts << 'EOF'
import { PrismaClient } from '@prisma/client'
import type { User } from '@prisma/client'
import { NotFoundError, ConflictError } from '../../core/base/errors.js'
import { AUTH_PROVIDERS } from '../../core/shared/constants.js'

export class AuthRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }

  async findByProvider(provider: string, providerId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
    })
  }

  async create(data: {
    email: string
    passwordHash?: string
    name?: string
    avatarUrl?: string
    provider?: string
    providerId?: string
  }): Promise<User> {
    const existing = await this.findByEmail(data.email)
    if (existing) {
      throw new ConflictError('Email already registered')
    }

    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name,
        avatarUrl: data.avatarUrl,
        provider: data.provider || AUTH_PROVIDERS.EMAIL,
        providerId: data.providerId,
      },
    })
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findById(id)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    return this.prisma.user.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    })
  }
}
EOF
```

### Step 4.3: Create Auth Service

```bash
cd job-find/backend

cat > src/modules/auth/auth_service.ts << 'EOF'
import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import type { FastifyJWT } from '@fastify/jwt'
import { AuthRepository } from './auth_repository.js'
import { registerSchema, loginSchema } from './dto/register.dto.js'
import { ValidationError, UnauthorizedError, NotFoundError } from '../../core/base/errors.js'
import config from '../../core/base/config.js'
import { logger } from '../../core/base/logger.js'
import type { RegisterDto, LoginDto } from './dto/register.dto.js'
import type { AuthResponse, UserResponse } from './dto/auth-response.dto.js'

const SALT_ROUNDS = 12
const REFRESH_TOKEN_BYTES = 64

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const validated = registerSchema.parse(dto)

    const passwordHash = await bcrypt.hash(validated.password, SALT_ROUNDS)

    const user = await this.authRepository.create({
      email: validated.email,
      passwordHash,
      name: validated.name,
    })

    return this.generateAuthResponse(user)
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const validated = loginSchema.parse(dto)

    const user = await this.authRepository.findByEmail(validated.email)
    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const isValid = await bcrypt.compare(validated.password, user.passwordHash)
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials')
    }

    return this.generateAuthResponse(user)
  }

  async oauthLogin(provider: string, providerId: string, email: string, name?: string, avatarUrl?: string): Promise<AuthResponse> {
    let user = await this.authRepository.findByProvider(provider, providerId)

    if (!user) {
      user = await this.authRepository.create({
        email,
        name,
        avatarUrl,
        provider,
        providerId,
      })
    }

    return this.generateAuthResponse(user)
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = await this.verifyRefreshToken(refreshToken)
      const user = await this.authRepository.findById(decoded.id)
      if (!user) {
        throw new UnauthorizedError('User not found')
      }

      const tokens = this.generateTokens(user.id)
      return tokens
    } catch {
      throw new UnauthorizedError('Invalid refresh token')
    }
  }

  async getCurrentUser(userId: string): Promise<UserResponse> {
    const user = await this.authRepository.findById(userId)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    return this.mapUserResponse(user)
  }

  async logout(userId: string): Promise<void> {
    logger.info({ userId }, 'User logged out')
  }

  async deleteAccount(userId: string): Promise<void> {
    await this.authRepository.delete(userId)
  }

  private generateAuthResponse(user: { id: string; email: string; name: string | null; avatarUrl: string | null; provider: string }) {
    const tokens = this.generateTokens(user.id)

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        provider: user.provider,
      },
      ...tokens,
    }
  }

  private generateTokens(userId: string): { accessToken: string; refreshToken: string } {
    const accessToken = this.jwtSign({ id: userId }, config.jwt.expiresIn)
    const refreshToken = this.jwtSign({ id: userId, type: 'refresh' }, config.jwt.refreshExpiresIn)

    return { accessToken, refreshToken }
  }

  private jwtSign(payload: object, expiresIn: string): string {
    // This will be called within Fastify JWT context
    // The actual signing happens in the route handler
    return JSON.stringify({ ...payload, expiresIn })
  }

  private async verifyRefreshToken(token: string): Promise<{ id: string }> {
    // This will use Fastify JWT verify
    return { id: token }
  }

  private mapUserResponse(user: { id: string; email: string; name: string | null; avatarUrl: string | null; provider: string; createdAt: Date }): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      provider: user.provider,
      createdAt: user.createdAt,
    }
  }
}
EOF
```

### Step 4.4: Create Auth Controller

```bash
cd job-find/backend

cat > src/modules/auth/auth_controller.ts << 'EOF'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { AuthService } from './auth_service.js'
import { registerSchema, loginSchema } from './dto/register.dto.js'
import type { RegisterDto, LoginDto } from './dto/register.dto.js'

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(request: FastifyRequest<{ Body: RegisterDto }>, reply: FastifyReply) {
    const result = await this.authService.register(request.body)
    return reply.status(201).send(result)
  }

  async login(request: FastifyRequest<{ Body: LoginDto }>, reply: FastifyReply) {
    const result = await this.authService.login(request.body)
    return reply.send(result)
  }

  async oauthCallback(request: FastifyRequest<{ Params: { provider: string } }>, reply: FastifyReply) {
    const { provider } = request.params
    // OAuth callback handling - provider specific
    // This would be handled by passport strategies
    return reply.send({ message: `OAuth ${provider} callback` })
  }

  async refresh(request: FastifyRequest<{ Body: { refreshToken: string } }>, reply: FastifyReply) {
    const result = await this.authService.refreshToken(request.body.refreshToken)
    return reply.send(result)
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id
    const result = await this.authService.getCurrentUser(userId)
    return reply.send(result)
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id
    await this.authService.logout(userId)
    return reply.send({ message: 'Logged out successfully' })
  }

  async deleteAccount(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id
    await this.authService.deleteAccount(userId)
    return reply.status(204).send()
  }
}
EOF
```

### Step 4.5: Create Auth Router

```bash
cd job-find/backend

cat > src/modules/auth/auth_router.ts << 'EOF'
import type { FastifyInstance } from 'fastify'
import { AuthController } from './auth_controller.js'
import { AuthService } from './auth_service.js'
import { AuthRepository } from './auth_repository.js'
import { registerSchema, loginSchema } from './dto/register.dto.js'

export async function authRouter(fastify: FastifyInstance) {
  const prisma = fastify.prisma

  const authRepository = new AuthRepository(prisma)
  const authService = new AuthService(authRepository)
  const authController = new AuthController(authService)

  // Public routes
  fastify.post('/register', {
    schema: {
      body: registerSchema,
    },
  }, async (request, reply) => authController.register(request, reply))

  fastify.post('/login', {
    schema: {
      body: loginSchema,
    },
  }, async (request, reply) => authController.login(request, reply))

  fastify.post('/refresh', async (request, reply) => {
    const { refreshToken } = request.body as { refreshToken: string }
    return authController.refresh({ body: { refreshToken } } as any, reply)
  })

  // OAuth routes
  fastify.get('/oauth/:provider', async (request, reply) => {
    const { provider } = request.params as { provider: string }
    // Initiate OAuth flow
    return reply.send({ message: `Initiate ${provider} OAuth` })
  })

  fastify.get('/oauth/:provider/callback', async (request, reply) => {
    const { provider } = request.params as { provider: string }
    return authController.oauthCallback({ params: { provider } } as any, reply)
  })

  // Protected routes
  fastify.addHook('onRequest', fastify.authenticate)

  fastify.get('/me', async (request, reply) => authController.me(request, reply))

  fastify.post('/logout', async (request, reply) => authController.logout(request, reply))

  fastify.delete('/account', async (request, reply) => authController.deleteAccount(request, reply))
}
EOF
```

### Step 4.6: Create OAuth Strategies

```bash
cd job-find/backend

# Google Strategy
cat > src/modules/auth/strategies/google.strategy.ts << 'EOF'
import { FastifyOAuth2 } from '@fastify/oauth2'
import config from '../../../core/base/config.js'

export async function googleStrategy(fastify: FastifyInstance) {
  await fastify.register(FastifyOAuth2, {
    name: 'google',
    scope: ['profile', 'email'],
    credentials: {
      client: {
        id: config.oauth.google.clientId,
        secret: config.oauth.google.clientSecret,
      },
      auth: fastify.OAuth2.prototype.config Grants.authorizationCode,
    },
    startRedirectPath: '/api/auth/oauth/google',
    callbackUri: `${config.oauth.callbackUrl}/google/callback`,
  })
}
EOF

# LinkedIn Strategy
cat > src/modules/auth/strategies/linkedin.strategy.ts << 'EOF'
import config from '../../../core/base/config.js'

export async function linkedinStrategy(fastify: FastifyInstance) {
  await fastify.register(FastifyOAuth2, {
    name: 'linkedin',
    scope: ['openid', 'profile', 'email'],
    credentials: {
      client: {
        id: config.oauth.linkedin.clientId,
        secret: config.oauth.linkedin.clientSecret,
      },
      auth: fastify.OAuth2.prototype.config Grants.authorizationCode,
    },
    startRedirectPath: '/api/auth/oauth/linkedin',
    callbackUri: `${config.oauth.callbackUrl}/linkedin/callback`,
  })
}
EOF

# GitHub Strategy
cat > src/modules/auth/strategies/github.strategy.ts << 'EOF'
import config from '../../../core/base/config.js'

export async function githubStrategy(fastify: FastifyInstance) {
  await fastify.register(FastifyOAuth2, {
    name: 'github',
    scope: ['user:email'],
    credentials: {
      client: {
        id: config.oauth.github.clientId,
        secret: config.oauth.github.clientSecret,
      },
      auth: fastify.OAuth2.prototype.config Grants.authorizationCode,
    },
    startRedirectPath: '/api/auth/oauth/github',
    callbackUri: `${config.oauth.callbackUrl}/github/callback`,
  })
}
EOF
```

---

## Phase 5: Backend Server Setup

### Step 5.1: Create Prisma Extension for Fastify

```bash
cd job-find/backend

cat > src/app/prisma.ts << 'EOF'
import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

export const prismaPlugin: FastifyPluginAsync = async (fastify) => {
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  await prisma.$connect()

  fastify.decorate('prisma', prisma)

  fastify.addHook('onClose', async () => {
    await prisma.$disconnect()
  })
}
EOF
```

### Step 5.2: Create JWT Authentication Decorator

```bash
cd job-find/backend

cat > src/app/middleware/auth.ts << 'EOF'
import { FastifyRequest, FastifyReply } from 'fastify'
import { UnauthorizedError } from '../../core/base/errors.js'

export interface JWTUser {
  id: string
}

declare module 'fastify' {
  interface FastifyRequest {
    user: JWTUser
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    throw new UnauthorizedError('Please log in to continue')
  }
}
EOF
```

### Step 5.3: Create Error Handler

```bash
cd job-find/backend

cat > src/app/middleware/error.ts << 'EOF'
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../../core/base/errors.js'
import { logger } from '../../core/base/logger.js'

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof AppError) {
    logger.warn({ error: error.message, statusCode: error.statusCode }, 'Application error')

    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      message: error.message,
      error: error.constructor.name,
    })
  }

  if (error.validation) {
    return reply.status(400).send({
      statusCode: 400,
      message: 'Validation error',
      error: 'ValidationError',
      details: error.validation,
    })
  }

  logger.error({ error: error.message, stack: error.stack }, 'Unhandled error')

  return reply.status(500).send({
    statusCode: 500,
    message: 'Internal server error',
    error: 'InternalError',
  })
}
EOF
```

### Step 5.4: Create Routes

```bash
cd job-find/backend

cat > src/app/routes.ts << 'EOF'
import type { FastifyInstance } from 'fastify'
import { authRouter } from '../modules/auth/auth_router.js'

export async function registerRoutes(fastify: FastifyInstance) {
  // Health check
  fastify.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

  // Auth routes
  fastify.register(authRouter, { prefix: '/api/auth' })

  // Future routes will be added here
  // fastify.register(jobsRouter, { prefix: '/api/jobs' })
  // fastify.register(resumeRouter, { prefix: '/api/resume' })
  // fastify.register(matchingRouter, { prefix: '/api/matching' })
  // fastify.register(preparationRouter, { prefix: '/api/preparation' })
}
EOF
```

### Step 5.5: Create Main Server

```bash
cd job-find/backend

cat > src/app/server.ts << 'EOF'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import compress from '@fastify/compress'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import websocket from '@fastify/websocket'
import { prismaPlugin } from './prisma.js'
import { registerRoutes } from './routes.js'
import { errorHandler } from './middleware/error.js'
import { authenticate } from './middleware/auth.js'
import config from '../core/base/config.js'
import { logger } from '../core/base/logger.js'

async function startServer() {
  const fastify = Fastify({
    logger: false, // We use our own logger
  })

  // Register CORS
  await fastify.register(cors, {
    origin: config.frontend.url,
    credentials: true,
  })

  // Register compression
  await fastify.register(compress)

  // Register rate limiting
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })

  // Register JWT
  await fastify.register(jwt, {
    secret: config.jwt.secret,
    sign: {
      expiresIn: config.jwt.expiresIn,
    },
  })

  // Register WebSocket
  await fastify.register(websocket)

  // Register Prisma
  await fastify.register(prismaPlugin)

  // Decorate with authenticate
  fastify.decorate('authenticate', authenticate)

  // Register error handler
  fastify.setErrorHandler(errorHandler)

  // Register routes
  await registerRoutes(fastify)

  // Start server
  try {
    await fastify.listen({ port: config.port, host: '0.0.0.0' })
    logger.info(`Server running on port ${config.port}`)
  } catch (err) {
    logger.error(err, 'Failed to start server')
    process.exit(1)
  }
}

startServer()
EOF
```

---

## Phase 6: Frontend Setup

### Step 6.1: Create Base Layout and Providers

```bash
cd job-find/frontend

# Create global styles
cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --primary: #0A2540;
    --secondary: #00D4AA;
    --accent: #635BFF;
    --background: #F8FAFC;
    --surface: #FFFFFF;
    --text-primary: #1E293B;
    --text-secondary: #64748B;
  }

  body {
    @apply bg-background text-text-primary antialiased;
  }
}

@layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  .animate-slide-up {
    animation: slideUp 0.3s ease-out;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
EOF
```

### Step 6.2: Create Root Layout

```bash
cd job-find/frontend

cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'JobFind - AI-Powered Job Search',
  description: 'Privacy-first AI-powered job matching platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0A2540',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}
EOF
```

### Step 6.3: Create Auth Store

```bash
cd job-find/frontend

cat > src/stores/auth_store.ts << 'EOF'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  provider: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
)
EOF
```

### Step 6.4: Create API Client

```bash
cd job-find/frontend

cat > src/lib/api.ts << 'EOF'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth_store'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
EOF
```

### Step 6.5: Create Utility Functions

```bash
cd job-find/frontend

cat > src/lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(new Date(date))
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}
EOF
```

---

## Phase 7: Frontend Auth Pages

### Step 7.1: Create UI Components

```bash
cd job-find/frontend

# Create Button component
cat > src/components/ui/button.tsx << 'EOF'
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-card text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-secondary text-white hover:bg-secondary/90',
        outline: 'border border-primary text-primary hover:bg-primary/10',
        ghost: 'hover:bg-primary/10',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3',
        lg: 'h-12 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
EOF

# Create Input component
cat > src/components/ui/input.tsx << 'EOF'
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-card border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
EOF

# Create Label component
cat > src/components/ui/label.tsx << 'EOF'
import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@/lib/utils'

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-sm font-medium text-text-primary leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
EOF

# Create Card component
cat > src/components/ui/card.tsx << 'EOF'
import * as React from 'react'
import { cn } from '@/lib/utils'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-modal bg-surface shadow-lg', className)}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-bold text-text-primary', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'
EOF
```

### Step 7.2: Create Auth Pages

```bash
cd job-find/frontend

# Create auth layout
cat > 'src/app/(auth)/layout.tsx' << 'EOF'
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">{children}</div>
    </div>
  )
}
EOF

# Create login page
cat > 'src/app/(auth)/login/page.tsx' << 'EOF'
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginDto } from '@/types/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/auth_store'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginDto) => {
    setIsLoading(true)
    try {
      const response = await api.post('/api/auth/login', data)
      setAuth(response.data.user, response.data.accessToken, response.data.refreshToken)
      toast.success('Welcome back!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Welcome Back</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-error text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="text-center text-sm text-text-secondary">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-primary hover:underline">
              Sign up
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
EOF

# Create register page
cat > 'src/app/(auth)/register/page.tsx' << 'EOF'
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterDto } from '@/types/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/auth_store'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterDto) => {
    setIsLoading(true)
    try {
      const response = await api.post('/api/auth/register', data)
      setAuth(response.data.user, response.data.accessToken, response.data.refreshToken)
      toast.success('Account created successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-error text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>

          <div className="text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:underline">
              Sign in
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
EOF
```

### Step 7.3: Create Auth Types

```bash
cd job-find/frontend

cat > src/types/auth.ts << 'EOF'
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
})

export type LoginDto = z.infer<typeof loginSchema>
export type RegisterDto = z.infer<typeof registerSchema>

export interface AuthResponse {
  user: {
    id: string
    email: string
    name: string | null
    avatarUrl: string | null
    provider: string
  }
  accessToken: string
  refreshToken: string
}
EOF
```

### Step 7.4: Create Root Page Redirect

```bash
cd job-find/frontend

cat > src/app/page.tsx << 'EOF'
import { redirect } from 'next/navigation'
import { useAuthStore } from '@/stores/auth_store'

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}
EOF
```

---

## Phase 8: Dashboard Layout

### Step 8.1: Create Dashboard Layout

```bash
cd job-find/frontend

# Create sidebar component
cat > src/components/shared/Sidebar.tsx << 'EOF'
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Settings,
  LogOut
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth_store'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Matches', href: '/matches', icon: Users },
  { name: 'Preparation', href: '/preparation', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const logout = useAuthStore((state) => state.logout)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-primary">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-white/10">
          <h1 className="text-2xl font-bold text-white">JobFind</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-card px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-card px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Log out
          </button>
        </div>
      </div>
    </aside>
  )
}
EOF

# Create header component
cat > src/components/shared/Header.tsx << 'EOF'
'use client'

import { useAuthStore } from '@/stores/auth_store'
import { Bell, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export function Header() {
  const user = useAuthStore((state) => state.user)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-surface px-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 hover:bg-gray-100">
          <Bell className="h-5 w-5 text-text-secondary" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-secondary" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 rounded-full px-3 py-1 hover:bg-gray-100"
          >
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <span className="text-sm font-medium text-text-primary">
              {user?.name || user?.email}
            </span>
            <ChevronDown className="h-4 w-4 text-text-secondary" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-modal bg-surface shadow-lg border border-gray-200 py-1">
              <a
                href="/settings"
                className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100"
              >
                Settings
              </a>
              <button
                onClick={() => {
                  useAuthStore.getState().logout()
                  window.location.href = '/login'
                }}
                className="w-full text-left px-4 py-2 text-sm text-error hover:bg-gray-100"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
EOF

# Create dashboard layout
cat > 'src/app/(dashboard)/layout.tsx' << 'EOF'
'use client'

import { Sidebar } from '@/components/shared/Sidebar'
import { Header } from '@/components/shared/Header'
import { useAuthStore } from '@/stores/auth_store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
EOF
```

### Step 8.2: Create Dashboard Pages

```bash
cd job-find/frontend

# Create dashboard home page
cat > 'src/app/(dashboard)/dashboard/page.tsx' << 'EOF'
'use client'

import { useAuthStore } from '@/stores/auth_store'
import { Briefcase, Users, FileText, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)

  const stats = [
    { name: 'Active Matches', value: '12', icon: Users, color: 'text-secondary' },
    { name: 'Jobs Viewed', value: '48', icon: Briefcase, color: 'text-accent' },
    { name: 'Prep Materials', value: '8', icon: FileText, color: 'text-primary' },
    { name: 'Success Rate', value: '76%', icon: TrendingUp, color: 'text-success' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Welcome back, {user?.name || 'there'}!
        </h1>
        <p className="text-text-secondary">
          Here&apos;s what&apos;s happening with your job search
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-card bg-surface p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">{stat.name}</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-card bg-surface p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <a
            href="/jobs"
            className="inline-flex items-center justify-center rounded-card bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            Search Jobs
          </a>
          <a
            href="/preparation"
            className="inline-flex items-center justify-center rounded-card border border-primary text-primary px-6 py-3 text-sm font-medium hover:bg-primary/5 transition-colors"
          >
            View Preparation
          </a>
        </div>
      </div>
    </div>
  )
}
EOF

# Create placeholder pages for jobs, matches, preparation, settings
cat > 'src/app/(dashboard)/jobs/page.tsx' << 'EOF'
export default function JobsPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-text-primary">Job Search</h1>
      <p className="text-text-secondary mt-2">Search for jobs across multiple platforms</p>
      {/* Job search functionality will be implemented in later phases */}
      <div className="mt-8 p-8 text-center text-text-secondary bg-surface rounded-card border border-gray-100">
        Job search engine coming in Phase 3
      </div>
    </div>
  )
}
EOF

cat > 'src/app/(dashboard)/matches/page.tsx' << 'EOF'
export default function MatchesPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-text-primary">My Matches</h1>
      <p className="text-text-secondary mt-2">Jobs matched to your profile</p>
      <div className="mt-8 p-8 text-center text-text-secondary bg-surface rounded-card border border-gray-100">
        Matching functionality coming in Phase 4
      </div>
    </div>
  )
}
EOF

cat > 'src/app/(dashboard)/preparation/page.tsx' << 'EOF'
export default function PreparationPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-text-primary">Preparation</h1>
      <p className="text-text-secondary mt-2">Interview questions and tips</p>
      <div className="mt-8 p-8 text-center text-text-secondary bg-surface rounded-card border border-gray-100">
        Preparation materials coming in Phase 5
      </div>
    </div>
  )
}
EOF

cat > 'src/app/(dashboard)/settings/page.tsx' << 'EOF'
'use client'

import { useAuthStore } from '@/stores/auth_store'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user)

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      try {
        // API call to delete account
        toast.success('Account deleted')
      } catch {
        toast.error('Failed to delete account')
      }
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-text-primary">Settings</h1>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-secondary">Name</label>
            <p className="text-text-primary">{user?.name || 'Not set'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary">Email</label>
            <p className="text-text-primary">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary">Provider</label>
            <p className="text-text-primary capitalize">{user?.provider}</p>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-error/20">
        <CardHeader>
          <CardTitle className="text-error">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="outline" className="border-error text-error hover:bg-error/10" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
EOF
```

---

## Phase 9: Testing & Verification

### Step 9.1: Test Backend

```bash
cd job-find/backend

# Run Prisma migration
npm run db:push

# Try to start the server (Ctrl+C to stop)
npm run dev
```

### Step 9.2: Test Frontend Build

```bash
cd job-find/frontend

# Run build to check for errors
npm run build

# If build succeeds, start dev server
npm run dev
```

### Step 9.3: Verify End-to-End Flow

1. Open browser to `http://localhost:3000`
2. Should redirect to `/login`
3. Test registration flow
4. Test login flow
5. Verify dashboard loads
6. Test navigation sidebar

---

## Phase 10: Resume Processing (Future)

This phase will include:
- File upload endpoint with multer
- AI resume parsing service
- Embedding generation
- Physical file deletion
- User-controlled data deletion

### Step 10.1: Install Additional Dependencies

```bash
cd job-find/backend

npm install multer@^1.4.5-lts.1
npm install @types/multer@^1.4.11
```

### Step 10.2: Create Resume Module

```
src/modules/resume/
├── resume_controller.ts
├── resume_service.ts
├── resume_repository.ts
└── dto/
```

---

## Phase 11: Job Search Engine (Future)

This phase will include:
- MCP browser setup
- Provider implementations (Google, LinkedIn, Indeed, Wellfound)
- Deduplication engine
- Job extraction with AI

---

## Phase 12: Matching System (Future)

This phase will include:
- Semantic similarity calculation
- Match ranking algorithm
- Save/dismiss functionality

---

## Phase 13: Preparation Materials (Future)

This phase will include:
- Interview question generation
- Resume tailoring suggestions
- Company research

---

## Phase 14: Real-time Updates (Future)

This phase will include:
- WebSocket integration
- Real-time job alerts
- Live match notifications

---

## Phase 15: Polish & Optimization (Future)

This phase will include:
- Performance optimization
- Mobile responsiveness
- Analytics dashboard
- Error tracking

---

## Summary Checklist

### Completed in Phase 1-9:
- [x] Project scaffolding (backend + frontend)
- [x] TypeScript configuration
- [x] Database schema with Prisma
- [x] Core infrastructure (logger, config, errors)
- [x] Auth module (register, login, JWT)
- [x] Backend server with Fastify
- [x] Frontend with Next.js 14
- [x] Auth pages (login, register)
- [x] Dashboard layout with sidebar navigation
- [x] Basic routing and state management

### Remaining Phases:
- [ ] Phase 10: Resume Processing
- [ ] Phase 11: Job Search Engine
- [ ] Phase 12: Matching System
- [ ] Phase 13: Preparation Materials
- [ ] Phase 14: Real-time Updates
- [ ] Phase 15: Polish & Optimization

---

## Running the Project

### Start Development Environment:

```bash
# Terminal 1: Start backend
cd job-find/backend
npm run dev

# Terminal 2: Start frontend
cd job-find/frontend
npm run dev
```

### Start Infrastructure (Docker):

```bash
# PostgreSQL with pgvector
docker run -d --name jobfind-postgres -e POSTGRES_USER=jobfind -e POSTGRES_PASSWORD=jobfindpass -e POSTGRES_DB=jobfind -p 5432:5432 postgres:15
docker exec jobfind-postgres psql -U jobfind -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Redis
docker run -d --name jobfind-redis -p 6379:6379 redis:7-alpine
```

---

## Environment Variables

### Backend (.env):
```bash
DATABASE_URL="postgresql://jobfind:jobfindpass@localhost:5432/jobfind?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-in-production"
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env.local):
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```