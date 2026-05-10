# Plan 2.3: Auth Module - Protected Routes & Refresh Tokens

## Overview
Implement refresh token functionality, token refresh endpoint, and ensure all protected routes properly validate both access and refresh tokens.

---

## Tasks

### 2.3.1 Refresh Token Storage
- [ ] Add `refreshTokenHash` field to User model in Prisma schema
- [ ] Create `refresh_tokens` table for token tracking
- [ ] Add migration for new tables/fields

### 2.3.2 Refresh Token Service
- [ ] `backend/src/modules/auth/refresh_token_service.ts`
  - Hash refresh tokens before storage (bcrypt)
  - Store token metadata (userId, expiresAt, createdAt)
  - Validate token existence and expiry
  - Revoke token on logout
  - Clean up expired tokens

### 2.3.3 Token Refresh Endpoint
- [ ] `POST /api/auth/refresh` — accepts refresh token, returns new access + refresh tokens
- [ ] Rotate refresh tokens (invalidate old, issue new)
- [ ] Update `auth_router.ts` and `auth_controller.ts`

### 2.3.4 Protected Route Middleware
- [ ] Ensure `/me`, `/logout`, `/account` all use proper JWT verification
- [ ] Add rate limiting to auth endpoints

### 2.3.5 Token Cleanup Worker
- [ ] Background job to clean expired refresh tokens
- [ ] Redis TTL-based automatic expiry (backup cleanup)

---

## Deliverables

| File | Purpose |
|------|---------|
| `refresh_token_service.ts` | Refresh token CRUD operations |
| `auth_router.ts` (updated) | Refresh endpoint, protected routes |
| `auth_controller.ts` (updated) | Refresh handler |
| `prisma/schema.prisma` (updated) | refresh_tokens table |

---

## Refresh Token Flow

1. User logs in → receives `accessToken` (15m) + `refreshToken` (7d)
2. Access token expires → frontend calls `POST /auth/refresh`
3. Backend validates refresh token, issues new pair
4. Old refresh token invalidated (rotation)
5. Refresh token expires → user must re-login

---

## Security Notes
- Refresh tokens hashed in database (like passwords)
- Token rotation on every refresh (prevents replay attacks)
- One-time use: each refresh token can only be used once
- Short-lived access tokens minimize window of compromise
- Redis TTL auto-expires verification cache entries