import { z } from 'zod'

// 공통 기본 스키마들
export const emailSchema = z.string().email('올바른 이메일 형식이 아닙니다')
export const urlSchema = z.string().url('올바른 URL 형식이 아닙니다')
export const uuidSchema = z.string().uuid('올바른 UUID 형식이 아닙니다')

// 한국어 특화 스키마들
export const koreanNameSchema = z.string()
  .min(2, '이름은 최소 2자 이상이어야 합니다')
  .max(10, '이름은 최대 10자까지 가능합니다')
  .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글, 영문만 사용할 수 있습니다')

// 텍스트 길이 제한 스키마들
export const shortTextSchema = z.string().max(100, '최대 100자까지 입력 가능합니다')
export const mediumTextSchema = z.string().max(500, '최대 500자까지 입력 가능합니다')
export const longTextSchema = z.string().max(2000, '최대 2000자까지 입력 가능합니다')

// 날짜 스키마들
export const dateSchema = z.date()
export const dateStringSchema = z.string().datetime('올바른 날짜 형식이 아닙니다')

// 숫자 스키마들
export const positiveIntSchema = z.number().int().positive('양의 정수여야 합니다')
export const nonNegativeIntSchema = z.number().int().nonnegative('0 이상의 정수여야 합니다')

// 선택적 문자열 (빈 문자열도 허용)
export const optionalStringSchema = z.string().optional().or(z.literal(''))

// Supabase 관련
export const supabaseIdSchema = z.string().min(1, 'Supabase ID가 필요합니다')