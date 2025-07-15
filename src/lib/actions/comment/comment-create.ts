'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { createCommentSchema, type CreateCommentData, type CommentWithAuthor } from '@/lib/validations/comment'
import { z } from 'zod'

// 응답 타입
export interface CreateCommentResponse {
  success: boolean
  data?: CommentWithAuthor
  error?: string
}

export async function createComment(data: CreateCommentData): Promise<CreateCommentResponse> {
  try {
    // 1. 데이터 검증
    const validatedData = createCommentSchema.parse(data)
    
    // 2. 사용자 인증 확인
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // 3. 프로젝트 존재 확인
    const project = await prisma.project.findUnique({
      where: { id: validatedData.projectId },
      select: { id: true }
    })

    if (!project) {
      return { success: false, error: '존재하지 않는 프로젝트입니다' }
    }

    // 4. 부모 댓글 존재 확인 (대댓글인 경우)
    let parentComment = null
    if (validatedData.parentId) {
      parentComment = await prisma.projectComment.findUnique({
        where: { id: validatedData.parentId },
        select: { id: true, projectId: true }
      })

      if (!parentComment) {
        return { success: false, error: '존재하지 않는 댓글입니다' }
      }

      // 부모 댓글이 같은 프로젝트에 속하는지 확인
      if (parentComment.projectId !== validatedData.projectId) {
        return { success: false, error: '잘못된 댓글 요청입니다' }
      }
    }

    // 5. 트랜잭션으로 댓글 생성
    const result = await prisma.$transaction(async (tx) => {
      // 댓글 생성
      const comment = await tx.projectComment.create({
        data: {
          id: crypto.randomUUID(),
          content: validatedData.content,
          projectId: validatedData.projectId,
          authorId: user.id,
          parentId: validatedData.parentId || null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatarUrl: true
            }
          }
        }
      })

      // 부모 댓글의 답글 수 증가
      if (validatedData.parentId) {
        await tx.projectComment.update({
          where: { id: validatedData.parentId },
          data: {
            repliesCount: {
              increment: 1
            }
          }
        })
      }

      return comment
    })

    return { 
      success: true, 
      data: {
        id: result.id,
        content: result.content,
        projectId: result.projectId,
        authorId: result.authorId,
        parentId: result.parentId,
        likeCount: result.likeCount,
        repliesCount: result.repliesCount,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        author: result.author,
        isLiked: false
      }
    }

  } catch (error: unknown) {
    console.error('댓글 생성 오류:', error)
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.issues[0]?.message || '입력 데이터가 올바르지 않습니다' 
      }
    }
    
    // Prisma 에러 처리
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return { success: false, error: '이미 존재하는 댓글입니다' }
      }
      if (error.code === 'P2003') {
        return { success: false, error: '잘못된 요청입니다' }
      }
    }
    
    return { success: false, error: '댓글 생성 중 오류가 발생했습니다' }
  }
}