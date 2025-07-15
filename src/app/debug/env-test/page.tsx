'use client'

import { AuthTest } from '@/components/debug/auth-test'

export default function EnvTestPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <div className="space-y-4">
        <div className="space-y-2">
          <p>NEXT_PUBLIC_SUPABASE_URL: {supabaseUrl || 'undefined'}</p>
          <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'undefined'}</p>
          <p>All NEXT_PUBLIC env vars:</p>
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify(
              Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')),
              null,
              2
            )}
          </pre>
        </div>
        
        <AuthTest />
      </div>
    </div>
  )
}