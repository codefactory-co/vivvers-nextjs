/**
 * Mock project data for demonstration and testing purposes
 */

import type { Project, ProjectDetail, ProjectTag } from '@/types/project'

// Helper function to create project tag
function createProjectTag(name: string): ProjectTag {
  // Convert name to kebab-case id
  const id = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-') || '-'

  return { id, name }
}

// Mock project data
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    title: 'E-Commerce Platform',
    excerpt: '현대적인 이커머스 플랫폼 구축 프로젝트',
    description: 'Next.js와 TypeScript를 활용한 풀스택 이커머스 플랫폼입니다.',
    category: 'e-commerce',
    images: ['/images/project1-1.jpg', '/images/project1-2.jpg'],
    screenshots: ['/images/project1-1.jpg', '/images/project1-2.jpg'],
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/example/project1',
    features: ['장바구니', '결제 시스템', '상품 검색', '리뷰 시스템'],
    viewCount: 1250,
    likeCount: 89,
    author: {
      id: 'user-1',
      username: 'developer1',
      email: 'developer1@example.com',
      avatarUrl: '/avatars/user1.jpg',
      bio: '풀스택 개발자'
    },
    tags: [
      createProjectTag('React'),
      createProjectTag('TypeScript'),
      createProjectTag('Next.js'),
      createProjectTag('Prisma')
    ],
    likes: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-20'),
    featured: true
  },
  {
    id: 'project-2',
    title: '날씨 앱',
    excerpt: '실시간 날씨 정보 제공 앱',
    description: '날씨 API를 활용한 실시간 날씨 정보 앱입니다.',
    category: 'utility',
    images: ['/images/project2-1.jpg'],
    screenshots: ['/images/project2-1.jpg'],
    demoUrl: 'https://weather.example.com',
    githubUrl: 'https://github.com/example/weather',
    features: ['실시간 날씨', '주간 예보', '위치 기반', '날씨 API'],
    viewCount: 856,
    likeCount: 45,
    author: {
      id: 'user-2',
      username: 'developer2',
      email: 'developer2@example.com',
      avatarUrl: '/avatars/user2.jpg',
      bio: '프론트엔드 개발자'
    },
    tags: [
      createProjectTag('React'),
      createProjectTag('날씨 API'),
      createProjectTag('TailwindCSS')
    ],
    likes: [],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-05-15'),
    featured: false
  },
  {
    id: 'project-3',
    title: '디자인 시스템',
    excerpt: '재사용 가능한 UI 컴포넌트 라이브러리',
    description: '일관된 디자인을 위한 컴포넌트 시스템입니다.',
    category: 'design',
    images: ['/images/project3-1.jpg', '/images/project3-2.jpg'],
    screenshots: ['/images/project3-1.jpg', '/images/project3-2.jpg'],
    demoUrl: 'https://design.example.com',
    githubUrl: 'https://github.com/example/design-system',
    features: ['컴포넌트 라이브러리', 'Storybook', '테마 지원', '접근성'],
    viewCount: 2100,
    likeCount: 156,
    author: {
      id: 'user-3',
      username: 'designer1',
      email: 'designer1@example.com',
      avatarUrl: '/avatars/user3.jpg',
      bio: 'UI/UX 디자이너'
    },
    tags: [
      createProjectTag('React'),
      createProjectTag('디자인 시스템'),
      createProjectTag('Storybook'),
      createProjectTag('TypeScript')
    ],
    likes: [],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-07-10'),
    featured: true
  },
  {
    id: 'project-4',
    title: '소셜 미디어 앱',
    excerpt: '사진 공유 중심의 소셜 플랫폼',
    description: '사용자들이 사진을 공유하고 소통할 수 있는 플랫폼입니다.',
    category: 'social',
    images: ['/images/project4-1.jpg'],
    screenshots: ['/images/project4-1.jpg'],
    demoUrl: 'https://social.example.com',
    githubUrl: 'https://github.com/example/social',
    features: ['사진 업로드', '팔로우 시스템', '좋아요', '댓글'],
    viewCount: 3200,
    likeCount: 234,
    author: {
      id: 'user-1',
      username: 'developer1',
      email: 'developer1@example.com',
      avatarUrl: '/avatars/user1.jpg',
      bio: '풀스택 개발자'
    },
    tags: [
      createProjectTag('React Native'),
      createProjectTag('Firebase'),
      createProjectTag('소셜')
    ],
    likes: [],
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-08-01'),
    featured: true
  },
  {
    id: 'project-5',
    title: '할 일 관리 앱',
    excerpt: '생산성 향상을 위한 태스크 관리 앱',
    description: '간단하고 효율적인 할 일 관리 앱입니다.',
    category: 'productivity',
    images: ['/images/project5-1.jpg'],
    screenshots: ['/images/project5-1.jpg'],
    demoUrl: 'https://todo.example.com',
    githubUrl: 'https://github.com/example/todo',
    features: ['태스크 생성', '마감일 설정', '카테고리 분류', '알림'],
    viewCount: 678,
    likeCount: 32,
    author: {
      id: 'user-4',
      username: 'developer4',
      email: 'developer4@example.com',
      avatarUrl: '/avatars/user4.jpg',
      bio: '백엔드 개발자'
    },
    tags: [
      createProjectTag('Vue.js'),
      createProjectTag('생산성'),
      createProjectTag('PWA')
    ],
    likes: [],
    createdAt: new Date('2024-05-20'),
    updatedAt: new Date('2024-07-25'),
    featured: false
  },
  {
    id: 'project-6',
    title: '블로그 플랫폼',
    excerpt: 'Markdown 지원 블로그 플랫폼',
    description: '개발자를 위한 기술 블로그 플랫폼입니다.',
    category: 'content',
    images: ['/images/project6-1.jpg', '/images/project6-2.jpg'],
    screenshots: ['/images/project6-1.jpg', '/images/project6-2.jpg'],
    demoUrl: 'https://blog.example.com',
    githubUrl: 'https://github.com/example/blog',
    features: ['Markdown 에디터', 'SEO 최적화', '댓글 시스템', '태그 관리'],
    viewCount: 1450,
    likeCount: 98,
    author: {
      id: 'user-2',
      username: 'developer2',
      email: 'developer2@example.com',
      avatarUrl: '/avatars/user2.jpg',
      bio: '프론트엔드 개발자'
    },
    tags: [
      createProjectTag('Next.js'),
      createProjectTag('MDX'),
      createProjectTag('블로그')
    ],
    likes: [],
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-08-15'),
    featured: false
  }
]

// Mock project details with full description
export const mockProjectDetails: ProjectDetail[] = mockProjects.map(project => ({
  ...project,
  fullDescription: `${project.description}\n\n이 프로젝트는 최신 웹 기술을 활용하여 만들어졌습니다. 사용자 경험을 최우선으로 고려하였으며, 확장 가능한 아키텍처를 채택했습니다.`,
  fullDescriptionJson: null,
  fullDescriptionHtml: `<p>${project.description}</p><p>이 프로젝트는 최신 웹 기술을 활용하여 만들어졌습니다. 사용자 경험을 최우선으로 고려하였으며, 확장 가능한 아키텍처를 채택했습니다.</p>`,
  comments: []
}))

/**
 * Get paginated projects
 */
export function getProjects(
  page: number = 1,
  limit: number = 12
): { projects: Project[]; totalPages: number } {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProjects = mockProjects.slice(startIndex, endIndex)
  const totalPages = Math.ceil(mockProjects.length / limit)

  return {
    projects: paginatedProjects,
    totalPages
  }
}

/**
 * Get featured projects
 */
export function getFeaturedProjects(limit: number = 6): Project[] {
  return mockProjects
    .filter(project => project.featured)
    .slice(0, limit)
}

/**
 * Get projects by category
 */
export function getProjectsByCategory(
  category: string,
  page: number = 1,
  limit: number = 12
): { projects: Project[]; totalPages: number } {
  const filteredProjects = mockProjects.filter(
    project => project.category === category
  )
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredProjects.length / limit)

  return {
    projects: paginatedProjects,
    totalPages
  }
}

/**
 * Get project detail by ID
 */
export function getProjectDetail(id: string): ProjectDetail | null {
  return mockProjectDetails.find(project => project.id === id) || null
}

/**
 * Get projects by author
 */
export function getProjectsByAuthor(
  authorId: string,
  page: number = 1,
  limit: number = 12
): { projects: Project[]; totalPages: number } {
  const filteredProjects = mockProjects.filter(
    project => project.author.id === authorId
  )
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredProjects.length / limit)

  return {
    projects: paginatedProjects,
    totalPages
  }
}

/**
 * Search projects by keyword
 */
export function searchProjects(
  keyword: string,
  page: number = 1,
  limit: number = 12
): { projects: Project[]; totalPages: number } {
  const lowerKeyword = keyword.toLowerCase()
  const filteredProjects = mockProjects.filter(
    project =>
      project.title.toLowerCase().includes(lowerKeyword) ||
      project.description.toLowerCase().includes(lowerKeyword) ||
      project.tags.some(tag => tag.name.toLowerCase().includes(lowerKeyword))
  )
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredProjects.length / limit)

  return {
    projects: paginatedProjects,
    totalPages
  }
}
