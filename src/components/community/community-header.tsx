'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusCircle, MessageSquare } from 'lucide-react'

export function CommunityHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      {/* Title and Description */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">커뮤니티</h1>
        </div>
        <p className="text-muted-foreground">
          일단 생성하면 수정이랑 삭제는 못한다 ㅇㅋ? 시간날때 만들어드림
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button asChild>
          <Link href="/community/new" className="flex items-center">
            <PlusCircle className="h-4 w-4 mr-2" />
            새 글 작성
          </Link>
        </Button>
      </div>
    </div>
  )
}