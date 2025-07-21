import { 
  Project, 
  ProjectListParams, 
  ProjectComment, 
  ProjectStats,
  getAllProjects,
  getProjectById,
  getProjectBySlug,
  getProjectsByAuthor,
  getProjectsByTags,
  getFeaturedProjects,
  searchProjects,
  getProjectStats,
  getCommentsByProject,
  MOCK_PROJECTS,
  MOCK_COMMENTS
} from '@/lib/data/projects'

// Re-export types for test files
export type { ProjectListParams }

export interface ProjectListResponse {
  projects: Project[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface CreateProjectData {
  title: string
  shortDescription: string
  fullDescription?: string
  fullDescriptionHtml?: string
  fullDescriptionJson?: unknown
  thumbnailUrl?: string
  images: string[]
  demoUrl?: string
  githubUrl?: string
  tags: string[]
  isPublished?: boolean
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  id: string
}

// 프로젝트 목록 조회
export async function getProjects(params: ProjectListParams = {}): Promise<ProjectListResponse> {
  // 시뮬레이션된 지연
  await new Promise(resolve => setTimeout(resolve, 100))

  let projects = getAllProjects()

  // 필터링
  if (params.search) {
    projects = searchProjects(params.search)
  }

  if (params.tags && params.tags.length > 0) {
    projects = projects.filter(project =>
      params.tags!.some(tag => project.tags.includes(tag))
    )
  }

  if (params.author) {
    projects = projects.filter(project => project.authorUsername === params.author)
  }

  if (params.featured !== undefined) {
    projects = projects.filter(project => project.isFeatured === params.featured)
  }

  // 정렬
  switch (params.sortBy) {
    case 'popular':
      projects.sort((a, b) => b.likesCount - a.likesCount)
      break
    case 'trending':
      projects.sort((a, b) => b.viewsCount - a.viewsCount)
      break
    case 'oldest':
      projects.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      break
    case 'latest':
    default:
      projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      break
  }

  // 페이지네이션
  const page = params.page || 1
  const limit = params.limit || 12
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProjects = projects.slice(startIndex, endIndex)

  const totalCount = projects.length
  const totalPages = Math.ceil(totalCount / limit)

  return {
    projects: paginatedProjects,
    totalCount,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  }
}

// 단일 프로젝트 조회 (ID)
export async function getProject(id: string): Promise<Project | null> {
  await new Promise(resolve => setTimeout(resolve, 50))
  return getProjectById(id) || null
}

// 단일 프로젝트 조회 (Slug)
export async function getProjectBySlugApi(slug: string): Promise<Project | null> {
  await new Promise(resolve => setTimeout(resolve, 50))
  return getProjectBySlug(slug) || null
}

// 사용자별 프로젝트 조회
export async function getUserProjects(authorId: string): Promise<Project[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return getProjectsByAuthor(authorId)
}

// 추천 프로젝트 조회
export async function getFeaturedProjectsApi(): Promise<Project[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return getFeaturedProjects()
}

// 관련 프로젝트 조회
export async function getRelatedProjects(projectId: string, limit: number = 4): Promise<Project[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const currentProject = getProjectById(projectId)
  if (!currentProject) return []

  // 같은 태그를 가진 프로젝트들 찾기
  let relatedProjects = getAllProjects()
    .filter(project => 
      project.id !== projectId && 
      project.tags.some(tag => currentProject.tags.includes(tag))
    )
    .sort((a, b) => {
      // 공통 태그 수로 정렬
      const aCommonTags = a.tags.filter(tag => currentProject.tags.includes(tag)).length
      const bCommonTags = b.tags.filter(tag => currentProject.tags.includes(tag)).length
      return bCommonTags - aCommonTags
    })

  // 부족하면 인기순으로 채우기
  if (relatedProjects.length < limit) {
    const additionalProjects = getAllProjects()
      .filter(project => 
        project.id !== projectId && 
        !relatedProjects.find(rp => rp.id === project.id)
      )
      .sort((a, b) => b.likesCount - a.likesCount)
      .slice(0, limit - relatedProjects.length)
    
    relatedProjects = [...relatedProjects, ...additionalProjects]
  }

  return relatedProjects.slice(0, limit)
}

// 프로젝트 생성
export async function createProject(data: CreateProjectData, authorId: string): Promise<Project> {
  await new Promise(resolve => setTimeout(resolve, 200))

  const newProject: Project = {
    id: `project_${Date.now()}`,
    slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    ...data,
    authorId,
    authorUsername: 'current_user', // 실제로는 인증된 사용자 정보
    authorDisplayName: '현재 사용자',
    authorAvatarUrl: '/api/placeholder/40/40',
    likesCount: 0,
    commentsCount: 0,
    viewsCount: 0,
    isPublished: data.isPublished || false,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  // Mock 데이터에 추가 (실제로는 데이터베이스에 저장)
  MOCK_PROJECTS.push(newProject)

  return newProject
}

// 프로젝트 업데이트
export async function updateProject(data: UpdateProjectData): Promise<Project | null> {
  await new Promise(resolve => setTimeout(resolve, 200))

  const projectIndex = MOCK_PROJECTS.findIndex(p => p.id === data.id)
  if (projectIndex === -1) return null

  const updatedProject = {
    ...MOCK_PROJECTS[projectIndex],
    ...data,
    updatedAt: new Date()
  }

  MOCK_PROJECTS[projectIndex] = updatedProject
  return updatedProject
}

// 프로젝트 삭제
export async function deleteProject(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200))

  const projectIndex = MOCK_PROJECTS.findIndex(p => p.id === id)
  if (projectIndex === -1) return false

  MOCK_PROJECTS.splice(projectIndex, 1)
  return true
}

// 프로젝트 좋아요
export async function likeProject(projectId: string, userId: string): Promise<{ success: boolean; likesCount: number }> {
  await new Promise(resolve => setTimeout(resolve, 100))

  const project = MOCK_PROJECTS.find(p => p.id === projectId)
  if (!project) return { success: false, likesCount: 0 }

  // 실제로는 사용자별 좋아요 상태를 확인하고 토글
  project.likesCount += 1
  project.updatedAt = new Date()

  return { success: true, likesCount: project.likesCount }
}

// 프로젝트 조회수 증가
export async function incrementProjectViews(projectId: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 50))

  const project = MOCK_PROJECTS.find(p => p.id === projectId)
  if (!project) return false

  project.viewsCount += 1
  project.updatedAt = new Date()

  return true
}

// 프로젝트 통계
export async function getProjectStatsApi(): Promise<ProjectStats> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return getProjectStats()
}

// 프로젝트 댓글 조회
export async function getProjectComments(projectId: string): Promise<ProjectComment[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return getCommentsByProject(projectId)
}

// 댓글 생성
export async function createComment(
  projectId: string, 
  content: string, 
  authorId: string, 
  parentId?: string
): Promise<ProjectComment> {
  await new Promise(resolve => setTimeout(resolve, 200))

  const newComment: ProjectComment = {
    id: `comment_${Date.now()}`,
    content,
    authorId,
    authorUsername: 'current_user',
    authorDisplayName: '현재 사용자',
    authorAvatarUrl: '/api/placeholder/40/40',
    projectId,
    parentId,
    likesCount: 0,
    repliesCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  MOCK_COMMENTS.push(newComment)

  // 프로젝트 댓글 수 업데이트
  const project = MOCK_PROJECTS.find(p => p.id === projectId)
  if (project) {
    if (!parentId) {
      project.commentsCount += 1
    } else {
      // 대댓글인 경우 부모 댓글의 repliesCount 증가
      const parentComment = MOCK_COMMENTS.find(c => c.id === parentId)
      if (parentComment) {
        parentComment.repliesCount += 1
      }
    }
  }

  return newComment
}