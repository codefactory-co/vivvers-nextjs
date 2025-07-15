'use server'

import { prisma } from '@/lib/prisma/client'

export async function getRelatedProjects(projectId: string, category: string, limit: number = 4) {
  try {
    const relatedProjects = await prisma.project.findMany({
      where: {
        category: category,
        id: {
          not: projectId // 현재 프로젝트 제외
        }
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
                slug: true
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
                slug: true
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

    // 데이터 변환
    const transformedProjects = relatedProjects.map(project => ({
      id: project.id,
      title: project.title,
      excerpt: project.excerpt,
      description: project.description,
      category: project.category,
      images: project.images,
      screenshots: project.images, // 호환성을 위해
      demoUrl: project.demoUrl,
      githubUrl: project.githubUrl,
      features: project.features,
      viewCount: project.viewCount,
      likeCount: project.likeCount,
      author: {
        id: project.author.id,
        username: project.author.username,
        email: `${project.author.username}@example.com`,
        avatarUrl: project.author.avatarUrl,
        bio: null
      },
      tags: project.projectTags.map(pt => ({
        id: pt.tag.id,
        name: pt.tag.name,
        slug: pt.tag.slug
      })),
      techStack: project.projectTechStacks.map(pts => ({
        id: pts.tag.id,
        name: pts.tag.name,
        slug: pts.tag.slug
      })),
      likes: [], // 빈 likes 배열 추가
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    }))

    return transformedProjects

  } catch (error) {
    console.error('관련 프로젝트 조회 오류:', error)
    return []
  }
}

export async function getProjectsByCategory(category: string, limit: number = 10) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        category: category
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
                slug: true
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
                slug: true
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

    // 데이터 변환
    const transformedProjects = projects.map(project => ({
      id: project.id,
      title: project.title,
      excerpt: project.excerpt,
      description: project.description,
      category: project.category,
      images: project.images,
      screenshots: project.images, // 호환성을 위해
      demoUrl: project.demoUrl,
      githubUrl: project.githubUrl,
      features: project.features,
      viewCount: project.viewCount,
      likeCount: project.likeCount,
      author: {
        id: project.author.id,
        username: project.author.username,
        email: `${project.author.username}@example.com`,
        avatarUrl: project.author.avatarUrl,
        bio: null
      },
      tags: project.projectTags.map(pt => ({
        id: pt.tag.id,
        name: pt.tag.name,
        slug: pt.tag.slug
      })),
      techStack: project.projectTechStacks.map(pts => ({
        id: pts.tag.id,
        name: pts.tag.name,
        slug: pts.tag.slug
      })),
      likes: [], // 빈 likes 배열 추가
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    }))

    return transformedProjects

  } catch (error) {
    console.error('카테고리별 프로젝트 조회 오류:', error)
    return []
  }
}