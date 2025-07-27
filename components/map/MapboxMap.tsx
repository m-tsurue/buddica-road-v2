'use client';

import { useEffect } from 'react';
import { useMapbox } from '@/hooks/useMapbox';
import { Spot } from '@/lib/mock-data';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AlertTriangle } from 'lucide-react';

// Mapbox CSS をクライアントサイドでのみ読み込み
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxMapProps {
  spots?: Spot[];
  selectedSpot?: Spot | null;
  onSpotSelect?: (spot: Spot) => void;
  onSpotRemove?: (spot: Spot) => void;
  height?: string;
  className?: string;
  showRoute?: boolean;
}

export function MapboxMap({ 
  spots = [], 
  selectedSpot,
  onSpotSelect,
  onSpotRemove,
  height = '400px',
  className = '',
  showRoute = false
}: MapboxMapProps) {
  const { mapContainer, map, isLoaded, error, addMarkers, clearMarkers, flyToSpot, drawRoute, clearRoute } = useMapbox();

  // スポットデータが変更された時にマーカーを更新
  useEffect(() => {
    if (isLoaded && spots.length > 0) {
      addMarkers(spots, onSpotSelect, onSpotRemove);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, spots, onSpotSelect, onSpotRemove]);

  // 選択されたスポットに移動
  useEffect(() => {
    if (selectedSpot && isLoaded) {
      flyToSpot(selectedSpot);
    }
  }, [selectedSpot, isLoaded, flyToSpot]);

  // ルート描画
  useEffect(() => {
    if (isLoaded && showRoute && spots.length > 1) {
      drawRoute(spots);
    } else if (isLoaded && !showRoute) {
      clearRoute();
    }
  }, [isLoaded, showRoute, spots, drawRoute, clearRoute]);

  // エラー表示
  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-xl ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-600 max-w-md p-6">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-red-500" />
          <p className="font-medium mb-2">地図の読み込みに失敗しました</p>
          <p className="text-sm mb-3">{error}</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-left">
            <p className="text-xs font-medium text-yellow-800 mb-2">解決方法:</p>
            <ol className="text-xs text-yellow-700 space-y-1">
              <li>1. <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="underline">Mapbox</a>でアカウント作成</li>
              <li>2. アクセストークンをコピー</li>
              <li>3. .env.localファイルを更新</li>
              <li>4. 開発サーバーを再起動</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // ローディング表示
  if (!isLoaded) {
    return (
      <div 
        className={`relative bg-gray-100 rounded-xl overflow-hidden ${className}`}
        style={{ height }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">地図を読み込み中...</p>
          </div>
        </div>
        {/* 地図コンテナは非表示だが DOM に存在させておく */}
        <div
          ref={mapContainer}
          className="w-full h-full opacity-0"
        />
      </div>
    );
  }

  return (
    <div 
      className={`relative bg-gray-100 rounded-xl overflow-hidden ${className}`}
      style={{ height }}
    >
      <div
        ref={mapContainer}
        className="w-full h-full"
      />
      
      {/* スポット数の表示 */}
      {spots.length > 0 && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-700">
            {spots.length}箇所のスポット
          </p>
        </div>
      )}
    </div>
  );
}