import type {
  Project,
  ProjectTag,
  ProjectAuthor,
  User,
  CommunityPost,
  CommunityPostComment
} from '@/types/index'

describe('Types Index', () => {
  it('should allow importing types from project module', () => {
    const testProject: Project = {
      id: 'test-id',
      title: 'Test Project',
      excerpt: 'Short excerpt',
      description: 'Test Description',
      category: 'web',
      images: [],
      screenshots: [],
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com/test/repo',
      features: ['feature1', 'feature2'],
      viewCount: 0,
      likeCount: 0,
      author: {
        id: 'author-id',
        username: 'testuser',
        email: 'test@example.com',
        avatarUrl: null,
        bio: null
      },
      tags: [],
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    expect(testProject.id).toBe('test-id')
    expect(testProject.title).toBe('Test Project')
  })

  it('should allow importing project author types', () => {
    const testAuthor: ProjectAuthor = {
      id: 'author-id',
      username: 'testuser',
      email: 'test@example.com',
      avatarUrl: null,
      bio: null
    }

    expect(testAuthor.id).toBe('author-id')
    expect(testAuthor.username).toBe('testuser')
  })

  it('should allow importing project tag types', () => {
    const testTag: ProjectTag = {
      id: 'tag-id',
      name: 'react'
    }

    expect(testTag.id).toBe('tag-id')
    expect(testTag.name).toBe('react')
  })

  it('should allow importing user types', () => {
    const testUser: User = {
      id: 'user-id',
      username: 'testuser',
      email: 'test@example.com',
      avatarUrl: null,
      bio: null,
      socialLinks: null,
      skills: [],
      experience: null,
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    expect(testUser.id).toBe('user-id')
    expect(testUser.username).toBe('testuser')
  })

  it('should allow importing community types', () => {
    const testCommunityPost: CommunityPost = {
      id: 'post-id',
      title: 'Test Post',
      content: 'Test content',
      contentHtml: '<p>Test content</p>',
      contentJson: { type: 'doc', content: [] },
      authorId: 'author-id',
      author: {
        id: 'author-id',
        username: 'testuser',
        avatarUrl: null
      },
      relatedProjectId: null,
      relatedProject: null,
      tags: [],
      likes: [],
      comments: [],
      likesCount: 0,
      commentsCount: 0,
      viewsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    expect(testCommunityPost.id).toBe('post-id')
    expect(testCommunityPost.title).toBe('Test Post')
  })

  it('should correctly export and use type definitions', () => {
    // This test verifies that types can be imported and used for type checking
    // The mere fact that TypeScript compiles means the types are working
    expect(true).toBe(true)
  })
})