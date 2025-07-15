'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import { Area } from 'react-easy-crop'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Loader2, ZoomIn } from 'lucide-react'
import { createCroppedImage } from '@/lib/utils/image-crop'

interface AvatarCropModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  onCropComplete: (croppedImageBlob: Blob) => void
  isLoading?: boolean
}

export function AvatarCropModal({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  isLoading = false
}: AvatarCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isCropping, setIsCropping] = useState(false)
  
  // Ref to track if component is unmounting
  const isUnmountingRef = useRef(false)

  // Cleanup effect to prevent state updates during unmounting
  useEffect(() => {
    return () => {
      isUnmountingRef.current = true
    }
  }, [])

  const onCropAreaChange = useCallback((cropArea: Area, cropAreaPixels: Area) => {
    if (!isUnmountingRef.current) {
      setCroppedAreaPixels(cropAreaPixels)
    }
  }, [])

  const handleCropAndSave = useCallback(async () => {
    if (!croppedAreaPixels || isUnmountingRef.current) return

    try {
      setIsCropping(true)
      const croppedImage = await createCroppedImage(imageSrc, croppedAreaPixels)
      onCropComplete(croppedImage)
    } catch (error) {
      console.error('크롭 처리 중 오류:', error)
      alert('이미지 처리 중 오류가 발생했습니다')
    } finally {
      if (!isUnmountingRef.current) {
        setIsCropping(false)
      }
    }
  }, [croppedAreaPixels, imageSrc, onCropComplete])

  const handleCancel = useCallback(() => {
    // Don't update state if component is unmounting
    if (!isUnmountingRef.current) {
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedAreaPixels(null)
    }
    onClose()
  }, [onClose])

  const handleZoomChange = useCallback((value: number[]) => {
    if (!isUnmountingRef.current) {
      setZoom(value[0])
    }
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Only handle close events, not during unmounting
      if (!open && !isUnmountingRef.current) {
        handleCancel()
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>프로필 이미지 편집</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 크롭 영역 */}
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1} // 1:1 비율 고정
              onCropChange={(newCrop) => {
                if (!isUnmountingRef.current) {
                  setCrop(newCrop)
                }
              }}
              onZoomChange={(newZoom) => {
                if (!isUnmountingRef.current) {
                  setZoom(newZoom)
                }
              }}
              onCropAreaChange={onCropAreaChange}
              cropShape="round" // 원형 크롭 표시
              showGrid={false}
              restrictPosition={true}
              style={{
                containerStyle: {
                  width: '100%',
                  height: '100%',
                  position: 'relative'
                }
              }}
            />
          </div>

          {/* 줌 컨트롤 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ZoomIn className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">확대/축소</span>
            </div>
            <Slider
              value={[zoom]}
              onValueChange={handleZoomChange}
              min={1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* 안내 메시지 */}
          <p className="text-sm text-muted-foreground text-center">
            드래그하여 위치를 조정하고, 슬라이더로 크기를 조절하세요
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isCropping || isLoading}
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={handleCropAndSave}
            disabled={isCropping || isLoading || !croppedAreaPixels}
          >
            {(isCropping || isLoading) && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            {isCropping ? '처리 중...' : isLoading ? '업로드 중...' : '저장'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}