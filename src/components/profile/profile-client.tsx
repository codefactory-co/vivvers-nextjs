'use client'

import { ProfileView } from '@/components/profile/profile-view'
import { User } from '@prisma/client'
import type { UserStats } from '@/types/user'

interface ProfileClientProps {
  user: User
  isOwner: boolean
  stats: UserStats
}

export function ProfileClient({ user, isOwner, stats }: ProfileClientProps) {
  return (
    <ProfileView
      user={user}
      isOwner={isOwner}
      stats={stats}
    />
  )
}