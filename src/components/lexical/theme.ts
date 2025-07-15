import { EditorThemeClasses } from 'lexical'

export const LexicalTheme: EditorThemeClasses = {
  // Paragraph and text styling
  paragraph: 'mb-1',
  
  // Heading styles
  heading: {
    h1: 'text-3xl font-bold mb-4 mt-6',
    h2: 'text-2xl font-bold mb-3 mt-5',
    h3: 'text-xl font-bold mb-2 mt-4',
    h4: 'text-lg font-semibold mb-2 mt-3',
    h5: 'text-base font-semibold mb-2 mt-2',
    h6: 'text-sm font-semibold mb-1 mt-2',
  },
  
  // Quote styling
  quote: 'border-l-4 border-border pl-4 italic text-muted-foreground my-4',
  
  // List styling
  list: {
    nested: {
      listitem: 'list-none',
    },
    ol: 'list-decimal list-outside ml-4 my-2',
    ul: 'list-disc list-outside ml-4 my-2',
    listitem: 'mb-1',
  },
  
  // Text formatting
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underline line-through',
    code: 'bg-muted px-1 py-0.5 rounded text-sm font-mono',
  },
  
  // Code block styling
  code: 'bg-muted rounded-md p-4 font-mono text-sm overflow-x-auto block my-4',
  codeHighlight: {
    atrule: 'text-purple-600 dark:text-purple-400',
    attr: 'text-blue-600 dark:text-blue-400',
    boolean: 'text-orange-600 dark:text-orange-400',
    builtin: 'text-purple-600 dark:text-purple-400',
    cdata: 'text-gray-600 dark:text-gray-400',
    char: 'text-green-600 dark:text-green-400',
    class: 'text-blue-600 dark:text-blue-400',
    'class-name': 'text-blue-600 dark:text-blue-400',
    comment: 'text-gray-500 dark:text-gray-500 italic',
    constant: 'text-orange-600 dark:text-orange-400',
    deleted: 'text-red-600 dark:text-red-400',
    doctype: 'text-gray-600 dark:text-gray-400',
    entity: 'text-orange-600 dark:text-orange-400',
    function: 'text-blue-600 dark:text-blue-400',
    important: 'text-red-600 dark:text-red-400',
    inserted: 'text-green-600 dark:text-green-400',
    keyword: 'text-purple-600 dark:text-purple-400',
    namespace: 'text-blue-600 dark:text-blue-400',
    number: 'text-orange-600 dark:text-orange-400',
    operator: 'text-gray-700 dark:text-gray-300',
    prolog: 'text-gray-600 dark:text-gray-400',
    property: 'text-blue-600 dark:text-blue-400',
    punctuation: 'text-gray-700 dark:text-gray-300',
    regex: 'text-green-600 dark:text-green-400',
    selector: 'text-green-600 dark:text-green-400',
    string: 'text-green-600 dark:text-green-400',
    symbol: 'text-orange-600 dark:text-orange-400',
    tag: 'text-red-600 dark:text-red-400',
    url: 'text-blue-600 dark:text-blue-400',
    variable: 'text-blue-600 dark:text-blue-400',
  },
  
  // Link styling
  link: 'text-primary underline hover:text-primary/80 cursor-pointer',
  
  // Table styling
  table: 'border-collapse border border-border my-4',
  tableCell: 'border border-border p-2 min-w-[100px]',
  tableCellHeader: 'border border-border p-2 min-w-[100px] bg-muted font-semibold',
}