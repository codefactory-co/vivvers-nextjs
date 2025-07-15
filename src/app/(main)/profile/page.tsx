import { ProfileView } from '@/components/profile/profile-view'
import { getUserStats } from '@/lib/actions/user/user-stats'
import { ensureUserExists } from '@/lib/actions/user/user-ensure'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { User as UserIcon } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  // 현재 로그인된 사용자 확인
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!authUser) {
    redirect('/signin')
  }
  
  // 사용자 정보 조회 또는 생성
  const currentUser = await ensureUserExists(authUser.id)
  
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

  // 사용자 통계 조회
  let userStats
  try {
    userStats = await getUserStats(currentUser.id)
  } catch (error) {
    console.error('Failed to get user stats:', error)
    // 기본 통계값 제공
    userStats = {
      projectCount: 0,
      totalLikes: 0,
      followerCount: 0,
      followingCount: 0
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      <ProfileView
        user={currentUser}
        isOwner={true}
        stats={userStats}
      />
    </div>
  )
}