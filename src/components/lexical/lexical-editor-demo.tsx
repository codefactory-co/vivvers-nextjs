'use client'

import { useState } from 'react'
import { LexicalEditor } from './lexical-editor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Save } from 'lucide-react'

export function LexicalEditorDemo() {
  const [editorContent, setEditorContent] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [isSaved, setIsSaved] = useState(false)

  // Note: Initial content can be set here if needed in the future

  const handleEditorChange = (content: string) => {
    setEditorContent(content)
    setWordCount(content.length)
    setIsSaved(false)
  }

  const handleSave = () => {
    // 실제 저장 로직은 여기에 구현
    console.log('저장된 내용:', editorContent)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleReset = () => {
    setEditorContent('')
    setWordCount(0)
    setIsSaved(false)
  }

  return (
    <div className="space-y-6">
      {/* Editor Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Lexical 에디터</CardTitle>
            <CardDescription>
              아래에서 리치 텍스트 편집 기능을 체험해보세요
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              글자 수: {wordCount}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              초기화
            </Button>
            <Button 
              variant={isSaved ? "default" : "outline"}
              size="sm" 
              onClick={handleSave}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaved ? '저장됨' : '저장'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <LexicalEditor
            placeholder="여기에 내용을 입력하세요..."
            onChange={handleEditorChange}
            autoFocus={true}
            className="min-h-[400px]"
          />
        </CardContent>
      </Card>

      {/* Content Display Section */}
      <Card>
        <CardHeader>
          <CardTitle>에디터 내용 (실시간)</CardTitle>
          <CardDescription>
            에디터에 입력한 텍스트 내용이 실시간으로 표시됩니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 min-h-[100px]">
            {editorContent ? (
              <div className="whitespace-pre-wrap text-sm">
                {editorContent}
              </div>
            ) : (
              <div className="text-muted-foreground text-sm italic">
                에디터에 내용을 입력하면 여기에 표시됩니다...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{wordCount}</div>
            <div className="text-sm text-muted-foreground">총 글자 수</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {editorContent.split(/\s+/).filter(word => word.length > 0).length}
            </div>
            <div className="text-sm text-muted-foreground">단어 수</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {editorContent.split('\n').length}
            </div>
            <div className="text-sm text-muted-foreground">줄 수</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}