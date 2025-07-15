'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { createUserSchema, type CreateUserData } from '@/lib/validations/user'
import { z } from 'zod'

export async function createUserProfile(data: CreateUserData) {
  try {
    // 데이터 검증
    const validatedData = createUserSchema.parse(data)
    
    const supabase = await createClient()
    
    // 현재 로그인된 사용자 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다' }
    }
    
    // Supabase 사용자 ID 일치 확인
    if (user.id !== validatedData.supabaseUserId) {
      return { success: false, error: '인증 오류가 발생했습니다' }
    }

    // 사용자명 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { username: validatedData.username }
    })

    if (existingUser) {
      return { success: false, error: '이미 사용 중인 사용자명입니다' }
    }

    // 사용자 생성 (Supabase User ID를 Primary Key로 사용)
    await prisma.user.create({
      data: {
        id: validatedData.supabaseUserId,
        username: validatedData.username,
        email: validatedData.email,
        bio: validatedData.bio || null,
        avatarUrl: validatedData.avatar || null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Supabase Auth 메타데이터 업데이트 (온보딩 완료)
    await supabase.auth.updateUser({
      data: { 
        profile_completed: true,
        username: validatedData.username
      }
    })

    return { success: true }

  } catch (error: unknown) {
    console.error('사용자 생성 오류:', error)
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.issues[0]?.message || '입력 데이터가 올바르지 않습니다' 
      }
    }
    
    return { success: false, error: '사용자 생성 중 오류가 발생했습니다' }
  }
}