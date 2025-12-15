/**
 * Tag data definitions for project categorization
 */

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
