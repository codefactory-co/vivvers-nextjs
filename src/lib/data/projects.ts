export interface Project {
  id: string
  title: string
  slug: string
  shortDescription: string
  fullDescription?: string
  fullDescriptionHtml?: string
  fullDescriptionJson?: unknown
  thumbnailUrl?: string
  images: string[]
  demoUrl?: string
  githubUrl?: string
  tags: string[]
  authorId: string
  authorUsername: string
  authorDisplayName: string
  authorAvatarUrl?: string
  likesCount: number
  commentsCount: number
  viewsCount: number
  isPublished: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProjectStats {
  totalProjects: number
  publishedProjects: number
  draftProjects: number
  featuredProjects: number
  totalViews: number
  totalLikes: number
  totalComments: number
}

export interface ProjectListParams {
  page?: number
  limit?: number
  search?: string
  tags?: string[]
  author?: string
  sortBy?: 'latest' | 'popular' | 'trending' | 'oldest'
  featured?: boolean
}

export interface ProjectComment {
  id: string
  content: string
  authorId: string
  authorUsername: string
  authorDisplayName: string
  authorAvatarUrl?: string
  projectId: string
  parentId?: string
  likesCount: number
  repliesCount: number
  createdAt: Date
  updatedAt: Date
  replies?: ProjectComment[]
}

// Mock 프로젝트 데이터
export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Next.js 포트폴리오 웹사이트',
    slug: 'nextjs-portfolio-website',
    shortDescription: '반응형 디자인과 다크모드를 지원하는 개인 포트폴리오 웹사이트',
    fullDescription: '이 프로젝트는 Next.js 13과 Tailwind CSS를 사용하여 구축된 현대적인 포트폴리오 웹사이트입니다.',
    thumbnailUrl: '/api/placeholder/400/300',
    images: ['/api/placeholder/800/600', '/api/placeholder/800/400'],
    demoUrl: 'https://portfolio-demo.vercel.app',
    githubUrl: 'https://github.com/user/portfolio',
    tags: ['nextjs', 'typescript', 'tailwindcss'],
    authorId: 'user1',
    authorUsername: 'devkim',
    authorDisplayName: '김개발',
    authorAvatarUrl: '/api/placeholder/40/40',
    likesCount: 42,
    commentsCount: 8,
    viewsCount: 1250,
    isPublished: true,
    isFeatured: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    title: 'React 할일 관리 앱',
    slug: 'react-todo-app',
    shortDescription: '드래그 앤 드롭과 로컬 스토리지를 지원하는 할일 관리 애플리케이션',
    fullDescription: 'React와 TypeScript로 만든 기능이 풍부한 할일 관리 앱입니다.',
    thumbnailUrl: '/api/placeholder/400/300',
    images: ['/api/placeholder/800/600'],
    demoUrl: 'https://todo-app-demo.netlify.app',
    githubUrl: 'https://github.com/user/todo-app',
    tags: ['react', 'typescript', 'css'],
    authorId: 'user2',
    authorUsername: 'codepark',
    authorDisplayName: '박코드',
    authorAvatarUrl: '/api/placeholder/40/40',
    likesCount: 28,
    commentsCount: 5,
    viewsCount: 890,
    isPublished: true,
    isFeatured: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    title: 'Flutter 날씨 앱',
    slug: 'flutter-weather-app',
    shortDescription: '실시간 날씨 정보와 5일 예보를 제공하는 크로스플랫폼 모바일 앱',
    fullDescription: 'Flutter로 개발된 날씨 앱으로 위치 기반 날씨 정보를 제공합니다.',
    thumbnailUrl: '/api/placeholder/400/300',
    images: ['/api/placeholder/400/800', '/api/placeholder/400/800'],
    githubUrl: 'https://github.com/user/weather-app',
    tags: ['flutter', 'dart', 'mobile'],
    authorId: 'user3',
    authorUsername: 'mobilechoi',
    authorDisplayName: '최모바일',
    authorAvatarUrl: '/api/placeholder/40/40',
    likesCount: 35,
    commentsCount: 12,
    viewsCount: 1100,
    isPublished: true,
    isFeatured: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-10')
  }
]

export const MOCK_COMMENTS: ProjectComment[] = [
  {
    id: '1',
    content: '정말 깔끔한 디자인이네요! 코드도 잘 정리되어 있어서 참고가 많이 됩니다.',
    authorId: 'user2',
    authorUsername: 'codepark',
    authorDisplayName: '박코드',
    authorAvatarUrl: '/api/placeholder/40/40',
    projectId: '1',
    likesCount: 5,
    repliesCount: 1,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '2',
    content: '감사합니다! 더 개선할 부분이 있다면 언제든 피드백 주세요.',
    authorId: 'user1',
    authorUsername: 'devkim',
    authorDisplayName: '김개발',
    authorAvatarUrl: '/api/placeholder/40/40',
    projectId: '1',
    parentId: '1',
    likesCount: 2,
    repliesCount: 0,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  }
]

// 데이터 조회 함수들
export function getAllProjects(): Project[] {
  return MOCK_PROJECTS
}

export function getProjectById(id: string): Project | undefined {
  return MOCK_PROJECTS.find(project => project.id === id)
}

export function getProjectBySlug(slug: string): Project | undefined {
  return MOCK_PROJECTS.find(project => project.slug === slug)
}

export function getProjectsByAuthor(authorId: string): Project[] {
  return MOCK_PROJECTS.filter(project => project.authorId === authorId)
}

export function getProjectsByTags(tags: string[]): Project[] {
  return MOCK_PROJECTS.filter(project =>
    tags.some(tag => project.tags.includes(tag))
  )
}

export function getFeaturedProjects(): Project[] {
  return MOCK_PROJECTS.filter(project => project.isFeatured)
}

export function searchProjects(query: string): Project[] {
  const lowercaseQuery = query.toLowerCase()
  return MOCK_PROJECTS.filter(project =>
    project.title.toLowerCase().includes(lowercaseQuery) ||
    project.shortDescription.toLowerCase().includes(lowercaseQuery) ||
    project.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

export function getProjectStats(): ProjectStats {
  const totalProjects = MOCK_PROJECTS.length
  const publishedProjects = MOCK_PROJECTS.filter(p => p.isPublished).length
  const draftProjects = totalProjects - publishedProjects
  const featuredProjects = MOCK_PROJECTS.filter(p => p.isFeatured).length
  const totalViews = MOCK_PROJECTS.reduce((sum, p) => sum + p.viewsCount, 0)
  const totalLikes = MOCK_PROJECTS.reduce((sum, p) => sum + p.likesCount, 0)
  const totalComments = MOCK_PROJECTS.reduce((sum, p) => sum + p.commentsCount, 0)

  return {
    totalProjects,
    publishedProjects,
    draftProjects,
    featuredProjects,
    totalViews,
    totalLikes,
    totalComments
  }
}

export function getCommentsByProject(projectId: string): ProjectComment[] {
  return MOCK_COMMENTS.filter(comment => comment.projectId === projectId && !comment.parentId)
    .map(comment => ({
      ...comment,
      replies: MOCK_COMMENTS.filter(reply => reply.parentId === comment.id)
    }))
}