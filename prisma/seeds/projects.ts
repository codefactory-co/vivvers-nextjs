import { PrismaClient, User, Tag, Project } from '@prisma/client'
import { uuidv7 } from 'uuidv7'

interface ProjectSeedData {
  title: string
  excerpt: string
  description: string
  fullDescription?: string
  fullDescriptionHtml?: string
  fullDescriptionJson?: string
  category: string
  images: string[]
  demoUrl?: string
  githubUrl?: string
  features: string[]
  tags: string[]          // 일반 태그 slug 배열
  techStack: string[]     // 기술스택 slug 배열
  authorUsername: string
  viewCount: number
  likeCount: number
}

const projectsData: ProjectSeedData[] = [
  {
    title: '모던 UI 디자인 시스템',
    excerpt: 'React와 Tailwind CSS로 구축된 종합적인 디자인 시스템',
    description: 'React와 Tailwind CSS로 구축된 종합적인 디자인 시스템으로, 재사용 가능한 컴포넌트와 다크 모드를 지원합니다. 현대적이고 일관된 사용자 인터페이스를 위한 완전한 솔루션입니다.',
    fullDescription: 'React와 Tailwind CSS로 구축된 종합적인 디자인 시스템으로, 재사용 가능한 컴포넌트와 다크 모드를 지원합니다. 현대적이고 일관된 사용자 인터페이스를 위한 완전한 솔루션입니다.',
    fullDescriptionHtml: '<h2>모던 UI 디자인 시스템</h2><p>React와 Tailwind CSS로 구축된 종합적인 디자인 시스템으로, 재사용 가능한 컴포넌트와 다크 모드를 지원합니다.</p><p>현대적이고 일관된 사용자 인터페이스를 위한 완전한 솔루션입니다.</p>',
    fullDescriptionJson: '{"type":"doc","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"모던 UI 디자인 시스템"}]},{"type":"paragraph","content":[{"type":"text","text":"React와 Tailwind CSS로 구축된 종합적인 디자인 시스템으로, 재사용 가능한 컴포넌트와 다크 모드를 지원합니다."}]},{"type":"paragraph","content":[{"type":"text","text":"현대적이고 일관된 사용자 인터페이스를 위한 완전한 솔루션입니다."}]}]}',
    category: 'UI/UX 디자인',
    images: [
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=800&h=500&fit=crop'
    ],
    demoUrl: 'https://design-system.example.com',
    githubUrl: 'https://github.com/sarahdesigns/design-system',
    features: ['재사용 가능한 컴포넌트', '다크 모드 지원', '반응형 디자인', 'TypeScript 지원'],
    tags: ['portfolio', 'responsive', 'dark-mode'],
    techStack: ['react', 'typescript', 'tailwindcss', 'figma'],
    authorUsername: 'parkdesigner',
    viewCount: 1832,
    likeCount: 234
  },
  {
    title: '이커머스 대시보드 분석',
    excerpt: '실시간 데이터 시각화와 종합적인 리포팅 도구를 갖춘 이커머스 분석용 인터랙티브 대시보드',
    description: '실시간 데이터 시각화와 종합적인 리포팅 도구를 갖춘 이커머스 분석용 인터랙티브 대시보드입니다. 매출, 사용자 행동, 재고 관리 등을 한눈에 파악할 수 있습니다.',
    category: '웹 개발',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop'
    ],
    demoUrl: 'https://ecommerce-dashboard.example.com',
    githubUrl: 'https://github.com/kimcoder/ecommerce-dashboard',
    features: ['실시간 데이터 시각화', '커스텀 차트', '데이터 필터링', '리포트 생성'],
    tags: ['commercial', 'realtime', 'advanced', 'e-commerce'],
    techStack: ['javascript', 'nodejs', 'postgresql', 'docker'],
    authorUsername: 'kimcoder',
    viewCount: 1456,
    likeCount: 189
  },
  {
    title: '모바일 피트니스 앱 프로토타입',
    excerpt: '직관적인 사용자 경험을 제공하는 피트니스 추적 애플리케이션',
    description: '직관적인 사용자 경험을 제공하는 피트니스 추적 애플리케이션을 위한 세련된 모바일 앱 인터페이스 디자인입니다. 운동 계획, 진행 상황 추적, 소셜 기능이 포함되어 있습니다.',
    category: '모바일 디자인',
    images: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop'
    ],
    demoUrl: 'https://fitness-app-prototype.example.com',
    features: ['운동 계획 관리', '진행 상황 추적', '소셜 기능', '애니메이션 효과'],
    tags: ['portfolio', 'mobile-first', 'intermediate', 'healthcare'],
    techStack: ['react-native', 'typescript', 'firebase'],
    authorUsername: 'songmobile',
    viewCount: 892,
    likeCount: 156
  },
  {
    title: '핀테크 대시보드 UI',
    excerpt: '깔끔하고 전문적인 금융 서비스 관리 인터페이스',
    description: '깔끔하고 전문적인 금융 서비스 관리 인터페이스입니다. 계좌 관리, 거래 내역, 투자 포트폴리오를 효율적으로 관리할 수 있는 현대적인 디자인을 제공합니다.',
    category: '웹 개발',
    images: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=500&fit=crop'
    ],
    demoUrl: 'https://fintech-dashboard.example.com',
    githubUrl: 'https://github.com/choistartu/fintech-dashboard',
    features: ['보안 인증', '실시간 알림', '데이터 시각화', '반응형 디자인'],
    tags: ['commercial', 'advanced', 'responsive', 'finance'],
    techStack: ['nextjs', 'typescript', 'postgresql', 'aws'],
    authorUsername: 'choistartu',
    viewCount: 2341,
    likeCount: 298
  },
  {
    title: '머신러닝 데이터 분석 도구',
    excerpt: 'Python과 TensorFlow를 활용한 데이터 분석 및 시각화 플랫폼',
    description: 'Python과 TensorFlow를 활용한 데이터 분석 및 시각화 플랫폼입니다. 대용량 데이터셋 처리, 머신러닝 모델 훈련, 결과 시각화 기능을 제공합니다.',
    category: '데이터 분석',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=500&fit=crop'
    ],
    githubUrl: 'https://github.com/yoondata/ml-analysis-tool',
    features: ['대용량 데이터 처리', 'ML 모델 훈련', '결과 시각화', 'API 제공'],
    tags: ['open-source', 'advanced', 'learning'],
    techStack: ['python', 'tensorflow', 'postgresql', 'docker'],
    authorUsername: 'yoondata',
    viewCount: 743,
    likeCount: 89
  },
  {
    title: '학습 관리 시스템',
    excerpt: '온라인 강의와 과제 관리를 위한 통합 교육 플랫폼',
    description: '온라인 강의와 과제 관리를 위한 통합 교육 플랫폼입니다. 강사와 학생이 효율적으로 소통하고 학습 진도를 관리할 수 있는 시스템입니다.',
    category: '웹 개발',
    images: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=500&fit=crop'
    ],
    demoUrl: 'https://lms-platform.example.com',
    githubUrl: 'https://github.com/leestudent/lms-platform',
    features: ['온라인 강의 스트리밍', '과제 제출 시스템', '성적 관리', '실시간 채팅'],
    tags: ['side-project', 'intermediate', 'education', 'realtime'],
    techStack: ['java', 'spring', 'mysql', 'aws'],
    authorUsername: 'leestudent',
    viewCount: 1234,
    likeCount: 167
  }
]

export async function seedProjects(
  prisma: PrismaClient,
  users: User[],
  tags: Tag[]
): Promise<Project[]> {
  const projects: Project[] = []

  for (const projectData of projectsData) {
    // 작성자 찾기
    const author = users.find(user => user.username === projectData.authorUsername)
    if (!author) {
      throw new Error(`작성자를 찾을 수 없습니다: ${projectData.authorUsername}`)
    }

    // 프로젝트 생성
    const project = await prisma.project.create({
      data: {
        id: uuidv7(),
        title: projectData.title,
        excerpt: projectData.excerpt,
        category: projectData.category,
        description: projectData.description,
        fullDescription: projectData.fullDescription,
        fullDescriptionHtml: projectData.fullDescriptionHtml,
        fullDescriptionJson: projectData.fullDescriptionJson,
        images: projectData.images,
        demoUrl: projectData.demoUrl,
        githubUrl: projectData.githubUrl,
        features: projectData.features,
        viewCount: projectData.viewCount,
        likeCount: projectData.likeCount,
        authorId: author.id,
      }
    })

    // 일반 태그 관계 생성
    for (const tagSlug of projectData.tags) {
      const tag = tags.find(t => t.slug === tagSlug)
      if (tag) {
        await prisma.projectTag.create({
          data: {
            id: uuidv7(),
            projectId: project.id,
            tagId: tag.id,
          }
        })
      }
    }

    // 기술스택 관계 생성
    for (const techSlug of projectData.techStack) {
      const tech = tags.find(t => t.slug === techSlug)
      if (tech) {
        await prisma.projectTechStack.create({
          data: {
            id: uuidv7(),
            projectId: project.id,
            tagId: tech.id,
          }
        })
      }
    }

    projects.push(project)
  }

  return projects
}