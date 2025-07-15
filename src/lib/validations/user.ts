import { z } from 'zod'

// 사용자 생성 스키마
export const createUserSchema = z.object({
  username: z.string()
    .min(3, '사용자명은 최소 3자 이상이어야 합니다')
    .max(20, '사용자명은 최대 20자까지 가능합니다')
    .regex(/^[a-zA-Z0-9-]+$/, '사용자명은 영문, 숫자, 하이픈만 사용할 수 있습니다'),
  bio: z.string().max(500, '자기소개는 최대 500자까지 가능합니다').optional(),
  avatar: z.string().url('올바른 URL 형식이 아닙니다').optional().or(z.literal('')),
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  supabaseUserId: z.string().min(1, 'Supabase 사용자 ID가 필요합니다')
})

// 사용자 업데이트 스키마 (선택적 필드들)
export const updateUserSchema = z.object({
  username: z.string()
    .min(3, '사용자명은 최소 3자 이상이어야 합니다')
    .max(20, '사용자명은 최대 20자까지 가능합니다')
    .regex(/^[a-zA-Z0-9-]+$/, '사용자명은 영문, 숫자, 하이픈만 사용할 수 있습니다')
    .optional(),
  bio: z.string().max(500, '자기소개는 최대 500자까지 가능합니다').optional(),
  avatar: z.string().url('올바른 URL 형식이 아닙니다').optional().or(z.literal('')),
  socialLinks: z.object({
    github: z.string().url('GitHub URL이 올바르지 않습니다').optional().or(z.literal('')),
    linkedin: z.string().url('LinkedIn URL이 올바르지 않습니다').optional().or(z.literal('')),
    portfolio: z.string().url('포트폴리오 URL이 올바르지 않습니다').optional().or(z.literal(''))
  }).optional(),
  skills: z.array(z.string().min(1, '스킬은 최소 1글자 이상이어야 합니다'))
    .max(20, '스킬은 최대 20개까지 입력 가능합니다')
    .optional(),
  experience: z.string().max(1000, '경력은 최대 1000자까지 입력 가능합니다').optional(),
  isPublic: z.boolean().optional()
})

// 사용자명 검증 스키마
export const usernameSchema = z.string()
  .min(3, '사용자명은 최소 3자 이상이어야 합니다')
  .max(20, '사용자명은 최대 20자까지 가능합니다')
  .regex(/^[a-zA-Z0-9-]+$/, '사용자명은 영문, 숫자, 하이픈만 사용할 수 있습니다')

// 타입 추론
export type CreateUserData = z.infer<typeof createUserSchema>
export type UpdateUserData = z.infer<typeof updateUserSchema>
export type Username = z.infer<typeof usernameSchema>