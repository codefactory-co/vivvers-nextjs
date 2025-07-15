'use client'

import React from 'react'
import { CommunityCommentItem } from './community-comment-item'
import { CommunityCommentListProps } from '@/types/community'

export const CommunityCommentList: React.FC<CommunityCommentListProps> = ({
  comments,
  currentUserId,
  postAuthorId,
  onCommentReply,
  onCommentEdit,
  onCommentDelete,
  loading = false,
  className
}) => {
  if (loading) {
    return (
      <div className={className}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3 animate-pulse">
            <div className="flex space-x-3">
              <div className="h-10 w-10 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-20 bg-muted rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Sort comments: best answers first, then by creation date
  const sortedComments = [...comments].sort((a, b) => {
    if (a.isBestAnswer && !b.isBestAnswer) return -1
    if (!a.isBestAnswer && b.isBestAnswer) return 1
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

  return (
    <div className={className}>
      <div className="space-y-6">
        {sortedComments.map((comment, index) => (
          <div key={comment.id}>
            {index > 0 && <div className="border-t my-6" />}
            <CommunityCommentItem
              comment={comment}
              currentUserId={currentUserId}
              postAuthorId={postAuthorId}
              onReply={onCommentReply}
              onEdit={onCommentEdit}
              onDelete={onCommentDelete}
              depth={0}
            />
          </div>
        ))}
      </div>
    </div>
  )
}