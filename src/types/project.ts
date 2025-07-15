import type { User } from './user'

export { User }

export interface ProjectAuthor {
  id: string
  username: string
  email: string
  avatarUrl: string | null
  bio: string | null
}

export interface ProjectTag {
  id: string
  name: string
  slug: string
}

export interface ProjectLike {
  id: string
  userId: string
}

export interface Project {
  id: string
  title: string
  excerpt: string
  description: string
  category: string
  images: string[]
  screenshots: string[] // 호환성을 위해 유지
  demoUrl: string | null
  githubUrl: string | null
  features: string[]
  viewCount: number
  likeCount: number
  author: ProjectAuthor
  tags: ProjectTag[]
  techStack: ProjectTag[]
  likes: ProjectLike[]
  createdAt: Date
  updatedAt: Date
  featured?: boolean
}

export interface Comment {
  id: string
  content: string
  projectId: string
  authorId: string
  parentId: string | null
  likeCount: number
  repliesCount: number
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    username: string
    avatarUrl: string | null
  }
  isLiked?: boolean
  replies?: Comment[]
}

export interface ProjectDetail extends Project {
  fullDescription: string | null
  fullDescriptionJson: unknown // JSON 타입
  fullDescriptionHtml: string | null
  comments: Comment[]
}

export interface ProjectCardProps {
  project: Project
  currentUserId?: string
  className?: string
}

export interface ProjectGridProps {
  projects: Project[]
  currentUserId?: string
  loading?: boolean
  className?: string
}

export interface ProjectSkeletonProps {
  count?: number
  className?: string
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}