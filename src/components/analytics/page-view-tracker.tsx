'use client'

import { useEffect } from 'react'
import { navigationEvents } from '@/lib/analytics'

interface PageViewTrackerProps {
  page: 'home' | 'projects' | 'profile'
  username?: string
}

export function PageViewTracker({ page, username }: PageViewTrackerProps) {
  useEffect(() => {
    switch (page) {
      case 'home':
        navigationEvents.homePage()
        break
      case 'projects':
        navigationEvents.projectsPage()
        break
      case 'profile':
        if (username) {
          navigationEvents.profilePage(username)
        }
        break
    }
  }, [page, username])

  return null
}