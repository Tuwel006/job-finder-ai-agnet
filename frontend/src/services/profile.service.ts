import { api } from '@/lib/api'

export interface UserProfile {
  id: string
  email: string
  name: string | null
  phone: string | null
  location: string | null
  headline: string | null
  summary: string | null
  createdAt: string
  resume: {
    id: string
    skills: string[]
    experience: object[]
    education: object[]
  } | null
}

export interface UpdateProfileData {
  name?: string
  email?: string
  phone?: string
  location?: string
  headline?: string
  summary?: string
}

export const profileService = {
  getProfile: async (): Promise<UserProfile> => {
    return api.get<UserProfile>('/api/profile')
  },

  updateProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
    return api.patch<UserProfile>('/api/profile', data)
  },

  getResume: async () => {
    return api.get('/api/profile/resume')
  },

  deleteResume: async (): Promise<{ message: string }> => {
    return api.delete<{ message: string }>('/api/profile/resume')
  },
}

export default profileService