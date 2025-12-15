import {
  uploadFile,
  uploadProjectImage,
  uploadAvatar,
  uploadDocument,
  deleteFile,
  deleteUserFiles,
  type UploadOptions
} from '@/lib/supabase/storage'

// Mock crypto.randomUUID
const mockRandomUUID = jest.fn()
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: mockRandomUUID
  }
})

// Mock console methods to avoid noise during tests
const originalConsoleError = console.error
const originalConsoleLog = console.log
const originalConsoleWarn = console.warn

beforeAll(() => {
  console.error = jest.fn()
  console.log = jest.fn()
  console.warn = jest.fn()
})

afterAll(() => {
  console.error = originalConsoleError
  console.log = originalConsoleLog
  console.warn = originalConsoleWarn
})

// Type for mock Supabase client
interface MockStorageBucket {
  upload: jest.Mock
  remove: jest.Mock
  list: jest.Mock
  getPublicUrl: jest.Mock
}

interface MockSupabaseClient {
  storage: {
    from: jest.Mock<MockStorageBucket>
  }
}

describe('Supabase Storage Utilities', () => {
  let mockSupabaseClient: MockSupabaseClient
  let mockFile: File

  beforeEach(() => {
    jest.clearAllMocks()
    mockRandomUUID.mockReturnValue('test-uuid-123')

    // Mock file
    mockFile = new File(['test content'], 'test.jpg', {
      type: 'image/jpeg',
      lastModified: Date.now()
    })

    // Mock Supabase client
    mockSupabaseClient = {
      storage: {
        from: jest.fn().mockReturnValue({
          upload: jest.fn(),
          remove: jest.fn(),
          list: jest.fn(),
          getPublicUrl: jest.fn()
        })
      }
    }
  })

  describe('uploadFile', () => {
    it('should upload file successfully with default options', async () => {
      const mockUpload = mockSupabaseClient.storage.from().upload
      const mockGetPublicUrl = mockSupabaseClient.storage.from().getPublicUrl

      mockUpload.mockResolvedValue({
        data: { path: 'user123/test-uuid-123.jpg' },
        error: null
      })

      mockGetPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://example.com/storage/user123/test-uuid-123.jpg' }
      })

      mockSupabaseClient.storage.from().list.mockResolvedValue({
        data: [],
        error: null
      })

      const result = await uploadFile(
        mockSupabaseClient,
        'projects',
        'user123',
        mockFile
      )

      expect(result).toEqual({
        success: true,
        url: 'https://example.com/storage/user123/test-uuid-123.jpg',
        path: 'user123/test-uuid-123.jpg',
        fileName: 'test-uuid-123.jpg',
        size: mockFile.size
      })

      expect(mockUpload).toHaveBeenCalledWith(
        'user123/test-uuid-123.jpg',
        mockFile,
        {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg'
        }
      )
    })

    it('should validate file size and reject oversized files', async () => {
      const largeFile = new File(['x'.repeat(1000)], 'large.jpg', {
        type: 'image/jpeg'
      })

      const options: UploadOptions = {
        maxSize: 500 // 500 bytes
      }

      const result = await uploadFile(
        mockSupabaseClient,
        'projects',
        'user123',
        largeFile,
        options
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('파일 크기가')
      expect(result.error).toContain('를 초과합니다')
    })

    it('should validate file type and reject invalid types', async () => {
      const textFile = new File(['content'], 'test.txt', {
        type: 'text/plain'
      })

      const options: UploadOptions = {
        allowedTypes: ['image/jpeg', 'image/png']
      }

      const result = await uploadFile(
        mockSupabaseClient,
        'projects',
        'user123',
        textFile,
        options
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('지원하지 않는 파일 형식')
    })

    it('should accept wildcard file types', async () => {
      const mockUpload = mockSupabaseClient.storage.from().upload
      const mockGetPublicUrl = mockSupabaseClient.storage.from().getPublicUrl

      mockUpload.mockResolvedValue({
        data: { path: 'user123/test-uuid-123.jpg' },
        error: null
      })

      mockGetPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://example.com/storage/user123/test-uuid-123.jpg' }
      })

      mockSupabaseClient.storage.from().list.mockResolvedValue({
        data: [],
        error: null
      })

      const options: UploadOptions = {
        allowedTypes: ['image/*']
      }

      const result = await uploadFile(
        mockSupabaseClient,
        'projects',
        'user123',
        mockFile,
        options
      )

      expect(result.success).toBe(true)
    })

    it('should generate original filename when strategy is original', async () => {
      const mockUpload = mockSupabaseClient.storage.from().upload
      const mockGetPublicUrl = mockSupabaseClient.storage.from().getPublicUrl

      mockUpload.mockResolvedValue({
        data: { path: 'user123/test.jpg' },
        error: null
      })

      mockGetPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://example.com/storage/user123/test.jpg' }
      })

      mockSupabaseClient.storage.from().list.mockResolvedValue({
        data: [],
        error: null
      })

      const options: UploadOptions = {
        fileNameStrategy: 'original'
      }

      const result = await uploadFile(
        mockSupabaseClient,
        'projects',
        'user123',
        mockFile,
        options
      )

      expect(result.success).toBe(true)
      expect(result.fileName).toBe('test.jpg')
    })

    it('should generate timestamp filename when strategy is timestamp', async () => {
      const mockUpload = mockSupabaseClient.storage.from().upload
      const mockGetPublicUrl = mockSupabaseClient.storage.from().getPublicUrl

      mockUpload.mockResolvedValue({
        data: { path: 'user123/1234567890-test.jpg' },
        error: null
      })

      mockGetPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://example.com/storage/user123/1234567890-test.jpg' }
      })

      mockSupabaseClient.storage.from().list.mockResolvedValue({
        data: [],
        error: null
      })

      // Mock Date.now
      const originalDateNow = Date.now
      Date.now = jest.fn(() => 1234567890)

      const options: UploadOptions = {
        fileNameStrategy: 'timestamp'
      }

      const result = await uploadFile(
        mockSupabaseClient,
        'projects',
        'user123',
        mockFile,
        options
      )

      expect(result.success).toBe(true)
      expect(result.fileName).toBe('1234567890-test.jpg')

      // Restore Date.now
      Date.now = originalDateNow
    })

    it('should handle duplicate filenames by appending counter', async () => {
      const mockUpload = mockSupabaseClient.storage.from().upload
      const mockGetPublicUrl = mockSupabaseClient.storage.from().getPublicUrl

      mockUpload.mockResolvedValue({
        data: { path: 'user123/test-uuid-123(1).jpg' },
        error: null
      })

      mockGetPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://example.com/storage/user123/test-uuid-123(1).jpg' }
      })

      // Mock existing files
      mockSupabaseClient.storage.from().list.mockResolvedValue({
        data: [
          { name: 'test-uuid-123.jpg' }
        ],
        error: null
      })

      const result = await uploadFile(
        mockSupabaseClient,
        'projects',
        'user123',
        mockFile
      )

      expect(result.success).toBe(true)
      expect(result.fileName).toBe('test-uuid-123(1).jpg')
    })

    it('should overwrite existing file when overwrite option is true', async () => {
      const mockUpload = mockSupabaseClient.storage.from().upload
      const mockGetPublicUrl = mockSupabaseClient.storage.from().getPublicUrl
      const mockRemove = mockSupabaseClient.storage.from().remove

      mockUpload.mockResolvedValue({
        data: { path: 'user123/test-uuid-123.jpg' },
        error: null
      })

      mockGetPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://example.com/storage/user123/test-uuid-123.jpg' }
      })

      mockRemove.mockResolvedValue({ error: null })

      const options: UploadOptions = {
        overwrite: true
      }

      const result = await uploadFile(
        mockSupabaseClient,
        'projects',
        'user123',
        mockFile,
        options
      )

      expect(result.success).toBe(true)
      expect(mockRemove).toHaveBeenCalledWith(['user123/test-uuid-123.jpg'])
    })

    it('should call progress callback during upload', async () => {
      const mockUpload = mockSupabaseClient.storage.from().upload
      const mockGetPublicUrl = mockSupabaseClient.storage.from().getPublicUrl
      const onProgress = jest.fn()

      mockUpload.mockImplementation(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({
              data: { path: 'user123/test-uuid-123.jpg' },
              error: null
            })
          }, 100)
        })
      })

      mockGetPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://example.com/storage/user123/test-uuid-123.jpg' }
      })

      mockSupabaseClient.storage.from().list.mockResolvedValue({
        data: [],
        error: null
      })

      const options: UploadOptions = {
        onProgress
      }

      const result = await uploadFile(
        mockSupabaseClient,
        'projects',
        'user123',
        mockFile,
        options
      )

      expect(result.success).toBe(true)
      expect(onProgress).toHaveBeenCalled()

      // Check that final progress was called
      const finalCall = onProgress.mock.calls[onProgress.mock.calls.length - 1][0]
      expect(finalCall.percentage).toBe(100)
      expect(finalCall.loaded).toBe(mockFile.size)
    })

    it('should call validation error callback on validation failure', async () => {
      const onValidationError = jest.fn()
      const largeFile = new File(['x'.repeat(1000)], 'large.jpg', {
        type: 'image/jpeg'
      })

      const options: UploadOptions = {
        maxSize: 500,
        onValidationError
      }

      const result = await uploadFile(
        mockSupabaseClient,
        'projects',
        'user123',
        largeFile,
        options
      )

      expect(result.success).toBe(false)
      expect(onValidationError).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'size',
          fileName: 'large.jpg',
          message: expect.stringContaining('파일 크기가')
        })
      )
    })

    it('should handle Supabase upload error', async () => {
      const mockUpload = mockSupabaseClient.storage.from().upload

      mockUpload.mockResolvedValue({
        data: null,
        error: { message: 'Upload failed' }
      })

      mockSupabaseClient.storage.from().list.mockResolvedValue({
        data: [],
        error: null
      })

      const result = await uploadFile(
        mockSupabaseClient,
        'projects',
        'user123',
        mockFile
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('업로드에 실패했습니다')
    })

    it('should handle exception during upload', async () => {
      const mockUpload = mockSupabaseClient.storage.from().upload

      mockUpload.mockRejectedValue(new Error('Network error'))

      mockSupabaseClient.storage.from().list.mockResolvedValue({
        data: [],
        error: null
      })

      const result = await uploadFile(
        mockSupabaseClient,
        'projects',
        'user123',
        mockFile
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('업로드 중 오류가 발생했습니다')
    })

    it('should preserve file extension when preserveExtension is true', async () => {
      const mockUpload = mockSupabaseClient.storage.from().upload
      const mockGetPublicUrl = mockSupabaseClient.storage.from().getPublicUrl

      mockUpload.mockResolvedValue({
        data: { path: 'user123/test-uuid-123.jpg' },
        error: null
      })

      mockGetPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://example.com/storage/user123/test-uuid-123.jpg' }
      })

      mockSupabaseClient.storage.from().list.mockResolvedValue({
        data: [],
        error: null
      })

      const options: UploadOptions = {
        fileNameStrategy: 'uuid',
        preserveExtension: true
      }

      const result = await uploadFile(
        mockSupabaseClient,
        'projects',
        'user123',
        mockFile,
        options
      )

      expect(result.success).toBe(true)
      expect(result.fileName).toBe('test-uuid-123.jpg')
    })

    it('should not preserve file extension when preserveExtension is false', async () => {
      const mockUpload = mockSupabaseClient.storage.from().upload
      const mockGetPublicUrl = mockSupabaseClient.storage.from().getPublicUrl

      mockUpload.mockResolvedValue({
        data: { path: 'user123/test-uuid-123' },
        error: null
      })

      mockGetPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://example.com/storage/user123/test-uuid-123' }
      })

      mockSupabaseClient.storage.from().list.mockResolvedValue({
        data: [],
        error: null
      })

      const options: UploadOptions = {
        fileNameStrategy: 'uuid',
        preserveExtension: false
      }

      const result = await uploadFile(
        mockSupabaseClient,
        'projects',
        'user123',
        mockFile,
        options
      )

      expect(result.success).toBe(true)
      expect(result.fileName).toBe('test-uuid-123')
    })
  })

  describe('uploadProjectImage', () => {
    it('should call uploadFile with correct parameters for project images', async () => {
      const mockUpload = mockSupabaseClient.storage.from().upload
      const mockGetPublicUrl = mockSupabaseClient.storage.from().getPublicUrl

      mockUpload.mockResolvedValue({
        data: { path: 'user123/test-uuid-123.jpg' },
        error: null
      })

      mockGetPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://example.com/storage/user123/test-uuid-123.jpg' }
      })

      mockSupabaseClient.storage.from().list.mockResolvedValue({
        data: [],
        error: null
      })

      const result = await uploadProjectImage(
        mockSupabaseClient,
        'user123',
        mockFile
      )

      expect(result.success).toBe(true)
      expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith('projects')
    })

    it('should reject non-image files for project images', async () => {
      const textFile = new File(['content'], 'test.txt', {
        type: 'text/plain'
      })

      const result = await uploadProjectImage(
        mockSupabaseClient,
        'user123',
        textFile
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('지원하지 않는 파일 형식')
    })
  })

  describe('uploadAvatar', () => {
    it('should call uploadFile with correct parameters for avatars', async () => {
      const mockUpload = mockSupabaseClient.storage.from().upload
      const mockGetPublicUrl = mockSupabaseClient.storage.from().getPublicUrl
      const mockRemove = mockSupabaseClient.storage.from().remove

      mockUpload.mockResolvedValue({
        data: { path: 'user123/test.jpg' },
        error: null
      })

      mockGetPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://example.com/storage/user123/test.jpg' }
      })

      mockRemove.mockResolvedValue({ error: null })

      const result = await uploadAvatar(
        mockSupabaseClient,
        'user123',
        mockFile
      )

      expect(result.success).toBe(true)
      expect(result.fileName).toBe('test.jpg') // Original filename strategy
      expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith('avatars')
    })
  })

  describe('uploadDocument', () => {
    it('should call uploadFile with correct parameters for documents', async () => {
      const pdfFile = new File(['content'], 'document.pdf', {
        type: 'application/pdf'
      })

      const mockUpload = mockSupabaseClient.storage.from().upload
      const mockGetPublicUrl = mockSupabaseClient.storage.from().getPublicUrl

      // Mock Date.now for timestamp strategy
      const originalDateNow = Date.now
      Date.now = jest.fn(() => 1234567890)

      mockUpload.mockResolvedValue({
        data: { path: 'user123/1234567890-document.pdf' },
        error: null
      })

      mockGetPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://example.com/storage/user123/1234567890-document.pdf' }
      })

      mockSupabaseClient.storage.from().list.mockResolvedValue({
        data: [],
        error: null
      })

      const result = await uploadDocument(
        mockSupabaseClient,
        'user123',
        pdfFile
      )

      expect(result.success).toBe(true)
      expect(result.fileName).toBe('1234567890-document.pdf') // Timestamp strategy
      expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith('documents')

      // Restore Date.now
      Date.now = originalDateNow
    })
  })

  describe('deleteFile', () => {
    it('should delete file successfully', async () => {
      const mockRemove = mockSupabaseClient.storage.from().remove

      mockRemove.mockResolvedValue({ error: null })

      const result = await deleteFile(
        mockSupabaseClient,
        'projects',
        'user123/test-file.jpg'
      )

      expect(result.success).toBe(true)
      expect(mockRemove).toHaveBeenCalledWith(['user123/test-file.jpg'])
      expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith('projects')
    })

    it('should handle delete error', async () => {
      const mockRemove = mockSupabaseClient.storage.from().remove

      mockRemove.mockResolvedValue({
        error: { message: 'File not found' }
      })

      const result = await deleteFile(
        mockSupabaseClient,
        'projects',
        'user123/nonexistent.jpg'
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('파일 삭제에 실패했습니다')
    })

    it('should handle exception during delete', async () => {
      const mockRemove = mockSupabaseClient.storage.from().remove

      mockRemove.mockRejectedValue(new Error('Network error'))

      const result = await deleteFile(
        mockSupabaseClient,
        'projects',
        'user123/test-file.jpg'
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('파일 삭제 중 오류가 발생했습니다')
    })
  })

  describe('deleteUserFiles', () => {
    it('should delete all user files successfully', async () => {
      const mockList = mockSupabaseClient.storage.from().list
      const mockRemove = mockSupabaseClient.storage.from().remove

      mockList.mockResolvedValue({
        data: [
          { name: 'file1.jpg' },
          { name: 'file2.png' }
        ],
        error: null
      })

      mockRemove.mockResolvedValue({ error: null })

      const result = await deleteUserFiles(
        mockSupabaseClient,
        'projects',
        'user123'
      )

      expect(result.success).toBe(true)
      expect(mockList).toHaveBeenCalledWith('user123', {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      })
      expect(mockRemove).toHaveBeenCalledWith([
        'user123/file1.jpg',
        'user123/file2.png'
      ])
    })

    it('should handle case with no files to delete', async () => {
      const mockList = mockSupabaseClient.storage.from().list

      mockList.mockResolvedValue({
        data: [],
        error: null
      })

      const result = await deleteUserFiles(
        mockSupabaseClient,
        'projects',
        'user123'
      )

      expect(result.success).toBe(true)
      expect(mockSupabaseClient.storage.from().remove).not.toHaveBeenCalled()
    })

    it('should handle null files array', async () => {
      const mockList = mockSupabaseClient.storage.from().list

      mockList.mockResolvedValue({
        data: null,
        error: null
      })

      const result = await deleteUserFiles(
        mockSupabaseClient,
        'projects',
        'user123'
      )

      expect(result.success).toBe(true)
      expect(mockSupabaseClient.storage.from().remove).not.toHaveBeenCalled()
    })

    it('should handle list error', async () => {
      const mockList = mockSupabaseClient.storage.from().list

      mockList.mockResolvedValue({
        data: null,
        error: { message: 'Access denied' }
      })

      const result = await deleteUserFiles(
        mockSupabaseClient,
        'projects',
        'user123'
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('파일 목록 조회에 실패했습니다')
    })

    it('should handle delete error', async () => {
      const mockList = mockSupabaseClient.storage.from().list
      const mockRemove = mockSupabaseClient.storage.from().remove

      mockList.mockResolvedValue({
        data: [{ name: 'file1.jpg' }],
        error: null
      })

      mockRemove.mockResolvedValue({
        error: { message: 'Delete failed' }
      })

      const result = await deleteUserFiles(
        mockSupabaseClient,
        'projects',
        'user123'
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('파일 삭제에 실패했습니다')
    })

    it('should handle exception during operation', async () => {
      const mockList = mockSupabaseClient.storage.from().list

      mockList.mockRejectedValue(new Error('Network error'))

      const result = await deleteUserFiles(
        mockSupabaseClient,
        'projects',
        'user123'
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('파일 삭제 중 오류가 발생했습니다')
    })
  })
})