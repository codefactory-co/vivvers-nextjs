import { HtmlContentRenderer } from './html-content-renderer'

// Example usage of HtmlContentRenderer
const exampleHtml = `
  <h1>프로젝트 제목</h1>
  <p>이것은 <strong>HTML 콘텐츠</strong>를 렌더링하는 예제입니다.</p>
  <h2>주요 기능</h2>
  <ul>
    <li>TipTap과 동일한 스타일링</li>
    <li>코드 블록 구문 강조</li>
    <li>안전한 HTML 렌더링</li>
  </ul>
  <h3>코드 예제</h3>
  <pre><code class="language-javascript">
function example() {
  console.log("Hello, World!");
  return true;
}
</code></pre>
  <blockquote>
    <p>이것은 인용문입니다.</p>
  </blockquote>
`

export function ExampleUsage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">HTML Content Renderer 예제</h1>
      
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">렌더링 결과:</h2>
        <HtmlContentRenderer 
          htmlContent={exampleHtml}
          enableSyntaxHighlighting={true}
        />
      </div>
    </div>
  )
}