'use client'

import { useEffect, useRef } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getRoot, LexicalNode } from 'lexical'
import { $isCodeNode, CodeNode } from '@lexical/code'

// Import Prism.js for syntax highlighting
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-bash'

/**
 * Code Highlight Plugin for Lexical Editor
 * Provides syntax highlighting for code blocks using Prism.js
 */
export function CodeHighlightPlugin() {
  const [editor] = useLexicalComposerContext()
  const isHighlightingRef = useRef(false)
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Function to highlight code in a specific element
    const highlightElement = (element: HTMLElement, language: string, code: string) => {
      try {
        // Skip if already has tokens
        if (element.querySelector('.token')) {
          return
        }
        
        if (Prism.languages[language]) {
          const highlightedCode = Prism.highlight(
            code,
            Prism.languages[language],
            language
          )
          element.innerHTML = highlightedCode
          element.classList.add(`language-${language}`)
        }
      } catch (error) {
        console.error('Highlighting failed:', error)
      }
    }

    // Function to find and highlight all code blocks
    const updateCodeHighlighting = () => {
      // Prevent multiple simultaneous updates
      if (isHighlightingRef.current) {
        return
      }
      
      isHighlightingRef.current = true
      
      // Collect code nodes without updating the editor
      const codeNodes: Array<{key: string, language: string, code: string}> = []
      
      editor.getEditorState().read(() => {
        const root = $getRoot()
        
        // Find all code nodes
        root.getChildren().forEach((topLevelElement) => {
          if ($isCodeNode(topLevelElement)) {
            codeNodes.push({
              key: topLevelElement.getKey(),
              language: topLevelElement.getLanguage() || 'javascript',
              code: topLevelElement.getTextContent()
            })
          } else {
            // Check children recursively if the node has children
            if ('getChildren' in topLevelElement && typeof topLevelElement.getChildren === 'function') {
              topLevelElement.getChildren().forEach((child: LexicalNode) => {
                if ($isCodeNode(child)) {
                  codeNodes.push({
                    key: child.getKey(),
                    language: child.getLanguage() || 'javascript',
                    code: child.getTextContent()
                  })
                }
              })
            }
          }
        })
      })
      
      // Apply highlighting outside of editor update
      codeNodes.forEach(({key, language, code}) => {
        const element = editor.getElementByKey(key)
        if (element && code.trim()) {
          const codeElement = element.querySelector('code') || element.querySelector('pre') || element
          highlightElement(codeElement as HTMLElement, language, code)
        }
      })
      
      isHighlightingRef.current = false
    }

    // Debounced update function
    const debouncedUpdate = () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
      updateTimeoutRef.current = setTimeout(updateCodeHighlighting, 100)
    }

    // Initial highlighting
    const timeoutId = setTimeout(updateCodeHighlighting, 100)

    // Register listeners with debouncing
    const unregisterUpdate = editor.registerUpdateListener(() => {
      debouncedUpdate()
    })

    const unregisterMutation = editor.registerMutationListener(CodeNode, () => {
      debouncedUpdate()
    })

    return () => {
      clearTimeout(timeoutId)
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
      unregisterUpdate()
      unregisterMutation()
    }
  }, [editor])

  return null
}

/**
 * Supported programming languages for syntax highlighting
 */
export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'jsx',
  'css',
  'json',
  'python',
  'bash',
] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

/**
 * Get language display name
 */
export function getLanguageDisplayName(language: string): string {
  const displayNames: Record<string, string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    jsx: 'React JSX',
    css: 'CSS',
    json: 'JSON',
    python: 'Python',
    bash: 'Bash',
  }
  
  return displayNames[language] || language.toUpperCase()
}