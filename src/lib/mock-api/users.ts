import { User } from '@/types/user'
import { mockUsers } from '@/lib/data/users'

// 전체 사용자 목록 조회
export async function getUsers(): Promise<User[]> {
  await new Promise(resolve => setTimeout(resolve, 500)) // 네트워크 지연 시뮬레이션
  return mockUsers
}

// 특정 사용자 조회 (ID로)
export async function getUserById(id: string): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 300))
  const user = mockUsers.find(user => user.id === id)
  return user || null
}

// 특정 사용자 조회 (username으로)
export async function getUserByUsername(username: string): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 300))
  const user = mockUsers.find(user => user.username === username)
  return user || null
}

// 사용자 검색
export async function searchUsers(query: string): Promise<User[]> {
  await new Promise(resolve => setTimeout(resolve, 400))
  const lowercaseQuery = query.toLowerCase()
  
  return mockUsers.filter(user => 
    user.username.toLowerCase().includes(lowercaseQuery) ||
    user.email.toLowerCase().includes(lowercaseQuery) ||
    user.bio?.toLowerCase().includes(lowercaseQuery)
  )
}

// 사용자 생성
export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  mockUsers.push(newUser)
  return newUser
}

// 사용자 정보 업데이트
export async function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const userIndex = mockUsers.findIndex(user => user.id === id)
  if (userIndex === -1) return null
  
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...updates,
    updatedAt: new Date()
  }
  
  return mockUsers[userIndex]
}

// 사용자 삭제
export async function deleteUser(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 400))
  
  const userIndex = mockUsers.findIndex(user => user.id === id)
  if (userIndex === -1) return false
  
  mockUsers.splice(userIndex, 1)
  return true
}