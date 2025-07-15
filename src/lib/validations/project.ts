import { z } from 'zod'

// 카테고리 목록
export const PROJECT_CATEGORIES = [
  '웹사이트',
  '모바일 앱', 
  '데스크톱 앱',
  '게임',
  '임베디드',
  '기타'
] as const

// 태그 유효성 검사 규칙
const TAG_REGEX = /^[a-zA-Z0-9_-]+$/
const TAG_MIN_LENGTH = 2
const TAG_MAX_LENGTH = 20

// 개별 태그 스키마
export const tagSchema = z.string()
  .min(TAG_MIN_LENGTH, `태그는 최소 ${TAG_MIN_LENGTH}자 이상이어야 합니다`)
  .max(TAG_MAX_LENGTH, `태그는 최대 ${TAG_MAX_LENGTH}자까지 가능합니다`)
  .regex(TAG_REGEX, '태그는 영문, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다')
  .transform(tag => tag.toLowerCase().trim())

// 태그 배열 스키마
export const tagsArraySchema = z.array(tagSchema)
  .max(10, '태그는 최대 10개까지 가능합니다')
  .default([])

// 태그 유틸리티 함수들
export const tagUtils = {
  // 태그 문자열을 정리하는 함수
  sanitizeTag: (tag: string): string => {
    return tag
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')  // 공백을 하이픈으로 변환
      .replace(/[^a-zA-Z0-9_-]/g, '')  // 허용되지 않는 특수문자 제거
  },
  
  // 태그가 유효한지 확인하는 함수
  isValidTag: (tag: string): boolean => {
    return TAG_REGEX.test(tag) && tag.length >= TAG_MIN_LENGTH && tag.length <= TAG_MAX_LENGTH
  },
  
  // 태그 제안 함수 (유효하지 않은 태그를 유효한 형태로 변환)
  suggestTag: (tag: string): string | null => {
    const sanitized = tagUtils.sanitizeTag(tag)
    if (sanitized.length < TAG_MIN_LENGTH || sanitized.length > TAG_MAX_LENGTH) {
      return null
    }
    return sanitized
  }
}

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
  features: z.array(z.string())
    .max(20, '주요 기능은 최대 20개까지 가능합니다')
    .default([]),
  tags: tagsArraySchema
})

// 프로젝트 업데이트 스키마
export const updateProjectSchema = createProjectSchema.partial()

// 타입 추론
export type CreateProjectData = z.infer<typeof createProjectSchema>
export type UpdateProjectData = z.infer<typeof updateProjectSchema>
export type ProjectCategory = typeof PROJECT_CATEGORIES[number]