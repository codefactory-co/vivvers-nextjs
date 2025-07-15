'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileUploader } from '@/components/forms/file-uploader'
import { TagCommandDB } from '@/components/forms/tag-command-db'
import { Plus, X, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@/components/editor/rich-text-editor'), {
  ssr: false,
})

import { PROJECT_CATEGORIES } from '@/lib/validations/project'

export interface ProjectFormData {
  title: string
  description: string
  fullDescription: string
  fullDescriptionJson: string
  fullDescriptionHtml: string
  category: string
  screenshots: string[]
  demoUrl: string
  githubUrl: string
  techStack: string[]
  features: string[]
  tags: string[]
}

interface ProjectFormProps {
  mode: 'create' | 'edit'
  formData: ProjectFormData
  onFormChange: (data: ProjectFormData) => void
  onSubmit: () => Promise<void>
  userId: string // 업로드를 위한 사용자 ID (필수)
}

export function ProjectForm({ mode, formData, onFormChange, onSubmit, userId }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newFeature, setNewFeature] = useState('')

  const updateFormData = (field: string, value: string | string[]) => {
    console.log(field, value);
    const newData = { ...formData, [field]: value }
    onFormChange(newData)
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      updateFormData('features', [...formData.features, newFeature.trim()])
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index)
    updateFormData('features', newFeatures)
  }


  const isFormValid = () => {
    return formData.title && formData.description && formData.category && formData.screenshots.length > 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid()) return

    setIsSubmitting(true)
    try {
      await onSubmit()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? '기본 정보' : '프로젝트 정보 수정'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">프로젝트 제목 *</Label>
            <Input
              id="title"
              placeholder="프로젝트 제목을 입력하세요"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('title', e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">간단한 설명 *</Label>
            <Textarea
              id="description"
              placeholder="프로젝트를 한 줄로 설명해주세요"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('description', e.target.value)}
              maxLength={200}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">카테고리 *</Label>
            <Select value={formData.category} onValueChange={(value: string) => updateFormData('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullDescription">상세 설명</Label>
            <RichTextEditor
              content={formData.fullDescriptionHtml}
              onChange={(html, text, json) => {
                const newData = {
                  ...formData,
                  fullDescriptionHtml: html,
                  fullDescription: text,
                  fullDescriptionJson: json
                }
                onFormChange(newData)
              }}
              mode="editor-only"
              showPreview={false}
              placeholder="프로젝트에 대한 자세한 설명을 작성하세요..."
              height="300px"
            />
          </div>
        </CardContent>
      </Card>

      {/* 스크린샷 업로드 */}
      <Card>
        <CardHeader>
          <CardTitle>스크린샷</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>스크린샷 *</Label>
            <FileUploader
              onFileSelect={(files) => updateFormData('screenshots', files)}
              accept="image/*"
              multiple
              placeholder="프로젝트 스크린샷을 업로드하세요 (최소 1개, 최대 10개)"
              userId={userId}
              existingFiles={formData.screenshots}
            />
          </div>
        </CardContent>
      </Card>

      {/* 링크 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>링크</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="liveUrl">라이브 데모 URL</Label>
            <Input
              id="liveUrl"
              type="url"
              placeholder="https://your-project.com"
              value={formData.demoUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('demoUrl', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              type="url"
              placeholder="https://github.com/username/repo"
              value={formData.githubUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('githubUrl', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 기술 스택 */}
      <Card>
        <CardHeader>
          <CardTitle>기술 스택</CardTitle>
        </CardHeader>
        <CardContent>
          <TagCommandDB
            selectedTags={formData.techStack}
            onTagsChange={(tags) => updateFormData('techStack', tags)}
            placeholder="사용한 기술 스택을 검색하세요"
            maxTags={15}
            type="techStack"
          />
        </CardContent>
      </Card>

      {/* 주요 기능 */}
      <Card>
        <CardHeader>
          <CardTitle>주요 기능</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="주요 기능을 입력하세요"
              value={newFeature}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFeature(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            />
            <Button type="button" onClick={addFeature} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {formData.features.map((feature, index) => (
              <div key={`${feature}-${index}`} className="flex items-center gap-2 p-2 bg-muted rounded">
                <span className="flex-1">{feature}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFeature(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 태그 */}
      <Card>
        <CardHeader>
          <CardTitle>태그</CardTitle>
        </CardHeader>
        <CardContent>
          <TagCommandDB
            selectedTags={formData.tags}
            onTagsChange={(tags) => updateFormData('tags', tags)}
            placeholder="프로젝트와 관련된 태그를 검색하세요"
            maxTags={10}
            type="tags"
          />
        </CardContent>
      </Card>

      {/* 제출 버튼 */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={!isFormValid() || isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === 'create' ? '프로젝트 생성 중...' : '프로젝트 수정 중...'}
            </>
          ) : (
            mode === 'create' ? '프로젝트 생성하기' : '수정사항 저장'
          )}
        </Button>
      </div>
    </form>
  )
}

// 기존 컴포넌트를 위한 호환성 export
export const ProjectCreateForm = ProjectForm