import { Area } from 'react-easy-crop'

/**
 * 크롭된 이미지를 생성하는 유틸리티 함수 (16:9 비율)
 */
export async function createCroppedImage(
  imageSrc: string,
  cropArea: Area,
  targetWidth: number = 1920,
  targetHeight: number = 1080
): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('Canvas context를 생성할 수 없습니다'))
        return
      }

      // 캔버스 크기를 16:9 비율로 설정
      canvas.width = targetWidth
      canvas.height = targetHeight

      // 고품질 렌더링 설정
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // 크롭된 부분을 캔버스에 그리기
      ctx.drawImage(
        image,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        targetWidth,
        targetHeight
      )

      // JPEG 포맷으로 변환 (압축률 90%)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Blob을 File 객체로 변환
            const file = new File([blob], 'cropped-screenshot.jpg', {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            resolve(file)
          } else {
            reject(new Error('이미지 변환에 실패했습니다'))
          }
        },
        'image/jpeg',
        0.9
      )
    }

    image.onerror = () => {
      reject(new Error('이미지 로딩에 실패했습니다'))
    }

    image.src = imageSrc
  })
}

/**
 * 파일을 Data URL로 변환하는 함수
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === 'string') {
        resolve(event.target.result)
      } else {
        reject(new Error('파일 읽기에 실패했습니다'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('파일 읽기에 실패했습니다'))
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * 파일 유효성 검증 함수
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // 파일 타입 검증
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'JPG, PNG, WebP 파일만 업로드 가능합니다'
    }
  }

  // 파일 크기 검증 (10MB)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: '파일 크기는 10MB 이하여야 합니다'
    }
  }

  return { isValid: true }
}