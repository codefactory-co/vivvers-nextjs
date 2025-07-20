import { validateImageFile, fileToDataUrl, createCroppedImage } from '@/lib/utils/image-crop'
import { Area } from 'react-easy-crop'

// Mock Canvas API
const mockCanvas = {
  width: 0,
  height: 0,
  getContext: jest.fn(),
  toBlob: jest.fn(),
}

const mockContext = {
  imageSmoothingEnabled: false,
  imageSmoothingQuality: 'low',
  drawImage: jest.fn(),
}

// Mock Image constructor
class MockImage {
  crossOrigin: string = ''
  src: string = ''
  onload: (() => void) | null = null
  onerror: (() => void) | null = null

  constructor() {
    // Simulate async loading
    setTimeout(() => {
      if (this.onload) {
        this.onload()
      }
    }, 0)
  }
}

// Mock FileReader
class MockFileReader {
  result: string | ArrayBuffer | null = null
  onload: ((event: ProgressEvent<FileReader>) => void) | null = null
  onerror: (() => void) | null = null

  readAsDataURL(file: File) {
    setTimeout(() => {
      this.result = `data:${file.type};base64,mockbase64data`
      if (this.onload) {
        const mockEvent = {
          target: this,
        } as unknown as ProgressEvent<FileReader>
        this.onload(mockEvent)
      }
    }, 0)
  }
}

// Mock File constructor  
const createMockFile = (
  content: string = 'mock content',
  filename: string = 'test.jpg',
  mimeType: string = 'image/jpeg',
  size: number = 1024
): File => {
  // Create a plain object that mimics a File
  const mockFile = {
    name: filename,
    type: mimeType,
    size: size,
    lastModified: Date.now(),
    slice: jest.fn(),
    stream: jest.fn(),
    text: jest.fn().mockResolvedValue(content),
    arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
  } as unknown as File
  
  return mockFile
}


describe('image-crop utilities', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()
    
    // Setup Canvas mocks
    mockCanvas.getContext.mockReturnValue(mockContext)
    mockCanvas.toBlob.mockImplementation((callback) => {
      setTimeout(() => {
        // Create a real Blob since we're not mocking File constructor anymore
        const blob = new Blob(['mock image data'], { type: 'image/jpeg' })
        callback(blob)
      }, 0)
    })
    
    // Mock document.createElement
    global.document.createElement = jest.fn().mockImplementation((tagName) => {
      if (tagName === 'canvas') {
        return mockCanvas
      }
      return {}
    })
    
    // Mock global Image
    global.Image = MockImage as unknown as typeof Image
    
    // Mock global FileReader
    global.FileReader = MockFileReader as unknown as typeof FileReader
    
    // Don't mock global File - let createMockFile handle file creation
  })

  describe('validateImageFile', () => {
    it('should validate JPEG files correctly', () => {
      const file = createMockFile('content', 'test.jpg', 'image/jpeg', 1024)
      const result = validateImageFile(file)
      
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should validate PNG files correctly', () => {
      const file = createMockFile('content', 'test.png', 'image/png', 1024)
      const result = validateImageFile(file)
      
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should validate WebP files correctly', () => {
      const file = createMockFile('content', 'test.webp', 'image/webp', 1024)
      const result = validateImageFile(file)
      
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject invalid file types', () => {
      const file = createMockFile('content', 'test.gif', 'image/gif', 1024)
      const result = validateImageFile(file)
      
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('JPG, PNG, WebP 파일만 업로드 가능합니다')
    })

    it('should reject files with non-image MIME types', () => {
      const file = createMockFile('content', 'test.txt', 'text/plain', 1024)
      const result = validateImageFile(file)
      
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('JPG, PNG, WebP 파일만 업로드 가능합니다')
    })

    it('should reject files larger than 10MB', () => {
      const largeFileSize = 11 * 1024 * 1024 // 11MB
      const file = createMockFile('content', 'large.jpg', 'image/jpeg', largeFileSize)
      const result = validateImageFile(file)
      
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('파일 크기는 10MB 이하여야 합니다')
    })

    it('should accept files exactly at 10MB limit', () => {
      const maxFileSize = 10 * 1024 * 1024 // Exactly 10MB
      const file = createMockFile('content', 'max.jpg', 'image/jpeg', maxFileSize)
      const result = validateImageFile(file)
      
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should handle empty files', () => {
      const file = createMockFile('', 'empty.jpg', 'image/jpeg', 0)
      const result = validateImageFile(file)
      
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should handle edge case file types', () => {
      const testCases = [
        { type: 'image/svg+xml', expected: false },
        { type: 'image/bmp', expected: false },
        { type: 'image/tiff', expected: false },
        { type: 'application/octet-stream', expected: false },
      ]

      testCases.forEach(({ type, expected }) => {
        const file = createMockFile('content', 'test.file', type, 1024)
        const result = validateImageFile(file)
        
        expect(result.isValid).toBe(expected)
        if (!expected) {
          expect(result.error).toBe('JPG, PNG, WebP 파일만 업로드 가능합니다')
        }
      })
    })
  })

  describe('fileToDataUrl', () => {
    it('should convert file to data URL successfully', async () => {
      const file = createMockFile('test content', 'test.jpg', 'image/jpeg')
      const result = await fileToDataUrl(file)
      
      expect(result).toBe('data:image/jpeg;base64,mockbase64data')
    })

    it('should handle different file types', async () => {
      const fileTypes = [
        { type: 'image/png', expected: 'data:image/png;base64,mockbase64data' },
        { type: 'image/webp', expected: 'data:image/webp;base64,mockbase64data' },
        { type: 'image/jpeg', expected: 'data:image/jpeg;base64,mockbase64data' },
      ]

      for (const { type, expected } of fileTypes) {
        const file = createMockFile('content', 'test.file', type)
        const result = await fileToDataUrl(file)
        expect(result).toBe(expected)
      }
    })

    it('should handle FileReader error', async () => {
      // Mock FileReader to simulate error
      global.FileReader = jest.fn().mockImplementation(() => {
        const mockReader = {
          result: null,
          onload: null,
          onerror: null,
          readAsDataURL: jest.fn().mockImplementation(function(this: MockFileReader) {
            setTimeout(() => {
              if (this.onerror) {
                this.onerror()
              }
            }, 0)
          })
        }
        return mockReader
      }) as unknown as typeof FileReader

      const file = createMockFile('content', 'test.jpg', 'image/jpeg')
      
      await expect(fileToDataUrl(file)).rejects.toThrow('파일 읽기에 실패했습니다')
    })

    it('should handle invalid result from FileReader', async () => {
      // Mock FileReader to return invalid result
      global.FileReader = jest.fn().mockImplementation(() => {
        const mockReader = {
          result: null,
          onload: null,
          onerror: null,
          readAsDataURL: jest.fn().mockImplementation(function(this: MockFileReader) {
            setTimeout(() => {
              this.result = null
              if (this.onload) {
                this.onload({ target: this } as ProgressEvent<FileReader>)
              }
            }, 0)
          })
        }
        return mockReader
      }) as unknown as typeof FileReader

      const file = createMockFile('content', 'test.jpg', 'image/jpeg')
      
      await expect(fileToDataUrl(file)).rejects.toThrow('파일 읽기에 실패했습니다')
    })

    it('should handle non-string result from FileReader', async () => {
      // Mock FileReader to return ArrayBuffer instead of string
      global.FileReader = jest.fn().mockImplementation(() => {
        const mockReader = {
          result: new ArrayBuffer(8),
          onload: null,
          onerror: null,
          readAsDataURL: jest.fn().mockImplementation(function(this: MockFileReader) {
            setTimeout(() => {
              this.result = new ArrayBuffer(8)
              if (this.onload) {
                this.onload({ target: this } as ProgressEvent<FileReader>)
              }
            }, 0)
          })
        }
        return mockReader
      }) as unknown as typeof FileReader

      const file = createMockFile('content', 'test.jpg', 'image/jpeg')
      
      await expect(fileToDataUrl(file)).rejects.toThrow('파일 읽기에 실패했습니다')
    })
  })

  describe('createCroppedImage', () => {
    const mockCropArea: Area = {
      x: 100,
      y: 100,
      width: 800,
      height: 450,
    }

    it('should create cropped image with default dimensions (16:9)', async () => {
      const imageSrc = 'data:image/jpeg;base64,mockdata'
      const result = await createCroppedImage(imageSrc, mockCropArea)
      
      expect(result).toBeInstanceOf(File)
      expect(result.name).toBe('cropped-screenshot.jpg')
      expect(result.type).toBe('image/jpeg')
      
      // Verify canvas setup
      expect(mockCanvas.width).toBe(1920)
      expect(mockCanvas.height).toBe(1080)
      expect(mockContext.imageSmoothingEnabled).toBe(true)
      expect(mockContext.imageSmoothingQuality).toBe('high')
      
      // Verify drawImage call
      expect(mockContext.drawImage).toHaveBeenCalledWith(
        expect.any(MockImage),
        100, 100, 800, 450, // crop area
        0, 0, 1920, 1080     // target dimensions
      )
    })

    it('should create cropped image with custom dimensions', async () => {
      const imageSrc = 'data:image/jpeg;base64,mockdata'
      const customWidth = 1280
      const customHeight = 720
      
      const result = await createCroppedImage(imageSrc, mockCropArea, customWidth, customHeight)
      
      expect(result).toBeInstanceOf(File)
      expect(mockCanvas.width).toBe(customWidth)
      expect(mockCanvas.height).toBe(customHeight)
      
      expect(mockContext.drawImage).toHaveBeenCalledWith(
        expect.any(MockImage),
        100, 100, 800, 450,
        0, 0, customWidth, customHeight
      )
    })

    it('should handle different crop areas', async () => {
      const imageSrc = 'data:image/jpeg;base64,mockdata'
      const customCropArea: Area = {
        x: 50,
        y: 75,
        width: 1200,
        height: 675,
      }
      
      await createCroppedImage(imageSrc, customCropArea)
      
      expect(mockContext.drawImage).toHaveBeenCalledWith(
        expect.any(MockImage),
        50, 75, 1200, 675,
        0, 0, 1920, 1080
      )
    })

    it('should set correct canvas properties', async () => {
      const imageSrc = 'data:image/jpeg;base64,mockdata'
      
      await createCroppedImage(imageSrc, mockCropArea)
      
      expect(mockContext.imageSmoothingEnabled).toBe(true)
      expect(mockContext.imageSmoothingQuality).toBe('high')
    })

    it('should call toBlob with correct parameters', async () => {
      const imageSrc = 'data:image/jpeg;base64,mockdata'
      
      await createCroppedImage(imageSrc, mockCropArea)
      
      expect(mockCanvas.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        'image/jpeg',
        0.9
      )
    })

    it('should handle canvas context creation failure', async () => {
      mockCanvas.getContext.mockReturnValue(null)
      
      const imageSrc = 'data:image/jpeg;base64,mockdata'
      
      await expect(createCroppedImage(imageSrc, mockCropArea))
        .rejects.toThrow('Canvas context를 생성할 수 없습니다')
    })

    it('should handle image loading failure', async () => {
      // Mock Image to simulate error
      global.Image = jest.fn().mockImplementation(() => {
        const mockImage = {
          crossOrigin: '',
          _src: '',
          onload: null,
          onerror: null,
          set src(value: string) {
            this._src = value
            setTimeout(() => {
              if (this.onerror) {
                (this.onerror as () => void)()
              }
            }, 0)
          },
          get src() {
            return this._src
          }
        }
        return mockImage
      }) as unknown as typeof Image

      const imageSrc = 'invalid-src'
      
      await expect(createCroppedImage(imageSrc, mockCropArea))
        .rejects.toThrow('이미지 로딩에 실패했습니다')
    })

    it('should handle blob creation failure', async () => {
      mockCanvas.toBlob.mockImplementation((callback) => {
        setTimeout(() => {
          callback(null)
        }, 0)
      })

      const imageSrc = 'data:image/jpeg;base64,mockdata'
      
      await expect(createCroppedImage(imageSrc, mockCropArea))
        .rejects.toThrow('이미지 변환에 실패했습니다')
    })

    it('should set crossOrigin to anonymous', async () => {
      const imageSrc = 'data:image/jpeg;base64,mockdata'
      let imageInstance: MockImage | undefined
      
      global.Image = jest.fn().mockImplementation(() => {
        imageInstance = {
          crossOrigin: '',
          src: '',
          onload: null,
          onerror: null,
        }
        
        setTimeout(() => {
          if (imageInstance?.onload) {
            imageInstance.onload()
          }
        }, 0)
        
        return imageInstance
      }) as unknown as typeof Image

      await createCroppedImage(imageSrc, mockCropArea)
      
      expect(imageInstance?.crossOrigin).toBe('anonymous')
    })

    it('should create File with correct properties', async () => {
      const imageSrc = 'data:image/jpeg;base64,mockdata'
      const result = await createCroppedImage(imageSrc, mockCropArea)
      
      expect(result.name).toBe('cropped-screenshot.jpg')
      expect(result.type).toBe('image/jpeg')
      expect(result.lastModified).toBeCloseTo(Date.now(), -3) // Within 1 second
    })

    it('should handle zero-dimension crop areas', async () => {
      const imageSrc = 'data:image/jpeg;base64,mockdata'
      const zeroCropArea: Area = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }
      
      const result = await createCroppedImage(imageSrc, zeroCropArea)
      
      expect(result).toBeInstanceOf(File)
      expect(mockContext.drawImage).toHaveBeenCalledWith(
        expect.any(MockImage),
        0, 0, 0, 0,
        0, 0, 1920, 1080
      )
    })

    it('should handle negative crop coordinates', async () => {
      const imageSrc = 'data:image/jpeg;base64,mockdata'
      const negativeCropArea: Area = {
        x: -50,
        y: -25,
        width: 800,
        height: 450,
      }
      
      const result = await createCroppedImage(imageSrc, negativeCropArea)
      
      expect(result).toBeInstanceOf(File)
      expect(mockContext.drawImage).toHaveBeenCalledWith(
        expect.any(MockImage),
        -50, -25, 800, 450,
        0, 0, 1920, 1080
      )
    })
  })

  describe('integration scenarios', () => {
    it('should work with complete file upload workflow', async () => {
      // 1. Validate file
      const originalFile = createMockFile('content', 'test.jpg', 'image/jpeg', 5 * 1024 * 1024)
      const validation = validateImageFile(originalFile)
      expect(validation.isValid).toBe(true)
      
      // 2. Convert to data URL
      const dataUrl = await fileToDataUrl(originalFile)
      expect(dataUrl).toBe('data:image/jpeg;base64,mockbase64data')
      
      // 3. Create cropped image
      const cropArea: Area = { x: 0, y: 0, width: 1600, height: 900 }
      const croppedFile = await createCroppedImage(dataUrl, cropArea)
      
      expect(croppedFile).toBeInstanceOf(File)
      expect(croppedFile.type).toBe('image/jpeg')
    })

    it('should handle errors gracefully in workflow', async () => {
      // Invalid file type
      const invalidFile = createMockFile('content', 'test.gif', 'image/gif', 1024)
      const validation = validateImageFile(invalidFile)
      expect(validation.isValid).toBe(false)
      
      // Should not proceed with invalid files
      if (!validation.isValid) {
        expect(validation.error).toBe('JPG, PNG, WebP 파일만 업로드 가능합니다')
      }
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle very large crop areas', async () => {
      const imageSrc = 'data:image/jpeg;base64,mockdata'
      const largeCropArea: Area = {
        x: 0,
        y: 0,
        width: 10000,
        height: 5625, // Maintaining 16:9 ratio
      }
      
      const result = await createCroppedImage(imageSrc, largeCropArea)
      expect(result).toBeInstanceOf(File)
    })

    it('should handle very small target dimensions', async () => {
      const imageSrc = 'data:image/jpeg;base64,mockdata'
      const smallCropArea: Area = { x: 0, y: 0, width: 100, height: 56 }
      const result = await createCroppedImage(imageSrc, smallCropArea, 16, 9)
      
      expect(mockCanvas.width).toBe(16)
      expect(mockCanvas.height).toBe(9)
      expect(result).toBeInstanceOf(File)
    })

    it('should handle files with unusual but valid MIME types', () => {
      const jpegVariants = ['image/jpeg', 'image/jpg']
      
      jpegVariants.forEach(mimeType => {
        const file = createMockFile('content', 'test.jpg', mimeType, 1024)
        const result = validateImageFile(file)
        
        if (mimeType === 'image/jpeg') {
          expect(result.isValid).toBe(true)
        } else {
          expect(result.isValid).toBe(false) // Only standard MIME types are allowed
        }
      })
    })
  })
})