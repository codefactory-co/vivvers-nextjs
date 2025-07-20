/**
 * Admin 관련 커스텀 에러 클래스들
 * 문자열 기반 에러 매칭을 대체하여 더 견고하고 분리된 에러 처리 제공
 */

export class NotLoggedInError extends Error {
  constructor(message = '로그인이 필요합니다') {
    super(message)
    this.name = 'NotLoggedInError'
  }
}

export class NotAdminError extends Error {
  constructor(message = '관리자 권한이 필요합니다') {
    super(message)
    this.name = 'NotAdminError'
  }
}

export class NotModeratorError extends Error {
  constructor(message = '모더레이터 이상의 권한이 필요합니다') {
    super(message)
    this.name = 'NotModeratorError'
  }
}

export class InsufficientPermissionError extends Error {
  constructor(message = '충분한 권한이 없습니다') {
    super(message)
    this.name = 'InsufficientPermissionError'
  }
}

export class UserNotFoundError extends Error {
  constructor(message = '사용자를 찾을 수 없습니다') {
    super(message)
    this.name = 'UserNotFoundError'
  }
}

export class InvalidUserActionError extends Error {
  constructor(message = '잘못된 사용자 작업입니다') {
    super(message)
    this.name = 'InvalidUserActionError'
  }
}

/**
 * 에러 타입 확인 유틸리티 함수들
 */
export function isNotLoggedInError(error: unknown): error is NotLoggedInError {
  return error instanceof NotLoggedInError
}

export function isNotAdminError(error: unknown): error is NotAdminError {
  return error instanceof NotAdminError
}

export function isNotModeratorError(error: unknown): error is NotModeratorError {
  return error instanceof NotModeratorError
}

export function isInsufficientPermissionError(error: unknown): error is InsufficientPermissionError {
  return error instanceof InsufficientPermissionError
}

export function isUserNotFoundError(error: unknown): error is UserNotFoundError {
  return error instanceof UserNotFoundError
}

export function isInvalidUserActionError(error: unknown): error is InvalidUserActionError {
  return error instanceof InvalidUserActionError
}

/**
 * 에러를 사용자 친화적 메시지로 변환
 */
export function getErrorMessage(error: unknown): string {
  if (isNotLoggedInError(error)) {
    return '로그인이 필요합니다'
  }
  
  if (isNotAdminError(error)) {
    return '관리자 권한이 필요합니다'
  }
  
  if (isNotModeratorError(error)) {
    return '모더레이터 이상의 권한이 필요합니다'
  }
  
  if (isInsufficientPermissionError(error)) {
    return '충분한 권한이 없습니다'
  }
  
  if (isUserNotFoundError(error)) {
    return '사용자를 찾을 수 없습니다'
  }
  
  if (isInvalidUserActionError(error)) {
    return '잘못된 사용자 작업입니다'
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return '알 수 없는 오류가 발생했습니다'
}