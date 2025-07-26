import { AppError, Result } from '@/types';

// エラー作成ヘルパー
export function createError(code: string, message: string, details?: unknown): AppError {
  return { code, message, details };
}

// Result型のヘルパー関数
export function success<T>(data: T): Result<T> {
  return { success: true, data };
}

export function failure<E = AppError>(error: E): Result<never, E> {
  return { success: false, error };
}

// 安全な非同期実行
export async function safeAsync<T>(
  fn: () => Promise<T>,
  errorMessage = 'An error occurred'
): Promise<Result<T, AppError>> {
  try {
    const data = await fn();
    return success(data);
  } catch (error) {
    console.error(errorMessage, error);
    return failure(createError(
      'ASYNC_ERROR',
      errorMessage,
      error
    ));
  }
}

// 安全なJSON.parse
export function safeJsonParse<T>(
  json: string
): Result<T, AppError> {
  try {
    const parsed = JSON.parse(json) as T;
    return success(parsed);
  } catch (error) {
    return failure(createError(
      'JSON_PARSE_ERROR',
      'Failed to parse JSON',
      error
    ));
  }
}

// 安全なlocalStorage操作
export function safeStorageGet<T>(
  key: string,
  fallback: T
): Result<T, AppError> {
  try {
    if (typeof window === 'undefined') {
      return success(fallback);
    }
    
    const item = localStorage.getItem(key);
    if (!item) {
      return success(fallback);
    }
    
    const parseResult = safeJsonParse<T>(item);
    return parseResult.success ? parseResult : success(fallback);
  } catch (error) {
    return failure(createError(
      'STORAGE_GET_ERROR',
      `Failed to get item from localStorage: ${key}`,
      error
    ));
  }
}

export function safeStorageSet<T>(
  key: string,
  value: T
): Result<void, AppError> {
  try {
    if (typeof window === 'undefined') {
      return success(undefined);
    }
    
    localStorage.setItem(key, JSON.stringify(value));
    return success(undefined);
  } catch (error) {
    return failure(createError(
      'STORAGE_SET_ERROR',
      `Failed to set item in localStorage: ${key}`,
      error
    ));
  }
}

// エラーバウンダリ用
export class AppErrorBoundary extends Error {
  public readonly code: string;
  public readonly details?: unknown;

  constructor(error: AppError) {
    super(error.message);
    this.name = 'AppErrorBoundary';
    this.code = error.code;
    this.details = error.details;
  }
}

// グローバルエラーハンドラー
export function handleGlobalError(error: unknown): void {
  console.error('Global error:', error);
  
  // ここで実際のエラー報告サービスに送信
  // 例: Sentry, LogRocket, など
  
  // ユーザーに通知（実装予定）
  // showErrorToast('An unexpected error occurred');
}