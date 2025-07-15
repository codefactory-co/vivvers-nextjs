import { Project } from '@/types/project'
import { mockProjects } from '@/lib/data/projects'

// 프로젝트 응답 타입
export interface ProjectsResponse {
  projects: Project[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// 필터 타입
export interface ProjectFilters {
  category?: string
  tags?: string[]
  search?: string
  sortBy?: 'latest' | 'popular' | 'updated'
}

// 모든 프로젝트 조회
export async function getProjects(page: number = 1, limit: number = 12): Promise<ProjectsResponse> {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const totalCount = mockProjects.length
  const totalPages = Math.ceil(totalCount / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const projects = mockProjects.slice(startIndex, endIndex)
  
  return {
    projects,
    totalCount,
    totalPages,
    currentPage: page,
    hasNextPage: endIndex < totalCount,
    hasPrevPage: page > 1
  }
}

// 특정 프로젝트 조회
export async function getProjectById(id: string): Promise<Project | null> {
  await new Promise(resolve => setTimeout(resolve, 200))
  return mockProjects.find(project => project.id === id) || null
}

// 특정 사용자의 프로젝트 조회
export async function getProjectsByAuthor(authorId: string, page: number = 1, limit: number = 9): Promise<ProjectsResponse> {
  // 시뮬레이션 지연
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // 해당 사용자가 작성한 프로젝트 필터링
  const userProjects = mockProjects.filter(project => project.author.id === authorId)
  
  // 최신순으로 정렬
  userProjects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  
  // 페이지네이션 적용
  const totalCount = userProjects.length
  const totalPages = Math.ceil(totalCount / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const projects = userProjects.slice(startIndex, endIndex)
  
  return {
    projects,
    totalCount,
    totalPages,
    currentPage: page,
    hasNextPage: endIndex < totalCount,
    hasPrevPage: page > 1
  }
}

// 사용자 정의 필터로 프로젝트 조회
export async function getProjectsWithFilters(filters: ProjectFilters, page: number = 1, limit: number = 12): Promise<ProjectsResponse> {
  // 시뮬레이션 지연
  await new Promise(resolve => setTimeout(resolve, 400))
  
  let filteredProjects = [...mockProjects]
  
  // 카테고리 필터
  if (filters.category) {
    filteredProjects = filteredProjects.filter(
      project => project.category.toLowerCase() === filters.category!.toLowerCase()
    )
  }
  
  // 태그 필터 
  if (filters.tags && filters.tags.length > 0) {
    filteredProjects = filteredProjects.filter(project =>
      filters.tags!.some(filterTag =>
        project.tags.some(projectTag => 
          projectTag.name.toLowerCase() === filterTag.toLowerCase()
        )
      )
    )
  }
  
  // 검색 필터
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filteredProjects = filteredProjects.filter(project =>
      project.title.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      project.excerpt.toLowerCase().includes(searchTerm)
    )
  }
  
  // 정렬
  switch (filters.sortBy) {
    case 'popular':
      filteredProjects.sort((a, b) => b.likeCount - a.likeCount)
      break
    case 'updated':
      filteredProjects.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      break
    case 'latest':
    default:
      filteredProjects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      break
  }
  
  // 페이지네이션
  const totalCount = filteredProjects.length
  const totalPages = Math.ceil(totalCount / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const projects = filteredProjects.slice(startIndex, endIndex)
  
  return {
    projects,
    totalCount,
    totalPages,
    currentPage: page,
    hasNextPage: endIndex < totalCount,
    hasPrevPage: page > 1
  }
}

// 관련 프로젝트 조회
export async function getRelatedProjects(projectId: string, category: string, limit: number = 4): Promise<Project[]> {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return mockProjects
    .filter(project => 
      project.id !== projectId && 
      project.category === category
    )
    .sort(() => Math.random() - 0.5) // 랜덤 셔플
    .slice(0, limit)
}

// 인기 프로젝트 조회
export async function getFeaturedProjects(limit: number = 6): Promise<Project[]> {
  await new Promise(resolve => setTimeout(resolve, 250))
  
  return mockProjects
    .filter(project => project.featured)
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, limit)
}