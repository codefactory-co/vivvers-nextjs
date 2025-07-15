'use client'

import { useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera } from 'lucide-react'

interface AvatarUploadButtonProps {
  src?: string
  alt: string
  name: string
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export function AvatarUploadButton({ 
  src, 
  alt, 
  name, 
  onFileSelect, 
  disabled = false 
}: AvatarUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (disabled) return
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 파일 타입 검증
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('JPG, PNG, WebP 파일만 업로드 가능합니다')
      return
    }

    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하여야 합니다')
      return
    }

    onFileSelect(file)
    
    // 파일 input 초기화 (같은 파일 재선택 가능하도록)
    if (event.target) {
      event.target.value = ''
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`relative group ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label="프로필 이미지 변경"
      >
        <Avatar className="w-24 h-24">
          <AvatarImage src={src} alt={alt} />
          <AvatarFallback>
            {name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        
        {/* 호버 오버레이 */}
        <div className={`absolute inset-0 bg-black/50 opacity-0 ${disabled ? '' : 'group-hover:opacity-100'} rounded-full flex items-center justify-center transition-opacity`}>
          <Camera className="w-6 h-6 text-white" />
        </div>

        {/* 숨겨진 파일 input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
      
      <p className="text-sm text-muted-foreground mt-2 text-center">
        클릭하여 프로필 이미지 변경
      </p>
    </div>
  )
}