// ============================================
// Base Types
// ============================================

export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ============================================
// Resume Types
// ============================================

export interface Experience {
  title: string
  company: string
  duration: string
  description?: string
}

export interface Project {
  name: string
  description?: string
  technologies: string[]
}

export interface Education {
  degree: string
  institution: string
  year?: string
}

export interface ParsedResume {
  skills: string[]
  experience: Experience[]
  projects: Project[]
  education: Education[]
  keywords: string[]
  summary?: string
}

// ============================================
// Job Types
// ============================================

export interface SearchQuery {
  text: string
  location?: string
  remote?: boolean
  salaryMin?: number
  salaryMax?: number
  experienceLevel?: string
  employmentType?: string
}

export interface Job {
  id: string
  externalId: string
  source: string
  title: string
  company: string
  location?: string
  salaryRange?: string
  description?: string
  applyUrl: string
  logoUrl?: string
  keywords: string[]
  expiresAt?: Date
  isExpired: boolean
  isFake?: boolean
  metadata?: Record<string, unknown>
}

// ============================================
// Match Types
// ============================================

export interface MatchResult {
  id: string
  job: Job
  similarityScore: number
  matchReasons: string[]
  isSaved: boolean
  isApplied: boolean
  appliedAt?: Date
  createdAt: Date
}

// ============================================
// User Types
// ============================================

export interface User {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  provider: string
  createdAt: Date
  updatedAt: Date
}

export interface TokenPayload {
  id: string
  type: 'access' | 'refresh'
}