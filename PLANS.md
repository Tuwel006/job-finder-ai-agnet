# Phase 1: Foundation - Implementation Plan

## Overview
Set up the complete project scaffolding with:
- Backend: Fastify + TypeScript + Prisma
- Frontend: Next.js 14 + TypeScript + Tailwind + shadcn/ui
- Database: PostgreSQL with pgvector
- Infrastructure: Redis + BullMQ

---

## Step 1: Project Scaffolding

### Backend Setup
```
backend/
├── src/
│   ├── core/
│   │   ├── interfaces/
│   │   ├── abstractions/
│   │   ├── base/
│   │   ├── events/
│   │   └── shared/
│   ├── modules/
│   │   ├── auth/
│   │   ├── resume/
│   │   ├── jobs/
│   │   ├── matching/
│   │   ├── preparation/
│   │   └── analytics/
│   ├── infrastructure/
│   │   ├── db/
│   │   │   ├── prisma/
│   │   │   └── redis/
│   │   ├── queues/
│   │   ├── websocket/
│   │   └── storage/
│   ├── plugins/
│   │   ├── providers/
│   │   └── browser/
│   └── app/
├── package.json
├── tsconfig.json
└── .env.example
```

### Frontend Setup
```
frontend/
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── stores/
│   └── types/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

### Actions for Step 1:
1. Create `backend/` directory with `package.json` (Fastify, TypeScript, Prisma, Zod, etc.)
2. Create `frontend/` directory with Next.js 14 app
3. Set up `tsconfig.json` for both with proper paths
4. Create `.env.example` files for both
5. Set up npm workspaces (root `package.json`)

---

## Step 2: Database Schema (Prisma)

### Tables to create:
1. **users** - User accounts
2. **resume_profiles** - Parsed resume data (user-controlled, no TTL)
3. **jobs** - Job listings with embeddings
4. **job_searches** - Search history
5. **matches** - User-job matches
6. **preparation_materials** - Interview prep content

### Actions for Step 2:
1. Create `backend/src/infrastructure/db/prisma/schema.prisma`
2. Configure pgvector extension for embeddings
3. Add proper indexes (IVFFlat for vectors, B-tree for lookups)
4. Create initial migration
5. Generate Prisma client

---

## Step 3: Core Infrastructure

### Core Base Classes
- `logger.ts` - Structured logging with Winston/Pino
- `config.ts` - Environment configuration loader
- `errors.ts` - Custom error classes (AppError, NotFoundError, ValidationError)

### Shared Types
```typescript
// types.ts
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PaginationParams {
  page: number;
  limit: number;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### Actions for Step 3:
1. Create `backend/src/core/base/` with logger, config, errors
2. Create `backend/src/core/shared/` with types and constants
3. Set up `backend/src/core/interfaces/` stubs

---

## Step 4: Auth Module

### Files to create:
```
modules/auth/
├── auth_controller.ts    # HTTP handlers
├── auth_service.ts        # Business logic
├── auth_repository.ts     # Database operations
├── oauth_service.ts       # OAuth provider management
├── dto/
│   ├── register.dto.ts
│   ├── login.dto.ts
│   └── auth-response.dto.ts
├── strategies/
│   ├── google.strategy.ts
│   ├── linkedin.strategy.ts
│   └── github.strategy.ts
└── auth_router.ts         # Fastify routes
```

### Features:
- Register with email/password
- Login with JWT tokens
- OAuth 2.0 login (Google, LinkedIn, GitHub)
- Refresh token mechanism
- Logout (invalidate refresh token)
- Get current user

### Actions for Step 4:
1. Create auth DTOs with Zod schemas
2. Create auth repository (Prisma operations)
3. Create auth service (hash passwords, generate JWTs)
4. Create auth controller
5. Create auth routes with Fastify
6. Add auth middleware for protected routes
7. Create OAuth service with provider strategies
8. Implement Google, LinkedIn, GitHub OAuth strategies
9. Add OAuth callback handlers

---

## Step 5: Backend Server Setup

### Files to create:
```
backend/src/app/
├── server.ts        # Fastify server setup
├── routes.ts        # Main routes registration
└── middleware/
    ├── auth.ts      # JWT verification
    ├── error.ts     # Global error handler
    └── rate-limit.ts
```

### Actions for Step 5:
1. Create Fastify server with CORS, compression, logging
2. Set up global error handler
3. Register all module routes
4. Add health check endpoint
5. Configure rate limiting
6. Add request logging

---

## Step 6: Frontend Setup

### Core setup:
- Next.js 14 App Router
- TypeScript strict mode
- Tailwind CSS with custom theme
- shadcn/ui component library
- Zustand for state management
- Framer Motion for animations

### Actions for Step 6:
1. Initialize Next.js with TypeScript
2. Configure Tailwind with design tokens from SPEC.md
3. Set up shadcn/ui
4. Create base layout component
5. Create theme provider
6. Set up API client with axios/fetch

---

## Step 7: Frontend Auth Pages

### Pages:
- `/login` - Login form
- `/register` - Registration form
- `/layout` - Auth layout with centered card

### Components:
- `LoginForm` - Email/password login
- `RegisterForm` - Email/password registration
- `AuthCard` - Styled card container

### Actions for Step 7:
1. Create auth layout
2. Create login page with form
3. Create register page with form
4. Add validation with Zod/react-hook-form
5. Create auth store with Zustand
6. Add API integration

---

## Step 8: Dashboard Layout

### Layout structure:
```
app/(dashboard)/
├── layout.tsx        # Dashboard shell with sidebar
├── page.tsx          # Dashboard home
├── jobs/
│   └── page.tsx     # Job search
├── matches/
│   └── page.tsx     # My matches
├── preparation/
│   └── page.tsx     # Interview prep
└── settings/
    └── page.tsx     # User settings
```

### Components:
- `Sidebar` - Navigation sidebar
- `Header` - Top bar with user menu
- `DashboardShell` - Main layout wrapper

### Actions for Step 8:
1. Create dashboard layout with sidebar
2. Create sidebar navigation
3. Create header with user dropdown
4. Create dashboard home page
5. Add protected route middleware

---

## Step 9: Testing & Verification

### Actions for Step 9:
1. Verify backend starts without errors
2. Verify Prisma migrations run successfully
3. Test auth endpoints (register, login)
4. Verify frontend builds successfully
5. Test login flow in browser

---

## Dependencies Needed

### Backend (package.json)
```json
{
  "dependencies": {
    "fastify": "^4.26.0",
    "@fastify/cors": "^8.5.0",
    "@fastify/compress": "^6.5.0",
    "@fastify/jwt": "^8.0.0",
    "@fastify/rate-limit": "^9.1.0",
    "@fastify/websocket": "^10.0.1",
    "@fastify/passport": "^2.4.0",
    "@fastify/oauth2": "^7.6.0",
    "@prisma/client": "^5.10.0",
    "zod": "^3.22.4",
    "bcrypt": "^5.1.1",
    "ioredis": "^5.3.2",
    "bullmq": "^5.1.0",
    "pino": "^8.18.0",
    "pino-pretty": "^10.3.1",
    "uuid": "^9.0.1",
    "dotenv": "^16.4.1"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.11.0",
    "@types/bcrypt": "^5.0.2",
    "@types/uuid": "^9.0.8",
    "prisma": "^5.10.0",
    "tsx": "^4.7.0",
    "vitest": "^1.2.0"
  }
}
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.17.0",
    "zustand": "^4.5.0",
    "axios": "^1.6.5",
    "zod": "^3.22.4",
    "react-hook-form": "^7.50.0",
    "@hookform/resolvers": "^3.3.4",
    "framer-motion": "^10.18.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "class-variance-authority": "^0.7.0",
    "lucide-react": "^0.323.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-toast": "^1.1.5",
    "react-hot-toast": "^2.4.1"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.33",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.1.0"
  }
}
```

---

## Next Steps After Phase 1

Once Phase 1 is complete and verified, we proceed to:
- **Phase 2**: Resume Processing (upload → parse → embed → delete physical file → user-controlled storage)
- **Phase 3**: Job Search Engine (MCP + browser automation)
- **Phase 4**: Matching (semantic similarity)
- **Phase 5**: Preparation (interview questions)
- **Phase 6**: Polish (WebSocket, analytics)

---

## Time Estimate
Step 1-3 (Scaffolding + Database): ~1-2 hours
Step 4-5 (Auth + Server): ~2-3 hours
Step 6-8 (Frontend): ~2-3 hours
Step 9 (Testing): ~1 hour

**Total Phase 1**: ~6-9 hours
