/**
 * Tag data definitions for project categorization
 */

// ==========================================
// Original tag types for seed and tests
// ==========================================

export interface TagOption {
  value: string
  label: string
  category: string
  description?: string
}

export interface TagCategory {
  name: string
  tags: TagOption[]
}

/**
 * General tag options for project categorization
 */
export const generalTagOptions: TagOption[] = [
  // 목적 (Purpose)
  { value: 'portfolio', label: '포트폴리오', category: '목적', description: '취업/이직을 위한 포트폴리오 프로젝트' },
  { value: 'side-project', label: '사이드 프로젝트', category: '목적', description: '개인적인 관심사로 진행한 프로젝트' },
  { value: 'learning', label: '학습', category: '목적', description: '새로운 기술/개념을 배우기 위한 프로젝트' },
  { value: 'commercial', label: '상업용', category: '목적', description: '실제 비즈니스/수익 목적의 프로젝트' },
  { value: 'open-source', label: '오픈소스', category: '목적', description: '오픈소스 기여 또는 공개 프로젝트' },
  { value: 'hackathon', label: '해커톤', category: '목적', description: '해커톤에서 만든 프로젝트' },

  // 난이도 (Difficulty)
  { value: 'beginner', label: '초급', category: '난이도', description: '프로그래밍 입문자도 이해할 수 있는 수준' },
  { value: 'intermediate', label: '중급', category: '난이도', description: '기본기를 갖춘 개발자 수준' },
  { value: 'advanced', label: '고급', category: '난이도', description: '심화 지식이 필요한 수준' },

  // 특징 (Features)
  { value: 'responsive', label: '반응형', category: '특징', description: '다양한 화면 크기에 최적화된 디자인' },
  { value: 'realtime', label: '실시간', category: '특징', description: '실시간 데이터 처리/업데이트 기능' },
  { value: 'mobile-first', label: '모바일 퍼스트', category: '특징', description: '모바일 우선 설계 방식' },
  { value: 'pwa', label: 'PWA', category: '특징', description: 'Progressive Web App 지원' },
  { value: 'seo-optimized', label: 'SEO 최적화', category: '특징', description: '검색 엔진 최적화 적용' },
  { value: 'accessibility', label: '접근성', category: '특징', description: '웹 접근성 기준 준수' },
  { value: 'dark-mode', label: '다크 모드', category: '특징', description: '다크/라이트 모드 지원' },
  { value: 'multilingual', label: '다국어', category: '특징', description: '여러 언어 지원' },

  // 분야 (Domain)
  { value: 'e-commerce', label: '이커머스', category: '분야', description: '온라인 쇼핑/거래 관련' },
  { value: 'social', label: '소셜', category: '분야', description: '소셜 네트워크/커뮤니티 관련' },
  { value: 'education', label: '교육', category: '분야', description: '교육/학습 관련 서비스' },
  { value: 'healthcare', label: '헬스케어', category: '분야', description: '건강/의료 관련 서비스' },
  { value: 'finance', label: '금융', category: '분야', description: '금융/핀테크 관련 서비스' },
  { value: 'entertainment', label: '엔터테인먼트', category: '분야', description: '게임/미디어/엔터테인먼트 관련' },
  { value: 'productivity', label: '생산성', category: '분야', description: '업무 효율/생산성 도구' },
  { value: 'news', label: '뉴스', category: '분야', description: '뉴스/미디어/콘텐츠 관련' },
  { value: 'travel', label: '여행', category: '분야', description: '여행/관광 관련 서비스' },
  { value: 'food', label: '음식', category: '분야', description: '음식/배달/레스토랑 관련' }
]

/**
 * General tag categories with their associated tags
 */
export const generalTagCategories: TagCategory[] = [
  {
    name: '목적',
    tags: generalTagOptions.filter(tag => tag.category === '목적')
  },
  {
    name: '난이도',
    tags: generalTagOptions.filter(tag => tag.category === '난이도')
  },
  {
    name: '특징',
    tags: generalTagOptions.filter(tag => tag.category === '특징')
  },
  {
    name: '분야',
    tags: generalTagOptions.filter(tag => tag.category === '분야')
  }
]

// ==========================================
// Extended tag types for data layer
// ==========================================

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
