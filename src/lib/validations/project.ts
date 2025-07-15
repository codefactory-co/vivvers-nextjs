import { z } from 'zod'

// 카테고리 목록
export const PROJECT_CATEGORIES = [
  '웹 개발',
  '모바일 앱', 
  'AI/ML',
  '블록체인',
  'UI/UX',
  '게임',
  '데이터'
] as const

// 프로젝트 생성 스키마
export const createProjectSchema = z.object({
  title: z.string()
    .min(1, '제목을 입력하세요')
    .max(100, '제목은 최대 100자까지 가능합니다'),
  description: z.string()
    .min(1, '간단한 설명을 입력하세요')
    .max(200, '설명은 최대 200자까지 가능합니다'),
  fullDescription: z.string()
    .max(5000, '상세 설명은 최대 5000자까지 가능합니다')
    .optional()
    .or(z.literal('')),
  fullDescriptionJson: z.string()
    .max(20000, 'JSON 데이터가 너무 큽니다')
    .optional()
    .or(z.literal('')),
  fullDescriptionHtml: z.string()
    .max(20000, 'HTML 데이터가 너무 큽니다')
    .optional()
    .or(z.literal('')),
  category: z.string()
    .min(1, '카테고리를 선택하세요')
    .refine(
      (value): value is typeof PROJECT_CATEGORIES[number] => 
        PROJECT_CATEGORIES.includes(value as typeof PROJECT_CATEGORIES[number]),
      { message: '유효한 카테고리를 선택하세요' }
    ),
  screenshots: z.array(z.string().url())
    .min(1, '스크린샷을 최소 1개 이상 업로드하세요')
    .max(10, '스크린샷은 최대 10개까지 가능합니다'),
  demoUrl: z.string()
    .url('올바른 URL 형식이 아닙니다')
    .optional()
    .or(z.literal('')),
  githubUrl: z.string()
    .url('올바른 URL 형식이 아닙니다')
    .optional()
    .or(z.literal('')),
  techStack: z.array(z.string())
    .max(15, '기술 스택은 최대 15개까지 가능합니다')
    .default([]),
  features: z.array(z.string())
    .max(20, '주요 기능은 최대 20개까지 가능합니다')
    .default([]),
  tags: z.array(z.string())
    .max(10, '태그는 최대 10개까지 가능합니다')
    .default([])
})

// 프로젝트 업데이트 스키마
export const updateProjectSchema = createProjectSchema.partial()

// 타입 추론
export type CreateProjectData = z.infer<typeof createProjectSchema>
export type UpdateProjectData = z.infer<typeof updateProjectSchema>
export type ProjectCategory = typeof PROJECT_CATEGORIES[number]