'use client'

import {useState, useEffect} from 'react'
import {useEditor, EditorContent} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {CodeBlockLowlight} from '@tiptap/extension-code-block-lowlight'
import {Image} from '@tiptap/extension-image'
import {FileHandler} from '@tiptap/extension-file-handler'
import {createLowlight, common} from 'lowlight'
import type {Extensions} from '@tiptap/react'
import {Button} from '@/components/ui/button'
import {Bold, Italic, Code, List, ListOrdered, Quote, Heading1, Heading2, Eye, EyeOff, ImageIcon} from 'lucide-react'
import {uploadFile} from '@/lib/supabase/storage'
import {createClient} from '@/lib/supabase/client'
import {useToast} from '@/hooks/use-toast'

// 언어 지원 추가
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import css from 'highlight.js/lib/languages/css'
import html from 'highlight.js/lib/languages/xml'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'
import json from 'highlight.js/lib/languages/json'

// lowlight 인스턴스 생성
const lowlight = createLowlight(common)
lowlight.register('javascript', js)
lowlight.register('typescript', ts)
lowlight.register('css', css)
lowlight.register('html', html)
lowlight.register('python', python)
lowlight.register('java', java)
lowlight.register('cpp', cpp)
lowlight.register('json', json)

// Image upload validation
const validateImageFile = (file: File, config: ImageUploadConfig): { message: string } | null => {
    const maxSize = config.maxSize || 5 * 1024 * 1024 // 5MB default
    const allowedTypes = config.allowedTypes || ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

    if (file.size > maxSize) {
        return {
            message: `파일 크기는 ${Math.round(maxSize / 1024 / 1024)}MB 이하여야 합니다`
        }
    }

    if (!allowedTypes.includes(file.type)) {
        return {
            message: `${allowedTypes.join(', ')} 이미지만 허용됩니다`
        }
    }

    return null
}

// Image upload handler
const handleImageUpload = async (file: File, config: ImageUploadConfig): Promise<string> => {
    const error = validateImageFile(file, config)
    if (error) {
        throw new Error(error.message)
    }

    try {
        const supabase = createClient()
        
        // Get current user - for now, we'll use a temporary user ID
        // In production, this should get the actual authenticated user
        const { data: { user } } = await supabase.auth.getUser()
        const userId = user?.id || 'anonymous'

        const result = await uploadFile(
            supabase,
            config.bucket,
            userId,
            file,
            {
                allowedTypes: config.allowedTypes,
                maxSize: config.maxSize,
                fileNameStrategy: 'uuid',
                preserveExtension: true,
            }
        )

        if (!result.success || !result.url) {
            throw new Error(result.error || '업로드에 실패했습니다')
        }

        return result.url
    } catch (error) {
        console.error('Image upload failed:', error)
        throw error
    }
}

interface ImageUploadConfig {
    enabled: boolean
    bucket: string
    directory: string
    maxSize?: number
    allowedTypes?: string[]
    maxFiles?: number
}

interface RichTextEditorProps {
    content: string
    onChange: (html: string, text: string, json: string) => void
    showPreview?: boolean
    mode?: 'split' | 'tabs' | 'editor-only'
    placeholder?: string
    height?: string
    imageUpload?: ImageUploadConfig
}

export default function RichTextEditor({
                                           content,
                                           onChange,
                                           showPreview = true,
                                           mode = 'split',
                                           placeholder = '내용을 입력하세요...',
                                           height = '300px',
                                           imageUpload
                                       }: RichTextEditorProps) {
    const [highlightedContent, setHighlightedContent] = useState('')
    const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor')
    const [previewVisible, setPreviewVisible] = useState(showPreview)
    const {toast} = useToast()

    // Dynamic extension configuration
    const getExtensions = () => {
        const baseExtensions: Extensions = [
            StarterKit.configure({
                codeBlock: false,
            }),
            CodeBlockLowlight.configure({
                lowlight,
                defaultLanguage: 'javascript',
                HTMLAttributes: {
                    class: 'hljs',
                },
            }),
        ]

        // Add image extensions if enabled
        if (imageUpload?.enabled) {
            // Validate required config
            if (!imageUpload.bucket || !imageUpload.directory) {
                console.error('Image upload enabled but bucket or directory not specified')
                toast({
                    title: "설정 오류",
                    description: "이미지 업로드가 활성화되었지만 bucket 또는 directory가 지정되지 않았습니다.",
                    variant: "destructive",
                })
                return baseExtensions
            }

            baseExtensions.push(
                Image.configure({
                    inline: false,
                    allowBase64: false,
                    HTMLAttributes: {
                        class: 'rounded-lg max-w-full h-auto shadow-sm',
                        loading: 'lazy',
                    },
                }),
                FileHandler.configure({
                    allowedMimeTypes: imageUpload.allowedTypes || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
                    onDrop: (editor, files, pos) => {
                        files.forEach(async (file) => {
                            if (file.type.startsWith('image/')) {
                                try {
                                    const url = await handleImageUpload(file, imageUpload)
                                    editor.chain().focus().insertContentAt(pos, {
                                        type: 'image',
                                        attrs: { src: url }
                                    }).run()
                                    toast({
                                        title: "이미지 업로드 완료",
                                        description: "이미지가 성공적으로 업로드되었습니다.",
                                    })
                                } catch (error) {
                                    toast({
                                        title: "업로드 실패",
                                        description: error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.",
                                        variant: "destructive",
                                    })
                                }
                            }
                        })
                    },
                    onPaste: (editor, files) => {
                        files.forEach(async (file) => {
                            if (file.type.startsWith('image/')) {
                                try {
                                    const url = await handleImageUpload(file, imageUpload)
                                    editor.chain().focus().setImage({ src: url }).run()
                                    toast({
                                        title: "이미지 업로드 완료",
                                        description: "이미지가 성공적으로 업로드되었습니다.",
                                    })
                                } catch (error) {
                                    toast({
                                        title: "업로드 실패",
                                        description: error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.",
                                        variant: "destructive",
                                    })
                                }
                            }
                        })
                    },
                })
            )
        }

        return baseExtensions
    }

    const editor = useEditor({
        extensions: getExtensions(),
        content,
        immediatelyRender: false,
        onUpdate: ({editor}) => {
            const html = editor.getHTML()
            const text = editor.getText()
            const json = JSON.stringify(editor.getJSON())
            onChange(html, text, json)
        },
        editorProps: {
            attributes: {
                class: `prose dark:prose-invert max-w-none focus:outline-none p-4`,
                style: `min-height: ${height}`,
                'data-placeholder': placeholder,
            },
        },
    })

    // 프리뷰 하이라이팅 처리
    useEffect(() => {
        if (!content || !showPreview) {
            setHighlightedContent('')
            return
        }

        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = content

        const codeBlocks = tempDiv.querySelectorAll('pre code')

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

        setHighlightedContent(tempDiv.innerHTML)
    }, [content, showPreview])

    if (!editor) {
        return null
    }

    const renderToolbar = () => (
        <div className="border-b bg-muted/50 p-2 flex flex-wrap gap-1 items-center">
            <Button
                type="button"
                size="sm"
                variant={editor.isActive('bold') ? 'default' : 'ghost'}
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold className="h-4 w-4"/>
            </Button>
            <Button
                type="button"
                size="sm"
                variant={editor.isActive('italic') ? 'default' : 'ghost'}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic className="h-4 w-4"/>
            </Button>
            <Button
                type="button"
                size="sm"
                variant={editor.isActive('code') ? 'default' : 'ghost'}
                onClick={() => editor.chain().focus().toggleCode().run()}
            >
                <Code className="h-4 w-4"/>
            </Button>

            <div className="w-px h-6 bg-border mx-1"/>

            <Button
                type="button"
                size="sm"
                variant={editor.isActive('heading', {level: 1}) ? 'default' : 'ghost'}
                onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
            >
                <Heading1 className="h-4 w-4"/>
            </Button>
            <Button
                type="button"
                size="sm"
                variant={editor.isActive('heading', {level: 2}) ? 'default' : 'ghost'}
                onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
            >
                <Heading2 className="h-4 w-4"/>
            </Button>

            <div className="w-px h-6 bg-border mx-1"/>

            <Button
                type="button"
                size="sm"
                variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                <List className="h-4 w-4"/>
            </Button>
            <Button
                type="button"
                size="sm"
                variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <ListOrdered className="h-4 w-4"/>
            </Button>
            <Button
                type="button"
                size="sm"
                variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
                <Quote className="h-4 w-4"/>
            </Button>

            <div className="w-px h-6 bg-border mx-1"/>

            <Button
                type="button"
                size="sm"
                variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
                코드 블록
            </Button>

            {/* Conditional Image Upload Button */}
            {imageUpload?.enabled && (
                <>
                    <div className="w-px h-6 bg-border mx-1"/>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            const input = document.createElement('input')
                            input.type = 'file'
                            input.accept = imageUpload.allowedTypes?.join(',') || 'image/*'
                            input.multiple = false
                            input.onchange = async (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0]
                                if (file && imageUpload) {
                                    try {
                                        const url = await handleImageUpload(file, imageUpload)
                                        editor.chain().focus().setImage({ src: url }).run()
                                        toast({
                                            title: "이미지 업로드 완료",
                                            description: "이미지가 성공적으로 업로드되었습니다.",
                                        })
                                    } catch (error) {
                                        toast({
                                            title: "업로드 실패",
                                            description: error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.",
                                            variant: "destructive",
                                        })
                                    }
                                }
                            }
                            input.click()
                        }}
                        title="이미지 업로드"
                    >
                        <ImageIcon className="h-4 w-4"/>
                    </Button>
                </>
            )}

            {mode === 'split' && showPreview && (
                <>
                    <div className="w-px h-6 bg-border mx-1"/>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setPreviewVisible(!previewVisible)}
                    >
                        {previewVisible ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                    </Button>
                </>
            )}
        </div>
    )

    const renderEditor = () => (
        <div className="border rounded-lg overflow-hidden">
            {renderToolbar()}
            <EditorContent editor={editor}/>
        </div>
    )

    const renderPreview = () => (
        <div className="border rounded-lg overflow-hidden">
            <div className="border-b bg-muted/50 p-2">
                <span className="text-sm font-medium">프리뷰</span>
            </div>
            <div
                className="prose prose-invert max-w-none preview-content p-4"
                style={{minHeight: height}}
                dangerouslySetInnerHTML={{__html: highlightedContent || content}}
            />
        </div>
    )

    // 모드별 렌더링
    if (mode === 'editor-only') {
        return renderEditor()
    }

    if (mode === 'tabs') {
        return (
            <div className="space-y-2">
                <div className="flex space-x-1 border-b">
                    <Button
                        type="button"
                        variant={activeTab === 'editor' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('editor')}
                    >
                        에디터
                    </Button>
                    {showPreview && (
                        <Button
                            type="button"
                            variant={activeTab === 'preview' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('preview')}
                        >
                            프리뷰
                        </Button>
                    )}
                </div>
                {activeTab === 'editor' ? renderEditor() : renderPreview()}
            </div>
        )
    }

    // split 모드
    return (
        <div className="space-y-4">
            {renderEditor()}
            {showPreview && previewVisible && renderPreview()}
        </div>
    )
}