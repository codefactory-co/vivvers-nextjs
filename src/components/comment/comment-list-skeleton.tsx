import { Skeleton } from '@/components/ui/skeleton'

export function CommentListSkeleton() {
  return (
    <div className="space-y-6">
      {/* 댓글 스켈레톤 */}
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex gap-3">
          {/* 아바타 */}
          <Skeleton className="h-8 w-8 rounded-full mt-1" />
          
          <div className="flex-1 space-y-2">
            {/* 작성자 정보 */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            
            {/* 댓글 내용 */}
            <div className="space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            
            {/* 액션 버튼들 */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-8 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}