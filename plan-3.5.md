# Plan 3.5: Dashboard API Integration

## Overview

The dashboard pages currently use mock data for UI demonstration. This plan outlines the integration of the frontend dashboard with actual backend API endpoints, enabling real data flow for Jobs, Matches, User Profile, and Preparation materials.

---

## 1. Backend API Structure

### 1.1 API Routes to Create

```
backend/src/modules/
├── jobs/
│   ├── jobs_controller.ts
│   ├── jobs_service.ts
│   ├── jobs_repository.ts
│   ├── dto/
│   │   ├── search-jobs.dto.ts
│   │   └── job-response.dto.ts
│   └── jobs_router.ts
├── matches/
│   ├── matches_controller.ts
│   ├── matches_service.ts
│   ├── matches_repository.ts
│   ├── dto/
│   │   └── match-response.dto.ts
│   └── matches_router.ts
├── resume/
│   ├── resume_controller.ts
│   ├── resume_service.ts
│   ├── resume_repository.ts
│   ├── dto/
│   └── resume_router.ts
└── preparation/
    ├── preparation_controller.ts
    ├── preparation_service.ts
    ├── preparation_repository.ts
    ├── dto/
    └── preparation_router.ts
```

### 1.2 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Search/list jobs with filters |
| GET | `/api/jobs/:id` | Get single job details |
| POST | `/api/jobs/:id/save` | Save job to user favorites |
| DELETE | `/api/jobs/:id/save` | Unsave job |
| GET | `/api/matches` | Get user's AI-curated matches |
| GET | `/api/matches/:id` | Get match details with score breakdown |
| GET | `/api/profile` | Get current user profile |
| PATCH | `/api/profile` | Update user profile |
| GET | `/api/resume` | Get user's resume data |
| POST | `/api/resume` | Upload/parse resume |
| GET | `/api/preparation` | Get prep materials for a job/match |
| GET | `/api/preparation/:id/questions` | Get interview questions |

---

## 2. Jobs API Module

### 2.1 Search Jobs DTO

```typescript
// dto/search-jobs.dto.ts
interface SearchJobsDto {
  query?: string;        // Search text
  location?: string;     // Location filter
  type?: string;         // full-time, part-time, contract
  remote?: boolean;      // Remote only
  salaryMin?: number;    // Minimum salary
  salaryMax?: number;    // Maximum salary
  page?: number;         // Pagination
  limit?: number;        // Results per page
}
```

### 2.2 Jobs Service

```typescript
// jobs_service.ts
interface JobsService {
  searchJobs(dto: SearchJobsDto): Promise<PaginatedResult<Job>>
  getJobById(id: string): Promise<Job>
  saveJob(userId: string, jobId: string): Promise<void>
  unsaveJob(userId: string, jobId: string): Promise<void>
  getSavedJobs(userId: string): Promise<Job[]>
}
```

### 2.3 Jobs Router

```
GET    /api/jobs              - Search jobs
GET    /api/jobs/saved        - Get user's saved jobs
GET    /api/jobs/:id          - Get job details
POST   /api/jobs/:id/save     - Save job
DELETE /api/jobs/:id/save      - Unsave job
```

---

## 3. Matches API Module

### 3.1 Match Response DTO

```typescript
// dto/match-response.dto.ts
interface MatchResponseDto {
  id: string
  jobId: string
  job: JobSummary
  score: number
  reasons: string[]           // Why it's a match
  missingSkills: string[]     // Gaps to address
  createdAt: Date
  status: 'new' | 'viewed' | 'applied' | 'dismissed'
}
```

### 3.2 Matches Service

```typescript
// matches_service.ts
interface MatchesService {
  getMatches(userId: string, page?: number, limit?: number): Promise<PaginatedResult<Match>>
  getMatchById(userId: string, matchId: string): Promise<MatchDetail>
  updateMatchStatus(userId: string, matchId: string, status: MatchStatus): Promise<void>
  dismissMatch(userId: string, matchId: string): Promise<void>
}
```

### 3.3 Matches Router

```
GET    /api/matches              - List user's matches
GET    /api/matches/:id          - Get match details
PATCH  /api/matches/:id          - Update match status
DELETE /api/matches/:id          - Dismiss match
```

---

## 4. Profile/Resume API Module

### 4.1 Profile Service

```typescript
// profile_service.ts
interface ProfileService {
  getProfile(userId: string): Promise<UserProfile>
  updateProfile(userId: string, data: UpdateProfileDto): Promise<UserProfile>
  getResume(userId: string): Promise<ResumeData | null>
  uploadResume(userId: string, file: Buffer): Promise<ResumeData>
  deleteResume(userId: string): Promise<void>
}
```

### 4.2 Profile Router

```
GET    /api/profile              - Get current user profile
PATCH  /api/profile              - Update profile
GET    /api/resume               - Get resume data
POST   /api/resume               - Upload and parse resume
DELETE /api/resume               - Delete user's resume
```

---

## 5. Preparation API Module

### 5.1 Preparation Service

```typescript
// preparation_service.ts
interface PreparationService {
  getPreparationMaterials(userId: string, matchId: string): Promise<PrepMaterials>
  getInterviewQuestions(userId: string, jobId: string): Promise<InterviewQuestion[]>
  markQuestionPracticed(userId: string, questionId: string): Promise<void>
}
```

### 5.2 Preparation Router

```
GET    /api/preparation/:matchId     - Get prep materials for a match
GET    /api/preparation/:matchId/questions  - Get interview questions
PATCH  /api/preparation/questions/:id  - Mark as practiced
```

---

## 6. Frontend Integration

### 6.1 Services to Create/Update

```
frontend/src/services/
├── jobs.service.ts       # GET /api/jobs, save/unsave
├── matches.service.ts    # GET /api/matches, update status
├── profile.service.ts    # GET/PATCH /api/profile
└── preparation.service.ts # GET /api/preparation
```

### 6.2 React Query Hooks

```typescript
// hooks/useJobs.ts
export function useJobs(filters: SearchFilters) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobsService.searchJobs(filters)
  })
}

export function useSavedJobs() {
  return useQuery({
    queryKey: ['jobs', 'saved'],
    queryFn: () => jobsService.getSavedJobs()
  })
}

// hooks/useMatches.ts
export function useMatches() {
  return useQuery({
    queryKey: ['matches'],
    queryFn: () => matchesService.getMatches()
  })
}

export function useMatch(matchId: string) {
  return useQuery({
    queryKey: ['matches', matchId],
    queryFn: () => matchesService.getMatchById(matchId)
  })
}
```

### 6.3 Update Dashboard Pages

**Jobs Page (`/dashboard/jobs`):**
- Replace mock data with `useJobs(filters)` hook
- Implement save/unsave job mutations
- Add loading skeletons

**Matches Page (`/dashboard/matches`):**
- Replace mock data with `useMatches()` hook
- Show real match scores and reasons
- Implement match status updates

**Dashboard Home:**
- Replace mock stats with real data from profile/matches APIs
- Show actual match counts, pending applications

---

## 7. Error Handling

### 7.1 API Error Response Format

```typescript
{
  statusCode: number,
  error: string,
  message: string
}
```

### 7.2 Frontend Error Handling

- Show toast notifications on API errors
- Implement retry logic for failed requests
- Show appropriate error states in UI (empty states, retry buttons)
- Handle 401 (redirect to login), 404 (not found), 500 (server error) scenarios

---

## 8. Loading & Empty States

### 8.1 Skeleton Components

Create loading skeletons for:
- `JobCardSkeleton` - for job list loading
- `MatchCardSkeleton` - for matches list loading
- `MatchDetailSkeleton` - for match detail pane

### 8.2 Empty States

Create empty state components for:
- No jobs found
- No matches yet (with CTA to upload resume)
- No preparation materials

---

## 9. Implementation Order

1. **Backend Jobs Module** - Create DTOs, service, repository, router
2. **Backend Matches Module** - Create DTOs, service, repository, router
3. **Backend Profile Module** - Create profile endpoints
4. **Backend Preparation Module** - Create preparation endpoints
5. **Frontend Services** - Create API service functions
6. **Frontend Hooks** - Create React Query hooks
7. **Update Jobs Page** - Connect to real API
8. **Update Matches Page** - Connect to real API
9. **Update Dashboard Home** - Show real stats

---

## Next Steps

1. Review and approve this API integration plan
2. Confirm the API response structures match frontend expectations
3. If approved, implement backend modules starting with Jobs