'use server'

import { prisma } from '@/lib/prisma/client'
import { z } from 'zod'
import { tagSchema } from '@/lib/validations/project'
import { randomUUID } from 'crypto'

const searchTagsSchema = z.object({
  query: z.string().min(1, '검색어를 입력해주세요').max(50),
  limit: z.number().int().positive().max(50).default(10),
  offset: z.number().int().nonnegative().default(0)
})

export type SearchTagsInput = z.infer<typeof searchTagsSchema>

export async function searchTags(input: SearchTagsInput) {
  try {
    const { query, limit, offset } = searchTagsSchema.parse(input)
    
    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            projectTags: true,
            projectTechStacks: true
          }
        }
      },
      take: limit,
      skip: offset,
      orderBy: [
        {
          name: 'asc'
        }
      ]
    })
    
    const formattedTags = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      usageCount: tag._count.projectTags + tag._count.projectTechStacks
    }))
    
    const totalCount = await prisma.tag.count({
      where: {
        name: {
          contains: query,
          mode: 'insensitive'
        }
      }
    })
    
    return {
      success: true,
      data: {
        tags: formattedTags,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount
        }
      }
    }
    
  } catch (error) {
    console.error('태그 검색 오류:', error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || '입력 데이터가 올바르지 않습니다'
      }
    }
    
    return {
      success: false,
      error: '태그 검색 중 오류가 발생했습니다'
    }
  }
}


export async function searchTagsByExactName(name: string) {
  try {
    const tag = await prisma.tag.findUnique({
      where: {
        name: name
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            projectTags: true,
            projectTechStacks: true
          }
        }
      }
    })
    
    if (!tag) {
      return {
        success: false,
        error: '태그를 찾을 수 없습니다'
      }
    }
    
    return {
      success: true,
      data: {
        id: tag.id,
        name: tag.name,
          usageCount: tag._count.projectTags + tag._count.projectTechStacks
      }
    }
    
  } catch (error) {
    console.error('태그 조회 오류:', error)
    return {
      success: false,
      error: '태그 조회 중 오류가 발생했습니다'
    }
  }
}

export async function getPopularTags(limit: number = 20) {
  try {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            projectTags: true,
            projectTechStacks: true
          }
        }
      },
      take: limit
    })
    
    const tagsWithUsageCount = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      usageCount: tag._count.projectTags + tag._count.projectTechStacks
    }))
    
    const sortedTags = tagsWithUsageCount.sort((a, b) => b.usageCount - a.usageCount)
    
    return {
      success: true,
      data: sortedTags
    }
    
  } catch (error) {
    console.error('인기 태그 조회 오류:', error)
    return {
      success: false,
      error: '인기 태그 조회 중 오류가 발생했습니다'
    }
  }
}

export async function createOrFindTag(name: string) {
  try {
    // 태그 유효성 검사
    const validatedTag = tagSchema.parse(name)
    
    // 기존 태그가 있는지 확인
    const existingTag = await prisma.tag.findUnique({
      where: {
        name: validatedTag
      }
    })
    
    if (existingTag) {
      return {
        success: true,
        data: existingTag
      }
    }
    
    // 새 태그 생성
    const newTag = await prisma.tag.create({
      data: {
        id: randomUUID(),
        name: validatedTag
      }
    })
    
    return {
      success: true,
      data: newTag
    }
    
  } catch (error) {
    console.error('태그 생성 오류:', error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || '유효하지 않은 태그입니다'
      }
    }
    
    return {
      success: false,
      error: '태그 생성 중 오류가 발생했습니다'
    }
  }
}