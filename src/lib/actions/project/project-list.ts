'use server'

import { prisma } from '@/lib/prisma/client'
import { Project } from '@/types/project'

export interface ProjectFilters {
  category?: string
  tags?: string[]
  sortBy?: 'latest' | 'popular' | 'updated'
  featured?: boolean
  search?: string
}

export interface ProjectListResponse {
  projects: Project[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasMore: boolean
}

export async function getProjectsWithFilters(
  filters: ProjectFilters = {},
  page: number = 1,
  limit: number = 12
): Promise<ProjectListResponse> {
  try {
    const { category, tags, sortBy = 'latest', featured, search } = filters
    const skip = (page - 1) * limit

    // Build where clause
    const whereClause: Record<string, unknown> = {}

    // Category filter
    if (category) {
      whereClause.category = category
    }

    // Featured filter
    if (featured !== undefined) {
      whereClause.featured = featured
    }

    // Tag filter
    if (tags && tags.length > 0) {
      whereClause.projectTags = {
        some: {
          tag: {
            name: {
              in: tags
            }
          }
        }
      }
    }

    // Search filter
    if (search && search.trim()) {
      const searchTerm = search.trim()
      whereClause.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { excerpt: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } }
      ]
    }

    // Sort options
    const sortOptions = {
      latest: { createdAt: 'desc' },
      popular: { likeCount: 'desc' },
      updated: { updatedAt: 'desc' }
    }

    // Get total count for pagination
    const totalCount = await prisma.project.count({
      where: whereClause
    })

    // Get projects with relations
    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        },
        projectTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                              }
            }
          }
        },
        projectTechStacks: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                              }
            }
          }
        }
      },
      orderBy: sortOptions[sortBy] as { createdAt?: 'desc' } | { likeCount?: 'desc' } | { updatedAt?: 'desc' },
      skip,
      take: limit
    })

    // Transform data to match Project interface
    const transformedProjects: Project[] = projects.map(project => ({
      id: project.id,
      title: project.title,
      excerpt: project.excerpt,
      description: project.description,
      category: project.category,
      images: project.images,
      screenshots: project.images, // For compatibility
      demoUrl: project.demoUrl,
      githubUrl: project.githubUrl,
      features: project.features,
      viewCount: project.viewCount,
      likeCount: project.likeCount,
      author: {
        id: project.author.id,
        username: project.author.username,
        email: `${project.author.username}@example.com`, // Temporary for compatibility
        avatarUrl: project.author.avatarUrl,
        bio: null
      },
      tags: project.projectTags.map(pt => ({
        id: pt.tag.id,
        name: pt.tag.name,
              })),
      techStack: project.projectTechStacks.map(pts => ({
        id: pts.tag.id,
        name: pts.tag.name,
              })),
      likes: [], // Empty array for compatibility
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      featured: project.featured || false
    }))

    const totalPages = Math.ceil(totalCount / limit)
    const hasMore = page < totalPages

    return {
      projects: transformedProjects,
      totalCount,
      totalPages,
      currentPage: page,
      hasMore
    }

  } catch (error) {
    console.error('프로젝트 목록 조회 오류:', error)
    return {
      projects: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
      hasMore: false
    }
  }
}

export async function getFeaturedProjects(limit: number = 6): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany({
      where: {
        featured: true
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        },
        projectTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                              }
            }
          }
        },
        projectTechStacks: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    // Transform data to match Project interface
    return projects.map(project => ({
      id: project.id,
      title: project.title,
      excerpt: project.excerpt,
      description: project.description,
      category: project.category,
      images: project.images,
      screenshots: project.images, // For compatibility
      demoUrl: project.demoUrl,
      githubUrl: project.githubUrl,
      features: project.features,
      viewCount: project.viewCount,
      likeCount: project.likeCount,
      author: {
        id: project.author.id,
        username: project.author.username,
        email: `${project.author.username}@example.com`, // Temporary for compatibility
        avatarUrl: project.author.avatarUrl,
        bio: null
      },
      tags: project.projectTags.map(pt => ({
        id: pt.tag.id,
        name: pt.tag.name,
              })),
      techStack: project.projectTechStacks.map(pts => ({
        id: pts.tag.id,
        name: pts.tag.name,
              })),
      likes: [], // Empty array for compatibility
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      featured: project.featured || false
    }))

  } catch (error) {
    console.error('특집 프로젝트 조회 오류:', error)
    return []
  }
}