# Plan 3.2: Frontend Auth Store & Dashboard Layout

## Overview

Implement Zustand-based state management for auth and create a beautiful, professional dashboard layout with sidebar navigation and header.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Components/Pages                                           │
│  (React Components - use Zustand store)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Auth Store (Zustand)                                       │
│  - user state, isAuthenticated, isLoading                   │
│  - login, register, logout actions                          │
│  - Persisted to localStorage                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Services                                                   │
│  (auth.service.ts - API calls only)                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Auth Store (Zustand)

### 3.2.1 Install Zustand ✅

```bash
cd frontend && npm install zustand
```

### 3.2.2 Create Auth Store (`stores/auth_store.ts`) ✅

- [x] Created `frontend/src/stores/auth_store.ts`
- [x] Store structure:
  ```typescript
  interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
  ```
- [x] Actions: `login`, `register`, `logout`, `setUser`, `setLoading`, `setError`, `clearError`, `checkAuth`
- [x] Persist tokens to localStorage via tokenService

### 3.2.3 Update useAuth Hook (`hooks/useAuth.ts`) ✅

- [x] Updated to use Zustand store
- [x] Provides login, register, logout functions
- [x] Returns user, isLoading, isAuthenticated, error state
- [x] Handles router navigation on success/logout

### 3.2.4 TypeScript Types (`types/auth.ts`) ✅

- [x] Already defined `User` interface with all fields
- [x] Exports for use across app

---

## Phase 2: Dashboard Layout

### 3.2.5 Dashboard Structure ✅

```
frontend/src/app/(dashboard)/
├── layout.tsx          # Dashboard shell with sidebar + header ✅
├── page.tsx           # Dashboard home ✅
├── jobs/              # Job search page ✅
├── matches/           # My matches page ✅
├── preparation/       # Interview prep page ✅
└── settings/          # User settings page ✅
```

### 3.2.6 Sidebar Component (`components/dashboard/Sidebar.tsx`) ✅

**Design:**

- Fixed left sidebar, 240px wide ✅
- Dark primary color background (`#0A2540`) ✅
- Logo at top ✅
- Navigation items with icons ✅
- Active state with secondary color accent ✅
- Hover effects with subtle background change ✅
- User profile mini at bottom with logout ✅

**Navigation Items:**

- Dashboard (Home icon) ✅
- Jobs (Briefcase icon) ✅
- Matches (Heart icon) ✅
- Preparation (BookOpen icon) ✅
- Settings (Settings icon) ✅

### 3.2.7 Header Component (`components/dashboard/Header.tsx`) ✅

**Design:**

- Fixed top, full width minus sidebar ✅
- White background with subtle bottom border ✅
- Left: Page title ✅
- Right: Search input (small), notifications bell, user avatar ✅

### 3.2.8 Dashboard Shell (`components/dashboard/DashboardShell.tsx`) ✅

- [x] Combines Sidebar + Header + main content area
- [x] Main content area with proper padding
- [x] Smooth transitions between pages

### 3.2.9 Dashboard Home Page (`app/(dashboard)/page.tsx`) ✅

**Design:**

- Welcome section with user name ✅
- Quick stats cards (Jobs Matched, Applications, etc.) ✅
- Recent activity section ✅
- Quick actions (Upload Resume, Search Jobs) ✅

### 3.2.10 Protected Route Wrapper ✅

- [x] Created `components/auth/ProtectedRoute.tsx`
- [x] Redirect to /login if not authenticated
- [x] Show loading spinner while checking auth

---

## Phase 3: Dashboard Pages (Stubs)

### 3.2.11 Jobs Page (`app/(dashboard)/jobs/page.tsx`) ✅

- [x] Job search interface (stub)
- [x] Search input + filters

### 3.2.12 Matches Page (`app/(dashboard)/matches/page.tsx`) ✅

- [x] Matched jobs list (stub)
- [x] Card layout

### 3.2.13 Preparation Page (`app/(dashboard)/preparation/page.tsx`) ✅

- [x] Interview prep materials (stub)
- [x] List view

### 3.2.14 Settings Page (`app/(dashboard)/settings/page.tsx`) ✅

- [x] User settings (stub)
- [x] Profile section

---

## Design Tokens (Dashboard)

```css
/* Sidebar */
--sidebar-bg: #0a2540
--sidebar-text: #ffffff
--sidebar-text-muted: rgba(255, 255, 255, 0.6)
--sidebar-hover: rgba(255, 255, 255, 0.1)
--sidebar-active: #00d4aa

/* Header */
--header-bg: #ffffff
--header-border: #e2e8f0
--header-height: 64px

/* Cards */
--card-radius: 12px
--card-shadow: 0 1px 3px rgba(0, 0, 0, 0.1)

/* Typography */
--heading-font: Inter 600
--body-font: Inter 400/500
```

---

## Component File Structure

```
frontend/src/
├── stores/
│   └── auth_store.ts          # Zustand auth store ✅
├── types/
│   └── auth.ts                # Auth types ✅
├── hooks/
│   └── useAuth.ts             # Updated to use store ✅
├── components/
│   ├── dashboard/
│   │   ├── Sidebar.tsx        # ✅
│   │   ├── Header.tsx          # ✅
│   │   ├── DashboardShell.tsx # ✅
│   │   └── StatCard.tsx       # ✅
│   └── auth/
│       └── ProtectedRoute.tsx # ✅
└── app/
    └── (dashboard)/
        ├── layout.tsx         # ✅
        ├── page.tsx           # ✅
        ├── jobs/              # ✅
        ├── matches/           # ✅
        ├── preparation/       # ✅
        └── settings/          # ✅
```

---

## Next Steps After 3.2

- **3.3**: Jobs API integration & full functionality
- **3.4**: Matches API integration
- **3.5**: Matching API integration