'use client'

import { useRouter } from 'next/navigation'
import { ProfileEditForm } from '@/components/profile/profile-edit-form'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { User } from '@/types/user'

interface ProfileEditPageProps {
  user: User
}

export function ProfileEditPage({ user }: ProfileEditPageProps) {
  const router = useRouter()

  const handleSave = () => {
    // 저장 후 프로필 페이지로 리다이렉트
    router.push('/profile')
    router.refresh() // 최신 데이터 반영
  }

  const handleCancel = () => {
    // 취소 시 프로필 페이지로 리다이렉트
    router.push('/profile')
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/profile')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          프로필로 돌아가기
        </Button>
      </div>

      {/* 편집 폼 */}
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">프로필 편집</h1>
          <ProfileEditForm
            user={user}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  )
}