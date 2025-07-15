import { prisma } from '@/lib/prisma/client'
import { CommunityPost, CommunityFilters, CommunityPostsResponse } from '@/types/community'
import { randomUUID } from 'crypto'
import type { Prisma } from '@prisma/client'

interface GetCommunityPostsParams {
  filters: CommunityFilters
  page: number
  pageSize: number
}

export async function getCommunityPosts({
  filters,
  page = 1,
  pageSize = 10
}: GetCommunityPostsParams): Promise<CommunityPostsResponse> {
  const skip = (page - 1) * pageSize

  // Build where clause
  const where: Record<string, unknown> = {}

  // Search filter
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { content: { contains: filters.search, mode: 'insensitive' } }
    ]
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    where.tags = {
      some: {
        tag: {
          name: { in: filters.tags }
        }
      }
    }
  }

  // Author filter
  if (filters.authorId) {
    where.authorId = filters.authorId
  }

  // Related project filter
  if (filters.relatedProjectId) {
    where.relatedProjectId = filters.relatedProjectId
  }

  // Build orderBy
  let orderBy: Record<string, string> = { createdAt: 'desc' } // default

  switch (filters.sortBy) {
    case 'popular':
      orderBy = { likesCount: 'desc' }
      break
    case 'mostCommented':
      orderBy = { commentsCount: 'desc' }
      break
    case 'mostViewed':
      orderBy = { viewsCount: 'desc' }
      break
    case 'latest':
    default:
      orderBy = { createdAt: 'desc' }
      break
  }

  try {
    const [posts, total] = await Promise.all([
      prisma.communityPost.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatarUrl: true
            }
          },
          relatedProject: {
            select: {
              id: true,
              title: true
            }
          },
          tags: {
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
          likes: {
            select: {
              userId: true
            }
          },
          comments: {
            where: { isBestAnswer: true },
            select: {
              id: true,
              isBestAnswer: true
            },
            take: 1
          }
        }
      }),
      prisma.communityPost.count({ where })
    ])

    const hasMore = skip + posts.length < total

    return {
      posts: posts as CommunityPost[],
      total,
      page,
      pageSize,
      hasMore
    }
  } catch (error) {
    console.error('Failed to get community posts:', error)
    throw new Error('Failed to get community posts')
  }
}

export async function getCommunityPostById(id: string): Promise<CommunityPost | null> {
  try {
    const post = await prisma.communityPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        },
        relatedProject: {
          select: {
            id: true,
            title: true
          }
        },
        tags: {
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
        likes: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatarUrl: true
              }
            }
          }
        },
        comments: {
          where: { parentId: null }, // Top-level comments only
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatarUrl: true
              }
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    avatarUrl: true
                  }
                },
                likes: {
                  select: {
                    userId: true,
                    user: {
                      select: {
                        id: true,
                        username: true,
                        avatarUrl: true
                      }
                    }
                  }
                }
              },
              orderBy: { createdAt: 'asc' }
            },
            likes: {
              select: {
                userId: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    avatarUrl: true
                  }
                }
              }
            }
          },
          orderBy: [
            { isBestAnswer: 'desc' }, // Best answers first
            { createdAt: 'asc' }
          ]
        }
      }
    })

    if (!post) {
      return null
    }

    // Increment view count
    await prisma.communityPost.update({
      where: { id },
      data: { viewsCount: { increment: 1 } }
    })

    return post as CommunityPost
  } catch (error) {
    console.error('Failed to get community post:', error)
    throw new Error('Failed to get community post')
  }
}

export async function createCommunityPost({
  title,
  content,
  contentHtml,
  contentJson,
  authorId,
  tags = [],
  relatedProjectId
}: {
  title: string
  content: string
  contentHtml: string
  contentJson: unknown
  authorId: string
  tags?: string[]
  relatedProjectId?: string
}): Promise<CommunityPost> {
  try {
    const postId = randomUUID()

    const post = await prisma.communityPost.create({
      data: {
        id: postId,
        title,
        content,
        contentHtml,
        contentJson: contentJson as Prisma.InputJsonValue,
        authorId,
        relatedProjectId: relatedProjectId || null,
        tags: {
          create: tags.map(tagId => ({
            id: randomUUID(),
            tagId
          }))
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
        relatedProject: {
          select: {
            id: true,
            title: true
          }
        },
        tags: {
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
        likes: true,
        comments: true
      }
    })

    // Update user's community posts count
    await prisma.user.update({
      where: { id: authorId },
      data: { communityPostsCount: { increment: 1 } }
    })

    return post as CommunityPost
  } catch (error) {
    console.error('Failed to create community post:', error)
    throw new Error('Failed to create community post')
  }
}

export async function toggleCommunityPostLike(postId: string, userId: string): Promise<{
  isLiked: boolean
  likeCount: number
}> {
  try {
    const existingLike = await prisma.communityPostLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    })

    if (existingLike) {
      // Unlike
      await Promise.all([
        prisma.communityPostLike.delete({
          where: { id: existingLike.id }
        }),
        prisma.communityPost.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } }
        })
      ])

      const post = await prisma.communityPost.findUnique({
        where: { id: postId },
        select: { likesCount: true }
      })

      return {
        isLiked: false,
        likeCount: post?.likesCount || 0
      }
    } else {
      // Like
      await Promise.all([
        prisma.communityPostLike.create({
          data: {
            id: randomUUID(),
            userId,
            postId
          }
        }),
        prisma.communityPost.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } }
        })
      ])

      const post = await prisma.communityPost.findUnique({
        where: { id: postId },
        select: { likesCount: true }
      })

      return {
        isLiked: true,
        likeCount: post?.likesCount || 0
      }
    }
  } catch (error) {
    console.error('Failed to toggle community post like:', error)
    throw new Error('Failed to toggle like')
  }
}