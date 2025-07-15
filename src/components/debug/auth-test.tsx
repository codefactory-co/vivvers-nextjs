'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function AuthTest() {
  const [status, setStatus] = useState('Checking...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testAuth = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        console.log('Environment variables:')
        console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
        console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'undefined')
        
        const supabase = createClient()
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setError(`Session error: ${error.message}`)
          setStatus('Error getting session')
        } else {
          setStatus(session ? 'User logged in' : 'No active session')
        }
      } catch (err) {
        setError(`Client creation error: ${err instanceof Error ? err.message : 'Unknown error'}`)
        setStatus('Client creation failed')
      }
    }

    testAuth()
  }, [])

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Auth Status Test</h3>
      <p>Status: {status}</p>
      {error && <p className="text-red-500">Error: {error}</p>}
      <div className="mt-2 text-sm">
        <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined'}</p>
        <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` : 'undefined'}</p>
      </div>
    </div>
  )
}