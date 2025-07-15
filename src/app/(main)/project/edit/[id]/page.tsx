'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ProjectForm, type ProjectFormData } from '@/components/project/project-form'
import { getProjectById } from '@/lib/actions/project/project-get'
import { updateProject } from '@/lib/actions/project/project-update'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export default function ProjectEditPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    fullDescription: '',
    fullDescriptionJson: '',
    fullDescriptionHtml: '',
    category: '',
    screenshots: [],
    demoUrl: '',
    githubUrl: '',
    techStack: [],
    features: [],
    tags: []
  })

  const projectId = params.id as string

  // 사용자 인증 확인 및 프로젝트 데이터 로드
  useEffect(() => {
    const loadProjectData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: "로그인 필요",
          description: "프로젝트를 수정하려면 로그인이 필요합니다.",
          variant: "destructive"
        })
        router.push('/signin')
        return
      }
      
      setUserId(user.id)

      try {
        const result = await getProjectById(projectId)
        
        if (!result.success || !result.project) {
          toast({
            title: "프로젝트를 찾을 수 없습니다",
            description: result.error || "존재하지 않는 프로젝트입니다.",
            variant: "destructive"
          })
          router.push('/')
          return
        }

        const project = result.project

        // 프로젝트 작성자인지 확인
        if (project.author.id !== user.id) {
          toast({
            title: "권한 없음",
            description: "이 프로젝트를 수정할 권한이 없습니다.",
            variant: "destructive"
          })
          router.push(`/project/${projectId}`)
          return
        }

        // 프로젝트 데이터를 폼 데이터로 변환
        setFormData({
          title: project.title,
          description: project.excerpt,
          fullDescription: project.fullDescription || '',
          fullDescriptionJson: project.fullDescriptionJson ? JSON.stringify(project.fullDescriptionJson) : '',
          fullDescriptionHtml: project.fullDescriptionHtml || '',
          category: project.category,
          screenshots: project.images || [],
          demoUrl: project.demoUrl || '',
          githubUrl: project.githubUrl || '',
          techStack: project.techStack.map(tech => tech.name),
          features: project.features,
          tags: project.tags.map(tag => tag.name)
        })
        
      } catch (error) {
        console.error('프로젝트 로드 오류:', error)
        toast({
          title: "프로젝트 로드 실패",
          description: "프로젝트 정보를 불러오는데 실패했습니다.",
          variant: "destructive"
        })
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId) {
      loadProjectData()
    }
  }, [projectId, router, toast])

  const handleFormChange = (data: ProjectFormData) => {
    setFormData(data)
  }

  const handleSubmit = async () => {
    if (!userId) {
      toast({
        title: "인증 오류",
        description: "사용자 정보를 확인할 수 없습니다.",
        variant: "destructive"
      })
      return
    }

    try {
      const result = await updateProject(projectId, formData)
      
      if (result.success) {
        toast({
          title: "프로젝트 수정 완료",
          description: "프로젝트가 성공적으로 수정되었습니다."
        })
        router.push(`/project/${projectId}`)
      } else {
        toast({
          title: "프로젝트 수정 실패",
          description: result.error || "알 수 없는 오류가 발생했습니다.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('프로젝트 수정 오류:', error)
      toast({
        title: "프로젝트 수정 실패",
        description: "프로젝트 수정 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">프로젝트 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">프로젝트 수정</h1>
          <p className="text-lg text-muted-foreground">
            프로젝트 정보를 수정하고 업데이트하세요
          </p>
        </div>

        <ProjectForm 
          mode="edit"
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
          userId={userId || ''}
        />
      </div>
    </div>
  )
}