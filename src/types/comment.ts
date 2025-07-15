export interface ProjectCommentAuthor {
  id: string
  username: string
  avatarUrl: string | null
  email?: string
  bio?: string | null
}

export interface ProjectComment {
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
  replies?: ProjectComment[]
}

export interface ProjectCommentFormData {
  content: string
  parentId?: string
}

export interface ProjectCommentFormProps {
  onSubmit: (data: ProjectCommentFormData) => Promise<void>
  isLoading?: boolean
  placeholder?: string
  parentId?: string
}

export interface ProjectCommentListProps {
  comments: ProjectComment[]
  isLoading?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
}

export interface ProjectCommentItemProps {
  comment: ProjectComment
  currentUserId?: string
  onLike: (commentId: string) => Promise<void> | void
  onReply: (commentId: string) => void
  onEdit: (commentId: string) => void
  onDelete: (commentId: string) => void
  depth?: number
}

export interface ProjectCommentActionsProps {
  comment: ProjectComment
  isOwner: boolean
  onLike: (commentId: string) => Promise<void> | void
  onReply: (commentId: string) => void
  onEdit: (commentId: string) => void
  onDelete: (commentId: string) => void
}

// Backward compatibility aliases
export type CommentAuthor = ProjectCommentAuthor
export type Comment = ProjectComment
export type CommentFormData = ProjectCommentFormData
export type CommentFormProps = ProjectCommentFormProps
export type CommentListProps = ProjectCommentListProps
export type CommentItemProps = ProjectCommentItemProps
export type CommentActionsProps = ProjectCommentActionsProps