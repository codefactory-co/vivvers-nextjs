/**
 * Supabase Storage 업로드 함수
 * Client/Server 양쪽에서 사용 가능
 * 경로: {bucketName}/{userId}/{filename}
 */

import type { SupabaseClient } from '@supabase/supabase-js'

// ============================================================================
// 타입 정의
// ============================================================================

export interface UploadOptions {
  // 파일명 설정
  fileNameStrategy?: 'uuid' | 'original' | 'timestamp'
  preserveExtension?: boolean

  // 파일 검증
  maxSize?: number
  allowedTypes?: string[]
  strictValidation?: boolean

  // 업로드 동작
  overwrite?: boolean
  compression?: CompressionOptions

  // 콜백
  onProgress?: (progress: UploadProgress) => void
  onValidationError?: (error: ValidationError) => void
}

export interface CompressionOptions {
  enabled: boolean
  quality?: number
  maxWidth?: number
  maxHeight?: number
  format?: 'webp' | 'jpeg' | 'png'
}

export interface UploadProgress {
  percentage: number
  loaded: number
  total: number
  speed?: number
  remainingTime?: number
  fileName: string
}

export interface ValidationError {
  type: 'size' | 'type' | 'extension' | 'format'
  message: string
  fileName: string
  details?: {
    actualSize?: number
    maxSize?: number
    actualType?: string
    allowedTypes?: string[]
  }
}

export interface UploadResult {
  success: boolean
  url?: string
  path?: string
  fileName?: string
  error?: string
  size?: number
}

// ============================================================================
// 기본값 설정
// ============================================================================

const DEFAULT_OPTIONS: Required<Omit<UploadOptions, 'onProgress' | 'onValidationError' | 'compression'>> = {
  fileNameStrategy: 'uuid',
  preserveExtension: true,
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [],
  strictValidation: false,
  overwrite: false
}

// ============================================================================
// 유틸리티 함수들
// ============================================================================

/**
 * 안전한 파일명 생성
 */
function generateFileName(
  originalName: string,
  strategy: 'uuid' | 'original' | 'timestamp',
  preserveExtension: boolean
): string {
  const extension = preserveExtension 
    ? '.' + (originalName.split('.').pop()?.toLowerCase() || '')
    : ''

  switch (strategy) {
    case 'uuid':
      return crypto.randomUUID() + extension

    case 'timestamp':
      const timestamp = Date.now()
      const baseName = originalName.replace(/\.[^/.]+$/, '')
      const safeName = sanitizeFileName(baseName)
      return `${timestamp}-${safeName}${extension}`

    case 'original':
      return sanitizeFileName(originalName)

    default:
      return crypto.randomUUID() + extension
  }
}

/**
 * 파일명 정리 (특수문자 제거)
 */
function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9가-힣.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100) // 파일명 길이 제한
}

/**
 * 파일 검증
 */
function validateFile(
  file: File,
  options: UploadOptions
): { valid: boolean; error?: ValidationError } {
  const maxSize = options.maxSize || DEFAULT_OPTIONS.maxSize
  const allowedTypes = options.allowedTypes || []

  // 파일 크기 검증
  if (file.size > maxSize) {
    return {
      valid: false,
      error: {
        type: 'size',
        message: `파일 크기가 ${formatFileSize(maxSize)}를 초과합니다.`,
        fileName: file.name,
        details: {
          actualSize: file.size,
          maxSize
        }
      }
    }
  }

  // 파일 타입 검증
  if (allowedTypes.length > 0) {
    const isTypeAllowed = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        const category = type.split('/')[0]
        return file.type.startsWith(category + '/')
      }
      return file.type === type
    })

    if (!isTypeAllowed) {
      return {
        valid: false,
        error: {
          type: 'type',
          message: `지원하지 않는 파일 형식입니다.`,
          fileName: file.name,
          details: {
            actualType: file.type,
            allowedTypes
          }
        }
      }
    }
  }

  return { valid: true }
}

/**
 * 파일 크기를 읽기 쉬운 형태로 변환
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 중복 파일명 처리
 */
async function handleDuplicateFileName(
  supabaseClient: SupabaseClient,
  bucketName: string,
  filePath: string,
  fileName: string,
  overwrite: boolean
): Promise<string> {
  if (overwrite) {
    // 기존 파일 삭제
    await supabaseClient.storage
      .from(bucketName)
      .remove([filePath])
    
    return fileName
  }

  // 중복 파일명 확인 및 새 이름 생성
  const { data: existingFiles } = await supabaseClient.storage
    .from(bucketName)
    .list(filePath.split('/').slice(0, -1).join('/'))

  if (!existingFiles || !existingFiles.some(f => f.name === fileName)) {
    return fileName
  }

  // 파일명에 번호 추가
  const [name, extension] = fileName.includes('.') 
    ? [fileName.substring(0, fileName.lastIndexOf('.')), fileName.substring(fileName.lastIndexOf('.'))]
    : [fileName, '']

  let counter = 1
  let newFileName = `${name}(${counter})${extension}`

  while (existingFiles.some(f => f.name === newFileName)) {
    counter++
    newFileName = `${name}(${counter})${extension}`
  }

  return newFileName
}

// ============================================================================
// 메인 업로드 함수
// ============================================================================

/**
 * 파일을 Supabase Storage에 업로드
 * 
 * @param supabaseClient - Supabase 클라이언트 (client 또는 server)
 * @param bucketName - 업로드할 버킷명
 * @param userId - 사용자 ID
 * @param file - 업로드할 파일
 * @param options - 업로드 옵션
 * @returns 업로드 결과
 */
export async function uploadFile(
  supabaseClient: SupabaseClient,
  bucketName: string,
  userId: string,
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    // 옵션 기본값 적용
    const finalOptions = { ...DEFAULT_OPTIONS, ...options }

    // 파일 검증
    const validation = validateFile(file, finalOptions)
    if (!validation.valid && validation.error) {
      options.onValidationError?.(validation.error)
      return {
        success: false,
        error: validation.error.message
      }
    }

    // 파일명 생성
    let fileName = generateFileName(
      file.name,
      finalOptions.fileNameStrategy,
      finalOptions.preserveExtension
    )

    // 파일 경로 생성: {bucketName}/{userId}/{filename}
    const basePath = userId
    const filePath = `${basePath}/${fileName}`

    // 중복 파일명 처리
    fileName = await handleDuplicateFileName(
      supabaseClient,
      bucketName,
      filePath,
      fileName,
      finalOptions.overwrite
    )

    const finalFilePath = `${basePath}/${fileName}`

    // 진행률 시뮬레이션 (Supabase는 실제 진행률 이벤트를 제공하지 않음)
    let progressInterval: NodeJS.Timeout | null = null
    if (options.onProgress) {
      let progress = 0
      const startTime = Date.now()
      
      progressInterval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 10, 90)
        const elapsed = Date.now() - startTime
        const speed = (file.size * progress / 100) / (elapsed / 1000)
        const remainingTime = elapsed > 0 ? ((100 - progress) / progress) * (elapsed / 1000) : 0

        options.onProgress!({
          percentage: progress,
          loaded: Math.floor(file.size * progress / 100),
          total: file.size,
          speed,
          remainingTime,
          fileName
        })
      }, 200)
    }

    // Supabase Storage에 업로드
    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .upload(finalFilePath, file, {
        cacheControl: '3600',
        upsert: finalOptions.overwrite,
        contentType: file.type
      })

    // 진행률 인터벌 정리
    if (progressInterval) {
      clearInterval(progressInterval)
      
      // 완료 진행률 알림
      options.onProgress?.({
        percentage: 100,
        loaded: file.size,
        total: file.size,
        speed: 0,
        remainingTime: 0,
        fileName
      })
    }

    if (error) {
      console.error('Upload error:', error)
      return {
        success: false,
        error: '업로드에 실패했습니다: ' + error.message
      }
    }

    // 공개 URL 생성
    const { data: urlData } = supabaseClient.storage
      .from(bucketName)
      .getPublicUrl(data.path)

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path,
      fileName,
      size: file.size
    }

  } catch (error) {
    console.error('Upload exception:', error)
    return {
      success: false,
      error: '업로드 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류')
    }
  }
}

// ============================================================================
// 편의 함수들
// ============================================================================

/**
 * 프로젝트 이미지 업로드
 */
export const uploadProjectImage = (
  supabaseClient: SupabaseClient,
  userId: string,
  file: File,
  options?: UploadOptions
) => uploadFile(supabaseClient, 'projects', userId, file, {
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxSize: 10 * 1024 * 1024, // 10MB
  ...options
})

/**
 * 프로필 사진 업로드
 */
export const uploadAvatar = (
  supabaseClient: SupabaseClient,
  userId: string,
  file: File,
  options?: UploadOptions
) => uploadFile(supabaseClient, 'avatars', userId, file, {
  fileNameStrategy: 'original',
  allowedTypes: ['image/*'],
  maxSize: 5 * 1024 * 1024, // 5MB
  overwrite: true,
  ...options
})

/**
 * 문서 파일 업로드
 */
export const uploadDocument = (
  supabaseClient: SupabaseClient,
  userId: string,
  file: File,
  options?: UploadOptions
) => uploadFile(supabaseClient, 'documents', userId, file, {
  fileNameStrategy: 'timestamp',
  allowedTypes: ['application/pdf', 'text/plain', 'application/msword'],
  maxSize: 20 * 1024 * 1024, // 20MB
  ...options
})

/**
 * 파일 삭제
 */
export async function deleteFile(
  supabaseClient: SupabaseClient,
  bucketName: string,
  filePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseClient.storage
      .from(bucketName)
      .remove([filePath])

    if (error) {
      return {
        success: false,
        error: '파일 삭제에 실패했습니다: ' + error.message
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: '파일 삭제 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류')
    }
  }
}

/**
 * 사용자의 모든 파일 삭제
 */
export async function deleteUserFiles(
  supabaseClient: SupabaseClient,
  bucketName: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 사용자 폴더 내 모든 파일 조회
    const { data: files, error: listError } = await supabaseClient.storage
      .from(bucketName)
      .list(userId, {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (listError) {
      return {
        success: false,
        error: '파일 목록 조회에 실패했습니다: ' + listError.message
      }
    }

    if (!files || files.length === 0) {
      return { success: true }
    }

    // 모든 파일 삭제
    const filePaths = files.map(file => `${userId}/${file.name}`)
    const { error: deleteError } = await supabaseClient.storage
      .from(bucketName)
      .remove(filePaths)

    if (deleteError) {
      return {
        success: false,
        error: '파일 삭제에 실패했습니다: ' + deleteError.message
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: '파일 삭제 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류')
    }
  }
}