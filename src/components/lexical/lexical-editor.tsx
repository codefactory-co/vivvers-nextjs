'use client'

import React from 'react'
import { $getRoot, EditorState } from 'lexical'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { cn } from '@/lib/utils'
import { lexicalConfig } from './config'
import { LexicalToolbar } from './lexical-toolbar'
import { 
  AutoLinkPlugin, 
  ListPlugin, 
  CodeHighlightPlugin, 
  MarkdownShortcutsPlugin 
} from './plugins'

export interface LexicalEditorProps {
  placeholder?: string
  className?: string
  onChange?: (value: string) => void
  autoFocus?: boolean
  readOnly?: boolean
  initialValue?: string
}

export function LexicalEditor({
  placeholder = '내용을 입력하세요...',
  className,
  onChange,
  autoFocus = false,
  readOnly = false,
  initialValue: _initialValue, // TODO: implement initial value support
}: LexicalEditorProps) {

  const handleEditorChange = (editorState: EditorState) => {
    if (onChange) {
      editorState.read(() => {
        const root = $getRoot()
        const textContent = root.getTextContent()
        onChange(textContent)
      })
    }
  }

  return (
    <LexicalComposer initialConfig={lexicalConfig}>
      <div className={cn('relative border border-input rounded-md', className)}>
        {/* Toolbar */}
        <LexicalToolbar />
        
        {/* Editor Container */}
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <div className="editor-scroller">
                <div className="editor">
                  <ContentEditable
                    className={cn(
                      'editor-input',
                      'min-h-[300px] p-4 text-sm leading-relaxed',
                      'focus:outline-none focus:ring-0',
                      'prose prose-slate dark:prose-invert max-w-none',
                      readOnly && 'cursor-default'
                    )}
                    aria-placeholder={placeholder}
                    placeholder={
                      <div className="editor-placeholder absolute top-4 left-4 text-muted-foreground pointer-events-none select-none">
                        {placeholder}
                      </div>
                    }
                    readOnly={readOnly}
                  />
                </div>
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          
          {/* Plugins */}
          <HistoryPlugin />
          {autoFocus && <AutoFocusPlugin />}
          <OnChangePlugin onChange={handleEditorChange} />
          
          {/* Custom Plugins */}
          <AutoLinkPlugin />
          <ListPlugin />
          <CodeHighlightPlugin />
          <MarkdownShortcutsPlugin />
        </div>
      </div>
    </LexicalComposer>
  )
}

export default LexicalEditor