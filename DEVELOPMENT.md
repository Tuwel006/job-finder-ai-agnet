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

## OAuth Setup (PKCE)

The app supports OAuth login via Google, LinkedIn, and GitHub using PKCE (Proof Key for Code Exchange) - no client secrets required.

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Go to "APIs & Services" → "OAuth consent screen"
4. Configure:
   - User Type: External
   - App name: JobFind
   - Support email: your-email
   - Developer contact: your-email
5. Add Scopes: `openid`, `profile`, `email`
6. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
7. Application type: Web application
8. Add Authorized redirect URI: `http://localhost:3001/api/auth/oauth/google/callback`
9. Copy Client ID to `GOOGLE_CLIENT_ID` in `.env`

### LinkedIn OAuth

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Click "Create App"
3. Fill: App name: JobFind, LinkedIn Page: (create one if needed), Privacy policy URL, Business email
4. Under "Auth" tab:
   - Add Redirect URL: `http://localhost:3001/api/auth/oauth/linkedin/callback`
5. Under "Products" tab: add "Sign In with LinkedIn"
6. Copy Client ID to `LINKEDIN_CLIENT_ID` in `.env`

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill:
   - Application name: JobFind
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: `http://localhost:3001/api/auth/oauth/github/callback`
4. Click "Register application"
5. Copy Client ID to `GITHUB_CLIENT_ID` in `.env`

### Testing OAuth

```bash
# Start the server
npm run dev

# Initiate OAuth flow (returns redirect URL)
curl http://localhost:3001/api/auth/oauth/google

# Response:
# { "redirectUrl": "https://accounts.google.com/o/oauth2/v2/auth?...", "state": "..." }

# Visit the redirectUrl in browser to complete OAuth
```

## Using Make

Run `make help` to see all available commands:

```bash
make help         # Show all commands
make db:start     # Start database containers
make dev          # Start dev servers
make build        # Build for production
```