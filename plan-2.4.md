# Plan 2.4: Backend Server Setup

## Overview
Set up the Fastify server with proper middleware, CORS, compression, rate limiting, error handling, health checks, and route registration.

---

## Tasks

### 2.4.1 Server Entry Point
- [ ] `backend/src/app/server.ts`
  - Create Fastify instance with TypeScript
  - Register CORS plugin with proper origin configuration
  - Register compression plugin
  - Set up request logging
  - Configure host and port from environment

### 2.4.2 Environment Configuration
- [ ] `backend/src/core/base/config.ts`
  - Load environment variables from `.env`
  - Validate required environment variables
  - Export typed config object

### 2.4.3 Error Handling
- [ ] `backend/src/app/middleware/error.ts`
  - Global error handler for all unhandled errors
  - Custom AppError class with status codes
  - Zod validation error formatting
  - Prisma error formatting
  - Consistent error response structure

### 2.4.4 Rate Limiting
- [ ] `backend/src/app/middleware/rate-limit.ts`
  - Configure rate limit plugin per route type
  - Auth endpoints: stricter limits (5 requests/min)
  - Public endpoints: relaxed limits (100 requests/min)
  - Return proper 429 Too Many Requests response

### 2.4.5 Health Check
- [ ] `GET /health` endpoint
  - Check database connectivity
  - Check Redis connectivity
  - Return service status and version

### 2.4.6 Route Registration
- [ ] `backend/src/app/routes.ts`
  - Import all module routers
  - Register auth routes under `/api/auth`
  - Register health check at `/health`
  - Set up API prefix for all routes

### 2.4.7 Main Entry Point
- [ ] `backend/src/app/index.ts`
  - Initialize Prisma client
  - Initialize Redis connection
  - Register routes
  - Start server with graceful shutdown

---

## Deliverables

| File | Purpose |
|------|---------|
| `src/app/server.ts` | Fastify server instance with plugins |
| `src/app/index.ts` | Main entry point with startup/shutdown |
| `src/app/routes.ts` | Central route registration |
| `src/app/middleware/error.ts` | Global error handler |
| `src/app/middleware/rate-limit.ts` | Rate limiting configuration |
| `src/core/base/config.ts` | Environment configuration loader |

---

## Server Configuration

```typescript
// Fastify instance should include:
- @fastify/cors (origin from env)
- @fastify/compress (gzip/brotli)
- pino-pretty (request logging)
- @fastify/rate-limit
- Custom error handler
```

---

## Environment Variables Required

```bash
# Server
PORT=3001
HOST=0.0.0.0
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# Database
DATABASE_URL=postgresql://...

# Redis
REDIS_URL=redis://localhost:6379
```

---

## Next Steps After 2.4

Once 2.4 is complete, we proceed to:
- **2.5**: Health check verification and basic routing structure
- **Phase 3**: Frontend Foundation (Auth Pages, Dashboard)