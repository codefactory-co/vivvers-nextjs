'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toggleCommentLike } from '@/lib/actions/community'

interface CommunityCommentLikeButtonProps {
  commentId: string
  postId: string
  initialLiked: boolean
  initialCount: number
  disabled?: boolean
}

export function CommunityCommentLikeButton({
  commentId,
  postId,
  initialLiked,
  initialCount,
  disabled = false
}: CommunityCommentLikeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [likeCount, setLikeCount] = useState(initialCount)
  const [isLiked, setIsLiked] = useState(initialLiked)

  const handleLike = async () => {
    if (disabled || isLoading) return

    setIsLoading(true)
    try {
      const result = await toggleCommentLike(commentId, postId)
      
      if (result.success && result.data) {
        // Update local state with server response
        setLikeCount(result.data.likeCount)
        setIsLiked(result.data.isLiked)
      } else {
        console.error('Failed to toggle like:', result.error)
      }
    } catch (error) {
      console.error('Failed to toggle like:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={disabled || isLoading}
      className={cn(
        "text-xs px-2 py-1 h-auto hover:text-red-500 transition-colors",
        isLiked && "text-red-500",
        isLoading && "opacity-50 cursor-not-allowed"
      )}
    >
      <Heart 
        className={cn(
          "w-3 h-3 mr-1 transition-all",
          isLiked && "fill-current",
          isLoading && "animate-pulse"
        )} 
      />
      {likeCount > 0 && (
        <span className="min-w-[1ch]">
          {likeCount}
        </span>
      )}
    </Button>
  )
}