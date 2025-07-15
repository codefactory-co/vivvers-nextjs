'use client'

import React from 'react'
import { ProjectGridProps } from '@/types/project'
import { ProjectCard } from './project-card'
import { ProjectSkeleton } from './project-skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { cn } from '@/lib/utils'

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  currentUserId,
  loading = false,
  className
}) => {
  if (loading) {
    return (
      <div className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
        className
      )}>
        <ProjectSkeleton count={12} />
      </div>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <div className={cn('w-full', className)}>
        <EmptyState
          icon={
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          }
          title="No projects found"
          description="There are no projects to display at the moment. Try adjusting your search or filters."
          variant="search"
          size="lg"
        />
      </div>
    )
  }

  return (
    <div className={cn(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
      className
    )}>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          currentUserId={currentUserId}
          className="h-full"
        />
      ))}
    </div>
  )
}