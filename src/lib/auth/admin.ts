import { prisma } from '@/lib/prisma/client'
import { createClient } from '@/lib/supabase/server'
import { UserRole, User } from '@prisma/client'
import { 
  NotLoggedInError, 
  NotAdminError, 
  NotModeratorError
} from '@/lib/errors/admin-errors'

export async function getCurrentUser(): Promise<User | null> {
  // Supabase 인증에서 현재 사용자 가져오기
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  return await prisma.user.findUnique({
    where: { id: user.id }
  })
}

export async function isAdminOrModerator(user: User): Promise<boolean> {
  return user.role === UserRole.admin || user.role === UserRole.moderator
}

export async function requireAdminPermission(): Promise<User> {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new NotLoggedInError()
  }
  
  if (!await isAdminOrModerator(user)) {
    throw new NotAdminError()
  }
  
  return user
}

export async function requireSpecificRole(requiredRole: UserRole): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    throw new NotLoggedInError()
  }
  
  if (requiredRole === UserRole.admin && user.role !== UserRole.admin) {
    throw new NotAdminError('어드민 권한이 필요합니다')
  }
  
  if (requiredRole === UserRole.moderator && 
      user.role !== UserRole.admin && 
      user.role !== UserRole.moderator) {
    throw new NotModeratorError()
  }
  
  return user
}