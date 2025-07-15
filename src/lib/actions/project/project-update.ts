'use server'

import { revalidatePath } from 'next/cache'
import { uuidv7 } from 'uuidv7'
import { prisma } from '@/lib/prisma/client'
import { createProjectSchema } from '@/lib/validations/project'
import { createClient } from '@/lib/supabase/server'
import type { ProjectFormData } from '@/components/project/project-form'

export async function updateProject(projectId: string, formData: ProjectFormData) {
  try {
    // 사용자 인증 확인
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // 프로젝트 소유자 확인
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
      select: { authorId: true }
    })

    if (!existingProject) {
      return { success: false, error: '프로젝트를 찾을 수 없습니다' }
    }

    if (existingProject.authorId !== user.id) {
      return { success: false, error: '프로젝트를 수정할 권한이 없습니다' }
    }

    // 유효성 검증
    const validationResult = createProjectSchema.safeParse(formData)
    if (!validationResult.success) {
      return { 
        success: false, 
        error: '입력 데이터가 유효하지 않습니다',
        validationErrors: validationResult.error.issues
      }
    }

    const validatedData = validationResult.data

    // 트랜잭션으로 프로젝트 업데이트
    const result = await prisma.$transaction(async (tx) => {
      // 1. 프로젝트 기본 정보 업데이트
      const updatedProject = await tx.project.update({
        where: { id: projectId },
        data: {
          title: validatedData.title,
          excerpt: validatedData.description,
          description: validatedData.description,
          fullDescription: validatedData.fullDescription || null,
          fullDescriptionJson: validatedData.fullDescriptionJson ? JSON.parse(validatedData.fullDescriptionJson) : null,
          fullDescriptionHtml: validatedData.fullDescriptionHtml || null,
          category: validatedData.category,
          images: validatedData.screenshots,
          demoUrl: validatedData.demoUrl || null,
          githubUrl: validatedData.githubUrl || null,
          features: validatedData.features,
          updatedAt: new Date()
        }
      })

      // 2. 기존 태그 관계 삭제
      await tx.projectTag.deleteMany({
        where: { projectId: projectId }
      })

      // 3. 새 태그 처리
      if (validatedData.tags && validatedData.tags.length > 0) {
        for (const tagName of validatedData.tags) {
          // 태그 생성 또는 조회
          const tag = await tx.tag.upsert({
            where: { name: tagName },
            update: {},
            create: {
              id: uuidv7(),
              name: tagName,
                          }
          })

          // 프로젝트-태그 관계 생성
          await tx.projectTag.create({
            data: {
              id: uuidv7(),
              projectId: projectId,
              tagId: tag.id
            }
          })
        }
      }

      return updatedProject
    })

    // 관련 페이지 재검증
    revalidatePath(`/project/${projectId}`)
    revalidatePath('/') // 메인 페이지 프로젝트 목록
    
    return { 
      success: true, 
      projectId: result.id,
      message: '프로젝트가 성공적으로 수정되었습니다' 
    }

  } catch (error) {
    console.error('프로젝트 수정 오류:', error)
    return { 
      success: false, 
      error: '프로젝트 수정 중 오류가 발생했습니다' 
    }
  }
}