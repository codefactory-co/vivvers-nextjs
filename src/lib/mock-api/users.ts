export interface User {
  id: string
  username: string
  email: string
  avatarUrl: string | null
  bio: string | null
  socialLinks: Record<string, string> | null
  skills: string[]
  experience: string | null
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile extends User {
  totalLikes: number
  totalViews: number
  totalComments: number
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  verifiedUsers: number
  newUsersThisMonth: number
}

// Mock 사용자 데이터
export const MOCK_USERS: User[] = [
  {
    id: 'user1',
    username: 'devkim',
    email: 'devkim@example.com',
    avatarUrl: '/api/placeholder/40/40',
    bio: '풀스택 개발자입니다. React와 Node.js를 주로 사용합니다.',
    socialLinks: {
      website: 'https://devkim.dev',
      github: 'https://github.com/devkim',
      linkedin: 'https://linkedin.com/in/devkim'
    },
    skills: ['React', 'Node.js', 'TypeScript', 'Next.js'],
    experience: '5년차 풀스택 개발자',
    isPublic: true,
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'user2',
    username: 'codepark',
    email: 'codepark@example.com',
    avatarUrl: '/api/placeholder/40/40',
    bio: '프론트엔드 개발자. 아름다운 UI를 만들어요.',
    socialLinks: {
      website: 'https://codepark.dev',
      github: 'https://github.com/codepark'
    },
    skills: ['Vue.js', 'CSS', 'JavaScript', 'Figma'],
    experience: '3년차 프론트엔드 개발자',
    isPublic: true,
    createdAt: new Date('2023-08-22'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: 'user3',
    username: 'mobilechoi',
    email: 'mobilechoi@example.com',
    avatarUrl: '/api/placeholder/40/40',
    bio: '모바일 앱 개발 전문가. Flutter와 React Native 사용.',
    socialLinks: {
      github: 'https://github.com/mobilechoi',
      twitter: 'https://twitter.com/mobilechoi'
    },
    skills: ['Flutter', 'React Native', 'Dart', 'Swift'],
    experience: '7년차 모바일 앱 개발자',
    isPublic: true,
    createdAt: new Date('2023-10-10'),
    updatedAt: new Date('2024-01-18')
  }
]

// 사용자 조회 함수들
export function getAllUsers(): User[] {
  return MOCK_USERS
}

export function getUserById(id: string): User | undefined {
  return MOCK_USERS.find(user => user.id === id)
}

export function getUserByUsername(username: string): User | undefined {
  return MOCK_USERS.find(user => user.username === username)
}

export function getUserByEmail(email: string): User | undefined {
  return MOCK_USERS.find(user => user.email === email)
}

export function searchUsers(query: string): User[] {
  const lowercaseQuery = query.toLowerCase()
  return MOCK_USERS.filter(user =>
    user.username.toLowerCase().includes(lowercaseQuery) ||
    user.bio?.toLowerCase().includes(lowercaseQuery) ||
    user.skills.some(skill => skill.toLowerCase().includes(lowercaseQuery))
  )
}

// API 함수들
export async function getUser(id: string): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 50))
  return getUserById(id) || null
}

export async function getUserByUsernameApi(username: string): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return getUserByUsername(username) || null
}

export async function getUserProfile(username: string): Promise<UserProfile | null> {
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const user = getUserByUsername(username)
  if (!user) return null

  // 실제로는 데이터베이스에서 통계 계산
  const userProfile: UserProfile = {
    ...user,
    totalLikes: 105, // Mock 데이터
    totalViews: 2340,
    totalComments: 87
  }

  return userProfile
}

export async function getUsers(page: number = 1, limit: number = 20): Promise<{
  users: User[]
  totalCount: number
  totalPages: number
  currentPage: number
}> {
  await new Promise(resolve => setTimeout(resolve, 100))

  const users = getAllUsers()
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedUsers = users.slice(startIndex, endIndex)

  return {
    users: paginatedUsers,
    totalCount: users.length,
    totalPages: Math.ceil(users.length / limit),
    currentPage: page
  }
}

export async function searchUsersApi(query: string): Promise<User[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return searchUsers(query)
}

export async function getUserStats(): Promise<UserStats> {
  await new Promise(resolve => setTimeout(resolve, 50))
  
  const users = getAllUsers()
  const now = new Date()
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

  return {
    totalUsers: users.length,
    activeUsers: users.filter(user => user.updatedAt > oneMonthAgo).length,
    verifiedUsers: users.filter(user => user.isPublic).length, // isPublic을 verified로 간주
    newUsersThisMonth: users.filter(user => user.createdAt > oneMonthAgo).length
  }
}

export interface CreateUserData {
  username: string
  email: string
  avatarUrl?: string | null
  bio?: string | null
  socialLinks?: Record<string, string> | null
  skills?: string[]
  experience?: string | null
  isPublic?: boolean
}

export interface UpdateUserData extends Partial<CreateUserData> {
  id: string
}

export async function createUser(data: CreateUserData): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 200))

  const newUser: User = {
    id: `user_${Date.now()}`,
    username: data.username,
    email: data.email,
    avatarUrl: data.avatarUrl || null,
    bio: data.bio || null,
    socialLinks: data.socialLinks || null,
    skills: data.skills || [],
    experience: data.experience || null,
    isPublic: data.isPublic !== undefined ? data.isPublic : true,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  MOCK_USERS.push(newUser)
  return newUser
}

export async function updateUser(data: UpdateUserData): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 200))

  const userIndex = MOCK_USERS.findIndex(u => u.id === data.id)
  if (userIndex === -1) return null

  const updatedUser = {
    ...MOCK_USERS[userIndex],
    ...data,
    updatedAt: new Date()
  }

  MOCK_USERS[userIndex] = updatedUser
  return updatedUser
}

export async function deleteUser(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200))

  const userIndex = MOCK_USERS.findIndex(u => u.id === id)
  if (userIndex === -1) return false

  MOCK_USERS.splice(userIndex, 1)
  return true
}

// Follow 시스템은 별도의 테이블/서비스로 구현 예정
// 현재는 기본적인 User CRUD만 지원

export async function followUser(followerId: string, followingId: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 100))

  const follower = MOCK_USERS.find(u => u.id === followerId)
  const following = MOCK_USERS.find(u => u.id === followingId)

  if (!follower || !following) return false

  // TODO: 실제로는 별도의 UserFollow 테이블에 레코드 생성
  console.log(`User ${followerId} is now following ${followingId}`)

  return true
}

export async function unfollowUser(followerId: string, followingId: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 100))

  const follower = MOCK_USERS.find(u => u.id === followerId)
  const following = MOCK_USERS.find(u => u.id === followingId)

  if (!follower || !following) return false

  // TODO: 실제로는 UserFollow 테이블에서 레코드 삭제
  console.log(`User ${followerId} unfollowed ${followingId}`)

  return true
}