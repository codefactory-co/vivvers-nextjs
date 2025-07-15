'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { deleteCommentSchema, type DeleteCommentData } from '@/lib/validations/comment'
import { z } from 'zod'

// 응답 타입
export interface DeleteCommentResponse {
  success: boolean
  data?: {
    deletedId: string
    deletedCount: number
  }
  error?: string
}

export async function deleteComment(data: DeleteCommentData): Promise<DeleteCommentResponse> {
  try {
    // 1. 데이터 검증
    const validatedData = deleteCommentSchema.parse(data)
    
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
        parentId: true,
        repliesCount: true,
        likeCount: true
      }
    })

    if (!existingComment) {
      return { success: false, error: '존재하지 않는 댓글입니다' }
    }

    // 4. 작성자 권한 확인
    if (existingComment.authorId !== user.id) {
      return { success: false, error: '댓글을 삭제할 권한이 없습니다' }
    }

    // 5. 트랜잭션으로 댓글 삭제 처리
    const result = await prisma.$transaction(async (tx) => {
      let deletedCount = 0

      // 5-1. 먼저 모든 대댓글들을 찾아서 삭제
      const replies = await tx.projectComment.findMany({
        where: { parentId: validatedData.id },
        select: { id: true }
      })

      if (replies.length > 0) {
        // 대댓글들의 좋아요 삭제
        await tx.projectCommentLike.deleteMany({
          where: { 
            commentId: { in: replies.map(reply => reply.id) }
          }
        })

        // 대댓글들 삭제
        await tx.projectComment.deleteMany({
          where: { parentId: validatedData.id }
        })

        deletedCount += replies.length
      }

      // 5-2. 원본 댓글의 좋아요 삭제
      await tx.projectCommentLike.deleteMany({
        where: { commentId: validatedData.id }
      })

      // 5-3. 원본 댓글 삭제
      await tx.projectComment.delete({
        where: { id: validatedData.id }
      })

      deletedCount += 1

      // 5-4. 부모 댓글의 답글 수 감소 (대댓글인 경우)
      if (existingComment.parentId) {
        await tx.projectComment.update({
          where: { id: existingComment.parentId },
          data: {
            repliesCount: {
              decrement: 1
            }
          }
        })
      }

      return {
        deletedId: validatedData.id,
        deletedCount
      }
    })

    return {
      success: true,
      data: result
    }

  } catch (error: unknown) {
    console.error('댓글 삭제 오류:', error)
    
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
      if (error.code === 'P2003') {
        return { success: false, error: '댓글 삭제 중 참조 오류가 발생했습니다' }
      }
    }
    
    return { success: false, error: '댓글 삭제 중 오류가 발생했습니다' }
  }
}