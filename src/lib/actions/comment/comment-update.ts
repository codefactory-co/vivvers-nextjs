'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { updateCommentSchema, type UpdateCommentData, type CommentWithAuthor } from '@/lib/validations/comment'
import { z } from 'zod'

// 응답 타입
export interface UpdateCommentResponse {
  success: boolean
  data?: CommentWithAuthor
  error?: string
}

export async function updateComment(data: UpdateCommentData): Promise<UpdateCommentResponse> {
  try {
    // 1. 데이터 검증
    const validatedData = updateCommentSchema.parse(data)
    
    // 2. 사용자 인증 확인
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // 3. 기존 댓글 조회 및 권한 확인
    const existingComment = await prisma.projectComment.findUnique({
      where: { id: validatedData.id },
      select: { 
        id: true, 
        authorId: true, 
        content: true,
        projectId: true,
        parentId: true,
        likeCount: true,
        repliesCount: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!existingComment) {
      return { success: false, error: '존재하지 않는 댓글입니다' }
    }

    // 4. 작성자 권한 확인
    if (existingComment.authorId !== user.id) {
      return { success: false, error: '댓글을 수정할 권한이 없습니다' }
    }

    // 5. 내용이 동일한지 확인
    if (existingComment.content === validatedData.content) {
      return { success: false, error: '변경된 내용이 없습니다' }
    }

    // 6. 댓글 수정
    const updatedComment = await prisma.projectComment.update({
      where: { id: validatedData.id },
      data: {
        content: validatedData.content,
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        },
        likes: {
          where: { userId: user.id },
          select: { id: true }
        }
      }
    })

    return {
      success: true,
      data: {
        id: updatedComment.id,
        content: updatedComment.content,
        projectId: updatedComment.projectId,
        authorId: updatedComment.authorId,
        parentId: updatedComment.parentId,
        likeCount: updatedComment.likeCount,
        repliesCount: updatedComment.repliesCount,
        createdAt: updatedComment.createdAt,
        updatedAt: updatedComment.updatedAt,
        author: updatedComment.author,
        isLiked: updatedComment.likes.length > 0
      }
    }

  } catch (error: unknown) {
    console.error('댓글 수정 오류:', error)
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.issues[0]?.message || '입력 데이터가 올바르지 않습니다' 
      }
    }
    
    // Prisma 에러 처리
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2025') {
        return { success: false, error: '존재하지 않는 댓글입니다' }
      }
    }
    
    return { success: false, error: '댓글 수정 중 오류가 발생했습니다' }
  }
}