'use server'

import { prisma } from '@/lib/prisma/client'
import type { User } from '@/types/user'

export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      return null
    }

    return {
      ...user,
      socialLinks: user.socialLinks as Record<string, string> | null
    }
  } catch (error) {
    console.error('사용자 조회 오류:', error)
    return null
  }
}

export async function getUserByUsername(username: string): Promise<{ success: boolean; data?: User; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      return { success: false, error: '사용자를 찾을 수 없습니다' }
    }

    return {
      success: true,
      data: {
        ...user,
        socialLinks: user.socialLinks as Record<string, string> | null
      }
    }
  } catch (error) {
    console.error('사용자 조회 오류:', error)
    return { success: false, error: '사용자 조회 중 오류가 발생했습니다' }
  }
}