'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { z } from 'zod'

// 카운트 동기화 스키마 (내부 사용)
const syncCountsSchema = z.object({
  projectId: z.string().uuid('올바른 프로젝트 ID를 입력해주세요').optional(),
  commentIds: z.array(z.string().uuid()).optional(),
  batchSize: z.number().int().min(1).max(1000).default(100)
})

export type SyncCountsData = z.infer<typeof syncCountsSchema>
export type SyncCountsInput = z.input<typeof syncCountsSchema>

// 동기화 통계 응답 타입
export interface SyncCountsResponse {
  success: boolean
  data?: {
    processedComments: number
    updatedLikeCounts: number
    updatedReplyCounts: number
    errors: string[]
    processingTime: number
  }
  error?: string
}

export async function syncCommentCounts(data: SyncCountsInput = {}): Promise<SyncCountsResponse> {
  try {
    const startTime = Date.now()
    
    // 1. 데이터 검증
    const validatedData = syncCountsSchema.parse(data)
    
    // 2. 관리자 권한 확인 (필요시)
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // 3. 동기화할 댓글 조회
    const whereClause: {
      projectId?: string
      id?: { in: string[] }
    } = {}
    if (validatedData.projectId) {
      whereClause.projectId = validatedData.projectId
    }
    if (validatedData.commentIds && validatedData.commentIds.length > 0) {
      whereClause.id = { in: validatedData.commentIds }
    }

    const comments = await prisma.projectComment.findMany({
      where: whereClause,
      select: {
        id: true,
        likeCount: true,
        repliesCount: true
      },
      take: validatedData.batchSize
    })

    let processedComments = 0
    let updatedLikeCounts = 0
    let updatedReplyCounts = 0
    const errors: string[] = []

    // 4. 배치 단위로 카운트 동기화
    for (const comment of comments) {
      try {
        await prisma.$transaction(async (tx) => {
          // 실제 좋아요 수 계산
          const actualLikeCount = await tx.projectCommentLike.count({
            where: { commentId: comment.id }
          })

          // 실제 답글 수 계산
          const actualRepliesCount = await tx.projectComment.count({
            where: { parentId: comment.id }
          })

          // 카운트가 다른 경우에만 업데이트
          const updates: {
            likeCount?: number
            repliesCount?: number
          } = {}
          if (comment.likeCount !== actualLikeCount) {
            updates.likeCount = actualLikeCount
            updatedLikeCounts++
          }
          if (comment.repliesCount !== actualRepliesCount) {
            updates.repliesCount = actualRepliesCount
            updatedReplyCounts++
          }

          // 업데이트할 내용이 있는 경우에만 실행
          if (Object.keys(updates).length > 0) {
            await tx.projectComment.update({
              where: { id: comment.id },
              data: updates
            })
          }

          processedComments++
        })
      } catch (error) {
        console.error(`댓글 ${comment.id} 동기화 오류:`, error)
        errors.push(`댓글 ${comment.id}: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      }
    }

    const processingTime = Date.now() - startTime

    return {
      success: true,
      data: {
        processedComments,
        updatedLikeCounts,
        updatedReplyCounts,
        errors,
        processingTime
      }
    }

  } catch (error: unknown) {
    console.error('카운트 동기화 오류:', error)
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.issues[0]?.message || '입력 데이터가 올바르지 않습니다' 
      }
    }
    
    return { success: false, error: '카운트 동기화 중 오류가 발생했습니다' }
  }
}

// 특정 프로젝트의 댓글 카운트 동기화
export async function syncProjectCommentCounts(projectId: string): Promise<SyncCountsResponse> {
  return syncCommentCounts({ projectId })
}

// 특정 댓글들의 카운트 동기화
export async function syncSpecificCommentCounts(commentIds: string[]): Promise<SyncCountsResponse> {
  return syncCommentCounts({ commentIds })
}

// 전체 댓글 카운트 검증 스키마 (내부 사용)
const validateAllCountsSchema = z.object({
  limit: z.number().int().min(1).max(10000).default(1000),
  offset: z.number().int().min(0).default(0)
})

export type ValidateAllCountsData = z.infer<typeof validateAllCountsSchema>
export type ValidateAllCountsInput = z.input<typeof validateAllCountsSchema>

export interface ValidateAllCountsResponse {
  success: boolean
  data?: {
    totalComments: number
    inconsistentComments: number
    inconsistencies: {
      commentId: string
      storedLikeCount: number
      actualLikeCount: number
      storedRepliesCount: number
      actualRepliesCount: number
    }[]
  }
  error?: string
}

export async function validateAllCommentCounts(data: ValidateAllCountsInput = {}): Promise<ValidateAllCountsResponse> {
  try {
    // 1. 데이터 검증
    const validatedData = validateAllCountsSchema.parse(data)
    
    // 2. 관리자 권한 확인 (필요시)
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // 3. 댓글 목록 조회
    const comments = await prisma.projectComment.findMany({
      select: {
        id: true,
        likeCount: true,
        repliesCount: true
      },
      skip: validatedData.offset,
      take: validatedData.limit
    })

    const inconsistencies: {
      commentId: string
      storedLikeCount: number
      actualLikeCount: number
      storedRepliesCount: number
      actualRepliesCount: number
    }[] = []

    // 4. 각 댓글의 카운트 검증
    for (const comment of comments) {
      const [actualLikeCount, actualRepliesCount] = await Promise.all([
        prisma.projectCommentLike.count({
          where: { commentId: comment.id }
        }),
        prisma.projectComment.count({
          where: { parentId: comment.id }
        })
      ])

      // 불일치 발견시 기록
      if (comment.likeCount !== actualLikeCount || comment.repliesCount !== actualRepliesCount) {
        inconsistencies.push({
          commentId: comment.id,
          storedLikeCount: comment.likeCount,
          actualLikeCount,
          storedRepliesCount: comment.repliesCount,
          actualRepliesCount
        })
      }
    }

    return {
      success: true,
      data: {
        totalComments: comments.length,
        inconsistentComments: inconsistencies.length,
        inconsistencies
      }
    }

  } catch (error: unknown) {
    console.error('카운트 검증 오류:', error)
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.issues[0]?.message || '입력 데이터가 올바르지 않습니다' 
      }
    }
    
    return { success: false, error: '카운트 검증 중 오류가 발생했습니다' }
  }
}

// 댓글 카운트 불일치 자동 수정 (크론잡용)
export async function autoFixCommentCounts(): Promise<SyncCountsResponse> {
  try {
    const startTime = Date.now()
    
    // 1. 불일치 댓글 찾기
    const validation = await validateAllCommentCounts({ limit: 1000 })
    
    if (!validation.success || !validation.data) {
      return { success: false, error: '카운트 검증 실패' }
    }

    const { inconsistencies } = validation.data
    
    if (inconsistencies.length === 0) {
      return {
        success: true,
        data: {
          processedComments: 0,
          updatedLikeCounts: 0,
          updatedReplyCounts: 0,
          errors: [],
          processingTime: Date.now() - startTime
        }
      }
    }

    // 2. 불일치 댓글 수정
    const commentIds = inconsistencies.map(item => item.commentId)
    const syncResult = await syncCommentCounts({ commentIds })

    return syncResult

  } catch (error: unknown) {
    console.error('자동 수정 오류:', error)
    return { success: false, error: '자동 수정 중 오류가 발생했습니다' }
  }
}