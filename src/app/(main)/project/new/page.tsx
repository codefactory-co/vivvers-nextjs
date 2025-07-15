'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectForm, type ProjectFormData } from '@/components/project/project-form'
import { createProject } from '@/lib/actions/project/project-create'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export default function ProjectCreatePage() {
  const router = useRouter()
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

  // 사용자 인증 확인
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: "로그인 필요",
          description: "프로젝트를 생성하려면 로그인이 필요합니다.",
          variant: "destructive"
        })
        router.push('/signin')
        return
      }
      
      setUserId(user.id)
      setIsLoading(false)
    }

    checkAuth()
  }, [router, toast])

  const handleFormChange = (data: ProjectFormData) => {
    console.log(data);
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
      const result = await createProject(formData)
      
      if (result.success && result.projectId) {
        toast({
          title: "프로젝트 생성 완료",
          description: "프로젝트가 성공적으로 생성되었습니다."
        })
        router.push(`/project/${result.projectId}`)
      } else {
        toast({
          title: "프로젝트 생성 실패",
          description: result.error || "알 수 없는 오류가 발생했습니다.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('프로젝트 생성 오류:', error)
      toast({
        title: "프로젝트 생성 실패",
        description: "프로젝트 생성 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">새 프로젝트 만들기</h1>
          <p className="text-lg text-muted-foreground">
            당신의 프로젝트를 Vivvers 커뮤니티와 공유해보세요
          </p>
        </div>

        <ProjectForm 
          mode="create"
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
          userId={userId || ''}
        />
      </div>
    </div>
  )
}