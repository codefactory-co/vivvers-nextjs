import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserByUsername } from '@/lib/actions/user/user-get'
import { ProfileEditPage } from '@/components/profile/profile-edit-page'
import { Card, CardContent } from '@/components/ui/card'
import { User as UserIcon } from 'lucide-react'

export default async function ProfileEdit() {
  // 현재 로그인된 사용자 확인
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!authUser) {
    redirect('/signin')
  }
  
  // 사용자 정보 조회 (profile 페이지와 동일한 로직)
  let currentUser = null
  
  // Try multiple ways to get user data
  if (authUser.user_metadata?.username) {
    const currentUserResult = await getUserByUsername(authUser.user_metadata.username)
    if (currentUserResult.success && currentUserResult.data) {
      currentUser = currentUserResult.data
    }
  } 
  
  // If user not found by username, try to find by Supabase user ID
  if (!currentUser) {
    try {
      const { getUserById } = await import('@/lib/actions/user/user-get')
      currentUser = await getUserById(authUser.id)
    } catch (error) {
      console.error('Failed to find user by ID:', error)
    }
  }
  
  // If still no user found, create a temporary user profile for demo
  if (!currentUser) {
    const tempUsername = authUser.email?.split('@')[0] || 'user'
    currentUser = {
      id: authUser.id,
      username: tempUsername,
      email: authUser.email || '',
      avatarUrl: null,
      bio: null,
      socialLinks: {},
      skills: [],
      experience: null,
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
  
  // 사용자 정보를 찾을 수 없는 경우
  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserIcon className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">프로필을 로드할 수 없습니다</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      <ProfileEditPage user={currentUser} />
    </div>
  )
}