# Development Guide

## Quick Start

### 1. Start Database Containers
```bash
./start-docker.sh
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Servers
```bash
npm run dev
```

This starts:
- Backend API: http://localhost:3001
- Frontend: http://localhost:3000

## Common Commands

### Database Management
```bash
./start-docker.sh   # Start PostgreSQL and Redis
./stop-docker.sh   # Stop containers
./docker-status.sh  # Check status
```

### Backend
```bash
cd backend
npm run dev         # Start with hot reload
npm run build       # Build for production
npx prisma studio    # Open Prisma admin
npx prisma db push   # Push schema changes
```

### Frontend
```bash
cd frontend
npm run dev         # Start with hot reload
npm run build      # Build for production
npm run lint       # Lint code
```

## Environment Variables

### Backend
Copy `.env.example` to `.env` and update values:
```bash
cd backend
cp .env.example .env
```

### Frontend
The frontend `.env.local` is already configured for local development.

## Docker

The project uses Docker for PostgreSQL (with pgvector) and Redis.

### Ports
- PostgreSQL: 5433 (mapped from container 5432)
- Redis: 6379
- Backend API: 3001
- Frontend: 3000

Note: If port 5432 is already in use on your system, PostgreSQL will use 5433 instead. Update `DATABASE_URL` accordingly.

## Using Make

Run `make help` to see all available commands:

```bash
make help         # Show all commands
make db:start     # Start database containers
make dev          # Start dev servers
make build        # Build for production
```