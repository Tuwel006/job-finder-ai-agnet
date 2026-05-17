import { PreparationRepository } from './preparation_repository.js'

interface Question {
  id: string
  question: string
  answer: string | null
  type: 'behavioral' | 'technical' | 'situational'
  practiced: boolean
}

interface PreparationResponse {
  id: string
  matchId: string
  jobTitle: string
  company: string
  questions: Question[]
  companyInsights: string[]
  tips: string[]
  createdAt: Date
}

export class PreparationService {
  constructor(private preparationRepository: PreparationRepository) {}

  async getPreparationMaterials(userId: string, matchId: string): Promise<PreparationResponse | null> {
    const match = await this.preparationRepository.findByUserAndMatchId(userId, matchId)
    if (!match) return null

    // Get or create preparation material
    let prep = await this.preparationRepository.findMaterialByUserAndMatchId(userId, matchId)

    if (!prep) {
      // Create initial preparation material
      const content = {
        questions: [
          { id: '1', question: 'Tell me about yourself', answer: null, type: 'behavioral', practiced: false },
          { id: '2', question: 'What are your strengths?', answer: null, type: 'behavioral', practiced: false },
          { id: '3', question: 'Why do you want to work here?', answer: null, type: 'situational', practiced: false },
        ],
        companyInsights: [`Research ${match.job.company} before your interview`],
        tips: ['Practice out loud', 'Review the job description'],
      }

      prep = await this.preparationRepository.upsertMaterial(userId, match.jobId, 'questions', content)
    }

    const content = prep.content as any

    return {
      id: prep.id,
      matchId,
      jobTitle: match.job.title,
      company: match.job.company,
      questions: content.questions || [],
      companyInsights: content.companyInsights || [],
      tips: content.tips || [],
      createdAt: prep.createdAt,
    }
  }

  async markQuestionPracticed(userId: string, prepId: string, questionIndex: number, practiced: boolean): Promise<void> {
    await this.preparationRepository.updateQuestionPracticed(prepId, questionIndex, practiced)
  }
}