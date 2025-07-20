'use server'

import { revalidatePath } from 'next/cache'
import { AdminUserService } from '@/lib/admin/user-service'
import { requireAdminPermission } from '@/lib/auth/admin'
import { UserRole, UserStatus } from '@prisma/client'
import type { UserFilters } from '@/types/admin'

export async function getUsersAction(filters: UserFilters) {
  try {
    await requireAdminPermission()
    const users = await AdminUserService.getUsers(filters)
    return { success: true, data: users }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateUserStatusAction(userId: string, status: UserStatus) {
  try {
    await requireAdminPermission()
    
    await AdminUserService.updateUserStatus(userId, status)
    
    revalidatePath('/admin/users')
    return { success: true, message: '사용자 상태가 변경되었습니다' }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateUserRoleAction(userId: string, role: UserRole) {
  try {
    const admin = await requireAdminPermission()
    
    // 어드민만 어드민 역할 부여 가능
    if (role === UserRole.admin && admin.role !== UserRole.admin) {
      throw new Error('어드민만 어드민 역할을 부여할 수 있습니다')
    }
    
    await AdminUserService.updateUserRole(userId, role)
    
    revalidatePath('/admin/users')
    return { success: true, message: '사용자 역할이 변경되었습니다' }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateUserVerificationAction(userId: string, verified: boolean) {
  try {
    await requireAdminPermission()
    
    await AdminUserService.updateUserVerification(userId, verified)
    
    revalidatePath('/admin/users')
    return { success: true, message: '사용자 인증 상태가 변경되었습니다' }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateAdminNotesAction(userId: string, adminNotes: string) {
  try {
    await requireAdminPermission()
    
    await AdminUserService.updateAdminNotes(userId, adminNotes)
    
    revalidatePath('/admin/users')
    return { success: true, message: '관리자 메모가 업데이트되었습니다' }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}