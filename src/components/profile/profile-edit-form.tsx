'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { AvatarUploadButton } from '@/components/onboarding/avatar-upload-button'
import { TagInput } from '@/components/forms/tag-input'
import { SocialLinksInput } from '@/components/forms/social-links-input'
import { updateUserProfile } from '@/lib/actions/user/user-update'
import { type UpdateUserData } from '@/lib/validations/user'
import { User } from '@/types/user'

interface ProfileEditFormProps {
  user: User
  onSave: () => void
  onCancel: () => void
}

interface FormData {
  username: string
  bio: string
  avatar: string
  socialLinks: {
    github?: string
    linkedin?: string
    portfolio?: string
  }
  skills: string[]
  experience: string
  isPublic: boolean
}

export function ProfileEditForm({ user, onSave, onCancel }: ProfileEditFormProps) {
  const [formData, setFormData] = useState<FormData>({
    username: user.username,
    bio: user.bio || '',
    avatar: user.avatarUrl || '',
    socialLinks: user.socialLinks as { github?: string; linkedin?: string; portfolio?: string } || {},
    skills: user.skills || [],
    experience: user.experience || '',
    isPublic: user.isPublic ?? true
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string | string[] | { github?: string; linkedin?: string; portfolio?: string } | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const updateData: UpdateUserData = {
        username: formData.username !== user.username ? formData.username : undefined,
        bio: formData.bio !== user.bio ? formData.bio : undefined,
        avatar: formData.avatar !== user.avatarUrl ? formData.avatar : undefined,
        socialLinks: formData.socialLinks,
        skills: formData.skills,
        experience: formData.experience,
        isPublic: formData.isPublic
      }

      const result = await updateUserProfile(updateData)

      if (result.success) {
        onSave()
      } else {
        setError(result.error || '프로필 업데이트에 실패했습니다')
      }
    } catch {
      setError('프로필 업데이트 중 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* 아바타 업로드 */}
      <div className="flex justify-center">
        <AvatarUploadButton
          src={formData.avatar}
          alt={user.username}
          name={user.username}
          onFileSelect={(file: File) => {
            // 파일 업로드 로직 추가 필요
            const reader = new FileReader()
            reader.onload = (e) => {
              if (e.target?.result) {
                handleInputChange('avatar', e.target.result as string)
              }
            }
            reader.readAsDataURL(file)
          }}
          disabled={isLoading}
        />
      </div>

      {/* 사용자명 */}
      <div className="space-y-2">
        <Label htmlFor="username">사용자명</Label>
        <Input
          id="username"
          type="text"
          value={formData.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          placeholder="사용자명을 입력하세요"
          disabled={isLoading}
          required
        />
      </div>

      {/* 자기소개 */}
      <div className="space-y-2">
        <Label htmlFor="bio">자기소개</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          placeholder="자기소개를 입력하세요"
          disabled={isLoading}
          maxLength={500}
        />
        <div className="text-sm text-muted-foreground text-right">
          {formData.bio.length}/500
        </div>
      </div>

      {/* 소셜 링크 */}
      <div className="space-y-2">
        <Label>소셜 링크</Label>
        <SocialLinksInput
          value={formData.socialLinks}
          onChange={(links) => handleInputChange('socialLinks', links)}
          disabled={isLoading}
        />
      </div>

      {/* 스킬 */}
      <div className="space-y-2">
        <Label>스킬</Label>
        <TagInput
          tags={formData.skills}
          onTagsChange={(tags) => handleInputChange('skills', tags)}
          placeholder="스킬을 입력하세요"
          disabled={isLoading}
        />
      </div>

      {/* 경력 */}
      <div className="space-y-2">
        <Label htmlFor="experience">경력</Label>
        <Textarea
          id="experience"
          value={formData.experience}
          onChange={(e) => handleInputChange('experience', e.target.value)}
          placeholder="경력 사항을 입력하세요"
          disabled={isLoading}
          maxLength={1000}
        />
        <div className="text-sm text-muted-foreground text-right">
          {formData.experience.length}/1000
        </div>
      </div>

      {/* 공개 설정 */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={formData.isPublic}
          onChange={(e) => handleInputChange('isPublic', e.target.checked)}
          disabled={isLoading}
        />
        <Label htmlFor="isPublic">프로필 공개</Label>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? '저장 중...' : '저장'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          취소
        </Button>
      </div>
    </form>
  )
}