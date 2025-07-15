/**
 * 파일 업로드를 위한 React 훅
 * 
 * Supabase Storage 업로드 타입 시스템을 활용한
 * 실제 사용 가능한 React 훅 구현
 */

'use client'

import { useState, useCallback, useRef } from 'react'
import type {
  UploadResult,
  UploadProgress,
  UploadStatus,
  StorageError,
  FileInfo,
  StorageBucket,
  BaseUploadOptions,
} from '@/types/storage'

import { 
  isFileValidForPurpose,
  createStorageError,
} from '@/lib/storage/helpers'

// ============================================================================
// 훅 옵션 타입
// ============================================================================

interface UseFileUploadOptions {
  /** 최대 파일 개수 */
  maxFiles?: number
  /** 허용되는 파일 타입 */
  acceptedFileTypes?: string[]
  /** 최대 파일 크기 */
  maxFileSize?: number
  /** 자동 업로드 여부 */
  autoUpload?: boolean
  /** 업로드 완료 후 콜백 */
  onUploadComplete?: (results: UploadResult[]) => void
  /** 업로드 에러 콜백 */
  onUploadError?: (error: StorageError) => void
}

interface UseFileUploadState {
  /** 선택된 파일들 */
  files: FileInfo[]
  /** 업로드 진행률 (파일 ID별) */
  progress: Record<string, UploadProgress>
  /** 업로드 상태 (파일 ID별) */
  status: Record<string, UploadStatus>
  /** 업로드 결과들 */
  results: UploadResult[]
  /** 전체 업로드 진행 중 여부 */
  isUploading: boolean
  /** 에러 정보 */
  errors: StorageError[]
}

interface UseFileUploadActions {
  /** 파일 선택/추가 */
  selectFiles: (newFiles: File[]) => void
  /** 파일 제거 */
  removeFile: (fileId: string) => void
  /** 모든 파일 제거 */
  clearFiles: () => void
  /** 업로드 시작 */
  startUpload: (bucket: StorageBucket, options?: BaseUploadOptions) => Promise<void>
  /** 개별 파일 업로드 */
  uploadFile: (fileId: string, bucket: StorageBucket, options?: BaseUploadOptions) => Promise<void>
  /** 업로드 취소 */
  cancelUpload: (fileId?: string) => void
  /** 에러 정리 */
  clearErrors: () => void
  /** 상태 초기화 */
  reset: () => void
}

// ============================================================================
// 메인 훅
// ============================================================================

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    maxFiles = 10,
    acceptedFileTypes,
    maxFileSize,
    autoUpload = false,
    onUploadComplete,
    onUploadError,
  } = options

  // 상태 관리
  const [state, setState] = useState<UseFileUploadState>({
    files: [],
    progress: {},
    status: {},
    results: [],
    isUploading: false,
    errors: [],
  })

  // 업로드 취소를 위한 AbortController 참조
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map())

  // ============================================================================
  // 파일 검증 함수들
  // ============================================================================

  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // 파일 타입 검증
    if (acceptedFileTypes && !acceptedFileTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: `지원하지 않는 파일 형식입니다. (허용: ${acceptedFileTypes.join(', ')})` 
      }
    }

    // 파일 크기 검증
    if (maxFileSize && file.size > maxFileSize) {
      return { 
        valid: false, 
        error: `파일 크기가 너무 큽니다. (최대: ${(maxFileSize / 1024 / 1024).toFixed(1)}MB)` 
      }
    }

    return { valid: true }
  }, [acceptedFileTypes, maxFileSize])

  // ============================================================================
  // 액션 함수들
  // ============================================================================

  const selectFiles = useCallback((newFiles: File[]) => {
    const validFiles: FileInfo[] = []
    const newErrors: StorageError[] = []

    // 파일 개수 제한 확인
    const totalFiles = state.files.length + newFiles.length
    if (totalFiles > maxFiles) {
      newErrors.push(createStorageError(
        'VALIDATION_ERROR',
        `최대 ${maxFiles}개의 파일만 선택할 수 있습니다.`
      ))
      return
    }

    // 각 파일 검증
    newFiles.forEach(file => {
      const validation = validateFile(file)
      if (validation.valid) {
        const fileInfo: FileInfo = {
          file,
          id: crypto.randomUUID(),
          previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        }
        validFiles.push(fileInfo)
      } else {
        newErrors.push(createStorageError(
          'VALIDATION_ERROR',
          validation.error || '파일 검증 실패'
        ))
      }
    })

    setState(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles],
      errors: [...prev.errors, ...newErrors],
    }))

    // 자동 업로드 옵션이 활성화되어 있고 에러가 없으면 업로드 시작
    if (autoUpload && validFiles.length > 0 && newErrors.length === 0) {
      // 기본 버킷으로 업로드 (실제로는 옵션에서 받아야 함)
      // startUpload('temp-uploads')
    }
  }, [state.files.length, maxFiles, validateFile, autoUpload])

  const removeFile = useCallback((fileId: string) => {
    setState(prev => {
      const fileToRemove = prev.files.find(f => f.id === fileId)
      
      // 미리보기 URL 정리
      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl)
      }

      // 진행 중인 업로드 취소
      const abortController = abortControllersRef.current.get(fileId)
      if (abortController) {
        abortController.abort()
        abortControllersRef.current.delete(fileId)
      }

      return {
        ...prev,
        files: prev.files.filter(f => f.id !== fileId),
        progress: Object.fromEntries(
          Object.entries(prev.progress).filter(([id]) => id !== fileId)
        ),
        status: Object.fromEntries(
          Object.entries(prev.status).filter(([id]) => id !== fileId)
        ),
        results: prev.results.filter(r => 
          ('file' in r && r.file.id !== fileId) || 
          ('error' in r && r.error.fileId !== fileId)
        ),
      }
    })
  }, [])

  const clearFiles = useCallback(() => {
    // 모든 미리보기 URL 정리
    state.files.forEach(file => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl)
      }
    })

    // 모든 업로드 취소
    abortControllersRef.current.forEach(controller => controller.abort())
    abortControllersRef.current.clear()

    setState({
      files: [],
      progress: {},
      status: {},
      results: [],
      isUploading: false,
      errors: [],
    })
  }, [state.files])

  const updateFileProgress = useCallback((fileId: string, progress: UploadProgress) => {
    setState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        [fileId]: progress,
      },
    }))
  }, [])

  const updateFileStatus = useCallback((fileId: string, status: UploadStatus) => {
    setState(prev => ({
      ...prev,
      status: {
        ...prev.status,
        [fileId]: status,
      },
    }))
  }, [])

  const startUpload = useCallback(async (bucket: StorageBucket) => {
    if (state.files.length === 0) return

    setState(prev => ({ ...prev, isUploading: true, errors: [] }))

    try {
      // 실제 업로드 서비스 호출 (여기서는 시뮬레이션)
      const uploadPromises = state.files.map(async (fileInfo) => {
        const abortController = new AbortController()
        abortControllersRef.current.set(fileInfo.id, abortController)

        try {
          // 파일이 해당 용도에 적합한지 확인
          const validation = isFileValidForPurpose(fileInfo.file, bucket)
          if (!validation.valid) {
            throw createStorageError('VALIDATION_ERROR', validation.error || '파일 검증 실패', undefined, undefined, fileInfo.id)
          }

          // 상태 업데이트
          updateFileStatus(fileInfo.id, 'uploading')

          // 업로드 진행률 시뮬레이션
          const simulateProgress = () => {
            let loaded = 0
            const total = fileInfo.file.size
            const interval = setInterval(() => {
              loaded += Math.random() * (total / 20)
              if (loaded >= total) {
                loaded = total
                clearInterval(interval)
              }
              
              updateFileProgress(fileInfo.id, {
                loaded,
                total,
                percentage: Math.round((loaded / total) * 100),
                speed: Math.random() * 1000000, // 1MB/s 정도
                timeRemaining: (total - loaded) / 1000000,
              })
            }, 100)

            return interval
          }

          const progressInterval = simulateProgress()

          // 실제 업로드 (시뮬레이션)
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              clearInterval(progressInterval)
              if (Math.random() > 0.1) { // 90% 성공률
                resolve(true)
              } else {
                reject(new Error('Upload failed'))
              }
            }, 2000 + Math.random() * 3000) // 2-5초 소요
          })

          updateFileStatus(fileInfo.id, 'completed')

          const result: UploadResult = {
            success: true,
            file: {
              id: fileInfo.id,
              path: `${bucket}/${fileInfo.file.name}`,
              publicUrl: `https://example.com/${bucket}/${fileInfo.file.name}`,
              metadata: {
                size: fileInfo.file.size,
                type: fileInfo.file.type,
                name: fileInfo.file.name,
                uploadedAt: new Date(),
                uploadedBy: 'current-user',
              },
            },
            uploadDuration: 2000,
          }

          return result

        } catch (error) {
          updateFileStatus(fileInfo.id, 'failed')
          
          const storageError = error instanceof Error && 'type' in error 
            ? error as unknown as StorageError
            : createStorageError('UPLOAD_FAILED', error instanceof Error ? error.message : 'Unknown error', undefined, error instanceof Error ? error : undefined, fileInfo.id)

          const result: UploadResult = {
            success: false,
            error: storageError,
            attemptDuration: 2000,
          }

          return result
        } finally {
          abortControllersRef.current.delete(fileInfo.id)
        }
      })

      const results = await Promise.all(uploadPromises)
      
      setState(prev => ({
        ...prev,
        results: [...prev.results, ...results],
        isUploading: false,
      }))

      // 성공한 결과들만 필터링
      const successResults = results.filter(r => r.success)
      if (successResults.length > 0) {
        onUploadComplete?.(successResults)
      }

      // 실패한 결과들의 에러 처리
      const failedResults = results.filter(r => !r.success) as Array<{ success: false; error: StorageError }>
      failedResults.forEach(result => {
        onUploadError?.(result.error)
      })

    } catch (error) {
      setState(prev => ({
        ...prev,
        isUploading: false,
        errors: [
          ...prev.errors,
          createStorageError('UPLOAD_FAILED', error instanceof Error ? error.message : 'Upload failed')
        ],
      }))
    }
  }, [state.files, updateFileProgress, updateFileStatus, onUploadComplete, onUploadError])

  const uploadFile = useCallback(async (fileId: string, bucket: StorageBucket) => {
    const fileInfo = state.files.find(f => f.id === fileId)
    if (!fileInfo) return

    // 임시로 해당 파일만 포함하는 상태로 업로드 실행
    const originalFiles = state.files
    setState(prev => ({ ...prev, files: [fileInfo] }))
    
    await startUpload(bucket)
    
    setState(prev => ({ ...prev, files: originalFiles }))
  }, [state.files, startUpload])

  const cancelUpload = useCallback((fileId?: string) => {
    if (fileId) {
      const abortController = abortControllersRef.current.get(fileId)
      if (abortController) {
        abortController.abort()
        abortControllersRef.current.delete(fileId)
        updateFileStatus(fileId, 'cancelled')
      }
    } else {
      // 모든 업로드 취소
      abortControllersRef.current.forEach((controller, id) => {
        controller.abort()
        updateFileStatus(id, 'cancelled')
      })
      abortControllersRef.current.clear()
      setState(prev => ({ ...prev, isUploading: false }))
    }
  }, [updateFileStatus])

  const clearErrors = useCallback(() => {
    setState(prev => ({ ...prev, errors: [] }))
  }, [])

  const reset = useCallback(() => {
    clearFiles()
    clearErrors()
  }, [clearFiles, clearErrors])

  // ============================================================================
  // 파생된 상태들
  // ============================================================================

  const totalProgress = state.files.length > 0 
    ? Object.values(state.progress).reduce((acc, p) => acc + p.percentage, 0) / state.files.length
    : 0

  const hasErrors = state.errors.length > 0
  const hasFailedUploads = state.results.some(r => !r.success)
  const allUploadsCompleted = state.files.length > 0 && 
    state.files.every(f => state.status[f.id] === 'completed' || state.status[f.id] === 'failed')

  // ============================================================================
  // 반환값
  // ============================================================================

  const actions: UseFileUploadActions = {
    selectFiles,
    removeFile,
    clearFiles,
    startUpload,
    uploadFile,
    cancelUpload,
    clearErrors,
    reset,
  }

  return {
    // 상태
    ...state,
    
    // 파생된 상태
    totalProgress,
    hasErrors,
    hasFailedUploads,
    allUploadsCompleted,
    
    // 액션들
    ...actions,
  }
}

// ============================================================================
// 특수한 용도를 위한 훅들
// ============================================================================

/**
 * 프로필 이미지 업로드 훅
 */
export function useProfileImageUpload() {
  return useFileUpload({
    maxFiles: 1,
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    autoUpload: false,
  })
}

/**
 * 프로젝트 이미지 업로드 훅
 */
export function useProjectImageUpload(maxImages = 5) {
  return useFileUpload({
    maxFiles: maxImages,
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    autoUpload: false,
  })
}

/**
 * 프로젝트 파일 업로드 훅
 */
export function useProjectFileUpload() {
  return useFileUpload({
    maxFiles: 20,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    autoUpload: false,
  })
}