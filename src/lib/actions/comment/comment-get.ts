'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { getCommentsSchema, type GetCommentsData, type CommentsResponse, type CommentWithAuthor } from '@/lib/validations/comment'
import { z } from 'zod'

// 응답 타입
export interface GetCommentsResponse {
  success: boolean
  data?: CommentsResponse
  error?: string
}

export async function getComments(params: GetCommentsData): Promise<GetCommentsResponse> {
  try {
    // 1. 데이터 검증
    const validatedData = getCommentsSchema.parse(params)
    
    // 2. 사용자 인증 확인 (좋아요 상태 확인용)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // 3. 프로젝트 존재 확인
    const project = await prisma.project.findUnique({
      where: { id: validatedData.projectId },
      select: { id: true }
    })

    if (!project) {
      return { success: false, error: '존재하지 않는 프로젝트입니다' }
    }

    // 4. 정렬 조건 설정
    let orderBy: { createdAt?: 'desc' | 'asc'; likeCount?: 'desc' | 'asc' } = {}
    switch (validatedData.sortBy) {
      case 'latest':
        orderBy = { createdAt: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'mostLiked':
        orderBy = { likeCount: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // 5. 페이지네이션 계산
    const skip = (validatedData.page - 1) * validatedData.limit
    const take = validatedData.limit

    // 6. 댓글 조회 (부모 댓글만 또는 특정 부모의 대댓글)
    const whereCondition = {
      projectId: validatedData.projectId,
      parentId: validatedData.parentId || null
    }

    const [comments, total] = await Promise.all([
      prisma.projectComment.findMany({
        where: whereCondition,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatarUrl: true
            }
          },
          ...(user ? {
            likes: {
              where: { userId: user.id },
              select: { id: true }
            }
          } : {}),
          // 대댓글 포함 (부모 댓글인 경우만)
          ...(validatedData.parentId ? {} : {
            replies: {
              take: 3, // 최대 3개의 대댓글만 미리 로드
              orderBy: { createdAt: 'asc' },
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    avatarUrl: true
                  }
                },
                ...(user ? {
                  likes: {
                    where: { userId: user.id },
                    select: { id: true }
                  }
                } : {})
              }
            }
          })
        },
        orderBy,
        skip,
        take
      }),
      prisma.projectComment.count({
        where: whereCondition
      })
    ])

    // 7. 응답 데이터 구성
    const commentsWithLikeStatus: CommentWithAuthor[] = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      projectId: comment.projectId,
      authorId: comment.authorId,
      parentId: comment.parentId,
      likeCount: comment.likeCount,
      repliesCount: comment.repliesCount,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: comment.author,
      isLiked: user ? (comment.likes?.length > 0) : false,
      replies: (comment as unknown as { replies?: { 
        id: string; 
        content: string; 
        projectId: string; 
        authorId: string; 
        parentId: string | null; 
        likeCount: number; 
        repliesCount: number; 
        createdAt: Date; 
        updatedAt: Date; 
        author: { id: string; username: string; avatarUrl: string | null }; 
        likes?: { id: string }[] 
      }[] }).replies?.map((reply) => ({
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
        isLiked: user ? (reply.likes?.length ?? 0) > 0 : false
      }))
    }))

    // 8. 페이지네이션 정보 계산
    const totalPages = Math.ceil(total / validatedData.limit)
    const hasNext = validatedData.page < totalPages
    const hasPrev = validatedData.page > 1

    return {
      success: true,
      data: {
        comments: commentsWithLikeStatus,
        pagination: {
          page: validatedData.page,
          limit: validatedData.limit,
          total,
          totalPages,
          hasNext,
          hasPrev
        }
      }
    }

  } catch (error: unknown) {
    console.error('댓글 조회 오류:', error)
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.issues[0]?.message || '입력 데이터가 올바르지 않습니다' 
      }
    }
    
    return { success: false, error: '댓글 조회 중 오류가 발생했습니다' }
  }
}

// 댓글 수 조회
export async function getCommentCount(projectId: string): Promise<number> {
  try {
    const count = await prisma.projectComment.count({
      where: { projectId }
    })
    return count
  } catch (error) {
    console.error('댓글 수 조회 오류:', error)
    return 0
  }
}

// 특정 댓글 조회
export async function getCommentById(commentId: string): Promise<CommentWithAuthor | null> {
  try {
    // 사용자 인증 확인
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const comment = await prisma.projectComment.findUnique({
      where: { id: commentId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        },
        ...(user ? {
          likes: {
            where: { userId: user.id },
            select: { id: true }
          }
        } : {})
      }
    })

    if (!comment) {
      return null
    }

    return {
      id: comment.id,
      content: comment.content,
      projectId: comment.projectId,
      authorId: comment.authorId,
      parentId: comment.parentId,
      likeCount: comment.likeCount,
      repliesCount: comment.repliesCount,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: comment.author,
      isLiked: user ? ((comment as unknown as { likes?: { id: string }[] }).likes?.length ?? 0) > 0 : false
    }

  } catch (error) {
    console.error('댓글 조회 오류:', error)
    return null
  }
}