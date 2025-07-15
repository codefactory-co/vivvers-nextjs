# TipTap Image Upload Usage Guide

This guide demonstrates how to use the newly implemented image upload functionality in the RichTextEditor component.

## ✅ Implementation Complete

The TipTap image upload feature has been successfully implemented with the following capabilities:

- **Configurable by default**: Image upload is disabled unless explicitly enabled
- **Supabase Storage integration**: Uses existing storage infrastructure
- **Drag & drop support**: Upload images by dragging files into the editor
- **Toolbar button**: Click to upload images via file picker
- **Paste support**: Paste images directly from clipboard
- **Validation**: File type, size, and count validation
- **Error handling**: Toast notifications for success/failure
- **TypeScript support**: Fully typed configuration options

## 🎯 Current Implementation Status

### ✅ **Enabled (Image Upload Available):**
- **Community Posts** - `bucket: 'community-posts', directory: 'posts'`
- **Community Comments** - Disabled (no image upload)

### ❌ **Disabled (No Image Upload):**
- **Project Descriptions** - Image upload disabled as requested
- **Project Comments** - Image upload disabled

### 🔄 **Available for Future Use:**
- Blog posts, user profiles, documentation, etc.

## 🔧 Configuration Options

```typescript
interface ImageUploadConfig {
    enabled: boolean        // Default: false (MUST be true to enable)
    bucket: string         // Required: Supabase bucket name
    directory: string      // Required: Directory path within bucket
    maxSize?: number       // Optional: Max file size in bytes (default: 5MB)
    allowedTypes?: string[] // Optional: Allowed MIME types
    maxFiles?: number      // Optional: Max files per upload (default: 10)
}
```

## 📋 Usage Examples

### 1. Basic Usage (No Image Upload) - Default Behavior

```tsx
// Default behavior - no image upload functionality
<RichTextEditor
    content={content}
    onChange={(html, text, json) => setContent(html)}
    placeholder="Type your content..."
/>
```

### 2. Community Post with Image Upload

```tsx
// Enable image upload for community posts
<RichTextEditor
    content={formData.contentHtml}
    onChange={(html, text, json) => {
        setFormData(prev => ({
            ...prev,
            content: text,
            contentHtml: html,
            contentJson: json
        }))
    }}
    imageUpload={{
        enabled: true,
        bucket: 'community-posts',
        directory: 'posts',
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        maxFiles: 15
    }}
    placeholder="커뮤니티 게시글 내용을 작성하세요..."
    mode="editor-only"
    height="400px"
/>
```

### 3. Blog Post Editor

```tsx
// Blog posts with different settings
<RichTextEditor
    content={blogContent}
    onChange={(html, text, json) => setBlogContent(html)}
    imageUpload={{
        enabled: true,
        bucket: 'blog-content',
        directory: 'posts',
        maxSize: 10 * 1024 * 1024, // 10MB for blog images
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maxFiles: 20
    }}
    mode="split"
    showPreview={true}
/>
```

### 4. Comment Editor (No Images)

```tsx
// Comments typically don't need image upload
<RichTextEditor
    content={formData.contentHtml}
    onChange={(html, text, json) => {
        setFormData(prev => ({
            ...prev,
            content: text,
            contentHtml: html,
            contentJson: json
        }))
    }}
    mode="editor-only"
    height="200px"
    placeholder="댓글을 작성하세요..."
    // imageUpload prop omitted = disabled by default
/>
```

### 5. User Profile Bio

```tsx
// User bio with limited image support
<RichTextEditor
    content={userBio}
    onChange={(html, text, json) => setUserBio(html)}
    imageUpload={{
        enabled: true,
        bucket: 'user-content',
        directory: 'bio-images',
        maxSize: 2 * 1024 * 1024, // 2MB limit for bio images
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maxFiles: 3 // Limited to 3 images
    }}
    height="200px"
    placeholder="Tell us about yourself..."
/>
```

## 🎯 Implementation Features

### Validation & Error Handling
- **File type validation**: Only specified image types allowed
- **File size validation**: Configurable size limits
- **Count validation**: Maximum number of files per upload
- **Toast notifications**: User-friendly error messages in Korean

### Upload Capabilities
1. **Toolbar Button**: Click the image icon in the toolbar
2. **Drag & Drop**: Drag image files into the editor
3. **Paste**: Paste images from clipboard
4. **File Picker**: Standard file selection dialog

### Storage Organization
Images are stored in Supabase Storage with the following structure:
```
bucket-name/
└── userId/
    └── filename-with-uuid.ext
```

## 🔒 Security & Permissions

- **User Authentication**: Requires authenticated user for uploads
- **Bucket Policies**: Ensure proper Supabase bucket policies are configured
- **File Validation**: Server-side validation through existing storage service
- **Public URLs**: Generated URLs are publicly accessible

## 🛠 Required Supabase Setup

Make sure these buckets exist in your Supabase project:
- `project-images` - For project-related images
- `user-content` - For user-generated content
- `blog-content` - For blog/article images

## 🎨 Styling

Images in the editor automatically get these CSS classes:
```css
.ProseMirror img {
    @apply rounded-lg max-w-full h-auto shadow-sm;
    loading: lazy;
}
```

## 🚀 Getting Started

1. **Enable image upload** by setting `enabled: true`
2. **Specify bucket and directory** (required)
3. **Configure limits** (optional, sensible defaults provided)
4. **Test the functionality**:
   - Click the image button in toolbar
   - Drag an image file into the editor
   - Paste an image from clipboard

## ⚠️ Important Notes

- **Default behavior**: Image upload is **disabled by default**
- **Required configuration**: Must provide `bucket` and `directory` when enabled
- **Authentication**: User must be authenticated for uploads to work
- **Storage policies**: Ensure Supabase storage policies allow uploads
- **File cleanup**: Consider implementing cleanup for unused images

## 🔧 Troubleshooting

### Images not uploading?
1. Check if `imageUpload.enabled` is `true`
2. Verify `bucket` and `directory` are specified
3. Ensure user is authenticated
4. Check Supabase storage policies
5. Verify file meets validation criteria

### No image button in toolbar?
- The image button only appears when `imageUpload.enabled` is `true`

### Upload errors?
- Check browser console for detailed error messages
- Verify Supabase storage configuration
- Check file size and type restrictions

This implementation provides a robust, configurable image upload system that integrates seamlessly with your existing TipTap editor and Supabase infrastructure.