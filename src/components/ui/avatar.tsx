'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string
  alt: string
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base'
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.trim())
    .filter(word => word.length > 0)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getAvatarColor = (name: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500'
  ]
  
  // 이름을 해시하여 색상 선택
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  
  return colors[Math.abs(hash) % colors.length]
}

export function Avatar({ src, alt, name, size = 'md', className }: AvatarProps) {
  const [imageError, setImageError] = useState(false)
  const initials = getInitials(name)
  const colorClass = getAvatarColor(name)
  
  // 이미지가 있고, 에러가 발생하지 않았으며, 빈 문자열이 아닌 경우에만 이미지 렌더링
  if (src && src.trim() !== '' && !imageError) {
    return (
      <div className={cn('relative rounded-full overflow-hidden', sizeClasses[size], className)}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="40px"
          onError={() => {
            setImageError(true)
          }}
        />
      </div>
    )
  }
  
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center text-white font-semibold',
        sizeClasses[size],
        colorClass,
        className
      )}
    >
      {initials}
    </div>
  )
}