'use client'

import React, { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageSquare, Star, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CommunityCommentForm } from './community-comment-form'
import { CommunityCommentItemProps } from '@/types/community'
import { HtmlContentRenderer } from '@/components/content/html-content-renderer'

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 1) return '방금 전'
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`
  if (diffInHours < 24) return `${diffInHours}시간 전`
  if (diffInDays < 7) return `${diffInDays}일 전`
  
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export const CommunityCommentItem: React.FC<CommunityCommentItemProps & {
  postAuthorId?: string
}> = ({
  comment,
  currentUserId,
  postAuthorId,
  onLike,
  onReply,
  onEdit,
  onDelete,
  onBestAnswer,
  depth = 0
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isLiked, setIsLiked] = useState(
    comment.likes?.some(like => like.userId === currentUserId) || false
  )
  
  const isOwner = currentUserId === comment.authorId
  const isPostAuthor = currentUserId === postAuthorId
  const maxDepth = 1 // 2-level comments only
  const canReply = depth < maxDepth && currentUserId

  const handleLike = () => {
    if (!currentUserId || !onLike) return
    setIsLiked(!isLiked)
    onLike(comment.id)
  }

  const handleReply = () => {
    setShowReplyForm(!showReplyForm)
  }

  const handleBestAnswer = () => {
    if (!onBestAnswer) return
    onBestAnswer(comment.id)
  }


  return (
    <div className={cn(
      "space-y-4",
      depth > 0 && "ml-12 border-l-2 border-muted pl-6 mt-4"
    )}>
      <div className={cn(
        "flex space-x-3",
        comment.isBestAnswer && "bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800"
      )}>
        {/* Avatar */}
        <Avatar className="h-10 w-10 shrink-0 mt-1">
          <AvatarImage 
            src={comment.author.avatarUrl || undefined} 
            alt={comment.author.username}
          />
          <AvatarFallback>
            {comment.author.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm">
                {comment.author.username}
              </span>
              {comment.authorId === postAuthorId && (
                <Badge variant="outline" className="text-xs">
                  작성자
                </Badge>
              )}
              {comment.isBestAnswer && (
                <Badge variant="default" className="text-xs bg-yellow-500 hover:bg-yellow-600">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  채택답변
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(new Date(comment.createdAt))}
              </span>
            </div>

            {/* Actions Menu */}
            {(isOwner || isPostAuthor) && (
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Comment Content */}
          {comment.contentHtml && comment.contentHtml.trim() !== '' ? (
            <HtmlContentRenderer
              htmlContent={comment.contentHtml}
              enableSyntaxHighlighting={true}
              className="prose prose-slate dark:prose-invert max-w-none mb-3 p-0"
            />
          ) : (
            <div className="prose prose-slate dark:prose-invert max-w-none mb-3">
              {comment.content.split('\n')
                .map((paragraph, index) => ({ paragraph: paragraph.trim(), originalIndex: index }))
                .filter(({ paragraph }) => paragraph)
                .map(({ paragraph, originalIndex }) => (
                  <p key={originalIndex} className="mb-2 last:mb-0 leading-relaxed text-sm">
                    {paragraph}
                  </p>
                ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-4 text-sm">
            {/* Like */}
            {currentUserId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn(
                  "text-xs px-2 py-1 h-auto hover:text-red-500",
                  isLiked && "text-red-500"
                )}
              >
                <Heart className={cn("w-3 h-3 mr-1", isLiked && "fill-current")} />
                {comment.likesCount > 0 && comment.likesCount}
              </Button>
            )}

            {/* Reply */}
            {canReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReply}
                className="text-xs px-2 py-1 h-auto"
              >
                <MessageSquare className="w-3 h-3 mr-1" />
                답글
              </Button>
            )}

            {/* Best Answer */}
            {isPostAuthor && !comment.isBestAnswer && depth === 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBestAnswer}
                className="text-xs px-2 py-1 h-auto hover:text-yellow-600"
              >
                <Star className="w-3 h-3 mr-1" />
                채택
              </Button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <CommunityCommentForm
                postId={comment.postId}
                parentId={comment.id}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommunityCommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              postAuthorId={postAuthorId}
              onLike={onLike}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onBestAnswer={onBestAnswer}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {/* Max depth notice */}
      {depth >= maxDepth && showReplyForm && (
        <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
          더 이상 답글을 달 수 없습니다. 새로운 댓글로 작성해주세요.
        </div>
      )}
    </div>
  )
}