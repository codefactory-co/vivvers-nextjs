import { notFound } from 'next/navigation'
import { getProjectDetail, getProjectsByCategory } from '@/lib/data/projects'
import { ProjectInfoHeader } from '@/components/project/project-info-header'
import { ProjectScreenshotCarousel } from '@/components/project/project-screenshot-carousel'
import { ProjectDescription } from '@/components/project/project-description'
import { ProjectFeatures } from '@/components/project/project-features'
import { ProjectComments } from '@/components/project/project-comments'
import { RelatedProjects } from '@/components/project/related-projects'

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params
  
  const project = await getProjectDetail(id)
  
  if (!project) {
    notFound()
  }

  // 관련 프로젝트 (같은 카테고리에서 현재 프로젝트 제외)
  const relatedProjects = getProjectsByCategory(project.category)
    .filter(p => p.id !== project.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen">
      {/* Project Info Header - 바로 Navbar 아래 */}
      <ProjectInfoHeader project={project} />
      
      {/* Screenshots Carousel */}
      <div className="container mx-auto px-4 py-8">
        <ProjectScreenshotCarousel 
          screenshots={project.screenshots} 
          title={project.title} 
        />
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-3 space-y-8">
            {/* Project Description */}
            <ProjectDescription description={project.fullDescription} />
            
            {/* Features */}
            <ProjectFeatures features={project.features} />
            
            {/* Comments */}
            <ProjectComments comments={project.comments} />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <div className="lg:sticky lg:top-8">
                <RelatedProjects projects={relatedProjects} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}