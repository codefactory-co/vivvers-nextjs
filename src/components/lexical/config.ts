import { InitialConfigType } from '@lexical/react/LexicalComposer'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { CodeHighlightNode, CodeNode } from '@lexical/code'

import { LexicalTheme } from './theme'

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
const onError = (error: Error) => {
  console.error('Lexical Error:', error)
}

export const lexicalConfig: InitialConfigType = {
  namespace: 'VivversLexicalEditor',
  theme: LexicalTheme,
  onError,
  nodes: [
    // Basic Rich Text nodes
    HeadingNode,
    QuoteNode,
    
    // List nodes
    ListNode,
    ListItemNode,

    // Link nodes
    AutoLinkNode,
    LinkNode,

    // Code nodes
    CodeNode,
    CodeHighlightNode,
  ],
  editorState: null, // Will be set when initializing with content
}