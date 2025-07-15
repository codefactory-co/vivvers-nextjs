export interface User {
  id: string
  username: string
  email: string
  avatarUrl: string | null
  bio: string | null
  socialLinks: Record<string, string> | null
  skills: string[]
  experience: string | null
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserStats {
  projectCount: number
  totalLikes: number
  followerCount: number
  followingCount: number
}