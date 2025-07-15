'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleProjectLike } from '@/lib/actions/project/project-like'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface ProjectLikeButtonProps {
  projectId: string
  initialIsLiked: boolean
  initialLikeCount: number
  currentUserId?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  className?: string
  showCount?: boolean
}

export function ProjectLikeButton({
  projectId,
  initialIsLiked,
  initialLikeCount,
  currentUserId,
  variant = 'outline',
  size = 'sm',
  className,
  showCount = true
}: ProjectLikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleLike = () => {
    if (!currentUserId) {
      // 로그인하지 않은 경우 로그인 페이지로 리디렉션
      router.push('/signin')
      return
    }

    startTransition(async () => {
      // 낙관적 업데이트
      const newIsLiked = !isLiked
      const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1
      
      setIsLiked(newIsLiked)
      setLikeCount(newLikeCount)

      try {
        const result = await toggleProjectLike(projectId)
        
        if (result.success) {
          // 서버 응답으로 상태 동기화
          setIsLiked(result.isLiked)
          setLikeCount(result.likeCount)
        } else {
          // 오류 발생 시 원래 상태로 롤백
          setIsLiked(initialIsLiked)
          setLikeCount(initialLikeCount)
          
          if (result.error) {
            // 토스트 메시지 표시 (선택사항)
            console.error('좋아요 오류:', result.error)
          }
        }
      } catch (error) {
        // 네트워크 오류 등 예외 발생 시 롤백
        setIsLiked(initialIsLiked)
        setLikeCount(initialLikeCount)
        console.error('좋아요 처리 중 오류:', error)
      }
    })
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLike}
      disabled={isPending}
      className={cn(
        'flex items-center gap-2 transition-all duration-200',
        isLiked && 'text-red-500 hover:text-red-600',
        className
      )}
    >
      <Heart 
        className={cn(
          'h-4 w-4 transition-all duration-200',
          isLiked && 'fill-current text-red-500'
        )} 
      />
      {showCount && (
        <span className="tabular-nums">
          {likeCount.toLocaleString()}
        </span>
      )}
    </Button>
  )
}

/**
 * 좋아요 개수만 표시하는 컴포넌트 (버튼 없음)
 */
interface ProjectLikeCountProps {
  likeCount: number
  className?: string
}

export function ProjectLikeCount({ likeCount, className }: ProjectLikeCountProps) {
  return (
    <div className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}>
      <Heart className="h-4 w-4" />
      <span className="tabular-nums">{likeCount.toLocaleString()}</span>
    </div>
  )
}

/**
 * 좋아요 상태 표시용 아이콘 (인터랙션 없음)
 */
interface ProjectLikeIconProps {
  isLiked: boolean
  className?: string
}

export function ProjectLikeIcon({ isLiked, className }: ProjectLikeIconProps) {
  return (
    <Heart 
      className={cn(
        'h-4 w-4 transition-colors duration-200',
        isLiked ? 'fill-current text-red-500' : 'text-muted-foreground',
        className
      )}
    />
  )
}