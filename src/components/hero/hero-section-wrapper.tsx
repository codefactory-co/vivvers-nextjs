'use client'

import { useRouter } from 'next/navigation'
import { HeroSection, HeroSectionProps } from './hero-section'

export function HeroSectionWrapper(props: Omit<HeroSectionProps, 'onPrimaryCtaClick' | 'onSecondaryCtaClick'>) {
  const router = useRouter()

  const handlePrimaryClick = () => {
    // Scroll to projects section
    const projectsSection = document.querySelector('[data-section="projects"]')
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSecondaryClick = () => {
    // Navigate to project creation page
    router.push('/project/new')
  }

  return (
    <HeroSection
      {...props}
      onPrimaryCtaClick={handlePrimaryClick}
      onSecondaryCtaClick={handleSecondaryClick}
    />
  )
}