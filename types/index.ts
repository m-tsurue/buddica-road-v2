// 共通の型定義
export type Result<T, E = Error> = {
  success: true;
  data: T;
} | {
  success: false;
  error: E;
};

// ページの状態管理
export type PageState = 'loading' | 'idle' | 'error';

// エラーハンドリング
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

// ナビゲーション関連
export interface NavigationOptions {
  replace?: boolean;
  shallow?: boolean;
}

// アニメーション関連
export interface AnimationConfig {
  duration: number;
  ease: string;
}

// UI状態
export interface UIState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

// フォーム関連
export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

// 検索関連
export interface SearchState {
  query: string;
  results: unknown[];
  isSearching: boolean;
  hasResults: boolean;
}

// ローカルストレージのデータ型
export interface StorageData {
  primaryDestination: import('@/lib/mock-data').Spot | null;
  selectedSpots: import('@/lib/mock-data').Spot[];
  currentIndex: number;
}