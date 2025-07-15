'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { createProjectSchema, type CreateProjectData } from '@/lib/validations/project'
import { z } from 'zod'
import { redirect } from 'next/navigation'

export async function createProject(data: CreateProjectData) {
  try {
    // 1. 데이터 검증
    const validatedData = createProjectSchema.parse(data)
    
    // 2. 사용자 인증 확인
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // 3. 트랜잭션으로 프로젝트 생성
    const result = await prisma.$transaction(async (tx) => {
      // 프로젝트 ID 생성
      const projectId = crypto.randomUUID()
      
      // 스크린샷 이미지 배열
      const allImages = validatedData.screenshots.filter(Boolean)
      
      // 프로젝트 생성
      const project = await tx.project.create({
        data: {
          id: projectId,
          title: validatedData.title,
          excerpt: validatedData.description,
          description: validatedData.fullDescription || '',
          fullDescription: validatedData.fullDescription || null,
          fullDescriptionJson: validatedData.fullDescriptionJson ? JSON.parse(validatedData.fullDescriptionJson) : null,
          fullDescriptionHtml: validatedData.fullDescriptionHtml || null,
          category: validatedData.category,
          images: allImages,
          demoUrl: validatedData.demoUrl || null,
          githubUrl: validatedData.githubUrl || null,
          features: validatedData.features,
          authorId: user.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      // 태그와 기술스택 처리
      const allTagNames = [...validatedData.techStack, ...validatedData.tags]
        .filter(Boolean)
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      if (allTagNames.length > 0) {
        // 기존 태그 조회
        const existingTags = await tx.tag.findMany({
          where: { 
            name: { in: allTagNames }
          }
        })

        // 새로 생성할 태그들
        const existingTagNames = existingTags.map(tag => tag.name)
        const newTagNames = allTagNames.filter(name => !existingTagNames.includes(name))

        // 새 태그 생성
        const newTags = []
        for (const tagName of newTagNames) {
          const tag = await tx.tag.create({
            data: {
              id: crypto.randomUUID(),
              name: tagName,
              slug: tagName.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-'),
              createdAt: new Date()
            }
          })
          newTags.push(tag)
        }

        // 모든 태그 (기존 + 새로생성)
        const allTags = [...existingTags, ...newTags]

        // 기술스택 관계 생성
        const techStackTags = allTags.filter(tag => 
          validatedData.techStack.includes(tag.name)
        )
        for (const tag of techStackTags) {
          await tx.projectTechStack.create({
            data: {
              id: crypto.randomUUID(),
              projectId: project.id,
              tagId: tag.id,
              createdAt: new Date()
            }
          })
        }

        // 일반 태그 관계 생성
        const normalTags = allTags.filter(tag => 
          validatedData.tags.includes(tag.name)
        )
        for (const tag of normalTags) {
          await tx.projectTag.create({
            data: {
              id: crypto.randomUUID(),
              projectId: project.id,
              tagId: tag.id,
              createdAt: new Date()
            }
          })
        }
      }

      return project
    })

    return { success: true, projectId: result.id }

  } catch (error: unknown) {
    console.error('프로젝트 생성 오류:', error)
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.issues[0]?.message || '입력 데이터가 올바르지 않습니다' 
      }
    }
    
    // Prisma 에러 처리
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return { success: false, error: '이미 존재하는 프로젝트 제목입니다' }
      }
    }
    
    return { success: false, error: '프로젝트 생성 중 오류가 발생했습니다' }
  }
}

// 프로젝트 생성 후 리다이렉트 함수
export async function createProjectAndRedirect(data: CreateProjectData) {
  const result = await createProject(data)
  
  if (result.success && result.projectId) {
    redirect(`/project/${result.projectId}`)
  }
  
  return result
}