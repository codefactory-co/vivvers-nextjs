# Vivvers - 바이브 코딩 프로젝트 홍보 플랫폼

Next.js 15 App Router 기반의 한국 개발자들을 위한 프로젝트 쇼케이스 플랫폼입니다.

## 🚀 기술 스택

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **Storage**: Supabase Storage
- **UI Components**: shadcn/ui, Radix UI
- **Editor**: TipTap (Rich Text Editor)
- **Styling**: Tailwind CSS, CSS Variables, Dark Mode

## 📦 설치 및 실행

### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone <repository-url>
cd vivvers-nextjs
npm install
```

### 2. 환경변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/vivvers"

# Supabase (파일 업로드용)
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"

# Next.js
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 스키마 적용
npm run db:push

# 또는 마이그레이션 사용
npm run db:migrate
```

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 애플리케이션을 확인할 수 있습니다.

## 🗄️ Supabase Storage 설정

프로젝트 이미지 업로드와 사용자 아바타 기능을 위해 Supabase Storage 버킷과 정책을 설정해야 합니다.

### 1. 버킷 생성

Supabase 대시보드 > Storage > Buckets에서 다음 버킷들을 생성하세요:

#### `avatars` 버킷 (사용자 프로필 이미지)
- **Bucket name**: `avatars`
- **Public bucket**: ✅ 체크 (공개 버킷)
- **File size limit**: 10MB
- **Allowed MIME types**: `image/*` (이미지만 허용)

#### `projects` 버킷 (프로젝트 이미지)
- **Bucket name**: `projects`
- **Public bucket**: ✅ 체크 (공개 버킷)
- **File size limit**: 50MB
- **Allowed MIME types**: `image/*` (이미지만 허용)

#### `community-posts` 버킷 (커뮤니티 게시물 이미지)
- **Bucket name**: `community-posts`
- **Public bucket**: ✅ 체크 (공개 버킷)
- **File size limit**: 20MB
- **Allowed MIME types**: `image/*` (이미지만 허용)

### 2. Storage 정책 (RLS) 설정

Supabase 대시보드 > SQL Editor에서 다음 모든 정책들을 한 번에 실행하세요:

```sql
-- =============================================
-- 기존 정책 삭제 (재실행 시 필요)
-- =============================================

-- Avatar 버킷 정책 삭제
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatars" ON storage.objects;

-- Projects 버킷 정책 삭제
DROP POLICY IF EXISTS "Anyone can view projects" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own projects" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own projects" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own projects" ON storage.objects;

-- Community Posts 버킷 정책 삭제
DROP POLICY IF EXISTS "Anyone can view community posts" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own community posts" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own community posts" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own community posts" ON storage.objects;

-- =============================================
-- Avatar 버킷 정책 (4개)
-- =============================================

-- 정책 1: Avatar 읽기 권한 (모든 사용자)
CREATE POLICY "Anyone can view avatars" 
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'avatars');

-- 정책 2: Avatar 업로드 권한 (인증된 사용자, 본인 폴더만)
CREATE POLICY "Users can upload own avatars" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- 정책 3: Avatar 업데이트 권한 (본인 파일만)
CREATE POLICY "Users can update own avatars" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- 정책 4: Avatar 삭제 권한 (본인 파일만)
CREATE POLICY "Users can delete own avatars" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- =============================================
-- Projects 버킷 정책 (4개)
-- =============================================

-- 정책 1: 프로젝트 파일 읽기 권한 (모든 사용자)
CREATE POLICY "Anyone can view projects" 
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'projects');

-- 정책 2: 프로젝트 파일 업로드 권한 (인증된 사용자, 본인 폴더만)
CREATE POLICY "Users can upload own projects" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'projects' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- 정책 3: 프로젝트 파일 업데이트 권한 (본인 파일만)
CREATE POLICY "Users can update own projects" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'projects' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- 정책 4: 프로젝트 파일 삭제 권한 (본인 파일만)
CREATE POLICY "Users can delete own projects" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'projects' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- =============================================
-- Community Posts 버킷 정책 (4개)
-- =============================================

-- 정책 1: 커뮤니티 게시물 읽기 권한 (모든 사용자)
CREATE POLICY "Anyone can view community posts" 
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'community-posts');

-- 정책 2: 커뮤니티 게시물 업로드 권한 (인증된 사용자, 본인 폴더만)
CREATE POLICY "Users can upload own community posts" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'community-posts' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- 정책 3: 커뮤니티 게시물 업데이트 권한 (본인 파일만)
CREATE POLICY "Users can update own community posts" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'community-posts' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- 정책 4: 커뮤니티 게시물 삭제 권한 (본인 파일만)
CREATE POLICY "Users can delete own community posts" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'community-posts' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);
```

### 3. 파일 저장 구조

#### Avatar 파일 구조
```
avatars/                            # 버킷 이름
├── {userId}/                       # 사용자 UUID
│   ├── avatar-timestamp.webp       # 프로필 이미지
│   └── avatar-timestamp2.jpg
└── {otherUserId}/                  # 다른 사용자
    └── avatar-timestamp.png
```

#### Projects 파일 구조
```
projects/                           # 버킷 이름
├── {userId}/                       # 사용자 UUID
│   ├── project-image-uuid.jpg      # 프로젝트 이미지
│   ├── screenshot-uuid.png
│   └── demo-uuid.webp
└── {otherUserId}/                  # 다른 사용자
    └── project-image-uuid.jpg
```

#### Community Posts 파일 구조
```
community-posts/                    # 버킷 이름
├── {userId}/                       # 사용자 UUID
│   ├── abc123-uuid.jpg             # 커뮤니티 게시물 이미지
│   ├── def456-uuid.png
│   └── ghi789-uuid.webp
```

**예시:**
```
avatars/
├── 6ba7b810-9dad-11d1-80b4-00c04fd430c8/    # 사용자 ID
│   ├── avatar_1640995200000.webp
│   └── profile_pic_1640995300000.jpg
└── 123e4567-e89b-12d3-a456-426614174000/    # 다른 사용자 ID
    └── avatar_1640995400000.png

projects/
├── 6ba7b810-9dad-11d1-80b4-00c04fd430c8/    # 사용자 ID
│   ├── project_screenshot_1640995200000.jpg
│   ├── project_demo_1640995300000.png
│   └── project_thumbnail_1640995400000.webp
└── 123e4567-e89b-12d3-a456-426614174000/    # 다른 사용자 ID
    └── project_image_1640995500000.jpg

community-posts/
├── 6ba7b810-9dad-11d1-80b4-00c04fd430c8/    # 사용자 ID
│   ├── community_post_1640995200000.jpg
│   └── community_post_1640995400000.png
└── 123e4567-e89b-12d3-a456-426614174000/    # 다른 사용자 ID
    └── community_post_1640995500000.webp
```

### 4. 정책 작동 원리

#### Avatar 권한
1. **읽기 권한**: 모든 사용자가 다른 사용자의 아바타를 볼 수 있습니다.
2. **업로드 권한**: 인증된 사용자만 자신의 폴더에 아바타를 업로드할 수 있습니다.
3. **수정/삭제 권한**: 사용자는 자신의 아바타만 수정하거나 삭제할 수 있습니다.
4. **경로 보안**: 파일 경로에서 사용자 ID를 추출하여 소유권을 검증합니다.

#### Projects 권한
1. **읽기 권한**: 모든 사용자(로그인하지 않은 사용자 포함)가 프로젝트 이미지를 볼 수 있습니다.
2. **업로드 권한**: 인증된 사용자만 자신의 폴더에 프로젝트 파일을 업로드할 수 있습니다.
3. **수정/삭제 권한**: 사용자는 자신의 프로젝트 파일만 수정하거나 삭제할 수 있습니다.
4. **경로 보안**: 파일 경로에서 사용자 ID를 추출하여 소유권을 검증합니다.

#### Community Posts 권한
1. **읽기 권한**: 모든 사용자가 커뮤니티 게시물 이미지를 볼 수 있습니다.
2. **업로드 권한**: 인증된 사용자만 자신의 폴더에 커뮤니티 게시물 이미지를 업로드할 수 있습니다.
3. **수정/삭제 권한**: 사용자는 자신이 업로드한 커뮤니티 게시물 이미지만 수정하거나 삭제할 수 있습니다.
4. **경로 보안**: 파일 경로에서 사용자 ID를 추출하여 소유권을 검증합니다.

### 5. 환경별 설정

#### 개발 환경
- 로컬 Supabase 사용 시 위 정책들을 동일하게 적용
- 테스트용 더미 데이터로 권한 테스트 권장

#### 프로덕션 환경
- 파일 크기 제한 및 보안 정책 재검토
- CDN 캐싱 설정 고려
- 모니터링 및 로깅 설정

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js 15 App Router
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                 # shadcn/ui 컴포넌트
│   ├── forms/              # 폼 관련 컴포넌트
│   ├── project/            # 프로젝트 관련 컴포넌트
│   └── common/             # 공통 컴포넌트
├── hooks/                  # 커스텀 훅
│   ├── use-project-upload.ts  # 프로젝트 업로드 훅
│   └── ...
├── lib/
│   ├── storage/            # Storage 관련 유틸리티
│   │   ├── project-upload.ts  # 프로젝트 업로드 서비스
│   │   └── ...
│   ├── prisma/             # Prisma 설정
│   ├── data/               # Mock 데이터
│   ├── validations/        # Zod 스키마
│   └── utils.ts
├── types/                  # TypeScript 타입 정의
└── ...
```

## 🛠️ 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 타입 체크
npm run typecheck

# 린트 체크
npm run lint

# 데이터베이스 관리
npm run db:generate      # Prisma 클라이언트 생성
npm run db:push          # 스키마를 DB에 적용
npm run db:migrate       # 마이그레이션 생성 및 적용
npm run db:studio        # Prisma Studio 실행
npm run db:reset         # 데이터베이스 리셋
```

## 📚 사용법

### Avatar 업로드 (온보딩 페이지)

```typescript
import { AvatarUploadButton } from '@/components/onboarding/avatar-upload-button'
import { AvatarCropModal } from '@/components/onboarding/avatar-crop-modal'

function OnboardingForm({ user }) {
  const [avatarUrl, setAvatarUrl] = useState('')
  const [showCropModal, setShowCropModal] = useState(false)
  
  const handleAvatarUpload = async (croppedBlob: Blob) => {
    const result = await replaceAvatarImage(user.id, croppedBlob, avatarUrl)
    if (result.success) {
      setAvatarUrl(result.url)
    }
  }

  return (
    <>
      <AvatarUploadButton
        src={avatarUrl}
        alt="프로필 이미지"
        name={user.email}
        onFileSelect={(file) => setShowCropModal(true)}
      />
      
      <AvatarCropModal
        isOpen={showCropModal}
        onCropComplete={handleAvatarUpload}
        // ... 기타 props
      />
    </>
  )
}
```

### 프로젝트 이미지 업로드

```typescript
import { useProjectUpload } from '@/hooks/use-project-upload'
import { supabase } from '@/lib/supabase'

function ProjectUploader({ projectId, userId }) {
  const { uploadFiles, isUploading, getUploadedUrls } = useProjectUpload(
    supabase, 
    projectId, 
    userId
  )

  const handleUpload = async (files: File[]) => {
    const urls = await uploadFiles(files)
    console.log('업로드된 URLs:', urls)
    // Prisma DB의 Project.images 배열에 URLs 저장
  }

  return (
    <input 
      type="file" 
      multiple 
      accept="image/*" 
      onChange={(e) => handleUpload(Array.from(e.target.files || []))}
      disabled={isUploading}
    />
  )
}
```

## 🔒 보안 고려사항

1. **파일 크기 제한**: 클라이언트와 서버 양쪽에서 검증
2. **파일 타입 제한**: 이미지 파일만 허용
3. **권한 검증**: Supabase RLS로 업로드/삭제 권한 제어
4. **SQL 인젝션 방지**: Prisma ORM 사용으로 자동 방지
5. **XSS 방지**: 적절한 HTML 이스케이핑

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이나 버그 리포트는 GitHub Issues를 통해 제출해주세요.