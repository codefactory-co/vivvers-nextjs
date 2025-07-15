'use server'

import { prisma } from '@/lib/prisma/client'

export async function getProjectById(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
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
        projectTechStacks: {
          include: {
            tag: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        likes: {
          select: {
            id: true,
            userId: true
          }
        }
      }
    })

    if (!project) {
      return { success: false, error: '프로젝트를 찾을 수 없습니다', project: null }
    }

    // 조회수 증가
    await prisma.project.update({
      where: { id: projectId },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })

    // 데이터 변환
    const transformedProject = {
      id: project.id,
      title: project.title,
      excerpt: project.excerpt,
      description: project.description,
      fullDescription: project.fullDescription,
      fullDescriptionJson: project.fullDescriptionJson,
      fullDescriptionHtml: project.fullDescriptionHtml,
      category: project.category,
      images: project.images,
      screenshots: project.images, // 호환성을 위해 screenshots도 추가
      demoUrl: project.demoUrl,
      githubUrl: project.githubUrl,
      features: project.features,
      viewCount: project.viewCount + 1, // 증가된 조회수 반영
      likeCount: project.likeCount,
      author: {
        id: project.author.id,
        username: project.author.username,
        email: project.author.email,
        avatarUrl: project.author.avatarUrl,
        bio: project.author.bio
      },
      tags: project.projectTags.map(pt => ({
        id: pt.tag.id,
        name: pt.tag.name
      })),
      techStack: project.projectTechStacks.map(pts => ({
        id: pts.tag.id,
        name: pts.tag.name
      })),
      likes: project.likes,
      comments: [], // 빈 댓글 배열 추가
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    }

    return { success: true, project: transformedProject, error: null }

  } catch (error) {
    console.error('프로젝트 조회 오류:', error)
    return { success: false, error: '프로젝트 조회 중 오류가 발생했습니다', project: null }
  }
}

export async function incrementProjectViewCount(projectId: string) {
  try {
    await prisma.project.update({
      where: { id: projectId },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })
    return { success: true }
  } catch (error) {
    console.error('조회수 증가 오류:', error)
    return { success: false, error: '조회수 증가 중 오류가 발생했습니다' }
  }
}