'use client'

import { createClient } from '@/lib/supabase/client'

/**
 * Avatar 이미지를 Supabase Storage에 업로드하는 함수
 */
export async function uploadAvatarImage(
  userId: string,
  imageBlob: Blob
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = createClient()

    // 파일명 생성 (userId + timestamp로 고유성 보장)
    const timestamp = Date.now()
    const fileName = `${userId}_${timestamp}.webp`
    const filePath = `avatars/${fileName}`

    // Supabase Storage에 업로드
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, imageBlob, {
        cacheControl: '3600',
        upsert: false // 새 파일로 생성
      })

    if (uploadError) {
      console.error('Storage 업로드 오류:', {
        message: uploadError.message,
        details: uploadError
      })
      return {
        success: false,
        error: `이미지 업로드에 실패했습니다: ${uploadError.message || 'Unknown error'}`
      }
    }

    // 공개 URL 생성
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    return {
      success: true,
      url: publicUrl
    }

  } catch (error) {
    console.error('Avatar 업로드 중 오류:', error)
    return {
      success: false,
      error: '이미지 업로드 중 오류가 발생했습니다'
    }
  }
}

/**
 * 기존 Avatar 이미지를 삭제하는 함수 (선택적)
 */
export async function deleteAvatarImage(
  imageUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    // URL에서 파일 경로 추출
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split('/')
    const fileName = pathParts[pathParts.length - 1]
    const filePath = `avatars/${fileName}`

    // Supabase Storage에서 삭제
    const { error: deleteError } = await supabase.storage
      .from('avatars')
      .remove([filePath])

    if (deleteError) {
      console.error('Storage 삭제 오류:', deleteError)
      return {
        success: false,
        error: '기존 이미지 삭제에 실패했습니다'
      }
    }

    return { success: true }

  } catch (error) {
    console.error('Avatar 삭제 중 오류:', error)
    return {
      success: false,
      error: '이미지 삭제 중 오류가 발생했습니다'
    }
  }
}

/**
 * Avatar 업로드와 기존 이미지 삭제를 동시에 처리하는 함수
 */
export async function replaceAvatarImage(
  userId: string,
  newImageBlob: Blob,
  oldImageUrl?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // 새 이미지 업로드
    const uploadResult = await uploadAvatarImage(userId, newImageBlob)
    
    if (!uploadResult.success) {
      return uploadResult
    }

    // 기존 이미지가 있고 Supabase Storage URL인 경우 삭제
    if (oldImageUrl && oldImageUrl.includes('supabase')) {
      // 삭제 실패해도 업로드는 성공했으므로 에러로 처리하지 않음
      await deleteAvatarImage(oldImageUrl)
    }

    return uploadResult

  } catch (error) {
    console.error('Avatar 교체 중 오류:', error)
    return {
      success: false,
      error: '이미지 교체 중 오류가 발생했습니다'
    }
  }
}