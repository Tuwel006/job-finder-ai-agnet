import { api } from '@/lib/api'

export interface InterviewQuestion {
  id: string
  question: string
  answer: string | null
  type: 'behavioral' | 'technical' | 'situational'
  practiced: boolean
}

export interface PreparationMaterials {
  id: string
  matchId: string
  jobTitle: string
  company: string
  questions: InterviewQuestion[]
  companyInsights: string[]
  tips: string[]
  createdAt: string
}

export const preparationService = {
  getMaterials: async (matchId: string): Promise<PreparationMaterials> => {
    return api.get<PreparationMaterials>(`/api/preparation/${matchId}`)
  },

  markQuestionPracticed: async (questionId: string, practiced: boolean): Promise<{ message: string }> => {
    return api.patch<{ message: string }>(`/api/preparation/questions/${questionId}`, { practiced })
  },
}

export default preparationService