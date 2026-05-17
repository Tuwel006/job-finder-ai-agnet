import { api } from '@/lib/api'

export interface Job {
  id: string
  title: string
  company: string
  companyLogo: string | null
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  remote: boolean
  salaryMin: number | null
  salaryMax: number | null
  description: string
  requirements: string[]
  postedAt: string
  url: string | null
  saved: boolean
}

export interface SearchFilters {
  query?: string
  location?: string
  type?: string
  remote?: boolean
  salaryMin?: number
  salaryMax?: number
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const jobsService = {
  searchJobs: async (filters: SearchFilters): Promise<PaginatedResponse<Job>> => {
    const params = new URLSearchParams()
    if (filters.query) params.append('query', filters.query)
    if (filters.location) params.append('location', filters.location)
    if (filters.type) params.append('type', filters.type)
    if (filters.remote !== undefined) params.append('remote', String(filters.remote))
    if (filters.salaryMin) params.append('salaryMin', String(filters.salaryMin))
    if (filters.salaryMax) params.append('salaryMax', String(filters.salaryMax))
    if (filters.page) params.append('page', String(filters.page))
    if (filters.limit) params.append('limit', String(filters.limit))

    return api.get<PaginatedResponse<Job>>(`/api/jobs?${params.toString()}`)
  },

  getJob: async (id: string): Promise<Job> => {
    return api.get<Job>(`/api/jobs/${id}`)
  },

  getSavedJobs: async (): Promise<{ data: Job[] }> => {
    return api.get<{ data: Job[] }>('/api/jobs/saved')
  },

  saveJob: async (jobId: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>(`/api/jobs/${jobId}/save`)
  },

  unsaveJob: async (jobId: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/api/jobs/${jobId}/save`)
  },
}

export default jobsService