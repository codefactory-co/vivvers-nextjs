"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Edit2, Trash2 } from 'lucide-react'
import { cn, formatCount } from '@/lib/utils'
import type { CommentActionsProps } from '@/types/comment'

export function CommentActions({
  comment,
  isOwner,
  onLike,
  onReply,
  onEdit,
  onDelete,
  depth = 0
}: CommentActionsProps) {
  const [animateCount, setAnimateCount] = useState(false)

  const handleLike = () => {
    // Trigger count animation
    setAnimateCount(true)
    setTimeout(() => setAnimateCount(false), 200)
    
    // Call the onLike function (which is already debounced in ProjectComments)
    onLike(comment.id)
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {/* 좋아요 버튼 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        className={cn(
          "h-8 gap-1.5 px-2 text-xs transition-all duration-200",
          comment.isLiked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-400"
        )}
      >
        <Heart 
          className={cn(
            "h-4 w-4 transition-all duration-200",
            comment.isLiked && "fill-current",
            animateCount && "scale-125"
          )} 
        />
        {comment.likeCount > 0 && (
          <span 
            className={cn(
              "font-medium tabular-nums transition-all duration-200",
              animateCount && "scale-110"
            )}
          >
            {formatCount(comment.likeCount)}
          </span>
        )}
      </Button>

      {/* 답글 버튼 - 최상위 댓글에만 표시 */}
      {depth === 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReply(comment.id)}
          className="h-8 gap-1.5 px-2 text-xs text-muted-foreground"
        >
          <MessageCircle className="h-4 w-4" />
          {comment.repliesCount > 0 && (
            <span className="font-medium">{comment.repliesCount}</span>
          )}
        </Button>
      )}

      {/* 소유자 전용 액션 */}
      {isOwner && (
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(comment.id)}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(comment.id)}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}