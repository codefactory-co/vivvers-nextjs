'use server'

import { getUserByUsername as mockGetUserByUsername, getUserById as mockGetUserById } from '@/lib/mock-api/users'
import type { User } from '@/types/user'

export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await mockGetUserById(id)
    return user
  } catch (error) {
    console.error('사용자 조회 오류:', error)
    return null
  }
}

export async function getUserByUsername(username: string): Promise<{ success: boolean; data?: User; error?: string }> {
  try {
    const user = await mockGetUserByUsername(username)
    
    if (!user) {
      return { success: false, error: '사용자를 찾을 수 없습니다' }
    }
    
    return {
      success: true,
      data: user
    }
  } catch (error) {
    console.error('사용자 조회 오류:', error)
    return { success: false, error: '사용자 조회 중 오류가 발생했습니다' }
  }
}