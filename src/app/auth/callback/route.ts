import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    // Create a NextResponse.next() first to allow for cookie manipulation
    const supabaseResponse = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
    
    // Create Supabase client
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.session) {
      // 사용자 정보 가져오기
      const { data: { user } } = await supabase.auth.getUser()
      
      // 첫 로그인 시 메타데이터 설정
      if (user && !user.user_metadata?.profile_completed) {
        await supabase.auth.updateUser({
          data: { profile_completed: false }
        })
      }

      // Now create the redirect response and copy over the cookies
      const redirectUrl = new URL(next, origin)
      const response = NextResponse.redirect(redirectUrl)
      
      // Copy all cookies from the Supabase response to the redirect response
      supabaseResponse.cookies.getAll().forEach(cookie => {
        response.cookies.set(cookie.name, cookie.value, cookie)
      })
      
      return response
    }
  }
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}