/**
 * Supabase Storage 업로드 관련 타입 정의
 * 
 * 프로필 이미지, 프로젝트 스크린샷, 첨부파일 등
 * 다양한 용도의 파일 업로드를 위한 포괄적인 타입 시스템
 */

// ============================================================================
// 기본 파일 타입 정의
// ============================================================================

export interface FileInfo {
  /** 파일 객체 */
  file: File
  /** 파일의 고유 식별자 (업로드 추적용) */
  id: string
  /** 미리보기 URL (선택사항) */
  previewUrl?: string
}

export interface FileMetadata {
  /** 파일 크기 (bytes) */
  size: number
  /** MIME 타입 */
  type: string
  /** 파일명 */
  name: string
  /** 업로드 시간 */
  uploadedAt: Date
  /** 업로드한 사용자 ID */
  uploadedBy: string
  /** 파일 설명 (선택사항) */
  description?: string
  /** 태그 (선택사항) */
  tags?: string[]
}

// ============================================================================
// 스토리지 버킷 및 경로 타입
// ============================================================================

export type StorageBucket = 
  | 'avatars'           // 프로필 이미지
  | 'project-images'    // 프로젝트 스크린샷/이미지
  | 'project-files'     // 프로젝트 첨부파일
  | 'temp-uploads'      // 임시 업로드
  | 'documents'         // 문서 파일
  | 'media';            // 기타 미디어 파일

export type StoragePolicy = 'public' | 'private' | 'authenticated';

export interface StoragePath {
  /** 버킷 이름 */
  bucket: StorageBucket
  /** 파일 경로 (폴더 구조 포함) */
  path: string
  /** 최종 파일명 */
  filename: string
  /** 스토리지 정책 */
  policy: StoragePolicy
}

// ============================================================================
// 업로드 옵션 타입
// ============================================================================

export interface BaseUploadOptions {
  /** 최대 파일 크기 (bytes) */
  maxSize?: number
  /** 허용되는 파일 타입 */
  allowedTypes?: readonly string[]
  /** 파일명 변환 옵션 */
  fileNameTransform?: 'uuid' | 'timestamp' | 'original' | 'sanitized'
  /** 중복 파일 처리 방식 */
  duplicateHandling?: 'overwrite' | 'rename' | 'error'
  /** 이미지 최적화 옵션 */
  imageOptimization?: ImageOptimizationOptions
  /** 메타데이터 추가 */
  metadata?: Record<string, string>
}

export interface ImageOptimizationOptions {
  /** 이미지 리사이징 */
  resize?: {
    width?: number
    height?: number
    quality?: number
  }
  /** 썸네일 생성 */
  generateThumbnail?: boolean
  /** WebP 변환 */
  convertToWebP?: boolean
}

// 용도별 업로드 옵션
export interface ProfileImageUploadOptions extends BaseUploadOptions {
  /** 프로필 이미지는 항상 public */
  policy: 'public'
  /** 기본 크기 제한: 5MB */
  maxSize: number
  /** 이미지만 허용 */
  allowedTypes: readonly string[]
  /** 정사각형 크롭 옵션 */
  cropToSquare?: boolean
}

export interface ProjectImageUploadOptions extends BaseUploadOptions {
  /** 프로젝트 이미지는 public 또는 authenticated */
  policy: 'public' | 'authenticated'
  /** 기본 크기 제한: 10MB */
  maxSize: number
  /** 이미지만 허용 */
  allowedTypes: readonly string[]
  /** 워터마크 추가 옵션 */
  addWatermark?: boolean
}

export interface ProjectFileUploadOptions extends BaseUploadOptions {
  /** 프로젝트 파일은 정책에 따라 */
  policy: StoragePolicy
  /** 기본 크기 제한: 50MB */
  maxSize: number
  /** 다양한 파일 타입 허용 */
  allowedTypes?: readonly string[]
  /** 압축 파일 처리 */
  extractArchive?: boolean
}

// ============================================================================
// 업로드 진행률 및 상태 타입
// ============================================================================

export type UploadStatus = 
  | 'pending'     // 대기 중
  | 'uploading'   // 업로드 중
  | 'processing'  // 후처리 중 (이미지 최적화 등)
  | 'completed'   // 완료
  | 'failed'      // 실패
  | 'cancelled';  // 취소됨

export interface UploadProgress {
  /** 업로드된 바이트 수 */
  loaded: number
  /** 전체 파일 크기 */
  total: number
  /** 진행률 (0-100) */
  percentage: number
  /** 업로드 속도 (bytes/sec) */
  speed?: number
  /** 예상 남은 시간 (seconds) */
  timeRemaining?: number
}

export interface UploadState {
  /** 파일 ID */
  fileId: string
  /** 현재 상태 */
  status: UploadStatus
  /** 진행률 정보 */
  progress: UploadProgress
  /** 에러 정보 (실패 시) */
  error?: StorageError
}

// ============================================================================
// 업로드 결과 타입
// ============================================================================

export interface UploadSuccess {
  /** 성공 여부 */
  success: true
  /** 업로드된 파일 정보 */
  file: {
    /** 파일 ID */
    id: string
    /** 스토리지 경로 */
    path: string
    /** 공개 URL */
    publicUrl: string
    /** 서명된 URL (private 파일용) */
    signedUrl?: string
    /** 파일 메타데이터 */
    metadata: FileMetadata
    /** 썸네일 URL (이미지인 경우) */
    thumbnailUrl?: string
  }
  /** 업로드 시간 */
  uploadDuration: number
}

export interface UploadFailure {
  /** 성공 여부 */
  success: false
  /** 에러 정보 */
  error: StorageError
  /** 업로드 시도 시간 */
  attemptDuration: number
}

export type UploadResult = UploadSuccess | UploadFailure

// 배치 업로드 결과
export interface BatchUploadResult {
  /** 전체 업로드 성공 여부 */
  success: boolean
  /** 성공한 업로드들 */
  successful: UploadSuccess[]
  /** 실패한 업로드들 */
  failed: UploadFailure[]
  /** 전체 업로드 시간 */
  totalDuration: number
}

// ============================================================================
// 에러 타입 정의
// ============================================================================

export type StorageErrorType =
  | 'VALIDATION_ERROR'      // 파일 검증 실패
  | 'SIZE_LIMIT_EXCEEDED'   // 크기 제한 초과
  | 'INVALID_FILE_TYPE'     // 허용되지 않는 파일 타입
  | 'UPLOAD_FAILED'         // 업로드 실패
  | 'NETWORK_ERROR'         // 네트워크 에러
  | 'PERMISSION_DENIED'     // 권한 없음
  | 'STORAGE_QUOTA_EXCEEDED' // 스토리지 용량 초과
  | 'FILE_NOT_FOUND'        // 파일을 찾을 수 없음
  | 'PROCESSING_ERROR'      // 후처리 에러
  | 'UNKNOWN_ERROR';        // 알 수 없는 에러

export interface StorageError {
  /** 에러 타입 */
  type: StorageErrorType
  /** 에러 메시지 */
  message: string
  /** 상세 정보 */
  details?: Record<string, unknown>
  /** 원본 에러 */
  originalError?: Error
  /** 에러 발생 시간 */
  timestamp: Date
  /** 파일 ID (관련된 파일이 있는 경우) */
  fileId?: string
}

// ============================================================================
// 업로드 함수 파라미터 타입
// ============================================================================

export interface SingleUploadParams {
  /** 업로드할 파일 */
  file: File
  /** 스토리지 경로 정보 */
  storagePath: StoragePath
  /** 업로드 옵션 */
  options?: BaseUploadOptions
  /** 진행률 콜백 */
  onProgress?: (progress: UploadProgress) => void
  /** 상태 변경 콜백 */
  onStatusChange?: (status: UploadStatus) => void
}

export interface BatchUploadParams {
  /** 업로드할 파일들 */
  files: FileInfo[]
  /** 스토리지 경로 생성 함수 */
  getStoragePath: (file: File, index: number) => StoragePath
  /** 업로드 옵션 */
  options?: BaseUploadOptions
  /** 개별 파일 진행률 콜백 */
  onFileProgress?: (fileId: string, progress: UploadProgress) => void
  /** 전체 진행률 콜백 */
  onOverallProgress?: (completed: number, total: number) => void
  /** 개별 파일 상태 변경 콜백 */
  onFileStatusChange?: (fileId: string, status: UploadStatus) => void
  /** 동시 업로드 개수 제한 */
  concurrency?: number
}

// ============================================================================
// 업로드 서비스 인터페이스
// ============================================================================

export interface StorageUploadService {
  /** 단일 파일 업로드 */
  uploadFile(params: SingleUploadParams): Promise<UploadResult>
  
  /** 배치 파일 업로드 */
  uploadFiles(params: BatchUploadParams): Promise<BatchUploadResult>
  
  /** 업로드 취소 */
  cancelUpload(fileId: string): Promise<void>
  
  /** 파일 삭제 */
  deleteFile(path: string, bucket: StorageBucket): Promise<boolean>
  
  /** 파일 URL 가져오기 */
  getFileUrl(path: string, bucket: StorageBucket, signed?: boolean): Promise<string>
  
  /** 파일 메타데이터 가져오기 */
  getFileMetadata(path: string, bucket: StorageBucket): Promise<FileMetadata>
}

// ============================================================================
// 콜백 함수 타입 정의
// ============================================================================

export type ProgressCallback = (progress: UploadProgress) => void
export type StatusChangeCallback = (status: UploadStatus) => void
export type ErrorCallback = (error: StorageError) => void
export type SuccessCallback = (result: UploadSuccess) => void

// ============================================================================
// 유틸리티 타입
// ============================================================================

/** 용도별 업로드 옵션 타입 */
export type UploadOptionsForPurpose<T extends StorageBucket> = 
  T extends 'avatars' ? ProfileImageUploadOptions :
  T extends 'project-images' ? ProjectImageUploadOptions :
  T extends 'project-files' ? ProjectFileUploadOptions :
  BaseUploadOptions

/** 파일 타입별 검증 함수 시그니처 */
export type FileValidator = (file: File) => Promise<{ valid: boolean; error?: string }>

/** 경로 생성 함수 시그니처 */
export type PathGenerator = (
  file: File, 
  userId: string, 
  purpose: StorageBucket
) => StoragePath