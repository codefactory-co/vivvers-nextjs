import { notFound } from 'next/navigation'
import { getProjectById } from '@/lib/actions/project/project-get'
import { getProjectLikeStatus } from '@/lib/actions/project/project-like'
import { ProjectInfoHeader } from '@/components/project/project-info-header'
import { ProjectScreenshotCarousel } from '@/components/project/project-screenshot-carousel'
import { ProjectDescription } from '@/components/project/project-description'
import { ProjectFeatures } from '@/components/project/project-features'
import { ProjectComments } from '@/components/project/project-comments'
import { createClient } from '@/lib/supabase/server'

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params
  
  const result = await getProjectById(id)
  
  if (!result.success || !result.project) {
    notFound()
  }

  const project = result.project

  // 현재 사용자 정보 가져오기
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id

  // 좋아요 상태 조회
  const likeStatus = await getProjectLikeStatus(id)

  // Comments will be loaded by the ProjectComments component via client-side fetching

  return (
    <div className="min-h-screen">
      {/* Project Info Header - 바로 Navbar 아래 */}
      <ProjectInfoHeader 
        project={project} 
        currentUserId={currentUserId} 
        initialIsLiked={likeStatus.isLiked}
      />
      
      {/* Screenshots Carousel */}
      <div className="container mx-auto px-4 py-8">
        <ProjectScreenshotCarousel 
          screenshots={project.images || []} 
          title={project.title} 
        />
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Project Description */}
          <ProjectDescription 
            description={project.fullDescription || project.description} 
            descriptionHtml={project.fullDescriptionHtml || undefined}
          />
          
          {/* Features */}
          <ProjectFeatures features={project.features} />
          
          {/* Comments */}
          <ProjectComments 
            projectId={project.id} 
            initialComments={[]} 
          />
        </div>
      </div>
    </div>
  )
}