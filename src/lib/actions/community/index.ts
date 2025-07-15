'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getUser } from '@/lib/supabase/server'
import { 
  createCommunityPost, 
  toggleCommunityPostLike,
  getCommunityPostById,
  createCommunityComment,
  toggleCommunityCommentLike,
  setBestAnswer
} from '@/lib/services/community'
import { 
  CommunityPostActionResult, 
  CommunityLikeActionResult,
  CommunityPostFormData,
  CommunityCommentActionResult,
  CommunityCommentFormData
} from '@/types/community'

export async function createPost(formData: CommunityPostFormData): Promise<CommunityPostActionResult> {
  try {
    const user = await getUser()
    
    if (!user) {
      return {
        success: false,
        error: '로그인이 필요합니다.'
      }
    }

    // Validate required fields
    if (!formData.title?.trim()) {
      return {
        success: false,
        error: '제목을 입력해주세요.'
      }
    }

    if (!formData.content?.trim()) {
      return {
        success: false,
        error: '내용을 입력해주세요.'
      }
    }

    console.log('=== FORM DATA DEBUG ===')
    console.log('Form data tags:', formData.tags)
    console.log('Form data tags type:', typeof formData.tags)
    console.log('Form data tags length:', formData.tags?.length)
    console.log('User ID:', user.id)
    console.log('User ID type:', typeof user.id)
    console.log('=== END FORM DATA DEBUG ===')
    
    console.log('=== ABOUT TO CALL createCommunityPost ===')
    console.log('Calling createCommunityPost with data:')
    console.log('- title:', formData.title.trim())
    console.log('- content length:', formData.content.trim().length)
    console.log('- authorId:', user.id)
    console.log('- tags:', formData.tags || [])
    console.log('=== CALLING createCommunityPost ===')
    
    const post = await createCommunityPost({
      title: formData.title.trim(),
      content: formData.content.trim(),
      contentHtml: formData.contentHtml || '',
      contentJson: formData.contentJson,
      authorId: user.id,
      tags: formData.tags || []
    })

    revalidatePath('/community')
    
    return {
      success: true,
      data: { post }
    }
  } catch (error) {
    console.error('Failed to create community post:', error)
    return {
      success: false,
      error: '게시글 작성에 실패했습니다.'
    }
  }
}

export async function createPostAndRedirect(formData: CommunityPostFormData) {
  const result = await createPost(formData)
  
  if (result.success && result.data) {
    redirect(`/community/post/${result.data.post.id}`)
  }
  
  return result
}

export async function togglePostLike(postId: string): Promise<CommunityLikeActionResult> {
  try {
    const user = await getUser()
    
    if (!user) {
      return {
        success: false,
        error: '로그인이 필요합니다.'
      }
    }

    const result = await toggleCommunityPostLike(postId, user.id)
    
    revalidatePath('/community')
    revalidatePath(`/community/post/${postId}`)
    
    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('Failed to toggle post like:', error)
    return {
      success: false,
      error: '좋아요 처리에 실패했습니다.'
    }
  }
}

export async function incrementPostViews(postId: string) {
  try {
    // This is handled in getCommunityPostById service
    await getCommunityPostById(postId)
    revalidatePath(`/community/post/${postId}`)
  } catch (error) {
    console.error('Failed to increment post views:', error)
  }
}

export async function createComment(
  postId: string,
  formData: CommunityCommentFormData
): Promise<CommunityCommentActionResult> {
  try {
    console.log('[DEBUG] createComment called with:', {
      postId,
      parentId: formData.parentId,
      contentLength: formData.content?.length
    })
    
    const user = await getUser()
    
    if (!user) {
      return {
        success: false,
        error: '로그인이 필요합니다.'
      }
    }

    // Validate content
    if (!formData.content?.trim()) {
      return {
        success: false,
        error: '댓글 내용을 입력해주세요.'
      }
    }

    const comment = await createCommunityComment({
      postId,
      authorId: user.id,
      content: formData.content.trim(),
      contentHtml: formData.contentHtml,
      contentJson: formData.contentJson,
      parentId: formData.parentId || null
    })

    console.log('[DEBUG] Comment created:', {
      commentId: comment.id,
      parentId: comment.parentId,
      isReply: !!comment.parentId
    })

    // Revalidate paths
    console.log('[DEBUG] Revalidating paths...')
    revalidatePath(`/community/post/${postId}`)
    revalidatePath('/community')
    console.log('[DEBUG] Paths revalidated')
    
    return {
      success: true,
      data: { comment }
    }
  } catch (error) {
    console.error('Failed to create comment:', error)
    return {
      success: false,
      error: '댓글 작성에 실패했습니다.'
    }
  }
}

export async function toggleCommentLike(commentId: string, postId: string): Promise<CommunityLikeActionResult> {
  try {
    const user = await getUser()
    
    if (!user) {
      return {
        success: false,
        error: '로그인이 필요합니다.'
      }
    }

    const result = await toggleCommunityCommentLike(commentId, user.id)
    
    // Revalidate both the specific post page and community list
    revalidatePath('/community')
    revalidatePath(`/community/post/${postId}`)
    
    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('Failed to toggle comment like:', error)
    return {
      success: false,
      error: '좋아요 처리에 실패했습니다.'
    }
  }
}

export async function selectBestAnswer(
  commentId: string,
  postId: string,
  postAuthorId: string
): Promise<CommunityCommentActionResult> {
  try {
    const user = await getUser()
    
    if (!user) {
      return {
        success: false,
        error: '로그인이 필요합니다.'
      }
    }

    await setBestAnswer(commentId, postId, postAuthorId, user.id)
    
    revalidatePath(`/community/post/${postId}`)
    revalidatePath('/community')
    
    return {
      success: true
    }
  } catch (error) {
    console.error('Failed to select best answer:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '베스트 답변 선택에 실패했습니다.'
    }
  }
}