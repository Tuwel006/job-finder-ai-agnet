import { api } from '@/lib/api'

export interface JobSummary {
  id: string
  title: string
  company: string
  companyLogo: string | null
  location: string
  type: string
  salary: string | null
  postedAt: string
}

export interface Match {
  id: string
  jobId: string
  job: JobSummary
  score: number
  reasons: string[]
  missingSkills: string[]
  createdAt: string
  status: 'new' | 'viewed' | 'applied' | 'dismissed'
}

export interface PaginatedMatches {
  data: Match[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const matchesService = {
  getMatches: async (page = 1, limit = 20): Promise<PaginatedMatches> => {
    return api.get<PaginatedMatches>(`/api/matches?page=${page}&limit=${limit}`)
  },

  getMatch: async (id: string): Promise<Match> => {
    return api.get<Match>(`/api/matches/${id}`)
  },

  updateMatchStatus: async (id: string, status: 'new' | 'viewed' | 'applied' | 'dismissed'): Promise<{ message: string }> => {
    return api.patch<{ message: string }>(`/api/matches/${id}`, { status })
  },

  dismissMatch: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/api/matches/${id}`)
  },
}

export default matchesService