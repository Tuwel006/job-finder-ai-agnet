# Module 1.4: Database Setup - Detailed Plan

## Overview
Set up PostgreSQL with pgvector extension, Redis, and create the complete Prisma schema with all tables, indexes, and relationships.

## Prerequisites
- Docker installed and running
- Docker Compose available

## Deliverables
- Docker containers for PostgreSQL + pgvector and Redis
- PostgreSQL database with pgvector extension enabled
- Redis running
- Complete Prisma schema with all tables
- Prisma migrations generated

---

## Step-by-Step Implementation

### Step 1.4.1: Check Docker Installation

**Action:** Verify Docker and Docker Compose are available

```bash
docker --version
docker compose version
```

If Docker is NOT installed, follow Step 1.4.2. If already installed, skip to Step 1.4.3.

---

### Step 1.4.2: Install Docker (Ubuntu/Debian)

**Action:** Install Docker Engine if not present

```bash
# Update package index
sudo apt update

# Install prerequisites
sudo apt install -y ca-certificates curl gnupg lsb-release

# Add Docker GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add current user to docker group (avoid sudo for docker commands)
sudo usermod -aG docker $USER
newgrp docker

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Verify installation
docker --version
docker compose version
```

**Note:** If you see "permission denied" errors, log out and log back in, or run `newgrp docker`.

---

### Step 1.4.3: Create Docker Compose File

**Action:** Create `docker-compose.yml` at project root for PostgreSQL + Redis

```bash
cd job-find
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: jobfind-postgres
    environment:
      POSTGRES_USER: jobfind
      POSTGRES_PASSWORD: jobfindpass
      POSTGRES_DB: jobfind
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U jobfind"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: jobfind-redis
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  pgdata:
    driver: local
EOF
```

---

### Step 1.4.4: Start Docker Containers

**Action:** Start PostgreSQL and Redis using Docker Compose

```bash
cd job-find

# Stop any existing containers with same names
docker stop jobfind-postgres 2>/dev/null || true
docker rm jobfind-postgres 2>/dev/null || true
docker stop jobfind-redis 2>/dev/null || true
docker rm jobfind-redis 2>/dev/null || true

# Start containers
docker compose up -d

# Wait for containers to be healthy
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Check container status
docker compose ps
```

---

### Step 1.4.5: Enable pgvector Extension

**Action:** Enable pgvector extension in PostgreSQL

```bash
# Enable pgvector extension
docker exec jobfind-postgres psql -U jobfind -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Verify pgvector is installed
docker exec jobfind-postgres psql -U jobfind -c "SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';"
```

---

### Step 1.4.6: Verify Docker Containers are Running

**Action:** Verify both containers are healthy

```bash
docker ps --filter "name=jobfind-postgres" --filter "name=jobfind-redis"
```

Expected output should show both containers with "Up" status and healthy indicator.

---

### Step 1.4.7: Create Complete Prisma Schema

**Action:** Create the full Prisma schema with all tables from SPEC.md

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

// ============================================
// USER MANAGEMENT
// ============================================

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String?
  name         String?
  avatarUrl    String?
  provider     String    @default("email")  // 'email', 'google', 'linkedin', 'github'
  providerId   String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  isActive     Boolean   @default(true)
  settings     Json      @default("{}")

  resumeProfiles       ResumeProfile[]
  jobSearches          JobSearch[]
  matches              Match[]
  preparationMaterials PreparationMaterial[]

  @@unique([provider, providerId])
  @@index([email])
}

// ============================================
// RESUME PROFILES (User-controlled persistence)
// ============================================

model ResumeProfile {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  parsedJson  Json      // Structured metadata: skills[], experience[], projects[], education[], keywords[]
  embedding   Unsupported("vector(1536)")?
  resumeScore Float?
  createdAt   DateTime  @default(now())
  deletedAt   DateTime? // NULL means active, user controls deletion

  matches Match[]

  @@index([userId])
  @@index([deletedAt])
}

// ============================================
// JOB LISTINGS
// ============================================

model Job {
  id          String    @id @default(uuid())
  externalId  String    // External ID from source
  source      String    // 'google', 'linkedin', 'indeed', 'wellfound'
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
  @@index([isExpired])
}

// ============================================
// JOB SEARCHES
// ============================================

model JobSearch {
  id               String   @id @default(uuid())
  userId           String
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  queryText        String
  generatedQueries String[] // Platform-specific queries
  filters          Json?    // { location?, remote?, salaryMin?, etc }
  resultsCount     Int?
  createdAt        DateTime @default(now())

  jobId String?
  job   Job?    @relation(fields: [jobId], references: [id])

  @@index([userId])
  @@index([createdAt])
}

// ============================================
// MATCHES (User-Job matching)
// ============================================

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
  @@index([resumeProfileId])
  @@index([similarityScore])
  @@index([isSaved])
  @@index([isApplied])
}

// ============================================
// PREPARATION MATERIALS
// ============================================

model PreparationMaterial {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  jobId     String
  job       Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  type      String   // 'questions', 'tips', 'company', 'resume_tailoring'
  content   Json     // { questions?: string[], tips?: string[], companyInfo?: {}, tailoredResume?: {} }
  createdAt DateTime @default(now())

  @@unique([userId, jobId, type])
  @@index([userId])
  @@index([jobId])
  @@index([type])
}
EOF
```

---

### Step 1.4.8: Update .env with Database URLs

**Action:** Update backend .env with correct database URLs for Docker

```bash
cd job-find/backend
cat > .env << 'EOF'
# Database - Docker PostgreSQL
DATABASE_URL="postgresql://jobfind:jobfindpass@localhost:5432/jobfind?schema=public"

# Redis - Docker Redis
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

---

### Step 1.4.9: Generate Prisma Client

**Action:** Generate Prisma client from schema

```bash
cd job-find/backend
npx prisma generate
```

---

### Step 1.4.10: Push Schema to Database

**Action:** Create tables in PostgreSQL using prisma db push

```bash
cd job-find/backend
npx prisma db push
```

---

### Step 1.4.11: Verify Database Tables

**Action:** Verify all tables were created

```bash
# List all tables
docker exec jobfind-postgres psql -U jobfind -c "\dt"

# Verify pgvector extension
docker exec jobfind-postgres psql -U jobfind -c "SELECT extname FROM pg_extension WHERE extname = 'vector';"
```

---

### Step 1.4.12: Create Redis Client File

**Action:** Create Redis client file for later use

```bash
cd job-find/backend
cat > src/infrastructure/db/redis/redis_client.ts << 'EOF'
import Redis from 'ioredis'
import config from '../../../core/base/config.js'

export const redis = new Redis(config.redis.url)

redis.on('error', (err) => {
  console.error('Redis connection error:', err)
})

redis.on('connect', () => {
  console.log('Redis connected')
})

export default redis
EOF
```

---

### Step 1.4.13: Create Docker Management Scripts

**Action:** Create convenience scripts for managing Docker containers

```bash
cd job-find

# Create start script
cat > start-docker.sh << 'EOF'
#!/bin/bash
echo "Starting JobFind Docker containers..."
docker compose up -d
echo "Waiting for services to be healthy..."
sleep 5
docker compose ps
echo "Services started!"
echo ""
echo "PostgreSQL: localhost:5432"
echo "Redis: localhost:6379"
EOF

# Create stop script
cat > stop-docker.sh << 'EOF'
#!/bin/bash
echo "Stopping JobFind Docker containers..."
docker compose down
echo "Services stopped!"
EOF

# Create status script
cat > docker-status.sh << 'EOF'
#!/bin/bash
echo "JobFind Docker Status:"
echo ""
docker compose ps
echo ""
echo "PostgreSQL:"
docker exec jobfind-postgres psql -U jobfind -c "SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';" 2>/dev/null || echo "  Not running"
echo ""
echo "Redis:"
docker exec jobfind-redis redis-cli ping 2>/dev/null || echo "  Not running"
EOF

# Make scripts executable
chmod +x start-docker.sh stop-docker.sh docker-status.sh
```

---

## Docker Commands Reference

```bash
# Start containers
./start-docker.sh
# or
docker compose up -d

# Stop containers
./stop-docker.sh
# or
docker compose down

# Check status
./docker-status.sh
# or
docker compose ps

# View logs
docker compose logs -f postgres
docker compose logs -f redis

# Connect to PostgreSQL
docker exec -it jobfind-postgres psql -U jobfind

# Connect to Redis CLI
docker exec -it jobfind-redis redis-cli
```

---

## Verification Steps

```bash
# 1. Verify Docker is running
docker --version

# 2. Verify containers are up
docker ps --filter "name=jobfind"

# 3. Verify PostgreSQL tables
docker exec jobfind-postgres psql -U jobfind -c "\dt"

# 4. Verify pgvector
docker exec jobfind-postgres psql -U jobfind -c "SELECT extname FROM pg_extension;"

# 5. Verify Prisma client generated
cd job-find/backend
ls node_modules/.prisma/client/
```

---

## Expected Result

```
Docker Containers:
- jobfind-postgres (postgres:15) - Running on port 5432
- jobfind-redis (redis:7-alpine) - Running on port 6379

Database Tables:
- User
- ResumeProfile
- Job
- JobSearch
- Match
- PreparationMaterial

Extensions:
- vector (pgvector)

Scripts:
- start-docker.sh
- stop-docker.sh
- docker-status.sh
```

---

## Notes

- Docker is required for PostgreSQL with pgvector and Redis
- pgvector extension enables 1536-dimensional vector storage for embeddings (OpenAI ada-002)
- Physical resume files are NEVER stored - only parsed JSON and embeddings
- User-controlled deletion via deletedAt field (soft delete)
- Job listings have expiration from external sources
- All timestamps use PostgreSQL defaults
- restart: unless-stopped ensures containers restart after reboot

---

## Ready to Proceed?

If this plan looks good, say "approve" and I will implement module 1.4.

If you want changes, tell me what to modify.