'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { CtaButtons } from './cta-buttons'

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
  headline = '바이브 코딩 프로젝트 쇼케이스',
  subtitle = '창의적인 프로젝트를 발견하고 영감을 얻으세요',
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
      container: 'py-12 px-4',
      headline: 'text-3xl md:text-4xl',
      subtitle: 'text-lg md:text-xl',
      spacing: 'space-y-6',
      maxWidth: 'max-w-3xl'
    },
    md: {
      container: 'py-16 px-6',
      headline: 'text-4xl md:text-5xl lg:text-6xl',
      subtitle: 'text-xl md:text-2xl',
      spacing: 'space-y-8',
      maxWidth: 'max-w-4xl'
    },
    lg: {
      container: 'py-20 px-8',
      headline: 'text-5xl md:text-6xl lg:text-7xl',
      subtitle: 'text-2xl md:text-3xl',
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
      'relative w-full bg-background',
      currentSize.container,
      className
    )}>
      <div className="container mx-auto">
        <div className={cn(
          'flex flex-col items-center justify-center',
          currentSize.maxWidth,
          'mx-auto',
          currentSize.spacing,
          variantStyles[variant]
        )}>
          {/* Main Headline */}
          <h1 className={cn(
            'font-bold tracking-tight text-foreground',
            'leading-tight',
            currentSize.headline
          )}>
            {headline}
          </h1>

          {/* Subtitle */}
          <p className={cn(
            'text-muted-foreground leading-relaxed',
            'max-w-2xl mx-auto',
            currentSize.subtitle
          )}>
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="w-full flex justify-center">
            <CtaButtons
              primaryText={primaryCtaText}
              secondaryText={secondaryCtaText}
              onPrimaryClick={onPrimaryCtaClick}
              onSecondaryClick={onSecondaryCtaClick}
              size={size}
              variant="center"
            />
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />
      </div>
    </section>
  )
}