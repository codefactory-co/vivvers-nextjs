'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { CtaButtons } from './cta-buttons'
import { Boxes } from '@/components/ui/background-boxes'

export interface HeroSectionProps {
  headline?: string
  subtitle?: string
  primaryCtaText?: string
  secondaryCtaText?: string
  onPrimaryCtaClick?: () => void
  onSecondaryCtaClick?: () => void
  className?: string
  variant?: 'default' | 'centered' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  headline = '당신의 프로젝트,\nvivvers에서 빛나다',
  subtitle = 'vivvers는 바이브 코딩으로 만든 서비스를 홍보하고 공유하는 플랫폼입니다.\n당신의 프로젝트를 세상에 알려보세요!',
  primaryCtaText = '프로젝트 둘러보기',
  secondaryCtaText = '내 프로젝트 업로드하기',
  onPrimaryCtaClick,
  onSecondaryCtaClick,
  className,
  variant = 'default',
  size = 'md'
}) => {
  const sizeStyles = {
    sm: {
      container: 'min-h-[70vh] py-12 px-4',
      headline: 'text-3xl md:text-4xl',
      subtitle: 'text-lg md:text-xl',
      spacing: 'space-y-6',
      maxWidth: 'max-w-3xl'
    },
    md: {
      container: 'min-h-[80vh] py-16 px-6',
      headline: 'text-4xl md:text-5xl lg:text-6xl',
      subtitle: 'text-xl md:text-2xl',
      spacing: 'space-y-8',
      maxWidth: 'max-w-4xl'
    },
    lg: {
      container: 'min-h-[90vh] py-20 px-8',
      headline: 'text-3xl md:text-4xl lg:text-5xl',
      subtitle: 'text-lg md:text-xl',
      spacing: 'space-y-10',
      maxWidth: 'max-w-5xl'
    }
  }

  const variantStyles = {
    default: 'text-center',
    centered: 'text-center',
    minimal: 'text-left md:text-center'
  }

  const currentSize = sizeStyles[size]

  return (
    <section className={cn(
      'relative w-full overflow-hidden',
      // Theme-responsive background
      'bg-background',
      'flex items-center justify-center',
      currentSize.container,
      className
    )}>
      {/* Animated Background Boxes */}
      <div className="absolute inset-0 w-full h-full">
        <Boxes />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 w-full h-full bg-background/40 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      </div>

      <div className="container mx-auto relative z-20 pointer-events-none">
        <div className={cn(
          'flex flex-col items-center justify-center',
          currentSize.maxWidth,
          'mx-auto',
          currentSize.spacing,
          variantStyles[variant]
        )}>
          {/* Logo */}
          <div className="mb-2">
            <img 
              src="/img/logo.png" 
              alt="Vivvers 로고" 
              className="h-24 w-auto md:h-32 lg:h-40"
            />
          </div>

          {/* Main Headline */}
          <h1 className={cn(
            'font-bold tracking-tight',
            // Theme-responsive text color
            'text-foreground',
            'leading-tight',
            currentSize.headline
          )}>
            {headline}
          </h1>

          {/* Subtitle */}
          <p className={cn(
            // Theme-responsive muted text color
            'text-muted-foreground leading-relaxed',
            'max-w-2xl mx-auto',
            currentSize.subtitle
          )}>
            {subtitle}
          </p>

          {/* CTA Buttons - restore pointer events for clickability */}
          <div className="w-full flex justify-center pointer-events-auto">
            <CtaButtons
              primaryText={primaryCtaText}
              secondaryText={secondaryCtaText}
              onPrimaryClick={onPrimaryCtaClick}
              onSecondaryClick={onSecondaryCtaClick}
              size="sm"
              variant="center"
            />
          </div>
        </div>
      </div>
    </section>
  )
}