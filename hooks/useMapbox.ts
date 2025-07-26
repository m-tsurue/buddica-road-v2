import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { mapboxConfig, validateMapboxToken } from '@/lib/map-config';
import { Spot } from '@/lib/mock-data';
import { MARKER_CONFIG } from '@/lib/constants';

export interface MapboxHookReturn {
  mapContainer: React.RefObject<HTMLDivElement>;
  map: mapboxgl.Map | null;
  isLoaded: boolean;
  error: string | null;
  addMarkers: (spots: Spot[]) => void;
  clearMarkers: () => void;
  flyToSpot: (spot: Spot) => void;
}

export function useMapbox(): MapboxHookReturn {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 地図初期化
  useEffect(() => {
    // トークン検証
    if (!validateMapboxToken()) {
      setError('Mapbox access token is not configured properly');
      return;
    }

    // コンテナ要素の確認
    if (!mapContainer.current) return;

    // 既存の地図があれば削除
    if (map.current) {
      map.current.remove();
    }

    try {
      // Mapbox GL JSのアクセストークン設定
      mapboxgl.accessToken = mapboxConfig.accessToken;

      // 地図インスタンス作成
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapboxConfig.style,
        center: mapboxConfig.center,
        zoom: mapboxConfig.zoom,
        maxZoom: mapboxConfig.maxZoom,
        minZoom: mapboxConfig.minZoom,
        pitch: mapboxConfig.pitch,
        bearing: mapboxConfig.bearing,
        attributionControl: mapboxConfig.attributionControl,
        antialias: mapboxConfig.antialias,
        preserveDrawingBuffer: mapboxConfig.preserveDrawingBuffer,
        interactive: mapboxConfig.interactive,
        doubleClickZoom: mapboxConfig.doubleClickZoom,
        boxZoom: mapboxConfig.boxZoom,
        dragRotate: mapboxConfig.dragRotate,
        dragPan: mapboxConfig.dragPan,
        keyboard: mapboxConfig.keyboard,
        scrollZoom: mapboxConfig.scrollZoom,
        touchZoomRotate: mapboxConfig.touchZoomRotate,
      });

      // ナビゲーションコントロール追加
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // 地図ロード完了イベント
      map.current.on('load', () => {
        setIsLoaded(true);
        setError(null);
      });

      // エラーハンドリング
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError('Failed to load map');
      });

    } catch (err) {
      console.error('Failed to initialize map:', err);
      setError('Failed to initialize map');
    }

    // クリーンアップ
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // マーカー追加
  const addMarkers = (spots: Spot[]) => {
    if (!map.current || !isLoaded) return;

    // 既存のマーカーをクリア
    clearMarkers();

    spots.forEach((spot) => {
      // マーカー要素作成
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.width = `${MARKER_CONFIG.SIZE}px`;
      markerElement.style.height = `${MARKER_CONFIG.SIZE}px`;
      markerElement.style.borderRadius = '50%';
      markerElement.style.backgroundColor = MARKER_CONFIG.COLOR;
      markerElement.style.border = '3px solid white';
      markerElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      markerElement.style.cursor = 'pointer';
      markerElement.style.display = 'flex';
      markerElement.style.alignItems = 'center';
      markerElement.style.justifyContent = 'center';
      markerElement.style.color = 'white';
      markerElement.style.fontWeight = 'bold';
      markerElement.style.fontSize = '12px';
      markerElement.style.transition = 'all 0.2s ease';
      
      // スポット名の最初の文字を表示
      markerElement.textContent = spot.name.charAt(0);

      // ホバー効果
      markerElement.addEventListener('mouseenter', () => {
        markerElement.style.backgroundColor = MARKER_CONFIG.HOVER_COLOR;
        markerElement.style.transform = 'scale(1.1)';
      });

      markerElement.addEventListener('mouseleave', () => {
        markerElement.style.backgroundColor = MARKER_CONFIG.COLOR;
        markerElement.style.transform = 'scale(1)';
      });

      // マーカー作成
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([spot.location.lng, spot.location.lat])
        .addTo(map.current!);

      // ポップアップ作成
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        className: 'custom-popup'
      }).setHTML(`
        <div class="p-3 max-w-xs">
          <img src="${spot.images[0]}" alt="${spot.name}" class="w-full h-20 object-cover rounded-lg mb-2" />
          <h3 class="font-bold text-sm mb-1">${spot.name}</h3>
          <p class="text-xs text-gray-600 mb-2">${spot.description.slice(0, 80)}...</p>
          <div class="flex items-center gap-2 text-xs text-gray-500">
            <span>⭐ ${spot.rating}</span>
            <span>⏱️ ${spot.duration}</span>
          </div>
          <div class="flex flex-wrap gap-1 mt-2">
            ${spot.tags.slice(0, 2).map(tag => 
              `<span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">${tag}</span>`
            ).join('')}
          </div>
        </div>
      `);

      // マーカークリックでポップアップ表示
      markerElement.addEventListener('click', () => {
        marker.setPopup(popup).togglePopup();
      });

      markers.current.push(marker);
    });
  };

  // マーカークリア
  const clearMarkers = () => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  };

  // 特定のスポットに移動
  const flyToSpot = (spot: Spot) => {
    if (!map.current) return;

    map.current.flyTo({
      center: [spot.location.lng, spot.location.lat],
      zoom: 15,
      duration: 1500,
      essential: true
    });
  };

  return {
    mapContainer,
    map: map.current,
    isLoaded,
    error,
    addMarkers,
    clearMarkers,
    flyToSpot,
  };
}