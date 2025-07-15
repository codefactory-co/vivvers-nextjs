/**
 * Storage helper functions
 * 
 * Utility functions for file validation, path generation, and error handling
 */

import type { FileInfo, StorageError, StorageErrorType, StorageBucket } from '@/types/storage'

/**
 * Convert File array to FileInfo array
 */
export function filesToFileInfo(files: File[]): FileInfo[] {
  return files.map(file => ({
    file,
    id: crypto.randomUUID(),
    previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
  }))
}

/**
 * Get file category based on MIME type
 */
export function getFileCategory(file: File): string {
  const type = file.type
  
  if (type.startsWith('image/')) return 'image'
  if (type.startsWith('video/')) return 'video'
  if (type.startsWith('audio/')) return 'audio'
  if (type.includes('pdf')) return 'pdf'
  if (type.includes('text/') || type.includes('application/json')) return 'text'
  if (type.includes('zip') || type.includes('compressed')) return 'archive'
  
  return 'other'
}

/**
 * Validate file for specific storage bucket purpose
 */
export function isFileValidForPurpose(
  file: File, 
  bucket: StorageBucket
): { valid: boolean; error?: string } {
  const validationRules: Record<StorageBucket, { types: string[]; maxSize: number }> = {
    avatars: {
      types: ['image/jpeg', 'image/png', 'image/webp'],
      maxSize: 5 * 1024 * 1024, // 5MB
    },
    'project-images': {
      types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      maxSize: 10 * 1024 * 1024, // 10MB
    },
    'project-files': {
      types: [], // All types allowed
      maxSize: 50 * 1024 * 1024, // 50MB
    },
    'temp-uploads': {
      types: [], // All types allowed
      maxSize: 100 * 1024 * 1024, // 100MB
    },
    documents: {
      types: ['application/pdf', 'text/plain', 'application/msword', 
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      maxSize: 20 * 1024 * 1024, // 20MB
    },
    media: {
      types: ['video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav'],
      maxSize: 200 * 1024 * 1024, // 200MB
    },
  }

  const rules = validationRules[bucket]
  
  // Check file type
  if (rules.types.length > 0 && !rules.types.includes(file.type)) {
    return {
      valid: false,
      error: `허용되지 않는 파일 형식입니다. 허용: ${rules.types.join(', ')}`,
    }
  }

  // Check file size
  if (file.size > rules.maxSize) {
    return {
      valid: false,
      error: `파일 크기가 너무 큽니다. 최대: ${(rules.maxSize / 1024 / 1024).toFixed(1)}MB`,
    }
  }

  return { valid: true }
}

/**
 * Create a storage error object
 */
export function createStorageError(
  type: StorageErrorType,
  message: string,
  details?: Record<string, unknown>,
  originalError?: Error,
  fileId?: string
): StorageError {
  return {
    type,
    message,
    details,
    originalError,
    timestamp: new Date(),
    fileId,
  }
}

/**
 * Generate safe filename
 */
export function generateSafeFilename(originalName: string): string {
  // Remove special characters and spaces
  const safeName = originalName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase()
  
  // Ensure filename doesn't start or end with underscore
  return safeName.replace(/^_+|_+$/g, '')
}

/**
 * Generate unique filename with timestamp
 */
export function generateUniqueFilename(originalName: string, userId?: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop() || 'bin'
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
  const safeName = generateSafeFilename(nameWithoutExt)
  
  if (userId) {
    return `${userId}_${safeName}_${timestamp}_${randomString}.${extension}`
  }
  
  return `${safeName}_${timestamp}_${randomString}.${extension}`
}

/**
 * Clean up preview URLs
 */
export function cleanupPreviewUrls(files: FileInfo[]): void {
  files.forEach(file => {
    if (file.previewUrl) {
      URL.revokeObjectURL(file.previewUrl)
    }
  })
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * Check if file is a video
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/')
}

/**
 * Estimate upload time
 */
export function estimateUploadTime(fileSize: number, uploadSpeed: number): number {
  // uploadSpeed in bytes per second
  return Math.ceil(fileSize / uploadSpeed)
}