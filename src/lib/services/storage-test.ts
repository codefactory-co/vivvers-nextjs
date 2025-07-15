'use client'

import { createClient } from '@/lib/supabase/client'

/**
 * Storage 상태를 테스트하는 함수
 */
export async function testStorageSetup() {
  try {
    const supabase = createClient()

    // 1. 버킷 목록 확인
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    console.log('Available buckets:', buckets, bucketsError)

    // 2. avatars 버킷이 있는지 확인
    const avatarsBucket = buckets?.find(bucket => bucket.name === 'avatars')
    if (!avatarsBucket) {
      console.error('avatars 버킷이 존재하지 않습니다!')
      return false
    }

    // 3. 간단한 텍스트 파일 업로드 테스트
    const testFile = new Blob(['test'], { type: 'text/plain' })
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(`test-${Date.now()}.txt`, testFile)

    if (error) {
      console.error('테스트 업로드 실패:', error)
      return false
    } else {
      console.log('테스트 업로드 성공:', data)
      
      // 테스트 파일 삭제
      await supabase.storage.from('avatars').remove([data.path])
      return true
    }
  } catch (error) {
    console.error('Storage 테스트 중 오류:', error)
    return false
  }
}