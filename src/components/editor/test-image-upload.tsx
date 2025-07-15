'use client'

import { useState } from 'react'
import RichTextEditor from './rich-text-editor'

/**
 * Test component to verify image upload functionality
 * This component demonstrates all the configuration options
 */
export default function TestImageUpload() {
  const [content, setContent] = useState('<p>이미지 업로드 테스트를 시작하세요!</p>')

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">TipTap 이미지 업로드 테스트</h1>
      
      {/* Test 1: Basic Editor without Image Upload (Default) */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">1. 기본 에디터 (이미지 업로드 비활성화)</h2>
        <p className="text-sm text-muted-foreground">
          기본 설정으로는 이미지 업로드 버튼이 표시되지 않습니다.
        </p>
        <RichTextEditor
          content="<p>이미지 업로드가 비활성화된 기본 에디터입니다.</p>"
          onChange={(html, text, json) => {
            console.log('Basic editor changed:', { html, text, json })
          }}
          placeholder="기본 에디터에서 글을 작성해보세요..."
          height="200px"
        />
      </div>

      {/* Test 2: Editor with Image Upload Enabled */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">2. 이미지 업로드 활성화된 에디터</h2>
        <p className="text-sm text-muted-foreground">
          이미지 업로드가 활성화되어 있습니다. 툴바에 이미지 버튼이 표시되고, 드래그 앤 드롭 및 붙여넣기가 가능합니다.
        </p>
        <RichTextEditor
          content={content}
          onChange={(html, text, json) => {
            setContent(html)
            console.log('Image upload editor changed:', { html, text, json })
          }}
          imageUpload={{
            enabled: true,
            bucket: 'project-images',
            directory: 'test-uploads',
            maxSize: 5 * 1024 * 1024, // 5MB
            allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
            maxFiles: 5
          }}
          placeholder="이미지를 업로드해보세요! 툴바 버튼을 클릭하거나 이미지를 드래그 앤 드롭하세요."
          height="300px"
          mode="split"
          showPreview={true}
        />
      </div>

      {/* Test 3: Editor with Restrictive Settings */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">3. 제한적 설정의 에디터</h2>
        <p className="text-sm text-muted-foreground">
          파일 크기 2MB 제한, JPEG/PNG만 허용, 최대 2개 파일까지만 업로드 가능합니다.
        </p>
        <RichTextEditor
          content="<p>제한적 설정으로 이미지를 업로드해보세요.</p>"
          onChange={(html, text, json) => {
            console.log('Restrictive editor changed:', { html, text, json })
          }}
          imageUpload={{
            enabled: true,
            bucket: 'user-content',
            directory: 'restricted-uploads',
            maxSize: 2 * 1024 * 1024, // 2MB
            allowedTypes: ['image/jpeg', 'image/png'],
            maxFiles: 2
          }}
          placeholder="제한된 설정에서 이미지 업로드를 테스트해보세요..."
          height="250px"
          mode="editor-only"
        />
      </div>

      {/* Instructions */}
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-2">테스트 방법:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li><strong>툴바 버튼:</strong> 이미지 아이콘을 클릭하여 파일 선택 대화상자를 엽니다</li>
          <li><strong>드래그 앤 드롭:</strong> 이미지 파일을 에디터 영역으로 드래그합니다</li>
          <li><strong>붙여넣기:</strong> 클립보드의 이미지를 Ctrl+V로 붙여넣습니다</li>
          <li><strong>검증:</strong> 파일 크기, 형식, 개수 제한을 확인해보세요</li>
          <li><strong>토스트 알림:</strong> 업로드 성공/실패 시 알림이 표시됩니다</li>
        </ul>
      </div>

      {/* Current Content Display */}
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-2">현재 컨텐츠 (디버깅용):</h3>
        <pre className="text-xs overflow-auto max-h-40 bg-background p-2 rounded">
          {content}
        </pre>
      </div>
    </div>
  )
}