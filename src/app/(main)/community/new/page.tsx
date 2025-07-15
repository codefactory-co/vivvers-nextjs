import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/server'
import { CommunityPostForm } from '@/components/community/community-post-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: '새 글 작성 - 커뮤니티 - Vivvers',
  description: '커뮤니티에 새로운 게시글을 작성합니다.',
}

export default async function NewCommunityPostPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/signin?redirect=/community/new')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <PlusCircle className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">새 글 작성</h1>
            <p className="text-muted-foreground">
              커뮤니티에 질문이나 의견을 공유해보세요.
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>게시글 작성</CardTitle>
          </CardHeader>
          <CardContent>
            <CommunityPostForm userId={user.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}