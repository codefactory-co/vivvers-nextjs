'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { uploadProjectImage } from '@/lib/supabase/storage'
import { useToast } from '@/hooks/use-toast'
import { ImageCropModal } from './image-crop-modal'
import { validateImageFile } from '@/lib/utils/image-crop'
import { DragDropScreenshots } from './drag-drop-screenshots'

interface FileUploaderProps {
  onFileSelect: (file: string | string[]) => void
  accept?: string
  multiple?: boolean
  placeholder?: string
  userId?: string // 업로드할 사용자 ID
  existingFiles?: string[] // 기존 파일들 (편집 모드용)
  onUploadStart?: () => void
  onUploadComplete?: (urls: string | string[]) => void
  onUploadError?: (error: string) => void
}

export function FileUploader({ 
  onFileSelect, 
  accept = "*", 
  multiple = false, 
  placeholder = "파일을 선택하세요",
  userId,
  existingFiles = [],
  onUploadStart,
  onUploadComplete,
  onUploadError
}: FileUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [currentCropFile, setCurrentCropFile] = useState<File | null>(null)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // 기존 파일들로 selectedFiles 초기화
  useEffect(() => {
    if (existingFiles.length > 0) {
      setSelectedFiles(existingFiles)
    }
  }, [existingFiles])

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || !userId) {
      if (!userId) {
        toast({
          title: "로그인 필요",
          description: "파일 업로드를 위해 로그인이 필요합니다.",
          variant: "destructive"
        })
      }
      return
    }

    const fileArray = Array.from(files)
    
    // 이미지 파일과 일반 파일 분리
    const imageFiles: File[] = []
    const nonImageFiles: File[] = []
    
    for (const file of fileArray) {
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        toast({
          title: "파일 검증 실패",
          description: validation.error || "파일 검증에 실패했습니다",
          variant: "destructive"
        })
        continue
      }
      
      if (file.type.startsWith('image/')) {
        imageFiles.push(file)
      } else {
        nonImageFiles.push(file)
      }
    }

    // 이미지 파일이 있으면 크롭 모달 시작
    if (imageFiles.length > 0) {
      setPendingFiles([...imageFiles, ...nonImageFiles])
      setCurrentFileIndex(0)
      setCurrentCropFile(imageFiles[0])
    } else if (nonImageFiles.length > 0) {
      // 이미지가 아닌 파일들은 바로 업로드
      await uploadFiles(nonImageFiles)
    }
  }

  const uploadFiles = async (filesToUpload: File[]) => {
    setIsUploading(true)
    onUploadStart?.()

    try {
      const supabase = createClient()
      
      const uploadPromises = filesToUpload.map(async (file, index) => {
        const fileKey = `${file.name}-${index}`
        
        const result = await uploadProjectImage(supabase, userId!, file, {
          onProgress: (progress) => {
            setUploadProgress(prev => ({
              ...prev,
              [fileKey]: progress.percentage
            }))
          }
        })

        if (!result.success) {
          throw new Error(result.error || '업로드 실패')
        }

        return result.url!
      })

      const urls = await Promise.all(uploadPromises)

      if (multiple) {
        const newFiles = [...selectedFiles, ...urls]
        setSelectedFiles(newFiles)
        onFileSelect(newFiles)
        onUploadComplete?.(newFiles)
      } else {
        setSelectedFiles([urls[0]])
        onFileSelect(urls[0])
        onUploadComplete?.(urls[0])
      }

      toast({
        title: "업로드 완료",
        description: `${urls.length}개 파일이 성공적으로 업로드되었습니다.`
      })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다'
      toast({
        title: "업로드 실패", 
        description: errorMessage,
        variant: "destructive"
      })
      onUploadError?.(errorMessage)
    } finally {
      setIsUploading(false)
      setUploadProgress({})
    }
  }

  const handleCropComplete = async (croppedFile: File) => {
    // 크롭된 파일을 pendingFiles에서 교체
    const newPendingFiles = [...pendingFiles]
    newPendingFiles[currentFileIndex] = croppedFile
    setPendingFiles(newPendingFiles)
    
    // 다음 이미지 파일이 있는지 확인
    const nextImageIndex = findNextImageIndex(currentFileIndex + 1)
    
    if (nextImageIndex !== -1) {
      // 다음 이미지 파일로 이동
      setCurrentFileIndex(nextImageIndex)
      setCurrentCropFile(newPendingFiles[nextImageIndex])
    } else {
      // 모든 이미지 크롭 완료, 업로드 시작
      setCurrentCropFile(null)
      await uploadFiles(newPendingFiles)
      setPendingFiles([])
      setCurrentFileIndex(0)
    }
  }

  const handleCropCancel = () => {
    setCurrentCropFile(null)
    setPendingFiles([])
    setCurrentFileIndex(0)
  }


  const findNextImageIndex = (startIndex: number): number => {
    for (let i = startIndex; i < pendingFiles.length; i++) {
      if (pendingFiles[i].type.startsWith('image/')) {
        return i
      }
    }
    return -1
  }

  const handleReorder = (newOrder: string[]) => {
    setSelectedFiles(newOrder)
    if (multiple) {
      onFileSelect(newOrder)
    } else {
      onFileSelect(newOrder[0] || '')
    }
  }

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    
    if (multiple) {
      onFileSelect(newFiles)
    } else {
      onFileSelect('')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        } ${isUploading || currentCropFile ? 'pointer-events-none opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && !currentCropFile && fileInputRef.current?.click()}
      >
        {isUploading ? (
          <Loader2 className="h-8 w-8 mx-auto mb-2 text-primary animate-spin" />
        ) : (
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        )}
        <p className="text-sm text-muted-foreground mb-2">
          {isUploading 
            ? '업로드 중...' 
            : currentCropFile 
            ? '이미지 크롭 중...' 
            : placeholder
          }
        </p>
        <p className="text-xs text-muted-foreground">
          {isUploading 
            ? '잠시만 기다려주세요' 
            : currentCropFile 
            ? '이미지 크롭을 완료해주세요'
            : '클릭하거나 파일을 드래그해서 업로드하세요'
          }
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* 드래그 앤 드롭 스크린샷 */}
      {selectedFiles.length > 0 && (
        <DragDropScreenshots
          screenshots={selectedFiles}
          onReorder={handleReorder}
          onRemove={removeFile}
          maxItems={10}
        />
      )}

      {/* 이미지 크롭 모달 */}
      <ImageCropModal
        isOpen={!!currentCropFile}
        imageFile={currentCropFile}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
      />
    </div>
  )
}