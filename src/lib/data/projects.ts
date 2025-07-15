import { Project, ProjectDetail } from '@/types/project'

export const mockProjects: Project[] = [
  {
    id: '1',
    title: '모던 UI 디자인 시스템',
    description: 'React와 Tailwind CSS로 구축된 종합적인 디자인 시스템으로, 재사용 가능한 컴포넌트와 다크 모드를 지원합니다.',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=240&fit=crop',
    author: {
      id: 'user1',
      name: '김사라',
      username: 'sarahdesigns',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    category: 'UI/UX 디자인',
    tags: ['React', 'Tailwind', '디자인 시스템'],
    likeCount: 234,
    viewCount: 1832,
    uploadDate: '2024-03-15',
    featured: true
  },
  {
    id: '2',
    title: '이커머스 대시보드 분석',
    description: '실시간 데이터 시각화와 종합적인 리포팅 도구를 갖춘 이커머스 분석용 인터랙티브 대시보드',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=240&fit=crop',
    author: {
      id: 'user2',
      name: '이준호',
      username: 'alexdev',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    category: '웹 개발',
    tags: ['JavaScript', 'D3.js', '분석'],
    likeCount: 189,
    viewCount: 1456,
    uploadDate: '2024-03-14'
  },
  {
    id: '3',
    title: '모바일 앱 프로토타입',
    description: '직관적인 사용자 경험을 제공하는 피트니스 추적 애플리케이션을 위한 세련된 모바일 앱 인터페이스 디자인',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=240&fit=crop',
    author: {
      id: 'user3',
      name: '김민지',
      username: 'emilyux',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    category: '모바일 디자인',
    tags: ['Figma', '모바일', '프로토타입'],
    likeCount: 312,
    viewCount: 2187,
    uploadDate: '2024-03-13',
    featured: true
  },
  {
    id: '4',
    title: 'AI 기반 코드 생성기',
    description: '자연어 설명으로부터 깔끔하고 최적화된 코드를 생성하는 머신러닝 도구',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=240&fit=crop',
    author: {
      id: 'user4',
      name: '김대현',
      username: 'davidai',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    category: '머신러닝',
    tags: ['Python', 'AI', 'NLP'],
    likeCount: 567,
    viewCount: 3421,
    uploadDate: '2024-03-12',
    featured: true
  },
  {
    id: '5',
    title: '블록체인 지갑 인터페이스',
    description: '고급 보안 기능을 갖춘 안전하고 사용자 친화적인 암호화폐 지갑 인터페이스',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=240&fit=crop',
    author: {
      id: 'user5',
      name: '박서연',
      username: 'mariaweb3',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
    },
    category: '블록체인',
    tags: ['Web3', 'React', '암호화폐'],
    likeCount: 423,
    viewCount: 2876,
    uploadDate: '2024-03-11'
  },
  {
    id: '6',
    title: '게임 포트폴리오 웹사이트',
    description: '인터랙티브 요소와 게임 미리보기 기능을 갖춘 인디 게임 개발자를 위한 동적 포트폴리오 쇼케이스',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=240&fit=crop',
    author: {
      id: 'user6',
      name: '최재원',
      username: 'jamesgames',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
    },
    category: '게임 개발',
    tags: ['Unity', 'C#', '포트폴리오'],
    likeCount: 298,
    viewCount: 1967,
    uploadDate: '2024-03-10'
  },
  {
    id: '7',
    title: '소셜 미디어 관리 도구',
    description: '스케줄링과 분석 기능을 갖춘 여러 소셜 미디어 계정 관리를 위한 종합 플랫폼',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=240&fit=crop',
    author: {
      id: 'user7',
      name: '이수진',
      username: 'lisasocial',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face'
    },
    category: '웹 개발',
    tags: ['Node.js', 'API', '소셜 미디어'],
    likeCount: 156,
    viewCount: 1234,
    uploadDate: '2024-03-09'
  },
  {
    id: '8',
    title: '날씨 시각화 앱',
    description: '멋진 시각화와 정확한 예보 데이터를 제공하는 아름다운 날씨 애플리케이션',
    thumbnail: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=240&fit=crop',
    author: {
      id: 'user8',
      name: '정민수',
      username: 'mikeweather',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face'
    },
    category: '데이터 시각화',
    tags: ['Vue.js', '날씨 API', '차트'],
    likeCount: 345,
    viewCount: 2543,
    uploadDate: '2024-03-08'
  },
  {
    id: '9',
    title: '헬스케어 관리 시스템',
    description: '환자 관리, 예약, 의료 기록을 위한 종합적인 헬스케어 플랫폼',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=240&fit=crop',
    author: {
      id: 'user9',
      name: '이지은 박사',
      username: 'drjenlee',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face'
    },
    category: '헬스케어',
    tags: ['HIPAA', '데이터베이스', '보안'],
    likeCount: 278,
    viewCount: 1876,
    uploadDate: '2024-03-07'
  },
  {
    id: '10',
    title: '부동산 플랫폼',
    description: '가상 투어, 부동산 비교, 모기지 계산기를 갖춘 현대적인 부동산 마켓플레이스',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=240&fit=crop',
    author: {
      id: 'user10',
      name: '강태현',
      username: 'robrealty',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    category: '부동산',
    tags: ['React', '지도 API', '금융'],
    likeCount: 412,
    viewCount: 3012,
    uploadDate: '2024-03-06',
    featured: true
  },
  {
    id: '11',
    title: '교육 학습 플랫폼',
    description: '비디오 강좌, 퀴즈, 진도 추적 기능을 갖춘 인터랙티브 온라인 학습 플랫폼',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=240&fit=crop',
    author: {
      id: 'user11',
      name: '윤하나',
      username: 'annaedu',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    category: '교육',
    tags: ['React', '비디오', '학습'],
    likeCount: 189,
    viewCount: 1543,
    uploadDate: '2024-03-05'
  },
  {
    id: '12',
    title: '작업 관리 대시보드',
    description: '칸반 보드, 시간 추적, 팀 협업 기능을 갖춘 협업 프로젝트 관리 도구',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=240&fit=crop',
    author: {
      id: 'user12',
      name: '최성민',
      username: 'chrispm',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    category: '생산성',
    tags: ['칸반', '팀', '애자일'],
    likeCount: 234,
    viewCount: 1876,
    uploadDate: '2024-03-04'
  },
  {
    id: '13',
    title: '음식 배달 앱 디자인',
    description: '레스토랑 검색, 주문 추적, 결제 통합 기능을 갖춘 현대적인 음식 배달 애플리케이션.',
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=240&fit=crop',
    author: {
      id: 'user13',
      name: '왕소피',
      username: 'sophieui',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    category: '모바일 디자인',
    tags: ['UI 디자인', '모바일', '음식'],
    likeCount: 367,
    viewCount: 2456,
    uploadDate: '2024-03-03'
  },
  {
    id: '14',
    title: '음악 스트리밍 인터페이스',
    description: '플레이리스트 관리, 발견 기능, 소셜 공유를 갖춘 우아한 음악 스트리밍 애플리케이션.',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=240&fit=crop',
    author: {
      id: 'user14',
      name: '마커스 톰슨',
      username: 'marcusmusic',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
    },
    category: '엔터테인먼트',
    tags: ['오디오', '스트리밍', '소셜'],
    likeCount: 445,
    viewCount: 3234,
    uploadDate: '2024-03-02'
  },
  {
    id: '15',
    title: '여행 계획 도우미',
    description: '일정 생성, 예약 통합, 현지 추천 기능을 갖춘 AI 기반 여행 계획 도구.',
    thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=240&fit=crop',
    author: {
      id: 'user15',
      name: '엘레나 로드리게스',
      username: 'elenatravel',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
    },
    category: '여행',
    tags: ['AI', '여행', '계획'],
    likeCount: 312,
    viewCount: 2187,
    uploadDate: '2024-03-01'
  },
  {
    id: '16',
    title: '피트니스 추적 앱',
    description: '운동 계획, 영양 추적, 진행 상황 분석 기능을 갖춘 종합 피트니스 애플리케이션.',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=240&fit=crop',
    author: {
      id: 'user16',
      name: '제이크 밀러',
      username: 'jakefit',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    category: '건강 & 피트니스',
    tags: ['건강', '모바일', '분석'],
    likeCount: 278,
    viewCount: 1987,
    uploadDate: '2024-02-29'
  },
  {
    id: '17',
    title: '사진 포트폴리오',
    description: '갤러리 관리와 클라이언트 예약 시스템을 갖춘 멋진 사진 포트폴리오 웹사이트.',
    thumbnail: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=240&fit=crop',
    author: {
      id: 'user17',
      name: '마야 파텔',
      username: 'mayaphoto',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face'
    },
    category: '사진',
    tags: ['포트폴리오', '갤러리', '예약'],
    likeCount: 456,
    viewCount: 3456,
    uploadDate: '2024-02-28',
    featured: true
  },
  {
    id: '18',
    title: '이벤트 관리 플랫폼',
    description: '티켓팅, 장소 예약, 참석자 관리 기능을 갖춘 완벽한 이벤트 관리 솔루션.',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=240&fit=crop',
    author: {
      id: 'user18',
      name: '톰 윌슨',
      username: 'tomevents',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face'
    },
    category: '이벤트 관리',
    tags: ['이벤트', '티켓팅', '관리'],
    likeCount: 234,
    viewCount: 1765,
    uploadDate: '2024-02-27'
  },
  {
    id: '19',
    title: '주식 거래 대시보드',
    description: '실시간 데이터, 기술적 분석, 포트폴리오 관리 기능을 갖춘 전문 거래 플랫폼.',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=240&fit=crop',
    author: {
      id: 'user19',
      name: '레이첼 그린',
      username: 'rachelfinance',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    category: '금융',
    tags: ['거래', '금융', '분석'],
    likeCount: 389,
    viewCount: 2678,
    uploadDate: '2024-02-26'
  },
  {
    id: '20',
    title: '채팅 애플리케이션 인터페이스',
    description: '종단 간 암호화, 파일 공유, 그룹 관리 기능을 갖춘 현대적인 메시징 애플리케이션.',
    thumbnail: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400&h=240&fit=crop',
    author: {
      id: 'user20',
      name: '케빈 창',
      username: 'kevinchat',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    category: '커뮤니케이션',
    tags: ['채팅', '보안', '실시간'],
    likeCount: 567,
    viewCount: 4123,
    uploadDate: '2024-02-25'
  },
  {
    id: '21',
    title: 'IoT 홈 자동화',
    description: '장치 관리, 자동화 규칙, 에너지 모니터링 기능을 갖춘 스마트 홈 제어 시스템.',
    thumbnail: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=240&fit=crop',
    author: {
      id: 'user21',
      name: '린다 데이비스',
      username: 'lindaiot',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    category: 'IoT',
    tags: ['IoT', '자동화', '스마트 홈'],
    likeCount: 298,
    viewCount: 2134,
    uploadDate: '2024-02-24'
  },
  {
    id: '22',
    title: '뉴스 집계 플랫폼',
    description: '개인화된 피드, 감정 분석, 팩트 체크 기능을 갖춘 지능형 뉴스 집계 서비스.',
    thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=240&fit=crop',
    author: {
      id: 'user22',
      name: '폴 앤더슨',
      username: 'paulnews',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    category: '뉴스 & 미디어',
    tags: ['뉴스', 'AI', '집계'],
    likeCount: 445,
    viewCount: 3567,
    uploadDate: '2024-02-23'
  },
  {
    id: '23',
    title: '레시피 공유 커뮤니티',
    description: '음식 애호가들이 레시피, 요리 팁, 미식 경험을 공유하는 소셜 플랫폼.',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=240&fit=crop',
    author: {
      id: 'user23',
      name: '이사벨라 로페즈',
      username: 'isabellacooks',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
    },
    category: '음식 & 요리',
    tags: ['레시피', '커뮤니티', '소셜'],
    likeCount: 356,
    viewCount: 2789,
    uploadDate: '2024-02-22'
  },
  {
    id: '24',
    title: '가상현실 체험',
    description: '인터랙티브 전시와 교육 콘텐츠를 갖춘 가상 박물관 투어를 위한 몰입형 VR 애플리케이션.',
    thumbnail: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=400&h=240&fit=crop',
    author: {
      id: 'user24',
      name: '김다니엘',
      username: 'danielvr',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
    },
    category: 'VR/AR',
    tags: ['VR', '교육', '박물관'],
    likeCount: 623,
    viewCount: 4567,
    uploadDate: '2024-02-21',
    featured: true
  },
  {
    id: '25',
    title: '언어 학습 앱',
    description: '음성 인식, 게임화, 문화적 몰입 기능을 갖춘 인터랙티브 언어 학습 플랫폼.',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=240&fit=crop',
    author: {
      id: 'user25',
      name: '다나카 유키',
      username: 'yukilang',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face'
    },
    category: '교육',
    tags: ['언어', '학습', '모바일'],
    likeCount: 478,
    viewCount: 3456,
    uploadDate: '2024-02-20'
  },
  {
    id: '26',
    title: '명상 & 마음챙김 앱',
    description: '가이드 세션, 진행 상황 추적, 주변 사운드스케이프 기능을 갖춘 편안한 명상 애플리케이션.',
    thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=240&fit=crop',
    author: {
      id: 'user26',
      name: '이선생',
      username: 'zenlee',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    category: '건강 & 웰빙',
    tags: ['명상', '웰빙', '마음챙김'],
    likeCount: 389,
    viewCount: 2987,
    uploadDate: '2024-02-19'
  },
  {
    id: '27',
    title: '증강현실 쇼핑',
    description: '고객이 제품을 자신의 환경에서 시각화할 수 있는 AR 기반 쇼핑 경험.',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=240&fit=crop',
    author: {
      id: 'user27',
      name: '알렉스 포스터',
      username: 'alexar',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    category: '이커머스',
    tags: ['AR', '쇼핑', '시각화'],
    likeCount: 512,
    viewCount: 3789,
    uploadDate: '2024-02-18'
  },
  {
    id: '28',
    title: '협업 디자인 도구',
    description: '버전 관리와 디자인 시스템을 갖춘 팀을 위한 실시간 협업 디자인 플랫폼.',
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=240&fit=crop',
    author: {
      id: 'user28',
      name: '류그레이스',
      username: 'gracedesign',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    category: '디자인 도구',
    tags: ['협업', '디자인', '팀'],
    likeCount: 267,
    viewCount: 1987,
    uploadDate: '2024-02-17'
  },
  {
    id: '29',
    title: '팟캐스트 발견 플랫폼',
    description: '개인화된 플레이리스트와 소셜 기능을 갖춘 AI 기반 팟캐스트 추천 엔진.',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=240&fit=crop',
    author: {
      id: 'user29',
      name: '마이크 로드리게스',
      username: 'mikepods',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face'
    },
    category: '엔터테인먼트',
    tags: ['팟캐스트', 'AI', '발견'],
    likeCount: 334,
    viewCount: 2456,
    uploadDate: '2024-02-16'
  },
  {
    id: '30',
    title: '탄소 발자국 추적기',
    description: '지속가능성 팁과 탄소 상쇄 마켓플레이스를 갖춘 환경 영향 추적 애플리케이션.',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=240&fit=crop',
    author: {
      id: 'user30',
      name: '엠마 톰슨',
      username: 'emmagreen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    category: '환경',
    tags: ['지속가능성', '환경', '추적'],
    likeCount: 445,
    viewCount: 3234,
    uploadDate: '2024-02-15'
  },
  {
    id: '31',
    title: '디지털 아트 마켓플레이스',
    description: '크리에이터 도구, 로열티 관리, 커뮤니티 기능을 갖춘 디지털 아티스트를 위한 NFT 마켓플레이스.',
    thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=240&fit=crop',
    author: {
      id: 'user31',
      name: '아티스틱 소울',
      username: 'artisticsoul',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
    },
    category: '디지털 아트',
    tags: ['NFT', '블록체인', '아트'],
    likeCount: 578,
    viewCount: 4123,
    uploadDate: '2024-02-14'
  },
  {
    id: '32',
    title: '스마트 예산 플래너',
    description: '비용 추적, 예산 최적화, 투자 조언 기능을 갖춘 지능형 개인 재무 관리.',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=240&fit=crop',
    author: {
      id: 'user32',
      name: '김재무',
      username: 'financeguru',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    category: '금융',
    tags: ['예산', '금융', '계획'],
    likeCount: 367,
    viewCount: 2789,
    uploadDate: '2024-02-13'
  },
  {
    id: '33',
    title: '가상 펫 시뮬레이터',
    description: '돌보기 메커니즘, 커스터마이제이션, 소셜 상호작용을 갖춘 사랑스러운 가상 펫 게임.',
    thumbnail: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=240&fit=crop',
    author: {
      id: 'user33',
      name: '박애견',
      username: 'petlover',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face'
    },
    category: '게임',
    tags: ['게임', '펫', '시뮬레이션'],
    likeCount: 456,
    viewCount: 3456,
    uploadDate: '2024-02-12'
  },
  {
    id: '34',
    title: '프리랜서 관리 허브',
    description: '프로젝트 관리, 클라이언트 커뮤니케이션, 송장 생성 기능을 갖춘 완벽한 프리랜서 워크스페이스.',
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=240&fit=crop',
    author: {
      id: 'user34',
      name: '최프로',
      username: 'freelancepro',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    category: '비즈니스',
    tags: ['프리랜서', '관리', '비즈니스'],
    likeCount: 289,
    viewCount: 2134,
    uploadDate: '2024-02-11'
  },
  {
    id: '35',
    title: '식물 관리 알림 앱',
    description: '식물 식별, 관리 일정, 성장 추적 기능을 갖춘 정원 관리 애플리케이션.',
    thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=240&fit=crop',
    author: {
      id: 'user35',
      name: '정원사',
      username: 'greenthumb',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    category: '라이프스타일',
    tags: ['식물', '정원', '관리'],
    likeCount: 378,
    viewCount: 2876,
    uploadDate: '2024-02-10'
  },
  {
    id: '36',
    title: '코드 리뷰 플랫폼',
    description: 'AI 기반 제안, 협업 기능, 품질 메트릭스를 갖춘 고급 코드 리뷰 도구.',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=240&fit=crop',
    author: {
      id: 'user36',
      name: '코드마스터',
      username: 'codemaster',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
    },
    category: '개발자 도구',
    tags: ['코드 리뷰', 'AI', '개발'],
    likeCount: 523,
    viewCount: 3789,
    uploadDate: '2024-02-09'
  },
  {
    id: '37',
    title: '레시피 영양 분석기',
    description: '영양 분석, 식이 제한, 식단 계획 기능을 갖춘 건강 중심 요리 앱.',
    thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=240&fit=crop',
    author: {
      id: 'user37',
      name: '건강요리사',
      username: 'healthychef',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    category: '건강 & 영양',
    tags: ['영양', '건강', '요리'],
    likeCount: 412,
    viewCount: 3012,
    uploadDate: '2024-02-08'
  },
  {
    id: '38',
    title: '가상 교실 플랫폼',
    description: '라이브 수업, 과제, 학생 참여 도구를 갖춘 인터랙티브 온라인 교육 플랫폼.',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=240&fit=crop',
    author: {
      id: 'user38',
      name: '교육혁신가',
      username: 'eduinnovator',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    category: '교육',
    tags: ['교육', '가상', '교실'],
    likeCount: 345,
    viewCount: 2543,
    uploadDate: '2024-02-07'
  },
  {
    id: '39',
    title: '습관 추적 저널',
    description: '습관 추적, 목표 설정, 진행 상황 시각화 기능을 갖춘 개인 개발 앱.',
    thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=240&fit=crop',
    author: {
      id: 'user39',
      name: '습관개발자',
      username: 'habitbuilder',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face'
    },
    category: '생산성',
    tags: ['습관', '목표', '생산성'],
    likeCount: 267,
    viewCount: 1987,
    uploadDate: '2024-02-06'
  },
  {
    id: '40',
    title: '와인 테이스팅 컴패니언',
    description: '테이스팅 노트, 셀러 관리, 페어링 추천 기능을 갖춘 세련된 와인 추적 앱.',
    thumbnail: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=240&fit=crop',
    author: {
      id: 'user40',
      name: '와인애호가',
      username: 'wineconnois',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face'
    },
    category: '음식 & 음료',
    tags: ['와인', '테이스팅', '커렉션'],
    likeCount: 389,
    viewCount: 2678,
    uploadDate: '2024-02-05'
  },
  {
    id: '41',
    title: '시간대 조정 도구',
    description: '시간대 관리, 회의 일정, 가용성 추적 기능을 갖춘 글로벌 팀 조정 앱.',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=240&fit=crop',
    author: {
      id: 'user41',
      name: '글로벌코디네이터',
      username: 'globalcoord',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    category: '생산성',
    tags: ['시간대', '팀', '일정'],
    likeCount: 234,
    viewCount: 1765,
    uploadDate: '2024-02-04'
  },
  {
    id: '42',
    title: '암호화폐 포트폴리오 트래커',
    description: '실시간 가격, 뉴스, 세금 보고 기능을 갖춘 종합 암호화폐 포트폴리오 관리.',
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=240&fit=crop',
    author: {
      id: 'user42',
      name: '크립토트레이더',
      username: 'cryptotrader',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    category: '금융',
    tags: ['암호화폐', '포트폴리오', '거래'],
    likeCount: 578,
    viewCount: 4123,
    uploadDate: '2024-02-03'
  },
  {
    id: '43',
    title: '꿈 일기 & 분석',
    description: 'AI 기반 분석, 패턴 인식, 자각몽 도구를 갖춘 개인 꿈 추적 앱.',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=240&fit=crop',
    author: {
      id: 'user43',
      name: '꿈분석가',
      username: 'dreamanalyst',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
    },
    category: '웰니스',
    tags: ['꿈', 'AI', '심리학'],
    likeCount: 456,
    viewCount: 3456,
    uploadDate: '2024-02-02'
  },
  {
    id: '44',
    title: '로컬 비즈니스 디렉토리',
    description: '리뷰, 이벤트, 로컬 추천 기능을 갖춘 커뮤니티 중심 비즈니스 발견 플랫폼.',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=240&fit=crop',
    author: {
      id: 'user44',
      name: '로컬탐험가',
      username: 'localexplorer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    category: '로컬 비즈니스',
    tags: ['로컬', '비즈니스', '커뮤니티'],
    likeCount: 312,
    viewCount: 2187,
    uploadDate: '2024-02-01'
  },
  {
    id: '45',
    title: 'AI 글쓰기 도우미',
    description: '문법 검사, 스타일 제안, 창의적 글쓰기 프롬프트 기능을 갖춘 고급 글쓰기 도구.',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=240&fit=crop',
    author: {
      id: 'user45',
      name: '글쓰기달인',
      username: 'writingpro',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    category: '글쓰기 도구',
    tags: ['AI', '글쓰기', '문법'],
    likeCount: 523,
    viewCount: 3789,
    uploadDate: '2024-01-31',
    featured: true
  },
  {
    id: '46',
    title: '스마트 홈 에너지 모니터',
    description: '최적화 제안과 재생 에너지 통합 기능을 갖춘 에너지 소비 추적 시스템.',
    thumbnail: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=240&fit=crop',
    author: {
      id: 'user46',
      name: '에너지세이버',
      username: 'energysaver',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face'
    },
    category: '스마트 홈',
    tags: ['에너지', 'IoT', '지속가능성'],
    likeCount: 367,
    viewCount: 2789,
    uploadDate: '2024-01-30'
  },
  {
    id: '47',
    title: '비디오 게임 리뷰 플랫폼',
    description: '리뷰, 스트리밍 통합, 업적 추적 기능을 갖춘 커뮤니티 주도 게임 플랫폼.',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=240&fit=crop',
    author: {
      id: 'user47',
      name: '게임리뷰어',
      username: 'gamereviewer',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face'
    },
    category: '게임',
    tags: ['게임', '리뷰', '커뮤니티'],
    likeCount: 445,
    viewCount: 3234,
    uploadDate: '2024-01-29'
  },
  {
    id: '48',
    title: '정신 건강 지원 앱',
    description: '기분 추적, 대처 전략, 전문가 리소스를 갖춘 따뜻한 정신 건강 플랫폼.',
    thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=240&fit=crop',
    author: {
      id: 'user48',
      name: '웰니스가이드',
      username: 'wellnessguide',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    category: '정신 건강',
    tags: ['정신 건강', '웰니스', '지원'],
    likeCount: 678,
    viewCount: 4567,
    uploadDate: '2024-01-28'
  },
  {
    id: '49',
    title: '온라인 마켓플레이스 빌더',
    description: '결제 처리와 벤더 관리 기능을 갖춘 맞춤형 온라인 마켓플레이스를 만드는 노코드 플랫폼.',
    thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=240&fit=crop',
    author: {
      id: 'user49',
      name: '마켓메이커',
      username: 'marketmaker',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    category: '이커머스',
    tags: ['마켓플레이스', '노코드', '플랫폼'],
    likeCount: 389,
    viewCount: 2876,
    uploadDate: '2024-01-27'
  },
  {
    id: '50',
    title: '지속가능한 생활 트래커',
    description: '탄소 추적, 지속가능한 제품 추천, 그린 챌린지 기능을 갖춘 친환경 라이프스타일 앱.',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=240&fit=crop',
    author: {
      id: 'user50',
      name: '에코워리어',
      username: 'ecowarrior',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    category: '환경',
    tags: ['지속가능성', '에코', '라이프스타일'],
    likeCount: 534,
    viewCount: 3678,
    uploadDate: '2024-01-26'
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
    fullDescription: `Modern UI Design System은 현대적인 웹 애플리케이션을 위한 포괄적인 디자인 시스템입니다. 

이 프로젝트는 재사용 가능한 컴포넌트 라이브러리, 일관된 디자인 토큰, 그리고 완벽한 다크 모드 지원을 제공합니다. 

개발자와 디자이너가 협업하여 빠르고 일관된 사용자 인터페이스를 구축할 수 있도록 도와줍니다.`,
    screenshots: [
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop'
    ],
    liveUrl: 'https://design-system-demo.vercel.app',
    githubUrl: 'https://github.com/sarahdesigns/modern-ui-system',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Storybook', 'Figma'],
    features: [
      '50개 이상의 재사용 가능한 컴포넌트',
      '다크 모드 자동 전환 지원',
      '접근성 우선 설계 (WCAG 2.1 준수)',
      'Storybook 기반 컴포넌트 문서화',
      'Figma와 완벽 동기화된 디자인 토큰'
    ],
    comments: [
      {
        id: 'c1',
        author: {
          id: 'user100',
          name: '김개발',
          username: 'kimdev',
          avatar: '' // 빈 아바타로 테스트
        },
        content: '정말 멋진 디자인 시스템이네요! 특히 다크 모드 전환이 매끄럽습니다.',
        createdAt: '2024-03-16T10:30:00Z',
        likeCount: 5
      },
      {
        id: 'c2',
        author: {
          id: 'user101',
          name: '박디자이너',
          username: 'parkdesigner',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
        },
        content: 'Figma와의 동기화 기능이 인상적입니다. 혹시 토큰 관리는 어떻게 하셨나요?',
        createdAt: '2024-03-16T14:15:00Z',
        likeCount: 3,
        replies: [
          {
            id: 'c2-1',
            author: {
              id: 'user1',
              name: 'Sarah Chen',
              username: 'sarahdesigns',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
            },
            content: 'Design Tokens Studio 플러그인을 사용해서 JSON 형태로 관리하고 있어요! 자세한 내용은 GitHub 리드미에서 확인하실 수 있습니다.',
            createdAt: '2024-03-16T15:20:00Z',
            likeCount: 2
          }
        ]
      }
    ]
  },
  '2': {
    ...mockProjects[1],
    fullDescription: `E-commerce Dashboard Analytics는 전자상거래 비즈니스를 위한 종합적인 분석 대시보드입니다.

실시간 데이터 시각화, 매출 분석, 고객 행동 패턴 분석, 재고 관리 등 온라인 비즈니스 운영에 필요한 모든 지표를 한눈에 볼 수 있습니다.

데이터 기반 의사결정을 지원하는 강력한 리포팅 도구와 예측 분석 기능을 제공합니다.`,
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?w=800&h=600&fit=crop'
    ],
    liveUrl: 'https://ecommerce-analytics-demo.vercel.app',
    githubUrl: 'https://github.com/alexdev/ecommerce-analytics',
    techStack: ['JavaScript', 'D3.js', 'Node.js', 'MongoDB', 'Chart.js'],
    features: [
      '실시간 매출 및 주문 모니터링',
      '고객 세그멘테이션 및 코호트 분석',
      '상품별 성과 분석 및 추천',
      '재고 최적화 알고리즘',
      'PDF/Excel 리포트 자동 생성'
    ],
    comments: []
  }
}

// Helper function to get project detail by ID
export const getProjectDetail = async (id: string): Promise<ProjectDetail | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return mockProjectDetails[id] || null
}