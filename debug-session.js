// Debug script to test session in browser console
// Run this in your browser's dev tools console

async function debugSupabaseSession() {
  // Import your client (adjust path as needed)
  const { createClient } = await import('./src/lib/supabase/client.ts')
  const supabase = createClient()
  
  console.log('=== Supabase Session Debug ===')
  
  // Check current session
  const { data: session, error: sessionError } = await supabase.auth.getSession()
  console.log('Current session:', session)
  console.log('Session error:', sessionError)
  
  // Check user
  const { data: user, error: userError } = await supabase.auth.getUser()
  console.log('Current user:', user)
  console.log('User error:', userError)
  
  // Check local storage
  console.log('LocalStorage auth tokens:', localStorage.getItem('sb-127.0.0.1:54321-auth-token'))
  
  // Check cookies
  console.log('All cookies:', document.cookie)
}

debugSupabaseSession()