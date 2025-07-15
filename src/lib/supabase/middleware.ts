import {createServerClient} from '@supabase/ssr'
import {NextResponse, type NextRequest} from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({name, value}) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({name, value, options}) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )


    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const { data } = await supabase.auth.getClaims()
    const user = data?.claims?.user;
    // const {
    //     data: {user},
    // } = await supabase.auth.getUser()

    // Route definitions
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/profile') ||
        request.nextUrl.pathname.startsWith('/project/upload')

    const isAuthRoute = request.nextUrl.pathname.startsWith('/signin') ||
        request.nextUrl.pathname.startsWith('/signup')

    const isOnboardingRoute = request.nextUrl.pathname.startsWith('/onboarding')

    // Redirect unauthenticated users away from protected routes
    if (isProtectedRoute && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/signin'
        return NextResponse.redirect(url)
    }

    // Check if authenticated user needs onboarding
    if (user && !isOnboardingRoute && !isAuthRoute && !user.user_metadata?.profile_completed) {
        const url = request.nextUrl.clone()
        url.pathname = '/onboarding'
        return NextResponse.redirect(url)
    }

    // Redirect authenticated users away from auth routes
    if (isAuthRoute && user) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    // Redirect users who completed onboarding away from onboarding page
    if (isOnboardingRoute && user?.user_metadata?.profile_completed) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object instead of the supabaseResponse object

    return supabaseResponse
}