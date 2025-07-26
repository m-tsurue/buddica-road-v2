import { MAP_CONFIG } from './constants';

// Mapbox設定
export const mapboxConfig = {
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '',
  style: MAP_CONFIG.STYLE,
  center: MAP_CONFIG.DEFAULT_CENTER,
  zoom: MAP_CONFIG.DEFAULT_ZOOM,
  maxZoom: MAP_CONFIG.MAX_ZOOM,
  minZoom: MAP_CONFIG.MIN_ZOOM,
  pitch: MAP_CONFIG.PITCH,
  bearing: MAP_CONFIG.BEARING,
  attributionControl: false,
  logoPosition: 'bottom-right' as const,
  antialias: true,
  preserveDrawingBuffer: false,
  interactive: true,
  doubleClickZoom: true,
  boxZoom: true,
  dragRotate: true,
  dragPan: true,
  keyboard: true,
  scrollZoom: true,
  touchZoomRotate: true,
} as const;

// Mapbox アクセストークンの検証
export function validateMapboxToken(): boolean {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  
  if (!token) {
    console.error('Mapbox access token is not set. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env.local file.');
    return false;
  }
  
  if (!token.startsWith('pk.')) {
    console.error('Invalid Mapbox access token format. Token should start with "pk."');
    return false;
  }
  
  return true;
}

// 地図スタイルの選択肢
export const MAP_STYLES = {
  STREETS: 'mapbox://styles/mapbox/streets-v12',
  OUTDOORS: 'mapbox://styles/mapbox/outdoors-v12',
  LIGHT: 'mapbox://styles/mapbox/light-v11',
  DARK: 'mapbox://styles/mapbox/dark-v11',
  SATELLITE: 'mapbox://styles/mapbox/satellite-v9',
  SATELLITE_STREETS: 'mapbox://styles/mapbox/satellite-streets-v12',
} as const;

export type MapStyle = typeof MAP_STYLES[keyof typeof MAP_STYLES];