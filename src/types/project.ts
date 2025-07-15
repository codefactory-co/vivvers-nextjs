export interface User {
  id: string
  name: string
  username: string
  avatar: string
}

export interface Project {
  id: string
  title: string
  description: string
  thumbnail: string
  author: User
  category: string
  tags: string[]
  likeCount: number
  viewCount: number
  uploadDate: string
  featured?: boolean
}

export interface Comment {
  id: string
  author: User
  content: string
  createdAt: string
  likeCount: number
  replies?: Comment[]
}

export interface ProjectDetail extends Project {
  fullDescription: string
  screenshots: string[]
  liveUrl?: string
  githubUrl?: string
  techStack: string[]
  features: string[]
  comments: Comment[]
}

export interface ProjectCardProps {
  project: Project
  className?: string
}

export interface ProjectGridProps {
  projects: Project[]
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