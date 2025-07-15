import { Project, ProjectDetail, ProjectTag, ProjectAuthor } from '@/types/project'
import { generalTagOptions } from './tags'

// Helper function to create ProjectTag objects
const createProjectTag = (name: string): ProjectTag => {
  const generalOption = generalTagOptions.find(opt => opt.label === name || opt.value === name.toLowerCase())
  
  if (generalOption) {
    return {
      id: generalOption.value,
      name: generalOption.label
    }
  }
  
  // Fallback for custom tags (including tech tags)
  return {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: name
  }
}

// Helper function to create ProjectAuthor objects
const createProjectAuthor = (id: string, name: string, username: string, avatar: string): ProjectAuthor => ({
  id,
  username,
  email: `${username}@example.com`,
  avatarUrl: avatar,
  bio: null
})

// TODO: Replace this with your actual Supabase user ID from the console log
const CURRENT_USER_ID = 'YOUR_ACTUAL_SUPABASE_USER_ID_HERE'

export const mockProjects: Project[] = [
  {
    id: '1',
    title: '모던 UI 디자인 시스템',
    excerpt: 'React와 Tailwind CSS로 구축된 종합적인 디자인 시스템',
    description: 'React와 Tailwind CSS로 구축된 종합적인 디자인 시스템으로, 재사용 가능한 컴포넌트와 다크 모드를 지원합니다.',
    images: ['https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=240&fit=crop'],
    screenshots: ['https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=240&fit=crop'],
    author: createProjectAuthor('user1', '김사라', 'sarahdesigns', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'),
    category: 'UI/UX 디자인',
    tags: [createProjectTag('React'), createProjectTag('Tailwind CSS'), createProjectTag('디자인 시스템')],
    features: ['재사용 가능한 컴포넌트', '다크 모드 지원', '반응형 디자인'],
    demoUrl: 'https://design-system-demo.vercel.app',
    githubUrl: 'https://github.com/sarahdesigns/modern-ui-system',
    likes: [],
    likeCount: 234,
    viewCount: 1832,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
    featured: true
  },
  {
    id: '2',
    title: '이커머스 대시보드 분석',
    excerpt: '실시간 데이터 시각화와 종합적인 리포팅 도구를 갖춘 대시보드',
    description: '실시간 데이터 시각화와 종합적인 리포팅 도구를 갖춘 이커머스 분석용 인터랙티브 대시보드',
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=240&fit=crop'],
    screenshots: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=240&fit=crop'],
    author: createProjectAuthor('user2', '이준호', 'alexdev', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'),
    category: '웹 개발',
    tags: [createProjectTag('JavaScript'), createProjectTag('D3.js'), createProjectTag('분석')],
    features: ['실시간 데이터 시각화', '리포팅 도구', '인터랙티브 대시보드'],
    demoUrl: 'https://ecommerce-analytics-demo.vercel.app',
    githubUrl: 'https://github.com/alexdev/ecommerce-analytics',
    likes: [],
    likeCount: 189,
    viewCount: 1456,
    createdAt: new Date('2024-03-14'),
    updatedAt: new Date('2024-03-14')
  },
  {
    id: '3',
    title: '모바일 앱 프로토타입',
    excerpt: '직관적인 사용자 경험을 제공하는 피트니스 추적 애플리케이션',
    description: '직관적인 사용자 경험을 제공하는 피트니스 추적 애플리케이션을 위한 세련된 모바일 앱 인터페이스 디자인',
    images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=240&fit=crop'],
    screenshots: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=240&fit=crop'],
    author: createProjectAuthor('user3', '김민지', 'emilyux', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'),
    category: '모바일 디자인',
    tags: [createProjectTag('Figma'), createProjectTag('모바일'), createProjectTag('프로토타입')],
    features: ['직관적인 UI/UX', '피트니스 추적 기능', '세련된 모바일 디자인'],
    demoUrl: 'https://figma.com/proto/mobile-app',
    githubUrl: null,
    likes: [],
    likeCount: 312,
    viewCount: 2187,
    createdAt: new Date('2024-03-13'),
    updatedAt: new Date('2024-03-13'),
    featured: true
  },
  {
    id: '4',
    title: 'AI 기반 코드 생성기',
    excerpt: '자연어 설명으로부터 깨끗하고 최적화된 코드를 생성하는 도구',
    description: '자연어 설명으로부터 깨끗하고 최적화된 코드를 생성하는 머신러닝 도구',
    images: ['https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=240&fit=crop'],
    screenshots: ['https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=240&fit=crop'],
    author: createProjectAuthor('user4', '김대현', 'davidai', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'),
    category: '머신러닝',
    tags: [createProjectTag('Python'), createProjectTag('AI'), createProjectTag('NLP')],
    features: ['자연어 처리', '코드 생성', '머신러닝 알고리즘'],
    demoUrl: 'https://ai-code-generator.vercel.app',
    githubUrl: 'https://github.com/davidai/ai-code-generator',
    likes: [],
    likeCount: 567,
    viewCount: 3421,
    createdAt: new Date('2024-03-12'),
    updatedAt: new Date('2024-03-12'),
    featured: true
  },
  {
    id: '5',
    title: '블록체인 지갑 인터페이스',
    excerpt: '고급 보안 기능을 갖춘 안전하고 사용자 친화적인 암호화폐 지갑',
    description: '고급 보안 기능을 갖춘 안전하고 사용자 친화적인 암호화폐 지갑 인터페이스',
    images: ['https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=240&fit=crop'],
    screenshots: ['https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=240&fit=crop'],
    author: createProjectAuthor('user5', '박서연', 'mariaweb3', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'),
    category: '블록체인',
    tags: [createProjectTag('Web3'), createProjectTag('React'), createProjectTag('암호화폐')],
    features: ['고급 보안', '사용자 친화적 인터페이스', '멀티 체인 지원'],
    demoUrl: null,
    githubUrl: 'https://github.com/mariaweb3/blockchain-wallet',
    likes: [],
    likeCount: 423,
    viewCount: 2876,
    createdAt: new Date('2024-03-11'),
    updatedAt: new Date('2024-03-11')
  },
  {
    id: '6',
    title: '게임 포트폴리오 웹사이트',
    excerpt: '인터랙티브 요소와 게임 미리보기 기능을 갖춘 포트폴리오 쇼케이스',
    description: '인터랙티브 요소와 게임 미리보기 기능을 갖춘 인디 게임 개발자를 위한 동적 포트폴리오 쇼케이스',
    images: ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=240&fit=crop'],
    screenshots: ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=240&fit=crop'],
    author: createProjectAuthor('user6', '최재원', 'jamesgames', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'),
    category: '게임 개발',
    tags: [createProjectTag('Unity'), createProjectTag('C#'), createProjectTag('포트폴리오')],
    features: ['인터랙티브 요소', '게임 미리보기', '동적 쇼케이스'],
    demoUrl: 'https://game-portfolio.vercel.app',
    githubUrl: 'https://github.com/jamesgames/game-portfolio',
    likes: [],
    likeCount: 298,
    viewCount: 1967,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: '7',
    title: '소셜 미디어 관리 도구',
    excerpt: '스케줄링과 분석 기능을 갖춘 소셜 미디어 계정 관리 플랫폼',
    description: '스케줄링과 분석 기능을 갖춘 여러 소셜 미디어 계정 관리를 위한 종합 플랫폼',
    images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=240&fit=crop'],
    screenshots: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=240&fit=crop'],
    author: createProjectAuthor('user7', '이수진', 'lisasocial', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face'),
    category: '웹 개발',
    tags: [createProjectTag('Node.js'), createProjectTag('API'), createProjectTag('소셜 미디어')],
    features: ['스케줄링', '분석 기능', '멀티 플랫폼 지원'],
    demoUrl: 'https://social-manager.vercel.app',
    githubUrl: 'https://github.com/lisasocial/social-manager',
    likes: [],
    likeCount: 156,
    viewCount: 1234,
    createdAt: new Date('2024-03-09'),
    updatedAt: new Date('2024-03-09')
  },
  {
    id: '8',
    title: '날씨 시각화 앱',
    excerpt: '멋진 시각화와 정확한 예보 데이터를 제공하는 날씨 애플리케이션',
    description: '멋진 시각화와 정확한 예보 데이터를 제공하는 아름다운 날씨 애플리케이션',
    images: ['https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=240&fit=crop'],
    screenshots: ['https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=240&fit=crop'],
    author: createProjectAuthor('user8', '정민수', 'mikeweather', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face'),
    category: '데이터 시각화',
    tags: [createProjectTag('Vue.js'), createProjectTag('날씨 API'), createProjectTag('차트')],
    features: ['데이터 시각화', '정확한 예보', '아름다운 UI'],
    demoUrl: 'https://weather-app.vercel.app',
    githubUrl: 'https://github.com/mikeweather/weather-app',
    likes: [],
    likeCount: 345,
    viewCount: 2543,
    createdAt: new Date('2024-03-08'),
    updatedAt: new Date('2024-03-08')
  },
  {
    id: '9',
    title: '헬스케어 관리 시스템',
    excerpt: '환자 관리, 예약, 의료 기록을 위한 종합적인 헬스케어 플랫폼',
    description: '환자 관리, 예약, 의료 기록을 위한 종합적인 헬스케어 플랫폼',
    images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=240&fit=crop'],
    screenshots: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=240&fit=crop'],
    author: createProjectAuthor('user9', '이지은 박사', 'drjenlee', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face'),
    category: '헬스케어',
    tags: [createProjectTag('HIPAA'), createProjectTag('데이터베이스'), createProjectTag('보안')],
    features: ['환자 관리', '예약 시스템', '의료 기록'],
    demoUrl: null,
    githubUrl: 'https://github.com/drjenlee/healthcare-system',
    likes: [],
    likeCount: 278,
    viewCount: 1876,
    createdAt: new Date('2024-03-07'),
    updatedAt: new Date('2024-03-07')
  },
  {
    id: '10',
    title: '부동산 플랫폼',
    excerpt: '가상 투어, 부동산 비교, 모기지 계산기를 갖춘 부동산 마켓플레이스',
    description: '가상 투어, 부동산 비교, 모기지 계산기를 갖춘 현대적인 부동산 마켓플레이스',
    images: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=240&fit=crop'],
    screenshots: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=240&fit=crop'],
    author: createProjectAuthor('user10', '강태현', 'robrealty', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'),
    category: '부동산',
    tags: [createProjectTag('React'), createProjectTag('지도 API'), createProjectTag('금융')],
    features: ['가상 투어', '부동산 비교', '모기지 계산기'],
    demoUrl: 'https://real-estate-platform.vercel.app',
    githubUrl: 'https://github.com/robrealty/real-estate-platform',
    likes: [],
    likeCount: 412,
    viewCount: 3012,
    createdAt: new Date('2024-03-06'),
    updatedAt: new Date('2024-03-06'),
    featured: true
  }
]

// Helper function to get projects with pagination
export const getProjects = (page: number = 1, limit: number = 12) => {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  
  return {
    projects: mockProjects.slice(startIndex, endIndex),
    totalProjects: mockProjects.length,
    totalPages: Math.ceil(mockProjects.length / limit),
    currentPage: page,
    hasNextPage: endIndex < mockProjects.length,
    hasPrevPage: page > 1
  }
}

// Helper function to get featured projects
export const getFeaturedProjects = () => {
  return mockProjects.filter(project => project.featured)
}

// Helper function to get projects by category
export const getProjectsByCategory = (category: string) => {
  return mockProjects.filter(project => 
    project.category.toLowerCase() === category.toLowerCase()
  )
}

// Mock project detail data
export const mockProjectDetails: Record<string, ProjectDetail> = {
  '1': {
    ...mockProjects[0],
    fullDescription: `Modern UI Design System은 현대적인 웹 애플리케이션을 위한 포괄적인 디자인 시스템입니다. 이 프로젝트는 재사용 가능한 컴포넌트 라이브러리, 일관된 디자인 토큰, 그리고 완벽한 다크 모드 지원을 제공합니다. 개발자와 디자이너가 협업하여 빠르고 일관된 사용자 인터페이스를 구축할 수 있도록 도와줍니다.`,
    fullDescriptionHtml: `<h2>Modern UI Design System</h2><p>현대적인 웹 애플리케이션을 위한 포괄적인 디자인 시스템입니다.</p><p>이 프로젝트는 재사용 가능한 컴포넌트 라이브러리, 일관된 디자인 토큰, 그리고 완벽한 다크 모드 지원을 제공합니다.</p><h3>주요 특징</h3><ul><li>재사용 가능한 컴포넌트 라이브러리</li><li>일관된 디자인 토큰</li><li>완벽한 다크 모드 지원</li></ul><p>개발자와 디자이너가 협업하여 빠르고 일관된 사용자 인터페이스를 구축할 수 있도록 도와줍니다.</p>`,
    fullDescriptionJson: `{"type":"doc","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Modern UI Design System"}]},{"type":"paragraph","content":[{"type":"text","text":"현대적인 웹 애플리케이션을 위한 포괄적인 디자인 시스템입니다."}]},{"type":"paragraph","content":[{"type":"text","text":"이 프로젝트는 재사용 가능한 컴포넌트 라이브러리, 일관된 디자인 토큰, 그리고 완벽한 다크 모드 지원을 제공합니다."}]},{"type":"heading","attrs":{"level":3},"content":[{"type":"text","text":"주요 특징"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"재사용 가능한 컴포넌트 라이브러리"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"일관된 디자인 토큰"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"완벽한 다크 모드 지원"}]}]}]},{"type":"paragraph","content":[{"type":"text","text":"개발자와 디자이너가 협업하여 빠르고 일관된 사용자 인터페이스를 구축할 수 있도록 도와줍니다."}]}]}`,
    screenshots: [
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop'
    ],
    comments: [
      {
        id: 'c1',
        content: '정말 멋진 디자인 시스템이네요! 특히 다크 모드 전환이 매끄럽습니다.',
        projectId: 'design-system-ui',
        authorId: 'user100',
        parentId: null,
        likeCount: 5,
        repliesCount: 0,
        createdAt: new Date('2024-03-16T10:30:00Z'),
        updatedAt: new Date('2024-03-16T10:30:00Z'),
        author: {
          id: 'user100',
          username: 'kimdev',
          avatarUrl: null
        },
        isLiked: false
      },
      {
        id: 'c2',
        content: 'Figma와의 동기화 기능이 인상적입니다. 혹시 토큰 관리는 어떻게 하셨나요?',
        projectId: 'design-system-ui',
        authorId: 'user101',
        parentId: null,
        likeCount: 3,
        repliesCount: 1,
        createdAt: new Date('2024-03-16T14:15:00Z'),
        updatedAt: new Date('2024-03-16T14:15:00Z'),
        author: {
          id: 'user101',
          username: 'parkdesigner',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
        },
        isLiked: false,
        replies: [
          {
            id: 'c2-1',
            content: 'Design Tokens Studio 플러그인을 사용해서 JSON 형태로 관리하고 있어요! 자세한 내용은 GitHub 리드미에서 확인하실 수 있습니다.',
            projectId: 'design-system-ui',
            authorId: 'user1',
            parentId: 'c2',
            likeCount: 2,
            repliesCount: 0,
            createdAt: new Date('2024-03-16T15:20:00Z'),
            updatedAt: new Date('2024-03-16T15:20:00Z'),
            author: {
              id: 'user1',
              username: 'sarahdesigns',
              avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
            },
            isLiked: false
          }
        ]
      }
    ]
  }
}

// Helper function to generate dynamic project detail from basic project data
const generateProjectDetail = (project: Project): ProjectDetail => {
  // Generate mock detailed description
  const fullDescription = `${project.description}\n\n이 프로젝트는 ${project.category} 분야에서 혁신적인 접근을 시도한 작품입니다. ${project.tags.map(tag => tag.name).join(', ')} 기술을 활용하여 사용자 중심의 솔루션을 제공합니다.\n\n개발 과정에서 다양한 기술적 도전과 창의적 문제 해결을 통해 완성된 프로젝트로, 실제 사용자들의 피드백을 바탕으로 지속적으로 개선되고 있습니다.`

  // Generate mock screenshots
  const screenshots = [
    `https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=500&fit=crop`,
    `https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=500&fit=crop`,
    `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop`,
    `https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop`
  ]

  // Generate mock comments
  const sampleComments = [
    {
      id: `comment-${project.id}-1`,
      content: `정말 인상적인 ${project.category} 프로젝트네요! 특히 사용자 경험 부분이 뛰어납니다.`,
      projectId: project.id,
      authorId: 'user-comment-1',
      parentId: null,
      likeCount: Math.floor(Math.random() * 10) + 1,
      repliesCount: 0,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      author: {
        id: 'user-comment-1',
        username: 'reviewer_kim',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      },
      isLiked: false
    },
    {
      id: `comment-${project.id}-2`,
      content: `${project.tags[0]?.name || '기술'} 기술 활용이 매우 잘 되어있습니다. 어떤 학습 리소스를 추천하시나요?`,
      projectId: project.id,
      authorId: 'user-comment-2',
      parentId: null,
      likeCount: Math.floor(Math.random() * 8) + 1,
      repliesCount: 1,
      createdAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000),
      author: {
        id: 'user-comment-2',
        username: 'dev_park',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      },
      isLiked: false,
      replies: [
        {
          id: `reply-${project.id}-1`,
          content: `좋은 질문이네요! 저는 공식 문서와 실습 프로젝트를 통해 학습했습니다. 도움이 필요하시면 언제든 연락주세요!`,
          projectId: project.id,
          authorId: project.author.id,
          parentId: `comment-${project.id}-2`,
          likeCount: Math.floor(Math.random() * 5) + 1,
          repliesCount: 0,
          createdAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
          author: {
            id: project.author.id,
            username: project.author.username,
            avatarUrl: project.author.avatarUrl
          },
          isLiked: false
        }
      ]
    }
  ]

  return {
    ...project,
    fullDescription,
    fullDescriptionHtml: `<p>${fullDescription}</p>`,
    fullDescriptionJson: null,
    screenshots,
    comments: sampleComments
  }
}

// Helper function to get project detail by ID
export const getProjectDetail = async (id: string): Promise<ProjectDetail | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // First check if we have explicit detailed data
  if (mockProjectDetails[id]) {
    return mockProjectDetails[id]
  }
  
  // If not found in detailed data, try to find in basic projects and generate detail
  const basicProject = mockProjects.find(project => project.id === id)
  if (basicProject) {
    return generateProjectDetail(basicProject)
  }
  
  // If project doesn't exist at all, return null
  return null
}