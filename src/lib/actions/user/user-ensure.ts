'use server'

import { prisma } from '@/lib/prisma/client'
import { createClient } from '@/lib/supabase/server'
import type { User } from '@/types/user'
import { getUserAvatarUrl } from './user-avatar-get'

/**
 * Ensure a user exists in the database
 * If the user doesn't exist, create them with basic info from Supabase Auth
 */
export async function ensureUserExists(authUserId: string): Promise<User | null> {
  try {
    // First check if user exists in database
    let user = await prisma.user.findUnique({
      where: { id: authUserId }
    })

    if (user) {
      // Check if avatar URL exists in storage if not in database
      let avatarUrl = user.avatarUrl
      if (!avatarUrl) {
        avatarUrl = await getUserAvatarUrl(authUserId)
        
        // Update database with the found avatar URL
        if (avatarUrl) {
          await prisma.user.update({
            where: { id: authUserId },
            data: { avatarUrl }
          })
        }
      }
      
      return {
        ...user,
        avatarUrl,
        socialLinks: user.socialLinks as Record<string, string> | null
      }
    }

    // User doesn't exist, get auth info and create them
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser || authUser.id !== authUserId) {
      console.error('Auth user mismatch or not found')
      return null
    }

    // Extract username from email or metadata
    const username = authUser.user_metadata?.username || 
                    authUser.email?.split('@')[0] || 
                    `user_${authUserId.slice(0, 8)}`

    // Check for avatar in storage
    const avatarUrl = await getUserAvatarUrl(authUserId) || authUser.user_metadata?.avatar_url || null

    // Create user in database
    user = await prisma.user.create({
      data: {
        id: authUserId,
        email: authUser.email || '',
        username: username,
        avatarUrl: avatarUrl,
        bio: null,
        socialLinks: {},
        skills: [],
        experience: null,
        isPublic: true
      }
    })

    return {
      ...user,
      socialLinks: user.socialLinks as Record<string, string> | null
    }
  } catch (error) {
    console.error('Error ensuring user exists:', error)
    return null
  }
}