'use client'

import { ListPlugin as LexicalListPlugin } from '@lexical/react/LexicalListPlugin'

/**
 * List Plugin for Lexical Editor
 * 
 * Provides enhanced list functionality including:
 * - Ordered and unordered lists
 * - Nested list support
 * - Keyboard shortcuts for list manipulation
 * - Tab/Shift-Tab for indenting/outdenting
 */
export function ListPlugin() {
  return <LexicalListPlugin />
}

export default ListPlugin