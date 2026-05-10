# Module 1.1: Project Scaffolding - Detailed Plan

## Overview
Create the initial project structure with npm workspaces, backend and frontend directories, and basic package.json files.

## Deliverables
- Root `package.json` with npm workspaces
- Backend directory structure
- Frontend directory structure
- Basic .gitignore files
- No dependencies installed yet (that's in 1.2 and 1.3)

---

## Step-by-Step Implementation

### Step 1.1.1: Create Project Root Directory

**Action:** Create the main project directory if it doesn't exist

```bash
mkdir -p job-find
cd job-find
```

**Expected Result:** `job-find/` directory exists

---

### Step 1.1.2: Create Root package.json with Workspaces

**Action:** Create `job-find/package.json` with npm workspaces configuration

```bash
cd job-find
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
```

**Files Modified/Created:**
- `job-find/package.json`

---

### Step 1.1.3: Create Backend Directory Structure

**Action:** Create all backend directories as specified in PLANS.md

```bash
cd job-find
mkdir -p backend/src/core/interfaces
mkdir -p backend/src/core/abstractions
mkdir -p backend/src/core/base
mkdir -p backend/src/core/events
mkdir -p backend/src/core/shared
mkdir -p backend/src/modules/auth/dto
mkdir -p backend/src/modules/auth/strategies
mkdir -p backend/src/modules/resume/dto
mkdir -p backend/src/modules/jobs/dto
mkdir -p backend/src/modules/matching/dto
mkdir -p backend/src/modules/preparation/dto
mkdir -p backend/src/modules/analytics
mkdir -p backend/src/infrastructure/db/prisma
mkdir -p backend/src/infrastructure/db/redis
mkdir -p backend/src/infrastructure/queues/bullmq/workers
mkdir -p backend/src/infrastructure/websocket
mkdir -p backend/src/infrastructure/storage
mkdir -p backend/src/plugins/providers/google
mkdir -p backend/src/plugins/providers/linkedin
mkdir -p backend/src/plugins/providers/indeed
mkdir -p backend/src/plugins/providers/wellfound
mkdir -p backend/src/plugins/browser/playwright
mkdir -p backend/src/plugins/browser/mcp
mkdir -p backend/src/app/middleware
```

**Expected Directory Structure:**
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
│   │   │   ├── dto/
│   │   │   └── strategies/
│   │   ├── resume/dto/
│   │   ├── jobs/dto/
│   │   ├── matching/dto/
│   │   ├── preparation/dto/
│   │   └── analytics/
│   ├── infrastructure/
│   │   ├── db/
│   │   │   ├── prisma/
│   │   │   └── redis/
│   │   ├── queues/bullmq/workers/
│   │   ├── websocket/
│   │   └── storage/
│   ├── plugins/
│   │   ├── providers/
│   │   │   ├── google/
│   │   │   ├── linkedin/
│   │   │   ├── indeed/
│   │   │   └── wellfound/
│   │   └── browser/
│   │       ├── playwright/
│   │       └── mcp/
│   └── app/middleware/
└── (empty package.json - filled in module 1.2)
```

---

### Step 1.1.4: Create Frontend Directory Structure

**Action:** Create all frontend directories as specified in PLANS.md

```bash
cd job-find
mkdir -p frontend/src/app/\(auth\)/login
mkdir -p frontend/src/app/\(auth\)/register
mkdir -p frontend/src/app/\(dashboard\)/dashboard
mkdir -p frontend/src/app/\(dashboard\)/jobs
mkdir -p frontend/src/app/\(dashboard\)/matches
mkdir -p frontend/src/app/\(dashboard\)/preparation
mkdir -p frontend/src/app/\(dashboard\)/settings
mkdir -p frontend/src/components/ui
mkdir -p frontend/src/components/auth
mkdir -p frontend/src/components/jobs
mkdir -p frontend/src/components/resume
mkdir -p frontend/src/components/matching
mkdir -p frontend/src/components/shared
mkdir -p frontend/src/hooks
mkdir -p frontend/src/lib
mkdir -p frontend/src/stores
mkdir -p frontend/src/types
```

**Expected Directory Structure:**
```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── jobs/
│   │   │   ├── matches/
│   │   │   ├── preparation/
│   │   │   └── settings/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── auth/
│   │   ├── jobs/
│   │   ├── resume/
│   │   ├── matching/
│   │   └── shared/
│   ├── hooks/
│   ├── lib/
│   ├── stores/
│   └── types/
└── (empty package.json - filled in module 1.3)
```

---

### Step 1.1.5: Create .gitignore Files

**Action:** Create `.gitignore` for root, backend, and frontend

**Root .gitignore:**
```bash
cd job-find
cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Build outputs
dist/
.next/

# Environment files
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Testing
coverage/

# Misc
*.tgz
.cache/
EOF
```

**Backend .gitignore:**
```bash
cd job-find/backend
cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Build
dist/

# Environment
.env

# Logs
*.log

# IDE
.idea/

# Misc
*.local
EOF
```

**Frontend .gitignore:**
```bash
cd job-find/frontend
cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Next.js
.next/
out/

# Build
build/
dist/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.idea/

# Misc
.DS_Store
*.pem
EOF
```

---

### Step 1.1.6: Create Placeholder README Files

**Action:** Create placeholder README.md files for documentation

```bash
cd job-find
cat > README.md << 'EOF'
# JobFind

AI-powered job search platform with privacy-first approach.

## Project Structure

- `/backend` - Fastify API Gateway
- `/frontend` - Next.js Frontend

## Quick Start

See PLAN.md for module breakdown and implementation order.

## Documentation

- [SPEC.md](./SPEC.md) - Project specification
- [PLAN.md](./PLAN.md) - Module task list
- [plan.md](./plan.md) - Detailed implementation plans
EOF
```

---

## Verification Steps

After completion, verify:

1. Directory structure matches expected
2. Root package.json has correct workspaces configuration
3. All .gitignore files are in place

```bash
cd job-find
find . -type d | head -60
cat package.json
```

---

## Notes

- **No dependencies installed yet** - That's in modules 1.2 (backend) and 1.3 (frontend)
- **No code files created** - Only directory structure and config files
- **Python AI layer** is not part of this module - it comes in Phase 4

---

## Ready to Proceed?

If this plan looks good, say "approve" and I will implement module 1.1.

If you want changes, tell me what to modify.