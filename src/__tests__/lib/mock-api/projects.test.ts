import type { Project } from '@/lib/mock-api/projects'
import {
  getProjects,
  getProject,
  getProjectBySlugApi,
  getUserProjects,
  getFeaturedProjectsApi,
  getRelatedProjects,
  createProject,
  updateProject,
  deleteProject,
  likeProject,
  incrementProjectViews,
  getProjectStatsApi,
  getProjectComments,
  createComment,
  ProjectListParams,
  CreateProjectData,
  UpdateProjectData
} from '@/lib/mock-api/projects'

// Mock setTimeout
jest.useFakeTimers()

describe('lib/mock-api/projects.ts', () => {
  beforeEach(() => {
    jest.clearAllTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
  })

  describe('getProjects', () => {
    it('should return paginated project list', async () => {
      const promise = getProjects({ page: 1, limit: 2 })
      jest.advanceTimersByTime(100)
      const result = await promise

      expect(result).toHaveProperty('projects')
      expect(result).toHaveProperty('totalCount')
      expect(result).toHaveProperty('totalPages')
      expect(result).toHaveProperty('currentPage')
      expect(result).toHaveProperty('hasNextPage')
      expect(result).toHaveProperty('hasPreviousPage')
      
      expect(result.projects.length).toBeLessThanOrEqual(2)
      expect(result.currentPage).toBe(1)
    })

    it('should filter by search query', async () => {
      const promise = getProjects({ search: 'Next.js' })
      jest.advanceTimersByTime(100)
      const result = await promise

      expect(result.projects.length).toBeGreaterThan(0)
      result.projects.forEach((project: Project) => {
        const matchesSearch = 
          project.title.toLowerCase().includes('next.js') ||
          project.shortDescription.toLowerCase().includes('next.js') ||
          project.tags.some((tag: string) => tag.toLowerCase().includes('next.js'))
        expect(matchesSearch).toBe(true)
      })
    })

    it('should filter by tags', async () => {
      const promise = getProjects({ tags: ['react'] })
      jest.advanceTimersByTime(100)
      const result = await promise

      expect(result.projects.length).toBeGreaterThan(0)
      result.projects.forEach((project: Project) => {
        expect(project.tags).toContain('react')
      })
    })

    it('should filter by author', async () => {
      const promise = getProjects({ author: 'devkim' })
      jest.advanceTimersByTime(100)
      const result = await promise

      result.projects.forEach((project: Project) => {
        expect(project.authorUsername).toBe('devkim')
      })
    })

    it('should filter by featured status', async () => {
      const promise = getProjects({ featured: true })
      jest.advanceTimersByTime(100)
      const result = await promise

      result.projects.forEach((project: Project) => {
        expect(project.isFeatured).toBe(true)
      })
    })

    it('should sort by popularity', async () => {
      const promise = getProjects({ sortBy: 'popular' })
      jest.advanceTimersByTime(100)
      const result = await promise

      if (result.projects.length > 1) {
        for (let i = 0; i < result.projects.length - 1; i++) {
          expect(result.projects[i].likesCount).toBeGreaterThanOrEqual(
            result.projects[i + 1].likesCount
          )
        }
      }
    })

    it('should sort by trending (views)', async () => {
      const promise = getProjects({ sortBy: 'trending' })
      jest.advanceTimersByTime(100)
      const result = await promise

      if (result.projects.length > 1) {
        for (let i = 0; i < result.projects.length - 1; i++) {
          expect(result.projects[i].viewsCount).toBeGreaterThanOrEqual(
            result.projects[i + 1].viewsCount
          )
        }
      }
    })

    it('should sort by latest (default)', async () => {
      const promise = getProjects({ sortBy: 'latest' })
      jest.advanceTimersByTime(100)
      const result = await promise

      if (result.projects.length > 1) {
        for (let i = 0; i < result.projects.length - 1; i++) {
          expect(result.projects[i].createdAt.getTime()).toBeGreaterThanOrEqual(
            result.projects[i + 1].createdAt.getTime()
          )
        }
      }
    })

    it('should handle pagination correctly', async () => {
      const page1Promise = getProjects({ page: 1, limit: 1 })
      jest.advanceTimersByTime(100)
      const page1 = await page1Promise

      expect(page1.currentPage).toBe(1)
      expect(page1.hasPreviousPage).toBe(false)
      
      if (page1.totalPages > 1) {
        expect(page1.hasNextPage).toBe(true)
      }
    })
  })

  describe('getProject', () => {
    it('should return project by ID', async () => {
      const promise = getProject('1')
      jest.advanceTimersByTime(50)
      const project = await promise

      expect(project).toBeDefined()
      expect(project?.id).toBe('1')
    })

    it('should return null for non-existent ID', async () => {
      const promise = getProject('nonexistent')
      jest.advanceTimersByTime(50)
      const project = await promise

      expect(project).toBeNull()
    })
  })

  describe('getProjectBySlugApi', () => {
    it('should return project by slug', async () => {
      const promise = getProjectBySlugApi('nextjs-portfolio-website')
      jest.advanceTimersByTime(50)
      const project = await promise

      expect(project).toBeDefined()
      expect(project?.slug).toBe('nextjs-portfolio-website')
    })

    it('should return null for non-existent slug', async () => {
      const promise = getProjectBySlugApi('nonexistent-slug')
      jest.advanceTimersByTime(50)
      const project = await promise

      expect(project).toBeNull()
    })
  })

  describe('getUserProjects', () => {
    it('should return projects by author ID', async () => {
      const promise = getUserProjects('user1')
      jest.advanceTimersByTime(100)
      const projects = await promise

      projects.forEach((project: Project) => {
        expect(project.authorId).toBe('user1')
      })
    })

    it('should return empty array for non-existent author', async () => {
      const promise = getUserProjects('nonexistent')
      jest.advanceTimersByTime(100)
      const projects = await promise

      expect(projects).toEqual([])
    })
  })

  describe('getFeaturedProjectsApi', () => {
    it('should return only featured projects', async () => {
      const promise = getFeaturedProjectsApi()
      jest.advanceTimersByTime(100)
      const projects = await promise

      projects.forEach((project: Project) => {
        expect(project.isFeatured).toBe(true)
      })
    })
  })

  describe('getRelatedProjects', () => {
    it('should return projects with similar tags', async () => {
      const promise = getRelatedProjects('1', 3)
      jest.advanceTimersByTime(100)
      const relatedProjects = await promise

      expect(relatedProjects.length).toBeLessThanOrEqual(3)
      relatedProjects.forEach((project: Project) => {
        expect(project.id).not.toBe('1')
      })
    })

    it('should return empty array for non-existent project', async () => {
      const promise = getRelatedProjects('nonexistent')
      jest.advanceTimersByTime(100)
      const relatedProjects = await promise

      expect(relatedProjects).toEqual([])
    })
  })

  describe('createProject', () => {
    it('should create new project with valid data', async () => {
      const projectData: CreateProjectData = {
        title: 'Test Project',
        shortDescription: 'Test description',
        images: [],
        tags: ['test'],
        isPublished: true
      }

      const promise = createProject(projectData, 'user1')
      jest.advanceTimersByTime(200)
      const newProject = await promise

      expect(newProject).toHaveProperty('id')
      expect(newProject.title).toBe('Test Project')
      expect(newProject.authorId).toBe('user1')
      expect(newProject.isPublished).toBe(true)
      expect(newProject.likesCount).toBe(0)
      expect(newProject.commentsCount).toBe(0)
      expect(newProject.viewsCount).toBe(0)
    })

    it('should generate slug from title', async () => {
      const projectData: CreateProjectData = {
        title: 'My Awesome Project!',
        shortDescription: 'Test description',
        images: [],
        tags: ['test']
      }

      const promise = createProject(projectData, 'user1')
      jest.advanceTimersByTime(200)
      const newProject = await promise

      expect(newProject.slug).toBe('my-awesome-project')
    })
  })

  describe('updateProject', () => {
    it('should update existing project', async () => {
      const updateData: UpdateProjectData = {
        id: '1',
        title: 'Updated Title'
      }

      const promise = updateProject(updateData)
      jest.advanceTimersByTime(200)
      const updatedProject = await promise

      expect(updatedProject).toBeDefined()
      expect(updatedProject?.title).toBe('Updated Title')
      expect(updatedProject?.updatedAt).toBeInstanceOf(Date)
    })

    it('should return null for non-existent project', async () => {
      const updateData: UpdateProjectData = {
        id: 'nonexistent',
        title: 'Updated Title'
      }

      const promise = updateProject(updateData)
      jest.advanceTimersByTime(200)
      const result = await promise

      expect(result).toBeNull()
    })
  })

  describe('deleteProject', () => {
    it('should delete existing project', async () => {
      const promise = deleteProject('1')
      jest.advanceTimersByTime(200)
      const result = await promise

      expect(result).toBe(true)
    })

    it('should return false for non-existent project', async () => {
      const promise = deleteProject('nonexistent')
      jest.advanceTimersByTime(200)
      const result = await promise

      expect(result).toBe(false)
    })
  })

  describe('likeProject', () => {
    it('should increment project likes', async () => {
      const promise = likeProject('1', 'user2')
      jest.advanceTimersByTime(100)
      const result = await promise

      expect(result.success).toBe(true)
      expect(typeof result.likesCount).toBe('number')
    })

    it('should return failure for non-existent project', async () => {
      const promise = likeProject('nonexistent', 'user2')
      jest.advanceTimersByTime(100)
      const result = await promise

      expect(result.success).toBe(false)
      expect(result.likesCount).toBe(0)
    })
  })

  describe('incrementProjectViews', () => {
    it('should increment project views', async () => {
      const promise = incrementProjectViews('1')
      jest.advanceTimersByTime(50)
      const result = await promise

      expect(result).toBe(true)
    })

    it('should return false for non-existent project', async () => {
      const promise = incrementProjectViews('nonexistent')
      jest.advanceTimersByTime(50)
      const result = await promise

      expect(result).toBe(false)
    })
  })

  describe('getProjectStatsApi', () => {
    it('should return project statistics', async () => {
      const promise = getProjectStatsApi()
      jest.advanceTimersByTime(100)
      const stats = await promise

      expect(stats).toHaveProperty('totalProjects')
      expect(stats).toHaveProperty('publishedProjects')
      expect(stats).toHaveProperty('draftProjects')
      expect(stats).toHaveProperty('featuredProjects')
      expect(stats).toHaveProperty('totalViews')
      expect(stats).toHaveProperty('totalLikes')
      expect(stats).toHaveProperty('totalComments')
    })
  })

  describe('getProjectComments', () => {
    it('should return comments for project', async () => {
      const promise = getProjectComments('1')
      jest.advanceTimersByTime(100)
      const comments = await promise

      expect(Array.isArray(comments)).toBe(true)
    })
  })

  describe('createComment', () => {
    it('should create new comment', async () => {
      const promise = createComment('1', 'Test comment', 'user2')
      jest.advanceTimersByTime(200)
      const newComment = await promise

      expect(newComment).toHaveProperty('id')
      expect(newComment.content).toBe('Test comment')
      expect(newComment.authorId).toBe('user2')
      expect(newComment.projectId).toBe('1')
      expect(newComment.likesCount).toBe(0)
      expect(newComment.repliesCount).toBe(0)
    })

    it('should create reply comment', async () => {
      const promise = createComment('1', 'Test reply', 'user2', 'comment1')
      jest.advanceTimersByTime(200)
      const newReply = await promise

      expect(newReply.parentId).toBe('comment1')
      expect(newReply.content).toBe('Test reply')
    })
  })
})