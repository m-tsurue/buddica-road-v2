import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { mapboxConfig, validateMapboxToken } from '@/lib/map-config';
import { Spot } from '@/lib/mock-data';
import { MARKER_CONFIG } from '@/lib/constants';

export interface MapboxHookReturn {
  mapContainer: React.RefObject<HTMLDivElement>;
  map: mapboxgl.Map | null;
  isLoaded: boolean;
  error: string | null;
  addMarkers: (spots: Spot[], onSpotSelect?: (spot: Spot) => void, onSpotRemove?: (spot: Spot) => void) => void;
  clearMarkers: () => void;
  flyToSpot: (spot: Spot) => void;
  drawRoute: (spots: Spot[]) => void;
  clearRoute: () => void;
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
        attributionControl: false,
        logoPosition: 'top-left', // ロゴ位置を指定してからCSSで非表示
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
      const navControl = new mapboxgl.NavigationControl({
        showCompass: false,
        showZoom: true,
        visualizePitch: false
      });
      map.current.addControl(navControl, 'top-right');

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

  // マーカークリア（先に定義）
  const clearMarkers = useCallback(() => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  }, []);

  // マーカー追加
  const addMarkers = useCallback((spots: Spot[], onSpotSelect?: (spot: Spot) => void, onSpotRemove?: (spot: Spot) => void) => {
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
      markerElement.style.transition = 'background-color 0.2s ease, box-shadow 0.2s ease';
      markerElement.style.transformOrigin = 'center';
      
      // スポット名の最初の文字を表示
      markerElement.textContent = spot.name.charAt(0);

      // ホバー効果（transformを使わずbox-shadowで強調）
      markerElement.addEventListener('mouseenter', () => {
        markerElement.style.backgroundColor = MARKER_CONFIG.HOVER_COLOR;
        markerElement.style.boxShadow = '0 4px 16px rgba(0,0,0,0.4), 0 0 0 4px rgba(220, 38, 38, 0.3)';
        markerElement.style.zIndex = '1';
      });

      markerElement.addEventListener('mouseleave', () => {
        markerElement.style.backgroundColor = MARKER_CONFIG.COLOR;
        markerElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        markerElement.style.zIndex = '1';
      });

      // マーカー作成（アンカーを中央に設定）
      const marker = new mapboxgl.Marker({
        element: markerElement,
        anchor: 'center'
      })
        .setLngLat([spot.location.lng, spot.location.lat])
        .addTo(map.current!);

      // ポップアップ作成
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        className: 'custom-popup',
        maxWidth: '400px'
      }).setHTML(`
        <div class="p-4" style="width: 320px; min-width: 320px;">
          <img src="${spot.images[0]}" alt="${spot.name}" class="w-full h-24 object-cover rounded-lg mb-3" />
          <h3 class="font-bold text-base mb-2">${spot.name}</h3>
          <div class="max-h-20 overflow-y-auto mb-3">
            <p class="text-sm text-gray-600">${spot.description}</p>
          </div>
          <div class="flex items-center gap-3 text-sm text-gray-500 mb-3">
            <span>⭐ ${spot.rating}</span>
            <span>⏱️ ${spot.duration}</span>
            <span>📍 ${spot.bestTime}</span>
          </div>
          <div class="flex flex-wrap gap-1 mb-4">
            ${spot.tags.slice(0, 3).map(tag => 
              `<span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">${tag}</span>`
            ).join('')}
          </div>
          ${onSpotSelect || onSpotRemove ? `
            <div class="flex gap-2">
              ${onSpotSelect ? `
                <button 
                  class="popup-select-btn flex-1 px-3 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg text-sm font-medium hover:from-orange-700 hover:to-red-700 transition-all" 
                  data-spot-id="${spot.id}"
                >
                  このスポットを選ぶ
                </button>
              ` : ''}
              ${onSpotRemove ? `
                <button 
                  class="popup-remove-btn px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-all border border-red-200" 
                  data-spot-id="${spot.id}"
                  title="このスポットを削除"
                >
                  削除
                </button>
              ` : ''}
            </div>
          ` : ''}
        </div>
      `);

      // マーカークリックでポップアップ表示
      markerElement.addEventListener('click', () => {
        marker.setPopup(popup).togglePopup();
      });

      // ポップアップ内のボタンクリックイベント
      popup.on('open', () => {
        // 選択ボタンのイベント
        if (onSpotSelect) {
          const selectButton = document.querySelector(`.popup-select-btn[data-spot-id="${spot.id}"]`);
          if (selectButton) {
            selectButton.addEventListener('click', () => {
              onSpotSelect(spot);
              popup.remove();
            });
          }
        }
        
        // 削除ボタンのイベント
        if (onSpotRemove) {
          const removeButton = document.querySelector(`.popup-remove-btn[data-spot-id="${spot.id}"]`);
          if (removeButton) {
            removeButton.addEventListener('click', () => {
              onSpotRemove(spot);
              popup.remove();
            });
          }
        }
      });

      markers.current.push(marker);
    });
  }, [isLoaded, clearMarkers]);

  // 特定のスポットに移動
  const flyToSpot = useCallback((spot: Spot) => {
    if (!map.current) return;

    map.current.flyTo({
      center: [spot.location.lng, spot.location.lat],
      zoom: 15,
      duration: 1500,
      essential: true
    });
  }, []);

  // ルート描画
  const drawRoute = useCallback((spots: Spot[]) => {
    if (!map.current || !isLoaded || spots.length < 2) return;

    // 既存のルートを削除
    clearRoute();

    // スポットの座標を取得
    const coordinates = spots.map(spot => [spot.location.lng, spot.location.lat]);

    // 簡単な直線ルートを描画（実際のナビアプリでは道路に沿ったルートを取得）
    const routeData = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates
      }
    };

    // ルートレイヤーのソースを追加
    if (!map.current.getSource('route')) {
      map.current.addSource('route', {
        type: 'geojson',
        data: routeData
      });

      // ルートレイヤーを追加
      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ea580c',
          'line-width': 4,
          'line-opacity': 0.8
        }
      });
    } else {
      // 既存のソースを更新
      const source = map.current.getSource('route') as mapboxgl.GeoJSONSource;
      source.setData(routeData);
    }

    // 全てのスポットが見えるようにズーム調整
    if (coordinates.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach(coord => bounds.extend(coord as [number, number]));
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [isLoaded]);

  // ルートクリア
  const clearRoute = useCallback(() => {
    if (!map.current) return;

    if (map.current.getLayer('route')) {
      map.current.removeLayer('route');
    }
    if (map.current.getSource('route')) {
      map.current.removeSource('route');
    }
  }, []);

  return {
    mapContainer,
    map: map.current,
    isLoaded,
    error,
    addMarkers,
    clearMarkers,
    flyToSpot,
    drawRoute,
    clearRoute,
  };
}