'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ProjectCardProps } from '@/types/project'
import { ProjectLikeButton } from '@/components/project/project-like-button'
import { cn } from '@/lib/utils'

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  currentUserId,
  className
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  return (
    <Link 
      href={`/project/${project.id}`}
      className={cn(
        'group block bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer',
        className
      )}
    >
      {/* Project Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={project.images?.[0] || '/default-project.jpg'}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {project.featured && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
            Featured
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3">
        {/* Category Badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
            {project.category}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDate(project.createdAt)}
          </span>
        </div>

        {/* Project Title */}
        <h3 className="font-semibold text-lg leading-tight text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {project.title}
        </h3>

        {/* Project Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {project.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {project.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-accent text-accent-foreground"
            >
              {tag.name}
            </span>
          ))}
          {project.tags && project.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs text-muted-foreground">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* Author and Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          {/* Author */}
          <div className="flex items-center space-x-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-muted">
              <Image
                src={project.author.avatarUrl || '/default-avatar.png'}
                alt={project.author.username}
                fill
                className="object-cover"
                sizes="24px"
              />
            </div>
            <span className="text-sm font-medium text-card-foreground truncate max-w-[100px]">
              {project.author.username}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            {/* Like Button */}
            <div className="flex items-center" onClick={(e) => e.preventDefault()}>
              <ProjectLikeButton
                projectId={project.id}
                initialIsLiked={project.likes?.some(like => like.userId === currentUserId) || false}
                initialLikeCount={project.likeCount}
                currentUserId={currentUserId}
                variant="ghost"
                size="sm"
                className="p-0 h-auto text-xs text-muted-foreground hover:text-red-500"
                showCount={true}
              />
            </div>

            {/* View Count */}
            <div className="flex items-center space-x-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>{formatCount(project.viewCount)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}