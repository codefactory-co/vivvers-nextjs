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

// 기술 스택 옵션
export const techStackOptions: TagOption[] = [
  // Frontend
  { value: 'react', label: 'React', category: 'Frontend', description: 'JavaScript 라이브러리' },
  { value: 'vue', label: 'Vue.js', category: 'Frontend', description: 'Progressive 프레임워크' },
  { value: 'angular', label: 'Angular', category: 'Frontend', description: 'TypeScript 기반 프레임워크' },
  { value: 'svelte', label: 'Svelte', category: 'Frontend', description: '컴파일 기반 프레임워크' },
  { value: 'nextjs', label: 'Next.js', category: 'Frontend', description: 'React 기반 풀스택 프레임워크' },
  { value: 'nuxtjs', label: 'Nuxt.js', category: 'Frontend', description: 'Vue.js 기반 프레임워크' },
  { value: 'typescript', label: 'TypeScript', category: 'Frontend', description: 'JavaScript의 상위집합' },
  { value: 'javascript', label: 'JavaScript', category: 'Frontend', description: '웹 프로그래밍 언어' },
  { value: 'html', label: 'HTML', category: 'Frontend', description: '마크업 언어' },
  { value: 'css', label: 'CSS', category: 'Frontend', description: '스타일시트 언어' },
  { value: 'tailwindcss', label: 'Tailwind CSS', category: 'Frontend', description: 'Utility-first CSS 프레임워크' },
  { value: 'sass', label: 'Sass', category: 'Frontend', description: 'CSS 전처리기' },

  // Backend
  { value: 'nodejs', label: 'Node.js', category: 'Backend', description: 'JavaScript 런타임' },
  { value: 'python', label: 'Python', category: 'Backend', description: '다목적 프로그래밍 언어' },
  { value: 'java', label: 'Java', category: 'Backend', description: '객체지향 프로그래밍 언어' },
  { value: 'go', label: 'Go', category: 'Backend', description: 'Google에서 개발한 언어' },
  { value: 'rust', label: 'Rust', category: 'Backend', description: '시스템 프로그래밍 언어' },
  { value: 'php', label: 'PHP', category: 'Backend', description: '웹 개발 언어' },
  { value: 'csharp', label: 'C#', category: 'Backend', description: 'Microsoft 개발 언어' },
  { value: 'express', label: 'Express.js', category: 'Backend', description: 'Node.js 웹 프레임워크' },
  { value: 'fastapi', label: 'FastAPI', category: 'Backend', description: 'Python 웹 프레임워크' },
  { value: 'django', label: 'Django', category: 'Backend', description: 'Python 웹 프레임워크' },
  { value: 'spring', label: 'Spring', category: 'Backend', description: 'Java 프레임워크' },
  { value: 'flask', label: 'Flask', category: 'Backend', description: 'Python 마이크로 프레임워크' },

  // Database
  { value: 'postgresql', label: 'PostgreSQL', category: 'Database', description: '관계형 데이터베이스' },
  { value: 'mysql', label: 'MySQL', category: 'Database', description: '관계형 데이터베이스' },
  { value: 'mongodb', label: 'MongoDB', category: 'Database', description: 'NoSQL 데이터베이스' },
  { value: 'redis', label: 'Redis', category: 'Database', description: '인메모리 데이터베이스' },
  { value: 'sqlite', label: 'SQLite', category: 'Database', description: '경량 데이터베이스' },
  { value: 'firebase', label: 'Firebase', category: 'Database', description: 'Google 클라우드 플랫폼' },
  { value: 'supabase', label: 'Supabase', category: 'Database', description: 'Firebase 대안' },
  { value: 'prisma', label: 'Prisma', category: 'Database', description: 'TypeScript ORM' },

  // Cloud & DevOps
  { value: 'aws', label: 'AWS', category: 'Cloud', description: 'Amazon 클라우드 서비스' },
  { value: 'gcp', label: 'Google Cloud', category: 'Cloud', description: 'Google 클라우드 플랫폼' },
  { value: 'azure', label: 'Azure', category: 'Cloud', description: 'Microsoft 클라우드' },
  { value: 'vercel', label: 'Vercel', category: 'Cloud', description: '프론트엔드 배포 플랫폼' },
  { value: 'netlify', label: 'Netlify', category: 'Cloud', description: '정적 사이트 호스팅' },
  { value: 'docker', label: 'Docker', category: 'DevOps', description: '컨테이너 플랫폼' },
  { value: 'kubernetes', label: 'Kubernetes', category: 'DevOps', description: '컨테이너 오케스트레이션' },
  { value: 'git', label: 'Git', category: 'DevOps', description: '버전 관리 시스템' },
  { value: 'github', label: 'GitHub', category: 'DevOps', description: 'Git 호스팅 서비스' },
  { value: 'gitlab', label: 'GitLab', category: 'DevOps', description: 'Git 호스팅 서비스' },

  // Mobile
  { value: 'react-native', label: 'React Native', category: 'Mobile', description: '크로스플랫폼 모바일 프레임워크' },
  { value: 'flutter', label: 'Flutter', category: 'Mobile', description: 'Google 모바일 프레임워크' },
  { value: 'swift', label: 'Swift', category: 'Mobile', description: 'iOS 개발 언어' },
  { value: 'kotlin', label: 'Kotlin', category: 'Mobile', description: 'Android 개발 언어' },
  { value: 'ionic', label: 'Ionic', category: 'Mobile', description: '하이브리드 앱 프레임워크' },

  // Tools
  { value: 'vscode', label: 'VS Code', category: 'Tools', description: '코드 에디터' },
  { value: 'figma', label: 'Figma', category: 'Tools', description: 'UI/UX 디자인 도구' },
  { value: 'photoshop', label: 'Photoshop', category: 'Tools', description: '이미지 편집 프로그램' },
  { value: 'notion', label: 'Notion', category: 'Tools', description: '협업 도구' },
  { value: 'slack', label: 'Slack', category: 'Tools', description: '팀 커뮤니케이션' },
  { value: 'jira', label: 'Jira', category: 'Tools', description: '프로젝트 관리 도구' }
]

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

// 카테고리별로 그룹화된 기술 스택
export const techStackCategories: TagCategory[] = [
  {
    name: 'Frontend',
    tags: techStackOptions.filter(tag => tag.category === 'Frontend')
  },
  {
    name: 'Backend',
    tags: techStackOptions.filter(tag => tag.category === 'Backend')
  },
  {
    name: 'Database',
    tags: techStackOptions.filter(tag => tag.category === 'Database')
  },
  {
    name: 'Cloud',
    tags: techStackOptions.filter(tag => tag.category === 'Cloud')
  },
  {
    name: 'DevOps',
    tags: techStackOptions.filter(tag => tag.category === 'DevOps')
  },
  {
    name: 'Mobile',
    tags: techStackOptions.filter(tag => tag.category === 'Mobile')
  },
  {
    name: 'Tools',
    tags: techStackOptions.filter(tag => tag.category === 'Tools')
  }
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