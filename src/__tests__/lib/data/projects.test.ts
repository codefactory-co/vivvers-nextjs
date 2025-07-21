import {
  MOCK_PROJECTS,
  MOCK_COMMENTS,
  getAllProjects,
  getProjectById,
  getProjectBySlug,
  getProjectsByAuthor,
  getProjectsByTags,
  getFeaturedProjects,
  searchProjects,
  getProjectStats,
  getCommentsByProject,
  Project,
  ProjectComment,
  ProjectStats
} from '@/lib/data/projects'

describe('lib/data/projects.ts', () => {
  describe('getAllProjects', () => {
    it('should return all mock projects', () => {
      const projects = getAllProjects()
      expect(projects).toEqual(MOCK_PROJECTS)
      expect(projects.length).toBeGreaterThan(0)
    })

    it('should return projects with required properties', () => {
      const projects = getAllProjects()
      projects.forEach((project: Project) => {
        expect(project).toHaveProperty('id')
        expect(project).toHaveProperty('title')
        expect(project).toHaveProperty('slug')
        expect(project).toHaveProperty('shortDescription')
        expect(project).toHaveProperty('tags')
        expect(project).toHaveProperty('authorId')
        expect(project).toHaveProperty('createdAt')
        expect(project).toHaveProperty('updatedAt')
      })
    })
  })

  describe('getProjectById', () => {
    it('should return project when ID exists', () => {
      const project = getProjectById('1')
      expect(project).toBeDefined()
      expect(project?.id).toBe('1')
    })

    it('should return undefined when ID does not exist', () => {
      const project = getProjectById('nonexistent')
      expect(project).toBeUndefined()
    })
  })

  describe('getProjectBySlug', () => {
    it('should return project when slug exists', () => {
      const project = getProjectBySlug('nextjs-portfolio-website')
      expect(project).toBeDefined()
      expect(project?.slug).toBe('nextjs-portfolio-website')
    })

    it('should return undefined when slug does not exist', () => {
      const project = getProjectBySlug('nonexistent-slug')
      expect(project).toBeUndefined()
    })
  })

  describe('getProjectsByAuthor', () => {
    it('should return projects by specific author', () => {
      const projects = getProjectsByAuthor('user1')
      expect(projects.length).toBeGreaterThan(0)
      projects.forEach((project: Project) => {
        expect(project.authorId).toBe('user1')
      })
    })

    it('should return empty array for non-existent author', () => {
      const projects = getProjectsByAuthor('nonexistent')
      expect(projects).toEqual([])
    })
  })

  describe('getProjectsByTags', () => {
    it('should return projects with specified tags', () => {
      const projects = getProjectsByTags(['nextjs'])
      expect(projects.length).toBeGreaterThan(0)
      projects.forEach((project: Project) => {
        expect(project.tags).toContain('nextjs')
      })
    })

    it('should return projects with any of the specified tags', () => {
      const projects = getProjectsByTags(['react', 'flutter'])
      expect(projects.length).toBeGreaterThan(0)
      projects.forEach((project: Project) => {
        const hasAnyTag = project.tags.some((tag: string) => ['react', 'flutter'].includes(tag))
        expect(hasAnyTag).toBe(true)
      })
    })

    it('should return empty array when no projects have specified tags', () => {
      const projects = getProjectsByTags(['nonexistent-tag'])
      expect(projects).toEqual([])
    })
  })

  describe('getFeaturedProjects', () => {
    it('should return only featured projects', () => {
      const projects = getFeaturedProjects()
      projects.forEach((project: Project) => {
        expect(project.isFeatured).toBe(true)
      })
    })

    it('should return projects in correct order', () => {
      const projects = getFeaturedProjects()
      expect(projects.length).toBeGreaterThan(0)
    })
  })

  describe('searchProjects', () => {
    it('should find projects by title', () => {
      const projects = searchProjects('Next.js')
      expect(projects.length).toBeGreaterThan(0)
      const hasMatchingTitle = projects.some((project: Project) => 
        project.title.toLowerCase().includes('next.js')
      )
      expect(hasMatchingTitle).toBe(true)
    })

    it('should find projects by description', () => {
      const projects = searchProjects('포트폴리오')
      expect(projects.length).toBeGreaterThan(0)
      const hasMatchingDescription = projects.some((project: Project) => 
        project.shortDescription.toLowerCase().includes('포트폴리오')
      )
      expect(hasMatchingDescription).toBe(true)
    })

    it('should find projects by tags', () => {
      const projects = searchProjects('react')
      expect(projects.length).toBeGreaterThan(0)
      const hasMatchingTag = projects.some((project: Project) => 
        project.tags.some((tag: string) => tag.toLowerCase().includes('react'))
      )
      expect(hasMatchingTag).toBe(true)
    })

    it('should return empty array for no matches', () => {
      const projects = searchProjects('zzz-nonexistent-term-zzz')
      expect(projects).toEqual([])
    })

    it('should be case insensitive', () => {
      const lowercaseResults = searchProjects('react')
      const uppercaseResults = searchProjects('REACT')
      const mixedCaseResults = searchProjects('React')
      
      expect(lowercaseResults).toEqual(uppercaseResults)
      expect(lowercaseResults).toEqual(mixedCaseResults)
    })
  })

  describe('getProjectStats', () => {
    it('should return correct project statistics', () => {
      const stats = getProjectStats()
      
      expect(stats).toHaveProperty('totalProjects')
      expect(stats).toHaveProperty('publishedProjects')
      expect(stats).toHaveProperty('draftProjects')
      expect(stats).toHaveProperty('featuredProjects')
      expect(stats).toHaveProperty('totalViews')
      expect(stats).toHaveProperty('totalLikes')
      expect(stats).toHaveProperty('totalComments')
      
      expect(typeof stats.totalProjects).toBe('number')
      expect(typeof stats.publishedProjects).toBe('number')
      expect(typeof stats.draftProjects).toBe('number')
      expect(typeof stats.featuredProjects).toBe('number')
      expect(typeof stats.totalViews).toBe('number')
      expect(typeof stats.totalLikes).toBe('number')
      expect(typeof stats.totalComments).toBe('number')
    })

    it('should have consistent statistics', () => {
      const stats = getProjectStats()
      const allProjects = getAllProjects()
      
      expect(stats.totalProjects).toBe(allProjects.length)
      expect(stats.publishedProjects + stats.draftProjects).toBe(stats.totalProjects)
      
      const actualViews = allProjects.reduce((sum, p) => sum + p.viewsCount, 0)
      expect(stats.totalViews).toBe(actualViews)
      
      const actualLikes = allProjects.reduce((sum, p) => sum + p.likesCount, 0)
      expect(stats.totalLikes).toBe(actualLikes)
      
      const actualComments = allProjects.reduce((sum, p) => sum + p.commentsCount, 0)
      expect(stats.totalComments).toBe(actualComments)
    })
  })

  describe('getCommentsByProject', () => {
    it('should return comments for existing project', () => {
      const comments = getCommentsByProject('1')
      expect(Array.isArray(comments)).toBe(true)
    })

    it('should return comments with correct structure', () => {
      const comments = getCommentsByProject('1')
      comments.forEach((comment: ProjectComment) => {
        expect(comment).toHaveProperty('id')
        expect(comment).toHaveProperty('content')
        expect(comment).toHaveProperty('authorId')
        expect(comment).toHaveProperty('projectId')
        expect(comment).toHaveProperty('createdAt')
        expect(comment.projectId).toBe('1')
      })
    })

    it('should return only top-level comments with replies nested', () => {
      const comments = getCommentsByProject('1')
      comments.forEach((comment: ProjectComment) => {
        expect(comment.parentId).toBeUndefined()
        if (comment.replies && comment.replies.length > 0) {
          comment.replies.forEach((reply: ProjectComment) => {
            expect(reply.parentId).toBe(comment.id)
          })
        }
      })
    })

    it('should return empty array for project with no comments', () => {
      const comments = getCommentsByProject('nonexistent')
      expect(comments).toEqual([])
    })
  })

  describe('Data integrity', () => {
    it('should have consistent data types', () => {
      const projects = getAllProjects()
      projects.forEach((project: Project) => {
        expect(typeof project.id).toBe('string')
        expect(typeof project.title).toBe('string')
        expect(typeof project.slug).toBe('string')
        expect(typeof project.shortDescription).toBe('string')
        expect(Array.isArray(project.tags)).toBe(true)
        expect(Array.isArray(project.images)).toBe(true)
        expect(typeof project.authorId).toBe('string')
        expect(typeof project.likesCount).toBe('number')
        expect(typeof project.commentsCount).toBe('number')
        expect(typeof project.viewsCount).toBe('number')
        expect(typeof project.isPublished).toBe('boolean')
        expect(typeof project.isFeatured).toBe('boolean')
        expect(project.createdAt).toBeInstanceOf(Date)
        expect(project.updatedAt).toBeInstanceOf(Date)
      })
    })

    it('should have valid URLs when provided', () => {
      const projects = getAllProjects()
      projects.forEach((project: Project) => {
        if (project.demoUrl) {
          expect(project.demoUrl).toMatch(/^https?:\/\//)
        }
        if (project.githubUrl) {
          expect(project.githubUrl).toMatch(/^https?:\/\//)
        }
      })
    })

    it('should have unique IDs', () => {
      const projects = getAllProjects()
      const ids = projects.map((project: Project) => project.id)
      const uniqueIds = [...new Set(ids)]
      expect(ids.length).toBe(uniqueIds.length)
    })

    it('should have unique slugs', () => {
      const projects = getAllProjects()
      const slugs = projects.map((project: Project) => project.slug)
      const uniqueSlugs = [...new Set(slugs)]
      expect(slugs.length).toBe(uniqueSlugs.length)
    })
  })
})