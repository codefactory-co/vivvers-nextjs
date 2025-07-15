// Comment CRUD actions
export { createComment } from './comment-create'
export { getComments } from './comment-get'
export { updateComment } from './comment-update'
export { deleteComment } from './comment-delete'

// Comment like actions
export { toggleCommentLike } from './comment-like'

// Comment reply actions
export { createReply, getReplies } from './comment-reply'

// Comment count management
export { 
  syncCommentCounts, 
  syncProjectCommentCounts, 
  syncSpecificCommentCounts, 
  validateAllCommentCounts, 
  autoFixCommentCounts 
} from './count-sync'

// Comment statistics
export { getCommentStats, getGlobalCommentStats } from './comment-stats'

// Type exports
export type { CreateCommentResponse } from './comment-create'
export type { GetCommentsResponse } from './comment-get'
export type { UpdateCommentResponse } from './comment-update'
export type { DeleteCommentResponse } from './comment-delete'
export type { CreateReplyResponse, GetRepliesResponse } from './comment-reply'
export type { CommentStatsResponse, GlobalCommentStatsResponse } from './comment-stats'