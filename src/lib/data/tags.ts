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


// 일반 태그 옵션
export const generalTagOptions: TagOption[] = [
  // 프로젝트 목적
  { value: 'portfolio', label: '포트폴리오', category: '목적', description: '개인 포트폴리오용 프로젝트' },
  { value: 'side-project', label: '사이드 프로젝트', category: '목적', description: '개인적인 사이드 프로젝트' },
  { value: 'learning', label: '학습', category: '목적', description: '기술 학습을 위한 프로젝트' },
  { value: 'commercial', label: '상업적', category: '목적', description: '수익을 목적으로 하는 프로젝트' },
  { value: 'open-source', label: '오픈소스', category: '목적', description: '오픈소스 프로젝트' },
  { value: 'hackathon', label: '해커톤', category: '목적', description: '해커톤 참가 작품' },

  // 난이도
  { value: 'beginner', label: '초급', category: '난이도', description: '초보자 수준의 프로젝트' },
  { value: 'intermediate', label: '중급', category: '난이도', description: '중급자 수준의 프로젝트' },
  { value: 'advanced', label: '고급', category: '난이도', description: '고급자 수준의 프로젝트' },

  // 특징
  { value: 'responsive', label: '반응형', category: '특징', description: '모든 디바이스에 최적화' },
  { value: 'realtime', label: '실시간', category: '특징', description: '실시간 기능 포함' },
  { value: 'mobile-first', label: '모바일 퍼스트', category: '특징', description: '모바일 우선 설계' },
  { value: 'pwa', label: 'PWA', category: '특징', description: 'Progressive Web App' },
  { value: 'seo-optimized', label: 'SEO 최적화', category: '특징', description: '검색엔진 최적화' },
  { value: 'accessibility', label: '접근성', category: '특징', description: '웹 접근성 준수' },
  { value: 'dark-mode', label: '다크모드', category: '특징', description: '다크모드 지원' },
  { value: 'multilingual', label: '다국어', category: '특징', description: '다국어 지원' },

  // 분야
  { value: 'e-commerce', label: 'E-commerce', category: '분야', description: '전자상거래' },
  { value: 'social', label: '소셜', category: '분야', description: '소셜 네트워크' },
  { value: 'education', label: '교육', category: '분야', description: '교육 관련' },
  { value: 'healthcare', label: '헬스케어', category: '분야', description: '의료/건강' },
  { value: 'finance', label: '금융', category: '분야', description: '금융 서비스' },
  { value: 'entertainment', label: '엔터테인먼트', category: '분야', description: '오락/게임' },
  { value: 'productivity', label: '생산성', category: '분야', description: '업무 효율성 도구' },
  { value: 'news', label: '뉴스', category: '분야', description: '뉴스/미디어' },
  { value: 'travel', label: '여행', category: '분야', description: '여행 관련' },
  { value: 'food', label: '음식', category: '분야', description: '음식/요리' }
]


// 카테고리별로 그룹화된 일반 태그
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