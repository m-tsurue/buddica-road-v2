import { STORAGE_KEYS } from './constants';
import { safeStorageGet, safeStorageSet } from './error-handling';

// ローカルストレージユーティリティ（エラーハンドリング強化版）
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    const result = safeStorageGet(key, defaultValue);
    return result.success ? result.data : defaultValue;
  },

  set: <T>(key: string, value: T): boolean => {
    const result = safeStorageSet(key, value);
    return result.success;
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove localStorage item "${key}":`, error);
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },
};

// ナビゲーションユーティリティ
export const navigation = {
  push: (path: string): void => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  },

  replace: (path: string): void => {
    if (typeof window !== 'undefined') {
      window.location.replace(path);
    }
  },
};

// 数値ユーティリティ
export const numbers = {
  clamp: (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
  },

  round: (value: number, decimals: number = 0): number => {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  },

  randomBetween: (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
  },
};

// 配列ユーティリティ
export const arrays = {
  unique: <T>(array: T[]): T[] => [...new Set(array)],
  
  shuffle: <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  chunk: <T>(array: readonly T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },
};

// 文字列ユーティリティ
export const strings = {
  truncate: (text: string, maxLength: number): string => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  },

  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  slugify: (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
};

// 遅延実行ユーティリティ
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// 型ガード
export const guards = {
  isNotNull: <T>(value: T | null): value is T => value !== null,
  isNotUndefined: <T>(value: T | undefined): value is T => value !== undefined,
  isString: (value: unknown): value is string => typeof value === 'string',
  isNumber: (value: unknown): value is number => typeof value === 'number' && !isNaN(value),
  isArray: (value: unknown): value is unknown[] => Array.isArray(value),
};