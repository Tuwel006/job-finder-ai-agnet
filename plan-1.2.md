# Module 1.2: Backend Setup - Detailed Plan

## Overview
Set up the backend with Fastify, TypeScript, Prisma, and all required dependencies. All packages installed using npm commands (not adding to package.json directly first, then we update package.json after).

## Deliverables
- `backend/package.json` with all dependencies
- `backend/tsconfig.json` with proper TypeScript configuration
- `backend/.env.example` for environment variables
- All dependencies installed via npm

---

## Step-by-Step Implementation

### Step 1.2.1: Create Backend package.json

**Action:** Create initial `backend/package.json` with name, scripts, and placeholder for dependencies

```bash
cd job-find/backend
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
    "db:studio": "prisma studio",
    "test": "vitest"
  }
}
EOF
```

**Files Created:** `backend/package.json`

---

### Step 1.2.2: Install Fastify and Core Packages

**Action:** Install Fastify framework and essential plugins one by one

```bash
cd job-find/backend

# Install Fastify core
npm install fastify@^4.26.0

# Install Fastify plugins
npm install @fastify/cors@^8.5.0
npm install @fastify/compress@^6.5.0
npm install @fastify/jwt@^8.0.0
npm install @fastify/rate-limit@^9.1.0
npm install @fastify/websocket@^10.0.1
npm install @fastify/passport@^2.4.0
npm install @fastify/oauth2@^7.6.0
```

---

### Step 1.2.3: Install Prisma and Database Packages

**Action:** Install Prisma ORM and database-related packages

```bash
cd job-find/backend

# Prisma client
npm install @prisma/client@^5.10.0

# Validation
npm install zod@^3.22.4

# Password hashing
npm install bcrypt@^5.1.1
```

---

### Step 1.2.4: Install Redis and Queue Packages

**Action:** Install Redis client and BullMQ for job queues

```bash
cd job-find/backend

# Redis client
npm install ioredis@^5.3.2

# Job queue
npm install bullmq@^5.1.0
```

---

### Step 1.2.5: Install Logging and Utility Packages

**Action:** Install Pino logger and other utilities

```bash
cd job-find/backend

# Logging
npm install pino@^8.18.0
npm install pino-pretty@^10.3.1

# Utilities
npm install uuid@^9.0.1
npm install dotenv@^16.4.1
```

---

### Step 1.2.6: Install Development Dependencies

**Action:** Install TypeScript and type definitions

```bash
cd job-find/backend

# TypeScript
npm install -D typescript@^5.3.3
npm install -D @types/node@^20.11.0
npm install -D @types/bcrypt@^5.0.2
npm install -D @types/uuid@^9.0.8

# Prisma CLI
npm install -D prisma@^5.10.0

# Development tools
npm install -D tsx@^4.7.0
npm install -D vitest@^1.2.0
```

---

### Step 1.2.7: Create TypeScript Configuration

**Action:** Create `tsconfig.json` for backend with proper paths and settings

```bash
cd job-find/backend
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

**Files Created:** `backend/tsconfig.json`

---

### Step 1.2.8: Create Environment Example File

**Action:** Create `.env.example` with all required environment variables

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

# OAuth Providers (fill in your credentials)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
LINKEDIN_CLIENT_ID=""
LINKEDIN_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# OAuth Callback URL
OAUTH_CALLBACK_URL="http://localhost:3001/api/auth/oauth"

# Server
PORT=3001
NODE_ENV="development"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"
EOF
```

**Files Created:** `backend/.env.example`

---

### Step 1.2.9: Copy .env.example to .env

**Action:** Create actual .env file for development

```bash
cd job-find/backend
cp .env.example .env
```

---

### Step 1.2.10: Create Prisma Schema File (Placeholder)

**Action:** Create empty Prisma schema file - will be completed in module 1.4

```bash
cd job-find/backend
cat > src/infrastructure/db/prisma/schema.prisma << 'EOF'
// Prisma schema will be configured in Module 1.4
// This is a placeholder to prevent build errors
EOF
```

---

### Step 1.2.11: Update package.json with Installed Dependencies

**Action:** Now that all packages are installed, update package.json with actual dependencies

```bash
cd job-find/backend
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
    "db:studio": "prisma studio",
    "test": "vitest"
  },
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
EOF
```

---

### Step 1.2.12: Install Root Dependencies

**Action:** Go back to root and install the concurrently devDependency

```bash
cd job-find
npm install
```

---

## Verification Steps

After completion, verify:

```bash
# Check backend directory
cd job-find/backend
ls -la

# Verify package.json
cat package.json

# Verify node_modules exists
ls node_modules | head -20

# Verify tsconfig.json
cat tsconfig.json
```

---

## Expected Result

```
backend/
├── package.json (with all dependencies)
├── tsconfig.json
├── .env.example
├── .env
├── node_modules/
└── src/
    └── infrastructure/
        └── db/
            └── prisma/
                └── schema.prisma (placeholder)
```

---

## Notes

- All packages installed via npm commands as requested
- Prisma schema is placeholder only (fully configured in Module 1.4)
- This module focuses on getting the backend runtime ready
- No actual server code created yet (that's in Module 1.5 + Phase 2)

---

## Next Steps After Module 1.2

- Module 1.3: Frontend Setup (Next.js + dependencies)
- Module 1.4: Database Setup (PostgreSQL + pgvector + Prisma schema)

---

## Ready to Proceed?

If this plan looks good, say "approve" and I will implement module 1.2.

If you want changes, tell me what to modify.