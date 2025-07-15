'use client'

import React from 'react'
import { CommunityPostCard } from './community-post-card'
import { cn } from '@/lib/utils'
import { CommunityPostGridProps } from '@/types/community'

export const CommunityPostGrid: React.FC<CommunityPostGridProps> = ({
  posts,
  currentUserId,
  loading = false,
  className
}) => {
  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {posts.map((post) => (
        <CommunityPostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  )
}