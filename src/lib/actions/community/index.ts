'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getUser } from '@/lib/supabase/server'
import { 
  createCommunityPost, 
  toggleCommunityPostLike,
  getCommunityPostById 
} from '@/lib/services/community'
import { 
  CommunityPostActionResult, 
  CommunityLikeActionResult,
  CommunityPostFormData 
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
    
    const post = await createCommunityPost({
      title: formData.title.trim(),
      content: formData.content.trim(),
      contentHtml: formData.contentHtml || '',
      contentJson: formData.contentJson,
      authorId: user.id,
      tags: formData.tags || [],
      relatedProjectId: formData.relatedProjectId
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