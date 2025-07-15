'use client'

import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { TRANSFORMERS } from '@lexical/markdown'

/**
 * Markdown Shortcuts Plugin for Lexical Editor
 * 
 * Enables markdown-style shortcuts for formatting:
 * - **bold** for bold text
 * - *italic* for italic text
 * - # for headings
 * - - or * for bullet lists
 * - 1. for numbered lists
 */
export function MarkdownShortcutsPlugin() {
  return <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
}