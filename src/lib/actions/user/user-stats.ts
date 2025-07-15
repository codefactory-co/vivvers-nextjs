'use server'

import { prisma } from '@/lib/prisma/client'
import type { UserStats } from '@/types/user'

export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    // Query 1: Count user's projects
    const projectCount = await prisma.project.count({
      where: { authorId: userId }
    })

    // Query 2: Count likes on user's projects
    const totalLikes = await prisma.projectLike.count({
      where: {
        project: { authorId: userId }
      }
    })

    return {
      projectCount,
      totalLikes,
      followerCount: 0, // No follow system yet
      followingCount: 0 // No follow system yet
    }
  } catch (error) {
    console.error('사용자 통계 조회 오류:', error)
    return {
      projectCount: 0,
      totalLikes: 0,
      followerCount: 0,
      followingCount: 0
    }
  }
}