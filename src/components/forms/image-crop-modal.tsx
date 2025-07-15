'use client'

import { useState, useCallback, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Loader2, RotateCw, ZoomIn, ZoomOut } from 'lucide-react'
import { createCroppedImage, fileToDataUrl } from '@/lib/utils/image-crop'
import { useToast } from '@/hooks/use-toast'

interface ImageCropModalProps {
  isOpen: boolean
  imageFile: File | null
  onCropComplete: (croppedFile: File) => void
  onCancel: () => void
}

export function ImageCropModal({ 
  isOpen, 
  imageFile, 
  onCropComplete, 
  onCancel
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [imageSrc, setImageSrc] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  // 이미지 파일이 변경될 때 Data URL로 변환
  const loadImage = useCallback(async () => {
    if (imageFile) {
      try {
        const dataUrl = await fileToDataUrl(imageFile)
        setImageSrc(dataUrl)
      } catch (error) {
        console.error('이미지 로딩 실패:', error)
        toast({
          title: "이미지 로딩 실패",
          description: "이미지를 불러올 수 없습니다.",
          variant: "destructive"
        })
      }
    }
  }, [imageFile, toast])

  // 파일이 변경될 때마다 이미지 로딩
  useEffect(() => {
    if (isOpen && imageFile) {
      loadImage()
    }
  }, [isOpen, imageFile, loadImage])

  const onCropCompleteCallback = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const handleCropConfirm = async () => {
    if (!croppedAreaPixels || !imageSrc) {
      toast({
        title: "크롭 영역 오류",
        description: "크롭할 영역을 선택해주세요.",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)
    try {
      const croppedFile = await createCroppedImage(imageSrc, croppedAreaPixels)
      onCropComplete(croppedFile)
      
      // 상태 초기화
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setRotation(0)
      setCroppedAreaPixels(null)
      setImageSrc('')
      
      toast({
        title: "크롭 완료",
        description: "이미지가 16:9 비율로 크롭되었습니다."
      })
    } catch (error) {
      console.error('크롭 처리 실패:', error)
      toast({
        title: "크롭 실패",
        description: "이미지 크롭 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    // 상태 초기화
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    setCroppedAreaPixels(null)
    setImageSrc('')
    onCancel()
  }


  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-4xl w-full h-[80vh] sm:h-[90vh] flex flex-col p-4 sm:p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl">이미지 크롭 - 16:9 비율</DialogTitle>
        </DialogHeader>

        <div className="flex-1 relative bg-muted rounded-lg overflow-hidden min-h-[300px]">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={16 / 9}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropCompleteCallback}
              showGrid={true}
              restrictPosition={true}
              style={{
                containerStyle: {
                  background: 'hsl(var(--muted))',
                },
                cropAreaStyle: {
                  border: '2px solid hsl(var(--primary))',
                  borderRadius: '4px',
                },
                mediaStyle: {
                  maxHeight: '100%',
                  maxWidth: '100%',
                },
              }}
            />
          )}
        </div>

        {/* 컨트롤 영역 */}
        <div className="space-y-3 pt-4">
          {/* 줌 컨트롤 */}
          <div className="flex items-center gap-3 sm:gap-4">
            <ZoomOut className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Slider
              value={[zoom]}
              onValueChange={(values) => setZoom(values[0])}
              min={1}
              max={3}
              step={0.1}
              className="flex-1 touch-none"
            />
            <ZoomIn className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground min-w-[50px] sm:min-w-[60px] text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* 회전 컨트롤 */}
          <div className="flex items-center gap-3 sm:gap-4">
            <RotateCw className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Slider
              value={[rotation]}
              onValueChange={(values) => setRotation(values[0])}
              min={-180}
              max={180}
              step={1}
              className="flex-1 touch-none"
            />
            <span className="text-sm text-muted-foreground min-w-[50px] sm:min-w-[60px] text-right">
              {rotation}°
            </span>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            취소
          </Button>
          
          <Button
            onClick={handleCropConfirm}
            disabled={isProcessing || !croppedAreaPixels}
            className="w-full sm:w-auto"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                처리 중...
              </>
            ) : (
              '크롭 완료'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}