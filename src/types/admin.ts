import { UserRole, UserStatus } from '@prisma/client'

export { UserRole, UserStatus }

export interface UserFilters {
  search?: string
  role?: UserRole
  status?: UserStatus
  verified?: boolean
  limit?: number
  offset?: number
}

export interface AdminUser {
  id: string
  username: string
  email: string
  avatar: string
  joinDate: Date
  description: string | null
  projectCount: number
  role: UserRole
  status: UserStatus
  verified: boolean
  lastActive: Date | null
  adminNotes: string | null
  reportCount: number
}