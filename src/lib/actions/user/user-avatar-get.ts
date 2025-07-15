'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Get the avatar URL for a user by checking Supabase storage
 * This is useful when the avatar URL might not be stored in the database
 */
export async function getUserAvatarUrl(userId: string): Promise<string | null> {
  try {
    const supabase = await createClient()
    
    // List files in the user's avatar directory
    const { data: files, error } = await supabase.storage
      .from('avatars')
      .list(userId, {
        limit: 10,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error || !files || files.length === 0) {
      return null
    }

    // Get the most recent avatar file
    const avatarFile = files[0]
    
    // Generate public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(`${userId}/${avatarFile.name}`)

    return urlData.publicUrl
  } catch (error) {
    console.error('Error getting avatar URL:', error)
    return null
  }
}