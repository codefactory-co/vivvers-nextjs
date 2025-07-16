'use client'

import React, { useState } from 'react'
import { Share, Copy, Check, MessageCircle, Facebook, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { projectEvents } from '@/lib/analytics'

interface ShareButtonProps {
  url: string
  title?: string
  description?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  projectId?: string
  projectTitle?: string
}

export function ShareButton({
  url,
  title = '',
  description = '',
  variant = 'outline',
  size = 'sm',
  className,
  projectId,
  projectTitle
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const trackShareEvent = () => {
    if (projectId && projectTitle) {
      projectEvents.share({
        project_id: projectId,
        project_title: projectTitle,
      });
    }
  };

  const handleCopyUrl = async () => {
    // 항상 full URL로 생성
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`
    
    trackShareEvent();
    
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = fullUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleKakaoShare = () => {
    trackShareEvent();
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`
    const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(fullUrl)}`
    window.open(kakaoUrl, '_blank', 'width=600,height=400')
  }

  const handleFacebookShare = () => {
    trackShareEvent();
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
  }

  const handleTwitterShare = () => {
    trackShareEvent();
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`
    const text = title ? `${title} - ${description}` : description
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(text)}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
  }

  const handleNaverShare = () => {
    trackShareEvent();
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`
    const naverUrl = `https://share.naver.com/web/shareView?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}`
    window.open(naverUrl, '_blank', 'width=600,height=400')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn('flex items-center gap-2', className)}
        >
          <Share className="h-4 w-4" />
          공유
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyUrl} className="flex items-center gap-2">
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? '복사됨!' : '링크 복사'}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleKakaoShare} className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-yellow-500" />
          카카오톡
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleFacebookShare} className="flex items-center gap-2">
          <Facebook className="h-4 w-4 text-blue-600" />
          Facebook
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleTwitterShare} className="flex items-center gap-2">
          <Twitter className="h-4 w-4 text-blue-400" />
          Twitter
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleNaverShare} className="flex items-center gap-2">
          <div className="h-4 w-4 bg-green-500 rounded text-xs flex items-center justify-center text-white font-bold">
            N
          </div>
          네이버 블로그
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}