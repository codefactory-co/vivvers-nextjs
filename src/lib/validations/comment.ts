import { z } from 'zod'
import { uuidSchema, positiveIntSchema } from './common'

// 프로젝트 댓글 내용 스키마
export const projectCommentContentSchema = z.string()
  .min(1, '댓글 내용을 입력해주세요')
  .max(500, '댓글은 최대 500자까지 입력 가능합니다')
  .transform(content => content.trim())

// 프로젝트 댓글 생성 스키마
export const createProjectCommentSchema = z.object({
  content: projectCommentContentSchema,
  projectId: uuidSchema,
  parentId: uuidSchema.optional()
})

// 프로젝트 댓글 수정 스키마
export const updateProjectCommentSchema = z.object({
  id: uuidSchema,
  content: projectCommentContentSchema
})

// 프로젝트 댓글 삭제 스키마
export const deleteProjectCommentSchema = z.object({
  id: uuidSchema
})

// 프로젝트 댓글 조회 스키마
export const getProjectCommentsSchema = z.object({
  projectId: uuidSchema,
  page: positiveIntSchema.default(1),
  limit: positiveIntSchema.min(1).max(50).default(10),
  sortBy: z.enum(['latest', 'oldest', 'mostLiked']).default('latest'),
  parentId: uuidSchema.optional() // 대댓글 조회용
})

// 프로젝트 댓글 좋아요 스키마
export const projectCommentLikeSchema = z.object({
  commentId: uuidSchema
})

// 타입 정의
export type CreateProjectCommentData = z.infer<typeof createProjectCommentSchema>
export type UpdateProjectCommentData = z.infer<typeof updateProjectCommentSchema>
export type DeleteProjectCommentData = z.infer<typeof deleteProjectCommentSchema>
export type GetProjectCommentsData = z.infer<typeof getProjectCommentsSchema>
export type ProjectCommentLikeData = z.infer<typeof projectCommentLikeSchema>

// 프로젝트 댓글 응답 타입
export interface ProjectCommentWithAuthor {
  id: string
  content: string
  projectId: string
  authorId: string
  parentId: string | null
  likeCount: number
  repliesCount: number
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    username: string
    avatarUrl: string | null
  }
  isLiked?: boolean
  replies?: ProjectCommentWithAuthor[]
}

// 프로젝트 댓글 페이지네이션 응답 타입
export interface ProjectCommentsResponse {
  comments: ProjectCommentWithAuthor[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Backward compatibility aliases
export const commentContentSchema = projectCommentContentSchema
export const createCommentSchema = createProjectCommentSchema
export const updateCommentSchema = updateProjectCommentSchema
export const deleteCommentSchema = deleteProjectCommentSchema
export const getCommentsSchema = getProjectCommentsSchema
export const commentLikeSchema = projectCommentLikeSchema

export type CreateCommentData = CreateProjectCommentData
export type UpdateCommentData = UpdateProjectCommentData
export type DeleteCommentData = DeleteProjectCommentData
export type GetCommentsData = GetProjectCommentsData
export type CommentLikeData = ProjectCommentLikeData
export type CommentWithAuthor = ProjectCommentWithAuthor
export type CommentsResponse = ProjectCommentsResponse