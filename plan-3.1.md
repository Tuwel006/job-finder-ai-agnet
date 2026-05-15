# Plan 3.1: Frontend UI Components & Auth Pages

## Overview
Build a reusable UI component library first, then create authentication pages using those components with professional layered architecture.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Components/Pages                                            │
│  (React Components - only call service functions)           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Services                                                   │
│  (Business logic + API calls - auth.service.ts)             │
│  - Functions that call API client methods                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  API Client (lib/api.ts)                                    │
│  (Generic HTTP methods: get, post, put, patch, delete)       │
│  - Base URL, interceptors, error handling                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: UI Component Library

### 3.1.1 Project Structure Setup
```
frontend/src/
├── components/
│   └── ui/                    # shadcn/ui style components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Label.tsx
│       ├── Card.tsx
│       ├── Checkbox.tsx
│       ├── Link.tsx
│       ├── Flex.tsx
│       ├── Text.tsx
│       ├── Container.tsx
│       ├── Skeleton.tsx
│       └── index.ts
├── app/
│   ├── (auth)/               # Auth route group
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── services/
│   └── auth.service.ts       # Auth API functions
├── lib/
│   ├── api.ts                # API client with generic methods
│   ├── utils.ts
│   └── validations/
│       └── auth.schema.ts
├── types/
│   └── auth.ts
└── hooks/
    └── useAuth.ts            # Auth hook using service
```

### 3.1.2 Design Tokens (CSS Variables)
- [ ] Add to `globals.css`:
  - Primary: `#0A2540`
  - Secondary: `#00D4AA`
  - Accent: `#635BFF`
  - Background: `#F8FAFC`
  - Surface: `#FFFFFF`
  - Text Primary: `#1E293B`
  - Text Secondary: `#64748B`
  - Error: `#DC2626`
  - Border radius: `8px` cards, `12px` modals

---

## Phase 2: API Client (lib/api.ts)

### 3.1.3 API Client
- [ ] Generic methods: `get`, `post`, `put`, `patch`, `delete`
- [ ] Base URL from env
- [ ] Request interceptor for auth token
- [ ] Response interceptor for error handling + token refresh

### 3.1.4 Auth Service (services/auth.service.ts)
- [ ] `login(email, password)` → calls `api.post('/auth/login', ...)`
- [ ] `register(data)` → calls `api.post('/auth/register', ...)`
- [ ] `refreshToken(token)` → calls `api.post('/auth/refresh', ...)`
- [ ] ` initiateOAuth(provider)` → calls `api.get('/auth/oauth/{provider}')`
- [ ] ` logout()` → calls `api.post('/auth/logout', ...)`
- [ ] Types for all request/response data

---

## Phase 3: Base UI Components

### 3.1.5 Button.tsx
- [ ] Variants: `primary`, `secondary`, `outline`, `ghost`, `link`
- [ ] Sizes: `sm`, `md`, `lg`
- [ ] States: default, hover, active, disabled, loading
- [ ] Props: `variant`, `size`, `disabled`, `loading`, `leftIcon`, `rightIcon`, `className`

### 3.1.6 Input.tsx
- [ ] Types: text, email, password, number
- [ ] States: default, focus, error, disabled
- [ ] Props: `label`, `error`, `placeholder`, `type`, `disabled`, `className`

### 3.1.7 Label.tsx
- [ ] Props: `htmlFor`, `children`, `required`

### 3.1.8 Card.tsx
- [ ] Props: `className`, `children`
- [ ] Surface background with rounded corners and shadow

### 3.1.9 Checkbox.tsx
- [ ] Props: `checked`, `onChange`, `label`, `disabled`

### 3.1.10 Link.tsx
- [ ] Variants: `primary`, `secondary`
- [ ] Uses Next.js Link component

### 3.1.11 Flex.tsx
- [ ] Wrapper for div with display: flex
- [ ] Props: `direction`, `justify`, `align`, `gap`, `wrap`, `className`

### 3.1.12 Text.tsx
- [ ] Variants: `h1`, `h2`, `h3`, `body`, `small`, `caption`
- [ ] Props: `variant`, `children`, `className`

### 3.1.13 Container.tsx
- [ ] Max-width wrapper centered on page
- [ ] Props: `size` (sm, md, lg, full), `className`

### 3.1.14 Skeleton.tsx
- [ ] Loading placeholder with pulse animation
- [ ] Props: `className`, `width`, `height`

### 3.1.15 ToasterProvider
- [ ] Create client component wrapping react-hot-toast
- [ ] Position: top-right
- [ ] Styled with design tokens

---

## Phase 4: Auth Pages

### 3.1.16 Auth Layout
- [ ] `frontend/src/app/(auth)/layout.tsx`
  - Centered card layout with brand header
  - Uses Container, Card, Text components

### 3.1.17 Login Page
- [ ] `frontend/src/app/(auth)/login/page.tsx`
- [ ] `frontend/src/components/auth/LoginForm.tsx`
  - Uses Input, Checkbox, Button, Link, Toast components
  - Email + password form with react-hook-form + zod validation
  - Calls `authService.login()` - NOT api.post directly

### 3.1.18 Register Page
- [ ] `frontend/src/app/(auth)/register/page.tsx`
- [ ] `frontend/src/components/auth/RegisterForm.tsx`
  - Uses Input, Button, Link, Toast components
  - Name + email + password + confirmPassword form
  - Calls `authService.register()` - NOT api.post directly

### 3.1.19 OAuth Buttons Component
- [ ] Google, LinkedIn, GitHub buttons
- [ ] Uses Flex, Button components with icon support
- [ ] Calls `authService.initiateOAuth()` - NOT api.get directly

### 3.1.20 useAuth Hook (hooks/useAuth.ts)
- [ ] `useLogin()` - returns login mutation function
- [ ] `useRegister()` - returns register mutation function
- [ ] `useLogout()` - returns logout function
- [ ] Token management in localStorage

---

## Design Tokens (from SPEC.md)

```css
/* Color Palette */
--primary: #0A2540
--secondary: #00D4AA
--accent: #635BFF
--background: #F8FAFC
--surface: #FFFFFF
--text-primary: #1E293B
--text-secondary: #64748B
--error: #DC2626

/* Border Radius */
--radius-sm: 4px
--radius-card: 8px
--radius-modal: 12px
--radius-pill: 24px
```

---

## API Endpoints (used by services)

| Endpoint | Method | Service Function | Purpose |
|----------|--------|-------------------|---------|
| `/api/auth/login` | POST | `authService.login()` | User login |
| `/api/auth/register` | POST | `authService.register()` | User registration |
| `/api/auth/refresh` | POST | `authService.refreshToken()` | Refresh access token |
| `/api/auth/oauth/:provider` | GET | `authService.initiateOAuth()` | Initiate OAuth flow |
| `/api/auth/logout` | POST | `authService.logout()` | User logout |

---

## Next Steps After 3.1

- **3.2**: Frontend Auth Store (Zustand state management) - integrates with auth service
- **3.3**: Dashboard Layout (Sidebar, Header, Navigation)
- **3.4**: Dashboard Pages
- **3.5**: API Client setup (completion)