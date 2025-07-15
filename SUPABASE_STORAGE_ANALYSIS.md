# Supabase Local Storage Analysis

## Summary

The uploaded files ARE being stored successfully in your local Supabase development environment. However, they are not directly visible in your file system because they are stored inside Docker volumes.

## Storage Architecture

### 1. **Storage Location**
- Files are stored in a Docker volume named `supabase_storage_vivvers-nextjs`
- Inside the container, files are stored at `/mnt/stub/stub/[bucket-name]/`
- The storage backend is configured as `file` (not S3) for local development

### 2. **Current Storage Structure**
```
/mnt/stub/stub/
├── avatars/
│   └── avatars/
│       ├── 1b1e2020-bdcb-42ce-ab72-6cf08ee50307_1752559281312.webp/
│       ├── 1b1e2020-bdcb-42ce-ab72-6cf08ee50307_1752559738110.webp/
│       └── ... (other avatar files)
└── project-images/
    ├── 019808bc-b4da-7a11-b908-ba703b1382bd/
    │   └── 1752493247219-019808bc.png/
    └── ... (other project images)
```

### 3. **Storage Configuration** (from config.toml)
```toml
[storage]
enabled = true
file_size_limit = "50MiB"

[storage.buckets.avatars]
public = true
file_size_limit = "5MiB"
allowed_mime_types = ["image/png", "image/jpeg", "image/webp"]

[storage.buckets.projects]
public = true
file_size_limit = "10MiB"
allowed_mime_types = ["image/png", "image/jpeg", "image/webp"]
```

## Why Files Are Not Visible in Your File System

1. **Docker Volume Isolation**: On macOS, Docker runs inside a lightweight VM, and volumes are stored within this VM's filesystem, not directly on your Mac's filesystem.

2. **Volume Location**: The volume is mounted at `/var/lib/docker/volumes/supabase_storage_vivvers-nextjs/_data`, but this path exists inside the Docker VM, not on your Mac.

## How to Access Your Files

### Method 1: Through Supabase Studio (Recommended)
1. Open Supabase Studio at http://127.0.0.1:54323
2. Navigate to the Storage section
3. You should see your buckets (`avatars` and `projects`)
4. Browse and download files through the UI

### Method 2: Through the Storage API
Access files directly via URLs:
```
http://127.0.0.1:54321/storage/v1/object/public/avatars/[filename]
http://127.0.0.1:54321/storage/v1/object/public/projects/[filename]
```

### Method 3: Using Docker Commands
List files in avatars bucket:
```bash
docker exec supabase_storage_vivvers-nextjs ls -la /mnt/stub/stub/avatars/
```

List files in projects bucket:
```bash
docker exec supabase_storage_vivvers-nextjs ls -la /mnt/stub/stub/project-images/
```

Copy a file from the container to your local filesystem:
```bash
docker cp supabase_storage_vivvers-nextjs:/mnt/stub/stub/avatars/[filename] ./local-file.webp
```

### Method 4: Create a Local Mount (Advanced)
If you need direct filesystem access, you can modify the Supabase setup to use a bind mount instead of a volume. However, this requires stopping Supabase and modifying the Docker Compose configuration.

## Verification

Your files ARE being stored correctly. The evidence:
1. The `docker exec` commands show files exist in the container
2. The file paths match the expected structure
3. The storage container is running and healthy

## Recommendations

1. **Use Supabase Studio**: The easiest way to verify and manage uploaded files is through the Studio UI at http://127.0.0.1:54323

2. **Test File Access**: Try accessing your uploaded files through your application using the Supabase client - they should load correctly.

3. **Don't Rely on Direct File Access**: In a production environment, files will be stored in cloud storage (like S3), so it's better to always access files through the Supabase Storage API rather than direct file paths.

4. **Backup Strategy**: If you need to backup files, use `docker cp` commands or the Supabase Storage API to download files programmatically.