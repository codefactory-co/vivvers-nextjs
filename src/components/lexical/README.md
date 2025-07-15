# Lexical Editor Components

This directory contains the Lexical WYSIWYG editor components for the Vivvers project.

## Structure

```
src/components/lexical/
├── index.ts                 # Main exports
├── lexical-editor.tsx      # Main LexicalEditor component
├── lexical-toolbar.tsx     # Toolbar component with formatting controls
├── config.ts               # Lexical configuration
├── theme.ts                # Editor theme using Tailwind classes
├── plugins/                # Custom and configured plugins
│   ├── index.ts
│   ├── auto-link-plugin.tsx
│   ├── list-plugin.tsx
│   └── code-highlight-plugin.tsx
└── README.md               # This file
```

## Components

### LexicalEditor

Main editor component that integrates all functionality:

```tsx
import { LexicalEditor } from '@/components/lexical'

export function MyComponent() {
  return (
    <LexicalEditor
      placeholder="내용을 입력하세요..."
      onChange={(value) => console.log(value)}
      autoFocus
    />
  )
}
```

**Props:**
- `placeholder?: string` - Placeholder text
- `className?: string` - Additional CSS classes
- `initialValue?: string` - Initial editor content
- `onChange?: (value: string) => void` - Content change callback
- `onError?: (error: Error, editor: LexicalEditor) => void` - Error handler
- `autoFocus?: boolean` - Auto-focus on mount
- `readOnly?: boolean` - Read-only mode

### LexicalToolbar

Formatting toolbar with text formatting, lists, and alignment controls.

### Configuration

The editor is configured with:
- Rich text nodes (headings, quotes)
- List support (ordered/unordered)
- Code blocks with syntax highlighting
- Auto-linking for URLs and emails
- Table support
- Custom theme integrated with project's Tailwind CSS

## Theme Integration

The editor theme (`theme.ts`) uses CSS classes that integrate with:
- Project's CSS custom properties
- Dark/light mode support
- Consistent typography scale
- Tailwind CSS utility classes

## Plugins

### Built-in Plugins
- **HistoryPlugin** - Undo/redo functionality
- **AutoFocusPlugin** - Auto-focus behavior
- **OnChangePlugin** - Content change detection
- **RichTextPlugin** - Core rich text editing

### Custom Plugins
- **AutoLinkPlugin** - Automatic URL and email linking
- **ListPlugin** - Enhanced list functionality
- **CodeHighlightPlugin** - Syntax highlighting for code blocks

## Usage in Pages

To use the editor in your pages:

```tsx
import { LexicalEditor } from '@/components/lexical'

export default function EditorPage() {
  const handleChange = (content: string) => {
    // Handle content changes
    console.log('Editor content:', content)
  }

  return (
    <div className="container mx-auto p-4">
      <LexicalEditor
        placeholder="프로젝트 설명을 작성해주세요..."
        onChange={handleChange}
        autoFocus
      />
    </div>
  )
}
```

## Development Notes

- All components are Client Components (use 'use client')
- Follow project naming conventions (kebab-case files, PascalCase components)
- Integrate with existing theme system
- Support Korean localization
- Maintain TypeScript strict mode compatibility