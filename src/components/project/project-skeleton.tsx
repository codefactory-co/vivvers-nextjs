'use client'

import React from 'react'
import { ProjectSkeletonProps } from '@/types/project'
import { cn } from '@/lib/utils'

export const ProjectSkeleton: React.FC<ProjectSkeletonProps> = ({
  count = 1,
  className
}) => {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={cn(
            'bg-card rounded-lg border border-border overflow-hidden shadow-sm animate-pulse',
            className
          )}
        >
          {/* Thumbnail Skeleton */}
          <div className="aspect-[16/10] bg-muted" />

          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Category and Date Row */}
            <div className="flex items-center justify-between">
              <div className="h-5 w-20 bg-muted rounded-full" />
              <div className="h-3 w-16 bg-muted rounded" />
            </div>

            {/* Title Skeleton */}
            <div className="h-6 w-3/4 bg-muted rounded" />

            {/* Description Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-5/6 bg-muted rounded" />
            </div>

            {/* Tags Skeleton */}
            <div className="flex flex-wrap gap-1">
              <div className="h-5 w-12 bg-muted rounded" />
              <div className="h-5 w-16 bg-muted rounded" />
              <div className="h-5 w-14 bg-muted rounded" />
            </div>

            {/* Author and Stats Skeleton */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              {/* Author */}
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-muted rounded-full" />
                <div className="h-4 w-20 bg-muted rounded" />
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-muted rounded" />
                  <div className="h-3 w-6 bg-muted rounded" />
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-muted rounded" />
                  <div className="h-3 w-8 bg-muted rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}