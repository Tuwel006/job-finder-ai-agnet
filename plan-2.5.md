# Plan 2.5: Health Check Verification & Route Structure

## Overview
Verify all health check endpoints work correctly and ensure proper routing structure is in place for all API modules.

---

## Tasks

### 2.5.1 Health Endpoint Verification
- [ ] `GET /health` - Returns overall status with DB/Redis checks
- [ ] `GET /health/live` - Kubernetes liveness probe
- [ ] `GET /health/ready` - Kubernetes readiness probe
- [ ] Verify all return proper JSON structure

### 2.5.2 Auth Routes Verification
- [ ] `POST /api/auth/register` - User registration
- [ ] `POST /api/auth/login` - User login
- [ ] `POST /api/auth/refresh` - Token refresh
- [ ] `GET /api/auth/me` - Get current user (protected)
- [ ] `POST /api/auth/logout` - Logout
- [ ] `DELETE /api/auth/account` - Delete account (protected)

### 2.5.3 OAuth Routes Verification
- [ ] `GET /api/auth/oauth/google` - Initiate Google OAuth
- [ ] `GET /api/auth/oauth/linkedin` - Initiate LinkedIn OAuth
- [ ] `GET /api/auth/oauth/github` - Initiate GitHub OAuth
- [ ] `GET /api/auth/oauth/:provider/callback` - OAuth callback

### 2.5.4 Future Routes (Placeholder Verification)
- [ ] `/api/jobs` - Jobs module (placeholder routes)
- [ ] `/api/resume` - Resume module (placeholder routes)
- [ ] `/api/matching` - Matching module (placeholder routes)
- [ ] `/api/preparation` - Preparation module (placeholder routes)

---

## Deliverables

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/health` | GET | Overall health with DB/Redis | ✅ |
| `/health/live` | GET | Liveness probe | ✅ |
| `/health/ready` | GET | Readiness probe | ✅ |
| `/api/auth/*` | various | Auth endpoints | ✅ |
| `/api/jobs` | - | Placeholder ready | ❌ |
| `/api/resume` | - | Placeholder ready | ❌ |
| `/api/matching` | - | Placeholder ready | ❌ |
| `/api/preparation` | - | Placeholder ready | ❌ |

---

## Health Check Response Format

```json
{
  "status": "ok",
  "timestamp": "2026-05-13T12:00:00.000Z",
  "version": "1.0.0",
  "services": {
    "database": "ok",
    "redis": "ok"
  }
}
```

---

## Next Steps After 2.5

Once 2.5 verification is complete, proceed to:
- **Phase 3**: Frontend Foundation
  - **3.1** Frontend Auth Pages (Login, Register with forms)
  - **3.2** Frontend Auth Store (Zustand state management)
  - **3.3** Dashboard Layout (Sidebar, Header, Navigation)
  - **3.4** Dashboard Pages
  - **3.5** API Client setup