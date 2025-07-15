import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingForm } from '@/components/onboarding/onboarding-form'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 로그인하지 않은 사용자는 로그인 페이지로
  if (!user) {
    redirect('/signin')
  }

  // 이미 온보딩을 완료한 사용자는 홈으로
  if (user.user_metadata?.profile_completed) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">프로필 설정</h1>
          <p className="text-muted-foreground mt-2">
            Vivvers에서 사용할 프로필 정보를 입력해주세요
          </p>
        </div>
        
        <OnboardingForm user={user} />
      </div>
    </div>
  )
}