'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { z } from 'zod'

// 댓글 통계 조회 스키마 (내부 사용)
const getCommentStatsSchema = z.object({
  projectId: z.string().uuid('올바른 프로젝트 ID를 입력해주세요'),
  timeRange: z.enum(['24h', '7d', '30d', 'all']).default('all')
})

export type GetCommentStatsData = z.infer<typeof getCommentStatsSchema>

// 댓글 통계 응답 타입
export interface CommentStatsResponse {
  success: boolean
  data?: {
    totalComments: number
    totalReplies: number
    totalLikes: number
    averageRepliesPerComment: number
    mostLikedComment: {
      id: string
      content: string
      likeCount: number
      author: {
        username: string
        avatarUrl: string | null
      }
    } | null
    mostRepliedComment: {
      id: string
      content: string
      repliesCount: number
      author: {
        username: string
        avatarUrl: string | null
      }
    } | null
    commentsByDate: {
      date: string
      count: number
    }[]
    topCommenters: {
      author: {
        id: string
        username: string
        avatarUrl: string | null
      }
      commentCount: number
      totalLikes: number
    }[]
  }
  error?: string
}

export async function getCommentStats(data: GetCommentStatsData): Promise<CommentStatsResponse> {
  try {
    // 1. 데이터 검증
    const validatedData = getCommentStatsSchema.parse(data)
    
    // 2. 사용자 인증 확인 (선택사항)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = user // user 정보는 향후 권한 확인 시 사용 예정
    
    // 3. 프로젝트 존재 확인
    const project = await prisma.project.findUnique({
      where: { id: validatedData.projectId },
      select: { id: true }
    })

    if (!project) {
      return { success: false, error: '존재하지 않는 프로젝트입니다' }
    }

    // 4. 시간 범위 계산
    const timeRange = getTimeRange(validatedData.timeRange)
    const whereClause: {
      projectId: string
      createdAt?: { gte: Date }
    } = {
      projectId: validatedData.projectId,
      ...(timeRange && { createdAt: { gte: timeRange } })
    }

    // 5. 병렬로 통계 데이터 조회
    const [
      totalComments,
      totalReplies,
      totalLikes,
      mostLikedComment,
      mostRepliedComment,
      commentsByDate,
      topCommenters
    ] = await Promise.all([
      // 총 댓글 수
      prisma.projectComment.count({
        where: whereClause
      }),
      
      // 총 답글 수
      prisma.projectComment.count({
        where: {
          ...whereClause,
          parentId: { not: null }
        }
      }),
      
      // 총 좋아요 수
      prisma.projectCommentLike.count({
        where: {
          comment: whereClause
        }
      }),
      
      // 가장 많은 좋아요를 받은 댓글
      prisma.projectComment.findFirst({
        where: whereClause,
        orderBy: { likeCount: 'desc' },
        select: {
          id: true,
          content: true,
          likeCount: true,
          author: {
            select: {
              username: true,
              avatarUrl: true
            }
          }
        }
      }),
      
      // 가장 많은 답글을 받은 댓글
      prisma.projectComment.findFirst({
        where: whereClause,
        orderBy: { repliesCount: 'desc' },
        select: {
          id: true,
          content: true,
          repliesCount: true,
          author: {
            select: {
              username: true,
              avatarUrl: true
            }
          }
        }
      }),
      
      // 날짜별 댓글 수
      getCommentsByDate(validatedData.projectId, timeRange),
      
      // 상위 댓글 작성자들
      getTopCommenters(validatedData.projectId, timeRange)
    ])

    // 6. 평균 답글 수 계산
    const parentComments = await prisma.projectComment.count({
      where: {
        ...whereClause,
        parentId: null
      }
    })
    
    const averageRepliesPerComment = parentComments > 0 ? totalReplies / parentComments : 0

    return {
      success: true,
      data: {
        totalComments,
        totalReplies,
        totalLikes,
        averageRepliesPerComment: Math.round(averageRepliesPerComment * 100) / 100,
        mostLikedComment: mostLikedComment ? {
          id: mostLikedComment.id,
          content: mostLikedComment.content,
          likeCount: mostLikedComment.likeCount,
          author: mostLikedComment.author
        } : null,
        mostRepliedComment: mostRepliedComment ? {
          id: mostRepliedComment.id,
          content: mostRepliedComment.content,
          repliesCount: mostRepliedComment.repliesCount,
          author: mostRepliedComment.author
        } : null,
        commentsByDate,
        topCommenters
      }
    }

  } catch (error: unknown) {
    console.error('댓글 통계 조회 오류:', error)
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.issues[0]?.message || '입력 데이터가 올바르지 않습니다' 
      }
    }
    
    return { success: false, error: '댓글 통계 조회 중 오류가 발생했습니다' }
  }
}

// 시간 범위 계산 헬퍼 함수
function getTimeRange(timeRange: string): Date | null {
  const now = new Date()
  
  switch (timeRange) {
    case '24h':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000)
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    case 'all':
    default:
      return null
  }
}

// 날짜별 댓글 수 조회 헬퍼 함수
async function getCommentsByDate(projectId: string, timeRange: Date | null) {
  const whereClause: {
    projectId: string
    createdAt?: { gte: Date }
  } = { projectId }
  if (timeRange) {
    whereClause.createdAt = { gte: timeRange }
  }

  const comments = await prisma.projectComment.findMany({
    where: whereClause,
    select: {
      createdAt: true
    }
  })

  // 날짜별로 그룹화
  const dateGroups: { [key: string]: number } = {}
  
  comments.forEach(comment => {
    const date = comment.createdAt.toISOString().split('T')[0] // YYYY-MM-DD 형식
    dateGroups[date] = (dateGroups[date] || 0) + 1
  })

  // 배열로 변환하고 정렬
  return Object.entries(dateGroups)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

// 상위 댓글 작성자 조회 헬퍼 함수
async function getTopCommenters(projectId: string, timeRange: Date | null) {
  const whereClause: {
    projectId: string
    createdAt?: { gte: Date }
  } = { projectId }
  if (timeRange) {
    whereClause.createdAt = { gte: timeRange }
  }

  const commenters = await prisma.projectComment.groupBy({
    by: ['authorId'],
    where: whereClause,
    _count: {
      id: true
    },
    _sum: {
      likeCount: true
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    },
    take: 5
  })

  // 작성자 정보 추가
  const topCommenters = await Promise.all(
    commenters.map(async (commenter) => {
      const author = await prisma.user.findUnique({
        where: { id: commenter.authorId },
        select: {
          id: true,
          username: true,
          avatarUrl: true
        }
      })

      return {
        author: author || {
          id: commenter.authorId,
          username: '알 수 없음',
          avatarUrl: null
        },
        commentCount: commenter._count.id,
        totalLikes: commenter._sum.likeCount || 0
      }
    })
  )

  return topCommenters
}

// 전체 플랫폼 댓글 통계 (관리자용)
export interface GlobalCommentStatsResponse {
  success: boolean
  data?: {
    totalComments: number
    totalProjects: number
    totalUsers: number
    averageCommentsPerProject: number
    averageCommentsPerUser: number
    mostActiveProjects: {
      id: string
      title: string
      commentCount: number
    }[]
    recentActivity: {
      date: string
      comments: number
      likes: number
    }[]
  }
  error?: string
}

export async function getGlobalCommentStats(): Promise<GlobalCommentStatsResponse> {
  try {
    // 관리자 권한 확인
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // 전체 통계 조회
    const [
      totalComments,
      totalProjects,
      totalUsers,
      projectStats,
      recentActivity
    ] = await Promise.all([
      prisma.projectComment.count(),
      prisma.project.count(),
      prisma.user.count(),
      
      // 프로젝트별 댓글 수
      prisma.projectComment.groupBy({
        by: ['projectId'],
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 5
      }),
      
      // 최근 7일간 활동
      getRecentActivity()
    ])

    // 프로젝트 정보 추가
    const mostActiveProjects = await Promise.all(
      projectStats.map(async (stat: { projectId: string; _count: { id: number } }) => {
        const project = await prisma.project.findUnique({
          where: { id: stat.projectId },
          select: {
            id: true,
            title: true
          }
        })

        return {
          id: stat.projectId,
          title: project?.title || '알 수 없음',
          commentCount: stat._count.id
        }
      })
    )

    const averageCommentsPerProject = totalProjects > 0 ? totalComments / totalProjects : 0
    const averageCommentsPerUser = totalUsers > 0 ? totalComments / totalUsers : 0

    return {
      success: true,
      data: {
        totalComments,
        totalProjects,
        totalUsers,
        averageCommentsPerProject: Math.round(averageCommentsPerProject * 100) / 100,
        averageCommentsPerUser: Math.round(averageCommentsPerUser * 100) / 100,
        mostActiveProjects,
        recentActivity
      }
    }

  } catch (error: unknown) {
    console.error('전체 댓글 통계 조회 오류:', error)
    return { success: false, error: '전체 댓글 통계 조회 중 오류가 발생했습니다' }
  }
}

// 최근 활동 조회 헬퍼 함수
async function getRecentActivity() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  
  const [comments, likes] = await Promise.all([
    prisma.projectComment.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo }
      },
      select: {
        createdAt: true
      }
    }),
    prisma.projectCommentLike.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo }
      },
      select: {
        createdAt: true
      }
    })
  ])

  // 날짜별로 그룹화
  const activityByDate: { [key: string]: { comments: number, likes: number } } = {}
  
  comments.forEach(comment => {
    const date = comment.createdAt.toISOString().split('T')[0]
    if (!activityByDate[date]) {
      activityByDate[date] = { comments: 0, likes: 0 }
    }
    activityByDate[date].comments++
  })

  likes.forEach(like => {
    const date = like.createdAt.toISOString().split('T')[0]
    if (!activityByDate[date]) {
      activityByDate[date] = { comments: 0, likes: 0 }
    }
    activityByDate[date].likes++
  })

  return Object.entries(activityByDate)
    .map(([date, activity]) => ({
      date,
      comments: activity.comments,
      likes: activity.likes
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}