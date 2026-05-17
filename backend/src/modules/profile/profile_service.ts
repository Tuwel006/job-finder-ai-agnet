import { ProfileRepository } from './profile_repository.js'
import { UpdateProfileDto } from './dto/index.js'

export interface UserProfile {
  id: string
  email: string
  name: string | null
  phone: string | null
  location: string | null
  headline: string | null
  summary: string | null
  avatarUrl: string | null
  createdAt: Date
  resume: {
    id: string
    skills: string[]
    experience: object[]
    education: object[]
  } | null
}

export class ProfileService {
  constructor(private profileRepository: ProfileRepository) {}

  async getProfile(userId: string): Promise<UserProfile | null> {
    const user = await this.profileRepository.findById(userId)
    if (!user) return null

    const resumeProfile = user.resumeProfiles[0]
    let resume = null
    if (resumeProfile) {
      const parsedJson = resumeProfile.parsedJson as any
      resume = {
        id: resumeProfile.id,
        skills: parsedJson?.skills || [],
        experience: parsedJson?.experience || [],
        education: parsedJson?.education || [],
      }
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: null,
      location: null,
      headline: null,
      summary: null,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      resume,
    }
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserProfile | null> {
    const user = await this.profileRepository.update(userId, dto)
    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: null,
      location: null,
      headline: null,
      summary: null,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      resume: null,
    }
  }

  async getResume(userId: string) {
    return this.profileRepository.getResume(userId)
  }

  async deleteResume(userId: string): Promise<void> {
    await this.profileRepository.deleteResume(userId)
  }
}