// アニメーション関連
export const ANIMATIONS = {
  SWIPE_DURATION: 300,
  SPRING_CONFIG: { stiffness: 300, damping: 30 },
  SCALE_HOVER: 1.05,
  SCALE_TAP: 0.95,
  ROTATION_RANGE: [-30, 30],
  SWIPE_THRESHOLD: 75,
  VELOCITY_THRESHOLD: 300,
} as const;

// UI関連
export const UI = {
  HEADER_HEIGHT: 72,
  CARD_MAX_WIDTH: 400,
  SIDEBAR_WIDTH: 384,
  SEARCH_DEBOUNCE: 300,
  MAX_VISIBLE_CARDS: 3,
  MAX_TAGS_DISPLAY: 3,
} as const;

// レコメンデーション関連
export const RECOMMENDATION = {
  MAX_DISTANCE: 100, // km
  MAX_RESULTS: 10,
  WEIGHTS: {
    DISTANCE: 0.4,
    TAG_SIMILARITY: 0.25,
    VIBES_SIMILARITY: 0.20,
    RATING: 0.15,
  },
} as const;

// ローカルストレージキー
export const STORAGE_KEYS = {
  PRIMARY_DESTINATION: 'primaryDestination',
  SELECTED_SPOTS: 'selectedSpots',
  CURRENT_INDEX: 'currentIndex',
} as const;

// ルート
export const ROUTES = {
  HOME: '/',
  SWIPE: '/swipe',
  ROUTE_EDITOR: '/route-editor',
  MAP: '/map',
  NAVIGATION: '/navigation',
} as const;

// カラーシステム
export const COLORS = {
  PRIMARY: 'orange-600',
  SECONDARY: 'amber-200',
  ACCENT: 'red-600',
  SUCCESS: 'green-600',
  ERROR: 'red-500',
  WARNING: 'yellow-500',
  GRAY: {
    50: 'gray-50',
    100: 'gray-100',
    200: 'gray-200',
    500: 'gray-500',
    600: 'gray-600',
    900: 'gray-900',
  },
} as const;

// 地図関連設定
export const MAP_CONFIG = {
  DEFAULT_CENTER: [139.6917, 35.6895] as [number, number], // 東京
  DEFAULT_ZOOM: 10,
  MAX_ZOOM: 18,
  MIN_ZOOM: 5,
  STYLE: 'mapbox://styles/mapbox/streets-v12',
  PITCH: 0,
  BEARING: 0,
} as const;

// スポットマーカー設定
export const MARKER_CONFIG = {
  SIZE: 40,
  COLOR: '#ea580c', // orange-600
  HOVER_COLOR: '#dc2626', // red-600
  SELECTED_COLOR: '#16a34a', // green-600
  CLUSTER_COLOR: '#f59e0b', // amber-500
} as const;