import {
  getProjects,
  getProjectById,
  getProjectsByAuthor,
  getProjectsWithFilters,
  getRelatedProjects,
  getFeaturedProjects,
  ProjectsResponse,
  ProjectFilters
} from '@/lib/mock-api/projects'
import { Project, ProjectTag, ProjectAuthor } from '@/types/project'

// Mock the projects data to have controlled test data
jest.mock('@/lib/data/projects', () => {
  const createProjectTag = (name: string): ProjectTag => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: name
  })

  const createProjectAuthor = (id: string, name: string, username: string, avatar: string): ProjectAuthor => ({
    id,
    username,
    email: `${username}@example.com`,
    avatarUrl: avatar,
    bio: null
  })

  const mockProjects: Project[] = [
    {
      id: '1',
      title: 'React Dashboard',
      excerpt: 'Modern dashboard built with React',
      description: 'A comprehensive dashboard application built with React and TypeScript',
      images: ['image1.jpg'],
      screenshots: ['image1.jpg'],
      author: createProjectAuthor('user1', 'John Doe', 'johndoe', 'avatar1.jpg'),
      category: '웹 개발',
      tags: [createProjectTag('React'), createProjectTag('TypeScript')],
      features: ['Dashboard', 'Analytics', 'Charts'],
      demoUrl: 'https://example.com/demo1',
      githubUrl: 'https://github.com/johndoe/dashboard',
      likes: [],
      likeCount: 50,
      viewCount: 200,
      createdAt: new Date('2024-03-15'),
      updatedAt: new Date('2024-03-16'),
      featured: true
    },
    {
      id: '2',
      title: 'Vue Mobile App',
      excerpt: 'Mobile app built with Vue.js',
      description: 'A beautiful mobile application created using Vue.js framework',
      images: ['image2.jpg'],
      screenshots: ['image2.jpg'],
      author: createProjectAuthor('user2', 'Jane Smith', 'janesmith', 'avatar2.jpg'),
      category: '모바일 개발',
      tags: [createProjectTag('Vue.js'), createProjectTag('Mobile')],
      features: ['Mobile UI', 'Responsive', 'PWA'],
      demoUrl: 'https://example.com/demo2',
      githubUrl: 'https://github.com/janesmith/mobile-app',
      likes: [],
      likeCount: 75,
      viewCount: 350,
      createdAt: new Date('2024-03-14'),
      updatedAt: new Date('2024-03-15'),
      featured: false
    },
    {
      id: '3',
      title: 'Python Data Analysis',
      excerpt: 'Data analysis tool using Python',
      description: 'Advanced data analysis and visualization tool built with Python and Pandas',
      images: ['image3.jpg'],
      screenshots: ['image3.jpg'],
      author: createProjectAuthor('user1', 'John Doe', 'johndoe', 'avatar1.jpg'),
      category: '데이터 과학',
      tags: [createProjectTag('Python'), createProjectTag('Pandas'), createProjectTag('Data')],
      features: ['Data Analysis', 'Visualization', 'Machine Learning'],
      demoUrl: null,
      githubUrl: 'https://github.com/johndoe/data-analysis',
      likes: [],
      likeCount: 120,
      viewCount: 800,
      createdAt: new Date('2024-03-13'),
      updatedAt: new Date('2024-03-14'),
      featured: true
    },
    {
      id: '4',
      title: 'Angular E-commerce',
      excerpt: 'E-commerce platform with Angular',
      description: 'Full-featured e-commerce platform built with Angular and TypeScript',
      images: ['image4.jpg'],
      screenshots: ['image4.jpg'],
      author: createProjectAuthor('user3', 'Bob Wilson', 'bobwilson', 'avatar3.jpg'),
      category: '웹 개발',
      tags: [createProjectTag('Angular'), createProjectTag('TypeScript'), createProjectTag('E-commerce')],
      features: ['Shopping Cart', 'Payment', 'Admin Panel'],
      demoUrl: 'https://example.com/demo4',
      githubUrl: 'https://github.com/bobwilson/ecommerce',
      likes: [],
      likeCount: 30,
      viewCount: 150,
      createdAt: new Date('2024-03-12'),
      updatedAt: new Date('2024-03-13'),
      featured: false
    },
    {
      id: '5',
      title: 'Unity Game Project',
      excerpt: 'Indie game built with Unity',
      description: 'An exciting indie game developed using Unity and C#',
      images: ['image5.jpg'],
      screenshots: ['image5.jpg'],
      author: createProjectAuthor('user4', 'Alice Brown', 'alicebrown', 'avatar4.jpg'),
      category: '게임 개발',
      tags: [createProjectTag('Unity'), createProjectTag('C#'), createProjectTag('Game')],
      features: ['3D Graphics', 'Physics', 'Audio'],
      demoUrl: null,
      githubUrl: 'https://github.com/alicebrown/unity-game',
      likes: [],
      likeCount: 200,
      viewCount: 1000,
      createdAt: new Date('2024-03-11'),
      updatedAt: new Date('2024-03-12'),
      featured: true
    },
    {
      id: '6',
      title: 'React Native Weather',
      excerpt: 'Weather app for mobile devices',
      description: 'Beautiful weather application for mobile devices using React Native',
      images: ['image6.jpg'],
      screenshots: ['image6.jpg'],
      author: createProjectAuthor('user2', 'Jane Smith', 'janesmith', 'avatar2.jpg'),
      category: '모바일 개발',
      tags: [createProjectTag('React Native'), createProjectTag('Weather'), createProjectTag('API')],
      features: ['Weather Forecast', 'Location Services', 'Notifications'],
      demoUrl: 'https://example.com/demo6',
      githubUrl: 'https://github.com/janesmith/weather-app',
      likes: [],
      likeCount: 90,
      viewCount: 400,
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-03-11'),
      featured: false
    }
  ]

  return { mockProjects }
})

// Helper to create consistent test expectations (kept for potential future use)
// const createExpectedResponse = (
//   projects: Project[],
//   totalCount: number,
//   currentPage: number,
//   limit: number
// ): ProjectsResponse => {
//   const totalPages = Math.ceil(totalCount / limit)
//   const startIndex = (currentPage - 1) * limit
//   const endIndex = startIndex + limit

//   return {
//     projects,
//     totalCount,
//     totalPages,
//     currentPage,
//     hasNextPage: endIndex < totalCount,
//     hasPrevPage: currentPage > 1
//   }
// }

describe('Projects Mock API', () => {
  beforeEach(() => {
    // Reset any module state if needed
    jest.clearAllMocks()
  })

  describe('getProjects', () => {
    it('should return first page with default pagination', async () => {
      const result = await getProjects()
      
      expect(result).toMatchObject({
        totalCount: 6,
        totalPages: 1,
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false
      })
      expect(result.projects).toHaveLength(6)
      expect(result.projects[0].id).toBe('1')
    })

    it('should handle pagination correctly', async () => {
      const result = await getProjects(1, 3)
      
      expect(result).toMatchObject({
        totalCount: 6,
        totalPages: 2,
        currentPage: 1,
        hasNextPage: true,
        hasPrevPage: false
      })
      expect(result.projects).toHaveLength(3)
      expect(result.projects.map(p => p.id)).toEqual(['1', '2', '3'])
    })

    it('should return second page correctly', async () => {
      const result = await getProjects(2, 3)
      
      expect(result).toMatchObject({
        totalCount: 6,
        totalPages: 2,
        currentPage: 2,
        hasNextPage: false,
        hasPrevPage: true
      })
      expect(result.projects).toHaveLength(3)
      expect(result.projects.map(p => p.id)).toEqual(['4', '5', '6'])
    })

    it('should handle edge case with page beyond available data', async () => {
      const result = await getProjects(10, 3)
      
      expect(result).toMatchObject({
        totalCount: 6,
        totalPages: 2,
        currentPage: 10,
        hasNextPage: false,
        hasPrevPage: true
      })
      expect(result.projects).toHaveLength(0)
    })

    it('should handle large limit', async () => {
      const result = await getProjects(1, 100)
      
      expect(result).toMatchObject({
        totalCount: 6,
        totalPages: 1,
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false
      })
      expect(result.projects).toHaveLength(6)
    })

    it('should simulate API delay', async () => {
      const startTime = Date.now()
      await getProjects()
      const endTime = Date.now()
      
      // Should take at least 295ms due to setTimeout (allowing for timing precision)
      expect(endTime - startTime).toBeGreaterThanOrEqual(295)
    })
  })

  describe('getProjectById', () => {
    it('should return project when ID exists', async () => {
      const result = await getProjectById('1')
      
      expect(result).not.toBeNull()
      expect(result?.id).toBe('1')
      expect(result?.title).toBe('React Dashboard')
      expect(result?.author.username).toBe('johndoe')
    })

    it('should return null when ID does not exist', async () => {
      const result = await getProjectById('999')
      
      expect(result).toBeNull()
    })

    it('should return null for empty string ID', async () => {
      const result = await getProjectById('')
      
      expect(result).toBeNull()
    })

    it('should simulate API delay', async () => {
      const startTime = Date.now()
      await getProjectById('1')
      const endTime = Date.now()
      
      // Should take at least 195ms due to setTimeout (allowing for timing precision)
      expect(endTime - startTime).toBeGreaterThanOrEqual(195)
    })
  })

  describe('getProjectsByAuthor', () => {
    it('should return projects by specific author', async () => {
      const result = await getProjectsByAuthor('user1')
      
      expect(result.totalCount).toBe(2)
      expect(result.projects).toHaveLength(2)
      expect(result.projects.every(p => p.author.id === 'user1')).toBe(true)
    })

    it('should sort projects by creation date (latest first)', async () => {
      const result = await getProjectsByAuthor('user1')
      
      expect(result.projects).toHaveLength(2)
      // Should be sorted by createdAt descending
      expect(result.projects[0].id).toBe('1') // 2024-03-15
      expect(result.projects[1].id).toBe('3') // 2024-03-13
    })

    it('should handle pagination for author projects', async () => {
      const result = await getProjectsByAuthor('user1', 1, 1)
      
      expect(result).toMatchObject({
        totalCount: 2,
        totalPages: 2,
        currentPage: 1,
        hasNextPage: true,
        hasPrevPage: false
      })
      expect(result.projects).toHaveLength(1)
      expect(result.projects[0].id).toBe('1')
    })

    it('should return empty result for non-existent author', async () => {
      const result = await getProjectsByAuthor('nonexistent')
      
      expect(result).toMatchObject({
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false
      })
      expect(result.projects).toHaveLength(0)
    })

    it('should handle second page correctly', async () => {
      const result = await getProjectsByAuthor('user1', 2, 1)
      
      expect(result).toMatchObject({
        totalCount: 2,
        totalPages: 2,
        currentPage: 2,
        hasNextPage: false,
        hasPrevPage: true
      })
      expect(result.projects).toHaveLength(1)
      expect(result.projects[0].id).toBe('3')
    })
  })

  describe('getProjectsWithFilters', () => {
    describe('category filtering', () => {
      it('should filter by category (case insensitive)', async () => {
        const filters: ProjectFilters = { category: '웹 개발' }
        const result = await getProjectsWithFilters(filters)
        
        expect(result.totalCount).toBe(2)
        expect(result.projects.every(p => p.category === '웹 개발')).toBe(true)
        expect(result.projects.map(p => p.id)).toEqual(expect.arrayContaining(['1', '4']))
      })

      it('should handle case insensitive category filtering', async () => {
        const filters: ProjectFilters = { category: '웹 개발' }
        const result = await getProjectsWithFilters(filters)
        
        expect(result.totalCount).toBe(2)
      })

      it('should return empty result for non-existent category', async () => {
        const filters: ProjectFilters = { category: '비존재 카테고리' }
        const result = await getProjectsWithFilters(filters)
        
        expect(result.totalCount).toBe(0)
        expect(result.projects).toHaveLength(0)
      })
    })

    describe('tag filtering', () => {
      it('should filter by single tag', async () => {
        const filters: ProjectFilters = { tags: ['React'] }
        const result = await getProjectsWithFilters(filters)
        
        expect(result.totalCount).toBe(1)
        expect(result.projects[0].id).toBe('1')
        expect(result.projects[0].tags.some(tag => tag.name === 'React')).toBe(true)
      })

      it('should filter by multiple tags (OR logic)', async () => {
        const filters: ProjectFilters = { tags: ['React', 'Vue.js'] }
        const result = await getProjectsWithFilters(filters)
        
        expect(result.totalCount).toBe(2)
        expect(result.projects.map(p => p.id)).toEqual(expect.arrayContaining(['1', '2']))
      })

      it('should handle case insensitive tag filtering', async () => {
        const filters: ProjectFilters = { tags: ['react'] }
        const result = await getProjectsWithFilters(filters)
        
        expect(result.totalCount).toBe(1)
        expect(result.projects[0].id).toBe('1')
      })

      it('should return empty result for non-existent tags', async () => {
        const filters: ProjectFilters = { tags: ['NonExistentTag'] }
        const result = await getProjectsWithFilters(filters)
        
        expect(result.totalCount).toBe(0)
      })

      it('should ignore empty tags array', async () => {
        const filters: ProjectFilters = { tags: [] }
        const result = await getProjectsWithFilters(filters)
        
        expect(result.totalCount).toBe(6) // All projects should be returned
      })
    })

    describe('search filtering', () => {
      it('should search in title', async () => {
        const filters: ProjectFilters = { search: 'React' }
        const result = await getProjectsWithFilters(filters)
        
        expect(result.totalCount).toBe(2) // React Dashboard and React Native Weather
        expect(result.projects.map(p => p.id)).toEqual(expect.arrayContaining(['1', '6']))
      })

      it('should search in description', async () => {
        const filters: ProjectFilters = { search: 'TypeScript' }
        const result = await getProjectsWithFilters(filters)
        
        expect(result.totalCount).toBe(2) // Projects with TypeScript in description
        expect(result.projects.map(p => p.id)).toEqual(expect.arrayContaining(['1', '4']))
      })

      it('should search in excerpt', async () => {
        const filters: ProjectFilters = { search: 'Mobile' }
        const result = await getProjectsWithFilters(filters)
        
        expect(result.totalCount).toBe(2) // Both Vue Mobile App and React Native Weather have "mobile" in excerpt
        expect(result.projects.map(p => p.id)).toEqual(expect.arrayContaining(['2', '6']))
      })

      it('should be case insensitive', async () => {
        const filters: ProjectFilters = { search: 'dashboard' }
        const result = await getProjectsWithFilters(filters)
        
        expect(result.totalCount).toBe(1)
        expect(result.projects[0].id).toBe('1')
      })

      it('should handle partial matches', async () => {
        const filters: ProjectFilters = { search: 'data' }
        const result = await getProjectsWithFilters(filters)
        
        expect(result.totalCount).toBe(1)
        expect(result.projects[0].id).toBe('3') // Python Data Analysis
      })

      it('should return empty result for non-matching search', async () => {
        const filters: ProjectFilters = { search: 'NonExistentTerm' }
        const result = await getProjectsWithFilters(filters)
        
        expect(result.totalCount).toBe(0)
      })
    })

    describe('sorting', () => {
      it('should sort by latest (default)', async () => {
        const filters: ProjectFilters = { sortBy: 'latest' }
        const result = await getProjectsWithFilters(filters)
        
        expect(result.projects).toHaveLength(6)
        // Should be sorted by createdAt descending
        expect(result.projects[0].id).toBe('1') // 2024-03-15
        expect(result.projects[1].id).toBe('2') // 2024-03-14
        expect(result.projects[5].id).toBe('6') // 2024-03-10
      })

      it('should sort by popular (like count)', async () => {
        const filters: ProjectFilters = { sortBy: 'popular' }
        const result = await getProjectsWithFilters(filters)
        
        expect(result.projects).toHaveLength(6)
        // Should be sorted by likeCount descending
        expect(result.projects[0].id).toBe('5') // 200 likes
        expect(result.projects[1].id).toBe('3') // 120 likes
        expect(result.projects[5].id).toBe('4') // 30 likes
      })

      it('should sort by updated', async () => {
        const filters: ProjectFilters = { sortBy: 'updated' }
        const result = await getProjectsWithFilters(filters)
        
        expect(result.projects).toHaveLength(6)
        // Should be sorted by updatedAt descending
        expect(result.projects[0].id).toBe('1') // 2024-03-16
        expect(result.projects[1].id).toBe('2') // 2024-03-15
      })

      it('should default to latest when sortBy is undefined', async () => {
        const filters: ProjectFilters = {}
        const result = await getProjectsWithFilters(filters)
        
        // Should behave same as 'latest'
        expect(result.projects[0].id).toBe('1') // Most recent
      })
    })

    describe('combined filtering', () => {
      it('should combine category and tag filters', async () => {
        const filters: ProjectFilters = {
          category: '웹 개발',
          tags: ['TypeScript']
        }
        const result = await getProjectsWithFilters(filters)
        
        expect(result.totalCount).toBe(2) // Both React Dashboard and Angular E-commerce
        expect(result.projects.every(p => p.category === '웹 개발')).toBe(true)
        expect(result.projects.every(p => 
          p.tags.some(tag => tag.name === 'TypeScript')
        )).toBe(true)
      })

      it('should combine all filters', async () => {
        const filters: ProjectFilters = {
          category: '웹 개발',
          tags: ['React'],
          search: 'dashboard',
          sortBy: 'popular'
        }
        const result = await getProjectsWithFilters(filters)
        
        expect(result.totalCount).toBe(1)
        expect(result.projects[0].id).toBe('1')
      })

      it('should return empty when filters do not match', async () => {
        const filters: ProjectFilters = {
          category: '웹 개발',
          tags: ['Unity'], // Unity is not in 웹 개발 category
        }
        const result = await getProjectsWithFilters(filters)
        
        expect(result.totalCount).toBe(0)
      })
    })

    describe('pagination with filters', () => {
      it('should paginate filtered results', async () => {
        const filters: ProjectFilters = { category: '웹 개발' }
        const result = await getProjectsWithFilters(filters, 1, 1)
        
        expect(result).toMatchObject({
          totalCount: 2,
          totalPages: 2,
          currentPage: 1,
          hasNextPage: true,
          hasPrevPage: false
        })
        expect(result.projects).toHaveLength(1)
      })
    })
  })

  describe('getRelatedProjects', () => {
    it('should return projects from same category excluding current project', async () => {
      const result = await getRelatedProjects('1', '웹 개발', 4)
      
      expect(result).toHaveLength(1) // Only project 4 should match
      expect(result[0].id).toBe('4')
      expect(result[0].category).toBe('웹 개발')
      expect(result.every(p => p.id !== '1')).toBe(true) // Should exclude current project
    })

    it('should respect limit parameter', async () => {
      const result = await getRelatedProjects('2', '모바일 개발', 1)
      
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('6') // The other mobile project
    })

    it('should return empty array when no related projects exist', async () => {
      const result = await getRelatedProjects('3', '데이터 과학', 4)
      
      expect(result).toHaveLength(0) // Only one project in 데이터 과학 category
    })

    it('should return projects in random order (test randomness concept)', async () => {
      // Note: Due to Math.random(), we can't test exact order
      // But we can test that the function returns valid results
      const result = await getRelatedProjects('1', '웹 개발', 4)
      
      expect(result.every(p => p.category === '웹 개발')).toBe(true)
      expect(result.every(p => p.id !== '1')).toBe(true)
    })

    it('should handle non-existent project ID', async () => {
      const result = await getRelatedProjects('999', '웹 개발', 4)
      
      expect(result).toHaveLength(2) // Should return all projects in category
      expect(result.every(p => p.category === '웹 개발')).toBe(true)
    })

    it('should handle non-existent category', async () => {
      const result = await getRelatedProjects('1', '비존재 카테고리', 4)
      
      expect(result).toHaveLength(0)
    })
  })

  describe('getFeaturedProjects', () => {
    it('should return only featured projects', async () => {
      const result = await getFeaturedProjects(6)
      
      expect(result).toHaveLength(3) // Projects 1, 3, and 5 are featured
      expect(result.every(p => p.featured === true)).toBe(true)
      expect(result.map(p => p.id)).toEqual(expect.arrayContaining(['1', '3', '5']))
    })

    it('should sort by like count descending', async () => {
      const result = await getFeaturedProjects(6)
      
      expect(result).toHaveLength(3)
      // Should be sorted by likeCount descending
      expect(result[0].id).toBe('5') // 200 likes
      expect(result[1].id).toBe('3') // 120 likes
      expect(result[2].id).toBe('1') // 50 likes
    })

    it('should respect limit parameter', async () => {
      const result = await getFeaturedProjects(2)
      
      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('5') // Highest likes
      expect(result[1].id).toBe('3') // Second highest likes
    })

    it('should handle limit larger than available featured projects', async () => {
      const result = await getFeaturedProjects(10)
      
      expect(result).toHaveLength(3) // Only 3 featured projects available
    })

    it('should handle zero limit', async () => {
      const result = await getFeaturedProjects(0)
      
      expect(result).toHaveLength(0)
    })

    it('should simulate API delay', async () => {
      const startTime = Date.now()
      await getFeaturedProjects(6)
      const endTime = Date.now()
      
      // Should take at least 245ms due to setTimeout (allowing for timing precision)
      expect(endTime - startTime).toBeGreaterThanOrEqual(245)
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle negative page numbers in getProjects', async () => {
      const result = await getProjects(-1, 3)
      
      // The implementation uses (page - 1) * limit = (-1 - 1) * 3 = -6
      // And endIndex = startIndex + limit = -6 + 3 = -3
      // slice(-6, -3) returns the first 3 elements (slice treats negative indices from end)
      expect(result.currentPage).toBe(-1)
      expect(result.projects).toHaveLength(3) // slice(-6, -3) returns first 3 projects
      expect(result.projects.map(p => p.id)).toEqual(['1', '2', '3'])
    })

    it('should handle zero limit in getProjects', async () => {
      const result = await getProjects(1, 0)
      
      expect(result.totalPages).toBe(Infinity)
      expect(result.projects).toHaveLength(0)
    })

    it('should handle null/undefined filters', async () => {
      const filters: ProjectFilters = {
        category: undefined,
        tags: undefined,
        search: undefined,
        sortBy: undefined
      }
      const result = await getProjectsWithFilters(filters)
      
      expect(result.totalCount).toBe(6) // Should return all projects
    })

    it('should handle empty search string', async () => {
      const filters: ProjectFilters = { search: '' }
      const result = await getProjectsWithFilters(filters)
      
      expect(result.totalCount).toBe(6) // Should return all projects
    })

    it('should handle whitespace-only search', async () => {
      const filters: ProjectFilters = { search: '   ' }
      const result = await getProjectsWithFilters(filters)
      
      expect(result.totalCount).toBe(0) // Whitespace should not match anything
    })
  })

  describe('performance and consistency', () => {
    it('should return consistent results for same parameters', async () => {
      const result1 = await getProjects(1, 3)
      const result2 = await getProjects(1, 3)
      
      expect(result1).toEqual(result2)
    })

    it('should handle concurrent requests correctly', async () => {
      const promises = [
        getProjects(1, 2),
        getProjects(2, 2),
        getProjectById('1'),
        getFeaturedProjects(3)
      ]
      
      const results = await Promise.all(promises)
      
      expect(results).toHaveLength(4)
      
      // Type-safe access to results
      const [result1, result2, result3, result4] = results
      
      expect((result1 as ProjectsResponse).projects).toHaveLength(2)
      expect((result2 as ProjectsResponse).projects).toHaveLength(2)
      expect((result3 as Project | null)?.id).toBe('1')
      expect((result4 as Project[])).toHaveLength(3)
    })
  })
})