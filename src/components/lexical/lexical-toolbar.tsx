'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  TextFormatType,
  RangeSelection,
} from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { 
  $isHeadingNode,
} from '@lexical/rich-text'
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list'
import {
  $createCodeNode,
} from '@lexical/code'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  CodeSquare,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ToolbarState {
  isBold: boolean
  isItalic: boolean
  isUnderline: boolean
  isStrikethrough: boolean
  isCode: boolean
  blockType: string
}

export function LexicalToolbar() {
  const [editor] = useLexicalComposerContext()
  const [toolbarState, setToolbarState] = useState<ToolbarState>({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikethrough: false,
    isCode: false,
    blockType: 'paragraph',
  })

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      // Update text format states
      setToolbarState({
        isBold: selection.hasFormat('bold'),
        isItalic: selection.hasFormat('italic'),
        isUnderline: selection.hasFormat('underline'),
        isStrikethrough: selection.hasFormat('strikethrough'),
        isCode: selection.hasFormat('code'),
        blockType: getBlockType(selection),
      })
    }
  }, [])

  const getBlockType = (selection: RangeSelection) => {
    const anchorNode = selection.anchor.getNode()
    const element = anchorNode.getKey() === 'root' 
      ? anchorNode 
      : anchorNode.getTopLevelElementOrThrow()

    if ($isHeadingNode(element)) {
      return element.getTag()
    }
    if ($isListNode(element)) {
      const parentList = element.getParent()
      if ($isListNode(parentList)) {
        return parentList.getListType()
      }
      return element.getListType()
    }
    
    return element.getType() || 'paragraph'
  }

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar()
        return false
      },
      1
    )
  }, [editor, updateToolbar])

  const formatText = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)
  }


  const formatBulletList = () => {
    if (toolbarState.blockType !== 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
  }

  const formatNumberedList = () => {
    if (toolbarState.blockType !== 'ol') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
  }

  const formatQuote = () => {
    // TODO: Implement quote formatting
  }

  const insertCodeBlock = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const codeNode = $createCodeNode()
        codeNode.setLanguage('javascript')
        selection.insertNodes([codeNode])
      }
    })
  }

  const undo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined)
  }

  const redo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined)
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
      {/* History Controls */}
      <div className="flex items-center gap-1 mr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          className="h-8 w-8 p-0"
          title="실행 취소"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          className="h-8 w-8 p-0"
          title="다시 실행"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Text Format Controls */}
      <div className="flex items-center gap-1 mr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('bold')}
          className={cn(
            'h-8 w-8 p-0',
            toolbarState.isBold && 'bg-accent text-accent-foreground'
          )}
          title="굵게"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('italic')}
          className={cn(
            'h-8 w-8 p-0',
            toolbarState.isItalic && 'bg-accent text-accent-foreground'
          )}
          title="기울임"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('underline')}
          className={cn(
            'h-8 w-8 p-0',
            toolbarState.isUnderline && 'bg-accent text-accent-foreground'
          )}
          title="밑줄"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('strikethrough')}
          className={cn(
            'h-8 w-8 p-0',
            toolbarState.isStrikethrough && 'bg-accent text-accent-foreground'
          )}
          title="취소선"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('code')}
          className={cn(
            'h-8 w-8 p-0',
            toolbarState.isCode && 'bg-accent text-accent-foreground'
          )}
          title="코드"
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* List Controls */}
      <div className="flex items-center gap-1 mr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={formatBulletList}
          className={cn(
            'h-8 w-8 p-0',
            toolbarState.blockType === 'ul' && 'bg-accent text-accent-foreground'
          )}
          title="불릿 목록"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={formatNumberedList}
          className={cn(
            'h-8 w-8 p-0',
            toolbarState.blockType === 'ol' && 'bg-accent text-accent-foreground'
          )}
          title="번호 목록"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={formatQuote}
          className={cn(
            'h-8 w-8 p-0',
            toolbarState.blockType === 'quote' && 'bg-accent text-accent-foreground'
          )}
          title="인용문"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={insertCodeBlock}
          className="h-8 w-8 p-0"
          title="코드 블록"
        >
          <CodeSquare className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Alignment Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
          className="h-8 w-8 p-0"
          title="왼쪽 정렬"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
          className="h-8 w-8 p-0"
          title="가운데 정렬"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
          className="h-8 w-8 p-0"
          title="오른쪽 정렬"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
          className="h-8 w-8 p-0"
          title="양쪽 정렬"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}