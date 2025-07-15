'use client'

import { useEffect, useRef } from 'react'
import { createLowlight, common } from 'lowlight'
import { cn } from '@/lib/utils'

// 언어 지원 추가 (TipTap과 동일)
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import css from 'highlight.js/lib/languages/css'
import html from 'highlight.js/lib/languages/xml'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'
import json from 'highlight.js/lib/languages/json'

// lowlight 인스턴스 생성 (TipTap과 동일한 설정)
const lowlight = createLowlight(common)
lowlight.register('javascript', js)
lowlight.register('typescript', ts)
lowlight.register('css', css)
lowlight.register('html', html)
lowlight.register('python', python)
lowlight.register('java', java)
lowlight.register('cpp', cpp)
lowlight.register('json', json)

interface HtmlContentRendererProps {
  htmlContent: string
  className?: string
  enableSyntaxHighlighting?: boolean
}

export const HtmlContentRenderer = ({ 
  htmlContent, 
  className,
  enableSyntaxHighlighting = true
}: HtmlContentRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enableSyntaxHighlighting || !containerRef.current) return

    const codeBlocks = containerRef.current.querySelectorAll('pre code')
    
    codeBlocks.forEach((codeBlock) => {
      const codeText = codeBlock.textContent || ''
      const language = codeBlock.className.match(/language-(\w+)/)?.[1] || 'javascript'
      
      try {
        const result = lowlight.highlight(language, codeText)
        const highlightedHtml = (result as { children: unknown[] }).children
          .map((node: unknown) => {
            const typedNode = node as {
              type: string;
              value?: string;
              properties?: { className?: string[] };
              children?: { type: string; value?: string }[]
            }
            if (typedNode.type === 'text') {
              return typedNode.value || ''
            } else if (typedNode.type === 'element') {
              const className = typedNode.properties?.className?.join(' ') || ''
              return `<span class="${className}">${typedNode.children?.map((child) =>
                child.type === 'text' ? child.value || '' : ''
              ).join('') || ''}</span>`
            }
            return ''
          })
          .join('')
        
        codeBlock.innerHTML = highlightedHtml
        codeBlock.className = `hljs language-${language}`
      } catch (error) {
        console.warn('Failed to highlight code block:', error)
      }
    })
  }, [htmlContent, enableSyntaxHighlighting])

  return (
    <div 
      ref={containerRef}
      className={cn(
        "prose prose-invert max-w-none preview-content p-4",
        className
      )}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}