'use client'

import { useState, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AvatarUploadButton } from './avatar-upload-button'
import { AvatarCropModal } from './avatar-crop-modal'
import { createUserProfile } from '@/lib/actions/user/user-create'
import { replaceAvatarImage } from '@/lib/services/avatar-upload'
import { fileToDataUrl, validateImageFile } from '@/lib/utils/image-crop'
import { Loader2 } from 'lucide-react'

interface OnboardingFormProps {
  user: User
}

export function OnboardingForm({ user }: OnboardingFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    avatar: user.user_metadata?.avatar_url || ''
  })

  // Avatar 업로드 관련 상태
  const [showCropModal, setShowCropModal] = useState(false)
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>('')
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await createUserProfile({
        username: formData.username,
        bio: formData.bio,
        avatar: formData.avatar,
        email: user.email!,
        supabaseUserId: user.id
      })

      if (result.success) {
        // 성공 시 홈페이지로 리다이렉트 (Server Action에서 처리)
        window.location.href = '/'
      } else {
        setError(result.error || '프로필 생성에 실패했습니다.')
      }
    } catch {
      setError('프로필 생성 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Avatar 파일 선택 처리
  const handleAvatarFileSelect = useCallback(async (file: File) => {
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      setError(validation.error || '파일이 유효하지 않습니다')
      return
    }

    try {
      const dataUrl = await fileToDataUrl(file)
      setSelectedImageSrc(dataUrl)
      setShowCropModal(true)
      setError(null)
    } catch {
      setError('파일을 읽는 중 오류가 발생했습니다')
    }
  }, [])

  // 크롭 완료 후 업로드 처리
  const handleCropComplete = useCallback(async (croppedImageBlob: Blob) => {
    try {
      setIsUploadingAvatar(true)
      
      const uploadResult = await replaceAvatarImage(
        user.id,
        croppedImageBlob,
        formData.avatar
      )

      if (uploadResult.success && uploadResult.url) {
        setFormData(prev => ({ ...prev, avatar: uploadResult.url! }))
        setShowCropModal(false)
        setError(null)
      } else {
        setError(uploadResult.error || '이미지 업로드에 실패했습니다')
      }
    } catch {
      setError('이미지 업로드 중 오류가 발생했습니다')
    } finally {
      setIsUploadingAvatar(false)
    }
  }, [user.id, formData.avatar])

  const handleCloseModal = useCallback(() => {
    setShowCropModal(false)
  }, [])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 아바타 섹션 */}
      <div className="flex flex-col items-center space-y-4">
        <AvatarUploadButton
          src={formData.avatar}
          alt="프로필 이미지"
          name={user.email || 'User'}
          onFileSelect={handleAvatarFileSelect}
          disabled={isLoading || isUploadingAvatar}
        />
      </div>

      {/* 사용자명 */}
      <div>
        <Label htmlFor="username">사용자명 *</Label>
        <Input
          id="username"
          type="text"
          placeholder="영문, 숫자, 하이픈만 사용 (3-20자)"
          value={formData.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          pattern="^[a-zA-Z0-9-]{3,20}$"
          required
        />
        <p className="text-sm text-muted-foreground mt-1">
          다른 사용자들에게 표시되는 고유한 사용자명입니다
        </p>
      </div>

      {/* 자기소개 */}
      <div>
        <Label htmlFor="bio">자기소개 (선택)</Label>
        <Textarea
          id="bio"
          placeholder="간단한 자기소개를 작성해주세요"
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          maxLength={500}
          rows={3}
        />
        <p className="text-sm text-muted-foreground mt-1">
          {formData.bio.length}/500자
        </p>
      </div>

      {/* 이메일 (읽기 전용) */}
      <div>
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          value={user.email || ''}
          readOnly
          className="bg-muted"
        />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* 제출 버튼 */}
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || isUploadingAvatar || !formData.username.trim()}
      >
        {(isLoading || isUploadingAvatar) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {isUploadingAvatar ? '이미지 업로드 중...' : isLoading ? '프로필 생성 중...' : '프로필 생성하기'}
      </Button>

      {/* Avatar 크롭 모달 */}
      <AvatarCropModal
        isOpen={showCropModal}
        onClose={handleCloseModal}
        imageSrc={selectedImageSrc}
        onCropComplete={handleCropComplete}
        isLoading={isUploadingAvatar}
      />
    </form>
  )
}