export interface Tag {
  id: string
  name: string
  slug: string
  categoryId?: string
  description?: string
  projectCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  projectCount: number
  createdAt: Date
  updatedAt: Date
}

export const CATEGORIES: Category[] = [
  {
    id: '1',
    name: '웹 개발',
    slug: 'web-development',
    description: '웹 애플리케이션, 프론트엔드, 백엔드 개발',
    color: '#3B82F6',
    projectCount: 150,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: '모바일 앱',
    slug: 'mobile-app',
    description: 'iOS, Android 애플리케이션 개발',
    color: '#10B981',
    projectCount: 80,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: '데이터 사이언스',
    slug: 'data-science',
    description: '데이터 분석, 머신러닝, AI',
    color: '#8B5CF6',
    projectCount: 45,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '4',
    name: '게임 개발',
    slug: 'game-development',
    description: '게임 엔진, 인디 게임, 모바일 게임',
    color: '#F59E0B',
    projectCount: 32,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '5',
    name: '디자인',
    slug: 'design',
    description: 'UI/UX, 그래픽 디자인, 브랜딩',
    color: '#EF4444',
    projectCount: 28,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

export const TAGS: Tag[] = [
  // 웹 개발 태그
  { id: '1', name: 'React', slug: 'react', categoryId: '1', projectCount: 65, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: '2', name: 'Next.js', slug: 'nextjs', categoryId: '1', projectCount: 42, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: '3', name: 'Vue.js', slug: 'vuejs', categoryId: '1', projectCount: 35, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: '4', name: 'Angular', slug: 'angular', categoryId: '1', projectCount: 28, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: '5', name: 'Node.js', slug: 'nodejs', categoryId: '1', projectCount: 55, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: '6', name: 'Express', slug: 'express', categoryId: '1', projectCount: 38, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: '7', name: 'TypeScript', slug: 'typescript', categoryId: '1', projectCount: 72, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: '8', name: 'JavaScript', slug: 'javascript', categoryId: '1', projectCount: 88, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  
  // 모바일 앱 태그
  { id: '9', name: 'React Native', slug: 'react-native', categoryId: '2', projectCount: 32, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: '10', name: 'Flutter', slug: 'flutter', categoryId: '2', projectCount: 28, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: '11', name: 'Swift', slug: 'swift', categoryId: '2', projectCount: 22, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: '12', name: 'Kotlin', slug: 'kotlin', categoryId: '2', projectCount: 25, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  
  // 데이터 사이언스 태그
  { id: '13', name: 'Python', slug: 'python', categoryId: '3', projectCount: 45, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: '14', name: 'Machine Learning', slug: 'machine-learning', categoryId: '3', projectCount: 35, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: '15', name: 'TensorFlow', slug: 'tensorflow', categoryId: '3', projectCount: 18, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: '16', name: 'PyTorch', slug: 'pytorch', categoryId: '3', projectCount: 15, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  
  // 게임 개발 태그
  { id: '17', name: 'Unity', slug: 'unity', categoryId: '4', projectCount: 18, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: '18', name: 'Unreal Engine', slug: 'unreal-engine', categoryId: '4', projectCount: 12, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: '19', name: 'C#', slug: 'csharp', categoryId: '4', projectCount: 20, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  
  // 디자인 태그
  { id: '20', name: 'Figma', slug: 'figma', categoryId: '5', projectCount: 25, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: '21', name: 'Adobe XD', slug: 'adobe-xd', categoryId: '5', projectCount: 15, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: '22', name: 'UI/UX', slug: 'ui-ux', categoryId: '5', projectCount: 28, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') }
]

export function getAllTags(): Tag[] {
  return TAGS
}

export function getTagsByCategory(categoryId: string): Tag[] {
  return TAGS.filter(tag => tag.categoryId === categoryId)
}

export function getTagBySlug(slug: string): Tag | undefined {
  return TAGS.find(tag => tag.slug === slug)
}

export function getAllCategories(): Category[] {
  return CATEGORIES
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(category => category.slug === slug)
}

export function searchTags(query: string): Tag[] {
  const lowercaseQuery = query.toLowerCase()
  return TAGS.filter(tag => 
    tag.name.toLowerCase().includes(lowercaseQuery) ||
    tag.slug.toLowerCase().includes(lowercaseQuery)
  )
}