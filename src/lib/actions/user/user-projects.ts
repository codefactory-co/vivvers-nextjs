'use server'

import { prisma } from '@/lib/prisma/client'
import { Project } from '@/types/project'

export interface GetProjectsByUserIdOptions {
  page?: number
  limit?: number
  sortBy?: 'latest' | 'popular' | 'updated'
}

export interface ProjectsResponse {
  projects: Project[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface GetProjectsByUserIdResult {
  success: boolean
  data?: ProjectsResponse
  error?: string
}

/**
 * 특정 사용자의 프로젝트 목록을 조회합니다 (Prisma 데이터베이스 사용)
 */
export async function getProjectsByUserId(
  userId: string, 
  options: GetProjectsByUserIdOptions = {}
): Promise<GetProjectsByUserIdResult> {
  try {
    const {
      page = 1,
      limit = 9,
      sortBy = 'latest'
    } = options

    if (!userId) {
      return {
        success: false,
        error: '사용자 ID가 필요합니다'
      }
    }

    // 정렬 옵션 설정
    let orderBy: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' } // 기본값: 최신순
    
    switch (sortBy) {
      case 'popular':
        orderBy = { likeCount: 'desc' }
        break
      case 'updated':
        orderBy = { updatedAt: 'desc' }
        break
      case 'latest':
      default:
        orderBy = { createdAt: 'desc' }
        break
    }

    // 총 개수 조회
    const totalCount = await prisma.project.count({
      where: { authorId: userId }
    })

    // 페이지네이션 계산
    const totalPages = Math.ceil(totalCount / limit)
    const skip = (page - 1) * limit

    // 프로젝트 목록 조회
    const projects = await prisma.project.findMany({
      where: { authorId: userId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            avatarUrl: true,
            bio: true
          }
        },
        projectTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      },
      orderBy,
      skip,
      take: limit
    })

    // 데이터 변환 (Prisma 결과를 Project 타입으로 변환)
    const transformedProjects: Project[] = projects.map(project => ({
      id: project.id,
      title: project.title,
      excerpt: project.excerpt,
      description: project.description,
      fullDescription: project.fullDescription,
      fullDescriptionHtml: project.fullDescriptionHtml,
      fullDescriptionJson: project.fullDescriptionJson,
      images: project.images,
      screenshots: project.images, // Use images as screenshots for now
      category: project.category,
      tags: project.projectTags.map(pt => ({ id: pt.tag.id, name: pt.tag.name })),
      techStack: project.projectTags.map(pt => ({ id: pt.tag.id, name: pt.tag.name })), // Use same tags for now
      features: project.features,
      demoUrl: project.demoUrl,
      githubUrl: project.githubUrl,
      likes: [], // 좋아요 목록은 별도로 조회 필요시에만
      likeCount: project._count.likes,
      viewCount: project.viewCount,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      featured: project.featured,
      author: {
        id: project.author.id,
        username: project.author.username,
        email: project.author.email,
        avatarUrl: project.author.avatarUrl,
        bio: project.author.bio
      }
    }))

    const result: ProjectsResponse = {
      projects: transformedProjects,
      totalCount,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
    
    return {
      success: true,
      data: result
    }

  } catch (error) {
    console.error('사용자 프로젝트 조회 오류:', error)
    return {
      success: false,
      error: '프로젝트 조회 중 오류가 발생했습니다'
    }
  }
}

/**
 * 사용자가 작성한 프로젝트 개수를 조회합니다 (Prisma 데이터베이스 사용)
 */
export async function getUserProjectCount(userId: string): Promise<number> {
  try {
    if (!userId) return 0
    
    const count = await prisma.project.count({
      where: { authorId: userId }
    })
    
    return count
    
  } catch (error) {
    console.error('사용자 프로젝트 개수 조회 오류:', error)
    return 0
  }
}