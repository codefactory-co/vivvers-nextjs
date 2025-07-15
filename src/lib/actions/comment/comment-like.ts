'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { commentLikeSchema, type CommentLikeData } from '@/lib/validations/comment'
import { z } from 'zod'

// 응답 타입
export interface CommentLikeResponse {
  success: boolean
  data?: {
    isLiked: boolean
    likeCount: number
  }
  error?: string
}

export async function toggleCommentLike(data: CommentLikeData): Promise<CommentLikeResponse> {
  try {
    // 1. 데이터 검증
    const validatedData = commentLikeSchema.parse(data)
    
    // 2. 사용자 인증 확인
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // 3. 댓글 존재 확인
    const comment = await prisma.projectComment.findUnique({
      where: { id: validatedData.commentId },
      select: { id: true, likeCount: true }
    })

    if (!comment) {
      return { success: false, error: '존재하지 않는 댓글입니다' }
    }

    // 4. 기존 좋아요 확인
    const existingLike = await prisma.projectCommentLike.findUnique({
      where: {
        userId_commentId: {
          userId: user.id,
          commentId: validatedData.commentId
        }
      }
    })

    // 5. 트랜잭션으로 좋아요 토글
    const result = await prisma.$transaction(async (tx) => {
      let isLiked: boolean
      let likeCount: number

      if (existingLike) {
        // 좋아요 해제
        await tx.projectCommentLike.delete({
          where: { id: existingLike.id }
        })

        // 댓글 좋아요 수 감소
        const updatedComment = await tx.projectComment.update({
          where: { id: validatedData.commentId },
          data: {
            likeCount: {
              decrement: 1
            }
          },
          select: { likeCount: true }
        })

        isLiked = false
        likeCount = updatedComment.likeCount
      } else {
        // 좋아요 추가
        await tx.projectCommentLike.create({
          data: {
            id: crypto.randomUUID(),
            userId: user.id,
            commentId: validatedData.commentId,
            createdAt: new Date()
          }
        })

        // 댓글 좋아요 수 증가
        const updatedComment = await tx.projectComment.update({
          where: { id: validatedData.commentId },
          data: {
            likeCount: {
              increment: 1
            }
          },
          select: { likeCount: true }
        })

        isLiked = true
        likeCount = updatedComment.likeCount
      }

      return { isLiked, likeCount }
    })

    return {
      success: true,
      data: result
    }

  } catch (error: unknown) {
    console.error('댓글 좋아요 토글 오류:', error)
    
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
      if (error.code === 'P2002') {
        return { success: false, error: '이미 좋아요를 누른 댓글입니다' }
      }
    }
    
    return { success: false, error: '댓글 좋아요 처리 중 오류가 발생했습니다' }
  }
}