'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { type CommentWithAuthor } from '@/lib/validations/comment'
import { z } from 'zod'

// 댓글 답글 생성 스키마
const createReplySchema = z.object({
  content: z.string()
    .min(1, '댓글 내용을 입력해주세요')
    .max(500, '댓글은 최대 500자까지 입력 가능합니다')
    .transform(content => content.trim()),
  parentId: z.string().uuid('올바른 댓글 ID를 입력해주세요')
})

export type CreateReplyData = z.infer<typeof createReplySchema>

// 응답 타입
export interface CreateReplyResponse {
  success: boolean
  data?: {
    reply: CommentWithAuthor
    parentCount: number
  }
  error?: string
}

export async function createReply(data: CreateReplyData): Promise<CreateReplyResponse> {
  try {
    // 1. 데이터 검증
    const validatedData = createReplySchema.parse(data)
    
    // 2. 사용자 인증 확인
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // 3. 부모 댓글 존재 확인
    const parentComment = await prisma.projectComment.findUnique({
      where: { id: validatedData.parentId },
      select: { 
        id: true, 
        projectId: true, 
        repliesCount: true,
        parentId: true 
      }
    })

    if (!parentComment) {
      return { success: false, error: '존재하지 않는 댓글입니다' }
    }

    // 4. 대댓글의 대댓글 방지 (2단계 제한)
    if (parentComment.parentId) {
      return { success: false, error: '대댓글에는 답글을 달 수 없습니다' }
    }

    // 5. 트랜잭션으로 답글 생성 및 카운트 업데이트
    const result = await prisma.$transaction(async (tx) => {
      // 답글 생성
      const reply = await tx.projectComment.create({
        data: {
          id: crypto.randomUUID(),
          content: validatedData.content,
          projectId: parentComment.projectId,
          authorId: user.id,
          parentId: validatedData.parentId,
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
      const updatedParent = await tx.projectComment.update({
        where: { id: validatedData.parentId },
        data: {
          repliesCount: {
            increment: 1
          }
        },
        select: { repliesCount: true }
      })

      return { reply, parentCount: updatedParent.repliesCount }
    })

    return { 
      success: true, 
      data: {
        reply: {
          id: result.reply.id,
          content: result.reply.content,
          projectId: result.reply.projectId,
          authorId: result.reply.authorId,
          parentId: result.reply.parentId,
          likeCount: result.reply.likeCount,
          repliesCount: result.reply.repliesCount,
          createdAt: result.reply.createdAt,
          updatedAt: result.reply.updatedAt,
          author: result.reply.author,
          isLiked: false
        },
        parentCount: result.parentCount
      }
    }

  } catch (error: unknown) {
    console.error('답글 생성 오류:', error)
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.issues[0]?.message || '입력 데이터가 올바르지 않습니다' 
      }
    }
    
    // Prisma 에러 처리
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return { success: false, error: '이미 존재하는 답글입니다' }
      }
      if (error.code === 'P2003') {
        return { success: false, error: '잘못된 요청입니다' }
      }
      if (error.code === 'P2025') {
        return { success: false, error: '존재하지 않는 댓글입니다' }
      }
    }
    
    return { success: false, error: '답글 생성 중 오류가 발생했습니다' }
  }
}

// 답글 목록 조회 스키마 (내부 사용)
const getRepliesSchema = z.object({
  parentId: z.string().uuid('올바른 댓글 ID를 입력해주세요'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10)
})

export type GetRepliesData = z.infer<typeof getRepliesSchema>

export interface GetRepliesResponse {
  success: boolean
  data?: {
    replies: CommentWithAuthor[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
  error?: string
}

export async function getReplies(data: GetRepliesData): Promise<GetRepliesResponse> {
  try {
    // 1. 데이터 검증
    const validatedData = getRepliesSchema.parse(data)
    
    // 2. 사용자 인증 확인 (좋아요 상태 확인용)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // 3. 부모 댓글 존재 확인
    const parentComment = await prisma.projectComment.findUnique({
      where: { id: validatedData.parentId },
      select: { id: true }
    })

    if (!parentComment) {
      return { success: false, error: '존재하지 않는 댓글입니다' }
    }

    // 4. 페이지네이션 계산
    const skip = (validatedData.page - 1) * validatedData.limit
    
    // 5. 총 답글 수 조회
    const total = await prisma.projectComment.count({
      where: { parentId: validatedData.parentId }
    })

    // 6. 답글 목록 조회
    const replies = await prisma.projectComment.findMany({
      where: { parentId: validatedData.parentId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        },
        ...(user && {
          likes: {
            where: { userId: user.id },
            select: { id: true }
          }
        })
      },
      orderBy: { createdAt: 'asc' },
      skip,
      take: validatedData.limit
    })

    // 7. 응답 데이터 구성
    const repliesWithLikeStatus: CommentWithAuthor[] = replies.map(reply => ({
      id: reply.id,
      content: reply.content,
      projectId: reply.projectId,
      authorId: reply.authorId,
      parentId: reply.parentId,
      likeCount: reply.likeCount,
      repliesCount: reply.repliesCount,
      createdAt: reply.createdAt,
      updatedAt: reply.updatedAt,
      author: reply.author,
      isLiked: user ? (reply.likes?.length > 0) : false
    }))

    const totalPages = Math.ceil(total / validatedData.limit)

    return {
      success: true,
      data: {
        replies: repliesWithLikeStatus,
        pagination: {
          page: validatedData.page,
          limit: validatedData.limit,
          total,
          totalPages,
          hasNext: validatedData.page < totalPages,
          hasPrev: validatedData.page > 1
        }
      }
    }

  } catch (error: unknown) {
    console.error('답글 조회 오류:', error)
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.issues[0]?.message || '입력 데이터가 올바르지 않습니다' 
      }
    }
    
    return { success: false, error: '답글 조회 중 오류가 발생했습니다' }
  }
}