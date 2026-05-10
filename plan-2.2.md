# Plan 2.2: Auth Module - OAuth Strategies (PKCE Protected)

## Overview
Implement OAuth 2.0 authentication with PKCE (Proof Key for Code Exchange) for Google, LinkedIn, and GitHub. PKCE provides additional security without requiring client secrets in the browser.

---

## Tasks

### 2.2.1 OAuth DTOs
- [ ] `backend/src/modules/auth/dto/oauth-callback.dto.ts` — validate OAuth callback params (code, state)
- [ ] `backend/src/modules/auth/dto/oauth-redirect.dto.ts` — OAuth redirect response

### 2.2.2 PKCE Utility
- [ ] `backend/src/modules/auth/utils/pkce.ts` — generate code verifier, create code challenge (SHA256 + base64url)

### 2.2.3 OAuth Strategies (PKCE-based)
- [ ] `backend/src/modules/auth/strategies/google.strategy.ts` — Google OAuth2 with PKCE
- [ ] `backend/src/modules/auth/strategies/linkedin.strategy.ts` — LinkedIn OAuth2 with PKCE
- [ ] `backend/src/modules/auth/strategies/github.strategy.ts` — GitHub OAuth2 with PKCE

### 2.2.4 OAuth Service
- [ ] `backend/src/modules/auth/oauth_service.ts` — unified OAuth service handling all providers

### 2.2.5 OAuth Router Integration
- [ ] Add OAuth redirect routes to `auth_router.ts`:
  - `GET /auth/oauth/:provider` — initiate OAuth flow (returns redirect URL to frontend)
  - `GET /auth/oauth/:provider/callback` — handle OAuth callback, exchange code for tokens

### 2.2.6 Environment Variables
- [ ] Add OAuth env vars to `backend/.env.example`:
  ```
  # Google OAuth
  GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
  GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/oauth/google/callback

  # LinkedIn OAuth
  LINKEDIN_CLIENT_ID=your-linkedin-client-id
  LINKEDIN_REDIRECT_URI=http://localhost:3000/api/auth/oauth/linkedin/callback

  # GitHub OAuth
  GITHUB_CLIENT_ID=your-github-client-id
  GITHUB_REDIRECT_URI=http://localhost:3000/api/auth/oauth/github/callback

  # Base OAuth redirect (used by frontend after OAuth completes)
  OAUTH_REDIRECT_URI=http://localhost:3000/auth/callback
  ```

### 2.2.7 User Instructions: Create OAuth Credentials
#### Google OAuth Setup
1. Go to https://console.cloud.google.com/
2. Create new project (or select existing)
3. Enable "Google+ API" or search "OAuth" → "OAuth consent screen"
4. Configure OAuth consent screen:
   - User Type: External
   - App name: JobFind
   - Support email: your-email
   - Developer contact: your-email
5. Add Scopes: `openid`, `profile`, `email`
6. Add Test users (for internal testing)
7. Go to "Credentials" tab → "Create Credentials" → "OAuth client ID"
8. Application type: "Web application"
9. Add Authorized redirect URI: `http://localhost:3000/api/auth/oauth/google/callback`
10. Copy "Client ID" and "Client Secret"

#### LinkedIn OAuth Setup
1. Go to https://www.linkedin.com/developers/
2. Click "Create App"
3. Fill: App name: JobFind, LinkedIn Page: (create one), Privacy policy URL, Business email
4. Under "Auth" tab:
   - Add Redirect URL: `http://localhost:3000/api/auth/oauth/linkedin/callback`
5. Under "Products" tab: add "Sign In with LinkedIn"
6. Copy Client ID and Client Secret from "Keys" section

#### GitHub OAuth Setup
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill:
   - Application name: JobFind
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: `http://localhost:3000/api/auth/oauth/github/callback`
4. Click "Register application"
5. Copy Client ID
6. Generate new Client Secret

### 2.2.8 Documentation
- [ ] Document OAuth setup in `DEVELOPMENT.md`

---

## Deliverables

| File | Purpose |
|------|---------|
| `dto/oauth-callback.dto.ts` | Callback param validation |
| `dto/oauth-redirect.dto.ts` | Redirect response type |
| `utils/pkce.ts` | PKCE code verifier/challenge generator |
| `strategies/google.strategy.ts` | Google OAuth2 with PKCE |
| `strategies/linkedin.strategy.ts` | LinkedIn OAuth2 with PKCE |
| `strategies/github.strategy.ts` | GitHub OAuth2 with PKCE |
| `oauth_service.ts` | Unified OAuth handler |
| `auth_router.ts` (updated) | OAuth routes |
| `.env.example` (updated) | OAuth env vars |

---

## PKCE Flow (How it works)

1. **Frontend requests OAuth initiation**
   ```
   GET /api/auth/oauth/:provider
   ```
   Backend generates:
   - `code_verifier` (random 43-128 char string)
   - `code_challenge` = base64url(SHA256(code_verifier))
   - Store `code_verifier` in Redis with short TTL (5 min)

2. **Backend returns authorization URL** to frontend
   ```
   { redirectUrl: "https://provider.com/auth?client_id=...&code_challenge=..." }
   ```

3. **Frontend redirects user to provider** → User logs in and authorizes

4. **Provider redirects to callback** with `?code=xxx&state=yyy`

5. **Backend exchanges code for tokens** using `code_verifier` (proves it initiated the request)

6. **Backend returns JWT tokens** to frontend

---

## Security Notes
- No client_secret needed with PKCE (client secrets are for server-side apps)
- `code_verifier` stored in Redis prevents CSRF
- State parameter prevents CSRF (generated per OAuth initiation)
- Short TTL on code_verifier (5 minutes)
- OAuth tokens exchanged on backend, never exposed to browser directly