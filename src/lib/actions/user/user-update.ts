'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { updateUserSchema, type UpdateUserData } from '@/lib/validations/user'
import { z } from 'zod'

export async function updateUserProfile(data: UpdateUserData) {
  try {
    // 데이터 검증
    const validatedData = updateUserSchema.parse(data)
    
    const supabase = await createClient()
    
    // 현재 로그인된 사용자 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // 현재 사용자 정보 조회
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!currentUser) {
      return { success: false, error: '사용자를 찾을 수 없습니다' }
    }

    // 사용자명 변경 시 중복 확인
    if (validatedData.username && validatedData.username !== currentUser.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: validatedData.username }
      })

      if (existingUser) {
        return { success: false, error: '이미 사용 중인 사용자명입니다' }
      }
    }

    // 업데이트할 데이터 준비
    const updateData: {
      updatedAt: Date
      username?: string
      bio?: string | null
      avatarUrl?: string | null
      socialLinks?: { github?: string; linkedin?: string; portfolio?: string }
      skills?: string[]
      experience?: string | null
      isPublic?: boolean
    } = {
      updatedAt: new Date()
    }

    if (validatedData.username) {
      updateData.username = validatedData.username
    }
    if (validatedData.bio !== undefined) {
      updateData.bio = validatedData.bio || null
    }
    if (validatedData.avatar !== undefined) {
      updateData.avatarUrl = validatedData.avatar || null
    }
    if (validatedData.socialLinks) {
      updateData.socialLinks = validatedData.socialLinks
    }
    if (validatedData.skills) {
      updateData.skills = validatedData.skills
    }
    if (validatedData.experience !== undefined) {
      updateData.experience = validatedData.experience || null
    }
    if (validatedData.isPublic !== undefined) {
      updateData.isPublic = validatedData.isPublic
    }

    // 사용자 업데이트
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData
    })

    // Supabase Auth 메타데이터 업데이트 (사용자명 변경 시)
    if (validatedData.username && validatedData.username !== currentUser.username) {
      await supabase.auth.updateUser({
        data: { 
          username: validatedData.username
        }
      })
    }

    // 프로필 페이지 재검증
    revalidatePath('/profile')
    
    return { success: true, data: updatedUser }

  } catch (error: unknown) {
    console.error('사용자 업데이트 오류:', error)
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.issues[0]?.message || '입력 데이터가 올바르지 않습니다' 
      }
    }
    
    return { success: false, error: '사용자 정보 업데이트 중 오류가 발생했습니다' }
  }
}