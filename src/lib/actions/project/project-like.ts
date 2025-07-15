'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma/client'
import { createClient } from '@/lib/supabase/server'
import { uuidv7 } from 'uuidv7'

export interface LikeActionResult {
  success: boolean
  isLiked: boolean
  likeCount: number
  error?: string
}

/**
 * 프로젝트 좋아요 토글 (추가/제거)
 */
export async function toggleProjectLike(projectId: string): Promise<LikeActionResult> {
  try {
    // 사용자 인증 확인
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return {
        success: false,
        isLiked: false,
        likeCount: 0,
        error: '로그인이 필요합니다.'
      }
    }

    // 트랜잭션으로 좋아요 상태 토글
    const result = await prisma.$transaction(async (tx) => {
      // 현재 좋아요 상태 확인
      const existingLike = await tx.projectLike.findUnique({
        where: {
          userId_projectId: {
            userId: user.id,
            projectId: projectId
          }
        }
      })

      let isLiked: boolean
      let likeCountDelta: number

      if (existingLike) {
        // 좋아요 제거
        await tx.projectLike.delete({
          where: {
            id: existingLike.id
          }
        })
        isLiked = false
        likeCountDelta = -1
      } else {
        // 좋아요 추가
        await tx.projectLike.create({
          data: {
            id: uuidv7(),
            userId: user.id,
            projectId: projectId
          }
        })
        isLiked = true
        likeCountDelta = 1
      }

      // 프로젝트의 likeCount 업데이트
      const updatedProject = await tx.project.update({
        where: { id: projectId },
        data: {
          likeCount: {
            increment: likeCountDelta
          }
        },
        select: {
          likeCount: true
        }
      })

      return {
        isLiked,
        likeCount: updatedProject.likeCount
      }
    })

    // 관련 페이지들 재검증
    revalidatePath(`/project/${projectId}`)
    revalidatePath('/') // 메인 페이지의 프로젝트 목록
    revalidatePath('/projects') // 프로젝트 목록 페이지

    return {
      success: true,
      isLiked: result.isLiked,
      likeCount: result.likeCount
    }

  } catch (error) {
    console.error('좋아요 토글 중 오류:', error)
    return {
      success: false,
      isLiked: false,
      likeCount: 0,
      error: '좋아요 처리 중 오류가 발생했습니다.'
    }
  }
}

/**
 * 사용자의 프로젝트 좋아요 상태 조회
 */
export async function getProjectLikeStatus(projectId: string): Promise<{
  isLiked: boolean
  likeCount: number
}> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const [project, userLike] = await Promise.all([
      // 프로젝트 좋아요 개수 조회
      prisma.project.findUnique({
        where: { id: projectId },
        select: { likeCount: true }
      }),
      // 사용자 좋아요 상태 조회 (로그인한 경우에만)
      user ? prisma.projectLike.findUnique({
        where: {
          userId_projectId: {
            userId: user.id,
            projectId: projectId
          }
        }
      }) : null
    ])

    return {
      isLiked: !!userLike,
      likeCount: project?.likeCount || 0
    }

  } catch (error) {
    console.error('좋아요 상태 조회 중 오류:', error)
    return {
      isLiked: false,
      likeCount: 0
    }
  }
}

/**
 * 프로젝트 좋아요 개수만 조회 (캐시된 값 사용)
 */
export async function getProjectLikeCount(projectId: string): Promise<number> {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { likeCount: true }
    })
    
    return project?.likeCount || 0
  } catch (error) {
    console.error('좋아요 개수 조회 중 오류:', error)
    return 0
  }
}

/**
 * 프로젝트를 좋아요한 사용자 목록 조회 (페이지네이션)
 */
export async function getProjectLikedUsers(
  projectId: string,
  page: number = 1,
  limit: number = 20
) {
  try {
    const offset = (page - 1) * limit

    const [likes, totalCount] = await Promise.all([
      prisma.projectLike.findMany({
        where: { projectId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset,
        take: limit
      }),
      prisma.projectLike.count({
        where: { projectId }
      })
    ])

    return {
      users: likes.map(like => like.user),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }

  } catch (error) {
    console.error('좋아요 사용자 목록 조회 중 오류:', error)
    return {
      users: [],
      pagination: {
        page: 1,
        limit,
        totalCount: 0,
        totalPages: 0
      }
    }
  }
}