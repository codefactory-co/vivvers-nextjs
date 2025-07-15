import type { Metadata } from 'next'
import { LexicalEditorDemo } from '@/components/lexical/lexical-editor-demo'

export const metadata: Metadata = {
  title: 'Lexical 에디터 데모',
  description: 'Lexical WYSIWYG 에디터 데모 페이지',
}

export default function LexicalPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Lexical WYSIWYG 에디터 데모
        </h1>
        <p className="text-muted-foreground mt-2">
          Meta에서 개발한 확장 가능한 텍스트 에디터 프레임워크를 체험해보세요.
        </p>
      </header>

      <main className="space-y-6">
        {/* Editor Demo Section */}
        <LexicalEditorDemo />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-border rounded-lg p-4 bg-card">
            <h3 className="font-semibold mb-2">현재 구현된 기능</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 리치 텍스트 편집 (볼드, 이탤릭, 밑줄)</li>
              <li>• 텍스트 정렬 (좌측, 가운데, 우측, 양쪽)</li>
              <li>• 목록 (순서있는/없는 목록)</li>
              <li>• 실행 취소/다시 실행</li>
              <li>• 자동 포커스 지원</li>
              <li>• 실시간 내용 변경 감지</li>
            </ul>
          </div>

          <div className="border border-border rounded-lg p-4 bg-card">
            <h3 className="font-semibold mb-2">확장 가능한 기능</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 이미지 및 미디어 삽입</li>
              <li>• 코드 블록 및 구문 강조</li>
              <li>• 표(테이블) 편집</li>
              <li>• 수학 공식 (LaTeX)</li>
              <li>• 협업 기능 (실시간 편집)</li>
              <li>• 플러그인 시스템</li>
            </ul>
          </div>
        </div>

        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="font-semibold mb-4">사용 방법</h3>
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <ol className="space-y-2">
              <li>위의 에디터 영역을 클릭하여 텍스트 입력을 시작하세요.</li>
              <li>툴바의 버튼들을 사용하여 텍스트 서식을 적용할 수 있습니다.</li>
              <li>키보드 단축키를 사용할 수 있습니다:
                <ul className="mt-2 ml-4 space-y-1">
                  <li><code>Ctrl/Cmd + B</code>: 볼드</li>
                  <li><code>Ctrl/Cmd + I</code>: 이탤릭</li>
                  <li><code>Ctrl/Cmd + U</code>: 밑줄</li>
                  <li><code>Ctrl/Cmd + Z</code>: 실행 취소</li>
                  <li><code>Ctrl/Cmd + Y</code>: 다시 실행</li>
                </ul>
              </li>
              <li>에디터의 내용은 실시간으로 하단에 표시됩니다.</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  )
}