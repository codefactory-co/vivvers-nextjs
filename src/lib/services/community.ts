import { prisma } from '@/lib/prisma/client'
import { CommunityPost, CommunityPostComment, CommunityFilters, CommunityPostsResponse } from '@/types/community'
import { uuidv7 } from 'uuidv7'

// Test import immediately
console.log('=== IMPORT TEST ===')
console.log('uuidv7 imported:', uuidv7)
console.log('typeof uuidv7:', typeof uuidv7)
try {
  const testUuid = uuidv7()
  console.log('Test UUID generated:', testUuid)
  console.log('Test UUID type:', typeof testUuid)
} catch (error) {
  console.error('Test UUID generation failed:', error)
}
console.log('=== END IMPORT TEST ===')
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
                  include: {
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
              include: {
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

/**
 * Helper function to resolve tag names to their corresponding UUIDs
 */
async function resolveTagsByName(tagNames: string[]): Promise<string[]> {
  if (tagNames.length === 0) {
    return []
  }

  try {
    const tags = await prisma.tag.findMany({
      where: {
        name: {
          in: tagNames
        }
      },
      select: {
        id: true,
        name: true
      }
    })

    console.log('=== TAG RESOLUTION DEBUG ===')
    console.log('Input tag names:', tagNames)
    console.log('Found tags:', tags)
    console.log('Resolved UUIDs:', tags.map(tag => tag.id))

    // Check for missing tags
    const foundTagNames = tags.map(tag => tag.name)
    const missingTags = tagNames.filter(name => !foundTagNames.includes(name))
    
    if (missingTags.length > 0) {
      console.warn('Missing tags (will be skipped):', missingTags)
    }

    console.log('=== END TAG RESOLUTION DEBUG ===')
    return tags.map(tag => tag.id)
  } catch (error) {
    console.error('Failed to resolve tag names:', error)
    throw new Error('Failed to resolve tag names')
  }
}

export async function createCommunityPost({
  title,
  content,
  contentHtml,
  contentJson,
  authorId,
  tags = []
}: {
  title: string
  content: string
  contentHtml: string
  contentJson: unknown
  authorId: string
  tags?: string[]
}): Promise<CommunityPost> {
  try {
    console.log('=== BEFORE UUID GENERATION ===')
    console.log('uuidv7 function:', uuidv7)
    console.log('typeof uuidv7:', typeof uuidv7)
    console.log('uuidv7 is function?:', typeof uuidv7 === 'function')
    
    // Test UUID generation
    let postId
    try {
      postId = uuidv7()
      console.log('UUID generation successful')
    } catch (uuidError) {
      console.error('UUID generation failed:', uuidError)
      throw uuidError
    }
    
    console.log('=== UUID v7 DEBUG INFO ===')
    console.log('Generated UUID raw:', postId)
    console.log('UUID type:', typeof postId)
    console.log('UUID is null?:', postId === null)
    console.log('UUID is undefined?:', postId === undefined)
    console.log('UUID toString():', postId ? postId.toString() : 'NULL/UNDEFINED')
    
    if (postId && typeof postId === 'string') {
      console.log('UUID length:', postId.length)
      console.log('First 10 characters:', postId.substring(0, 10))
      console.log('Character at position 0:', postId[0])
      console.log('Character at position 1:', postId[1])
      console.log('Character code at position 1:', postId.charCodeAt(1))
      console.log('Is valid hex?', /^[0-9a-fA-F-]+$/.test(postId))
      console.log('UUID parts:', postId.split('-'))
      console.log('UUID parts lengths:', postId.split('-').map(part => part.length))
    } else {
      console.log('UUID is not a string - cannot analyze further')
    }
    console.log('=== END DEBUG INFO ===')

    // Resolve tag names to UUIDs
    const tagIds = await resolveTagsByName(tags)

    const post = await prisma.communityPost.create({
      data: {
        id: postId,
        title,
        content,
        contentHtml,
        contentJson: contentJson as Prisma.InputJsonValue,
        authorId,
        tags: {
          create: tagIds.map(tagId => {
            const tagRelationId = uuidv7()
            console.log('=== TAG RELATION UUID DEBUG ===')
            console.log('Tag relation UUID:', tagRelationId)
            console.log('Tag relation UUID type:', typeof tagRelationId)
            console.log('Tag ID being used:', tagId)
            console.log('Tag ID type:', typeof tagId)
            console.log('=== END TAG DEBUG ===')
            return {
              id: tagRelationId,
              tagId
            }
          })
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
    console.error('=== ERROR DEBUG INFO ===')
    console.error('Full error object:', error)
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error code:', error && typeof error === 'object' && 'code' in error ? error.code : 'Unknown')
    console.error('Error meta:', error && typeof error === 'object' && 'meta' in error ? error.meta : 'Unknown')
    console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown')
    console.error('=== END ERROR DEBUG ===')
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
            id: uuidv7(),
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

export async function createCommunityComment({
  postId,
  authorId,
  content,
  contentHtml,
  contentJson,
  parentId
}: {
  postId: string
  authorId: string
  content: string
  contentHtml?: string
  contentJson?: unknown
  parentId?: string | null
}): Promise<CommunityPostComment> {
  try {
    const commentId = uuidv7()
    
    // Create the comment
    const comment = await prisma.communityPostComment.create({
      data: {
        id: commentId,
        postId,
        authorId,
        content,
        contentHtml,
        contentJson: contentJson as Prisma.InputJsonValue,
        parentId
      },
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
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    avatarUrl: true
                  }
                }
              }
            }
          }
        },
        likes: {
          select: {
            userId: true
          }
        }
      }
    })

    // Update counts
    const updatePromises: Promise<unknown>[] = [
      // Update post comment count
      prisma.communityPost.update({
        where: { id: postId },
        data: { commentsCount: { increment: 1 } }
      })
    ]

    // If this is a reply, update parent comment's reply count
    if (parentId) {
      updatePromises.push(
        prisma.communityPostComment.update({
          where: { id: parentId },
          data: { repliesCount: { increment: 1 } }
        })
      )
    }

    await Promise.all(updatePromises)

    return comment as CommunityPostComment
  } catch (error) {
    console.error('Failed to create community comment:', error)
    throw new Error('Failed to create comment')
  }
}

export async function toggleCommunityCommentLike(commentId: string, userId: string): Promise<{
  isLiked: boolean
  likeCount: number
}> {
  try {
    const existingLike = await prisma.communityPostCommentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId
        }
      }
    })

    if (existingLike) {
      // Unlike
      await Promise.all([
        prisma.communityPostCommentLike.delete({
          where: { id: existingLike.id }
        }),
        prisma.communityPostComment.update({
          where: { id: commentId },
          data: { likesCount: { decrement: 1 } }
        })
      ])

      const comment = await prisma.communityPostComment.findUnique({
        where: { id: commentId },
        select: { likesCount: true }
      })

      return {
        isLiked: false,
        likeCount: comment?.likesCount || 0
      }
    } else {
      // Like
      await Promise.all([
        prisma.communityPostCommentLike.create({
          data: {
            id: uuidv7(),
            userId,
            commentId
          }
        }),
        prisma.communityPostComment.update({
          where: { id: commentId },
          data: { likesCount: { increment: 1 } }
        })
      ])

      const comment = await prisma.communityPostComment.findUnique({
        where: { id: commentId },
        select: { likesCount: true }
      })

      return {
        isLiked: true,
        likeCount: comment?.likesCount || 0
      }
    }
  } catch (error) {
    console.error('Failed to toggle community comment like:', error)
    throw new Error('Failed to toggle comment like')
  }
}

export async function setBestAnswer(commentId: string, postId: string, postAuthorId: string, userId: string): Promise<void> {
  try {
    // Verify the user is the post author
    if (userId !== postAuthorId) {
      throw new Error('Only the post author can select best answer')
    }

    // Check if comment belongs to the post
    const comment = await prisma.communityPostComment.findFirst({
      where: {
        id: commentId,
        postId: postId
      }
    })

    if (!comment) {
      throw new Error('Comment not found or does not belong to this post')
    }

    // Remove any existing best answer for this post
    await prisma.communityPostComment.updateMany({
      where: {
        postId: postId,
        isBestAnswer: true
      },
      data: {
        isBestAnswer: false
      }
    })

    // Set the new best answer
    await prisma.communityPostComment.update({
      where: { id: commentId },
      data: { isBestAnswer: true }
    })

    // Update helpful answers count for the comment author
    await prisma.user.update({
      where: { id: comment.authorId },
      data: { helpfulAnswersCount: { increment: 1 } }
    })
  } catch (error) {
    console.error('Failed to set best answer:', error)
    throw error instanceof Error ? error : new Error('Failed to set best answer')
  }
}