'use server'

import { getProjectsByAuthor, type ProjectsResponse } from '@/lib/mock-api/projects'

export interface GetProjectsByUserIdOptions {
  page?: number
  limit?: number
  sortBy?: 'latest' | 'popular' | 'updated'
}

export interface GetProjectsByUserIdResult {
  success: boolean
  data?: ProjectsResponse
  error?: string
}

/**
 * 특정 사용자의 프로젝트 목록을 조회합니다
 */
export async function getProjectsByUserId(
  userId: string, 
  options: GetProjectsByUserIdOptions = {}
): Promise<GetProjectsByUserIdResult> {
  try {
    const {
      page = 1,
      limit = 9
    } = options

    if (!userId) {
      return {
        success: false,
        error: '사용자 ID가 필요합니다'
      }
    }

    const result = await getProjectsByAuthor(userId, page, limit)
    
    return {
      success: true,
      data: result
    }

  } catch (error) {
    console.error('사용자 프로젝트 조회 오류:', error)
    return {
      success: false,
      error: '프로젝트 조회 중 오류가 발생했습니다'
    }
  }
}

/**
 * 사용자가 작성한 프로젝트 개수를 조회합니다
 */
export async function getUserProjectCount(userId: string): Promise<number> {
  try {
    if (!userId) return 0
    
    const result = await getProjectsByAuthor(userId, 1, 1000) // 큰 수를 사용해서 전체 개수 조회
    return result.totalCount
    
  } catch (error) {
    console.error('사용자 프로젝트 개수 조회 오류:', error)
    return 0
  }
}