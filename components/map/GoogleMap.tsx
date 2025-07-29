'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { GoogleMap as GoogleMapComponent, LoadScript, Marker, InfoWindow, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { Spot } from '@/lib/mock-data';
import { Location } from '@/contexts/SpotSelectionContext';
import { AlertTriangle, Navigation2 } from 'lucide-react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

// 静的な定数として定義（再レンダリング時に変わらないようにする）
const GOOGLE_MAPS_LIBRARIES: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ['places'];

interface GoogleMapProps {
  spots?: Spot[];
  selectedSpot?: Spot | null;
  startLocation?: Location | null;
  endLocation?: Location | null;
  onSpotSelect?: (spot: Spot) => void;
  onSpotRemove?: (spot: Spot) => void;
  height?: string;
  className?: string;
  showRoute?: boolean;
  onRouteCalculated?: (info: { distance: string; duration: string } | null) => void;
  onMarkerClick?: (spot: Spot) => void; // 新しいプロップ：マーカークリック時のハンドラー
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 35.6895,
  lng: 139.6917
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  gestureHandling: 'greedy', // シングルタッチでドラッグ可能にする
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ]
};

export function GoogleMap({ 
  spots = [], 
  selectedSpot,
  startLocation,
  endLocation,
  onSpotSelect,
  onSpotRemove,
  height = '400px',
  className = '',
  showRoute = false,
  onRouteCalculated,
  onMarkerClick
}: GoogleMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Spot | null>(null);
  const [showCurrentLocation, setShowCurrentLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const { calculateRoute, calculateRouteWithLocations, clearRoute, isCalculatingRoute, routeInfo } = useGoogleMaps();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: GOOGLE_MAPS_LIBRARIES
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // ルート計算
  useEffect(() => {
    let isCancelled = false;
    
    const handleRoute = async () => {
      if (isCancelled) return;
      
      // ルート表示条件：スポットが2個以上、または出発地と到着地が両方設定されている
      const shouldShowRoute = map && showRoute && (
        spots.length > 1 || 
        (startLocation && endLocation)
      );
      
      if (shouldShowRoute) {
        const info = await calculateRouteWithLocations(map, spots, startLocation, endLocation, showCurrentLocation);
        if (!isCancelled && onRouteCalculated) {
          onRouteCalculated(info);
        }
      } else if (map && !showRoute) {
        clearRoute();
        if (!isCancelled && onRouteCalculated) {
          onRouteCalculated(null);
        }
      }
    };
    
    handleRoute();
    
    return () => {
      isCancelled = true;
    };
  }, [map, showRoute, spots, startLocation, endLocation, showCurrentLocation]);

  // スポットが変更されたときに境界を調整
  useEffect(() => {
    if (map && spots.length > 1 && !showRoute) {
      const bounds = new window.google.maps.LatLngBounds();
      spots.forEach(spot => {
        bounds.extend({ lat: spot.location.lat, lng: spot.location.lng });
      });
      map.fitBounds(bounds, { top: 60, bottom: 60, left: 60, right: 60 });
    } else if (map && spots.length === 1 && !showRoute) {
      // 1つのスポットの場合は適度なズームレベルで表示
      map.setCenter({ lat: spots[0].location.lat, lng: spots[0].location.lng });
      map.setZoom(14);
    }
  }, [map, spots, showRoute]);

  // 選択されたスポットに移動
  useEffect(() => {
    if (map && selectedSpot) {
      map.panTo({ lat: selectedSpot.location.lat, lng: selectedSpot.location.lng });
      map.setZoom(15);
    }
  }, [map, selectedSpot]);

  // 現在地の取得と表示
  const handleShowCurrentLocation = useCallback(async () => {
    if (!map) return;
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      
      setCurrentLocation(location);
      setShowCurrentLocation(true);
      
      // 現在地を含めてルートを再計算
      if (showRoute && spots.length > 0) {
        const info = await calculateRoute(map, spots, true);
        if (onRouteCalculated) {
          onRouteCalculated(info);
        }
      }
    } catch (error) {
      console.error('現在地の取得に失敗しました:', error);
    }
  }, [map, showRoute, spots.length, calculateRoute, onRouteCalculated]); // spots.lengthのみを監視

  if (loadError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-xl ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-600 max-w-md p-6">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-red-500" />
          <p className="font-medium mb-2">地図の読み込みに失敗しました</p>
          <p className="text-sm mb-3">Google Maps APIキーが設定されていません</p>
        </div>
      </div>
    );
  }

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
      </div>
    );
  }

  return (
    <div 
      className={`relative bg-gray-100 overflow-hidden ${className}`}
      style={{ height }}
    >
      <GoogleMapComponent
        mapContainerStyle={mapContainerStyle}
        zoom={spots.length > 1 ? 12 : spots.length === 1 ? 14 : 10}
        center={spots.length > 0 ? { lat: spots[0].location.lat, lng: spots[0].location.lng } : defaultCenter}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* 出発地マーカー */}
        {startLocation && (
          <Marker
            position={{ lat: startLocation.lat, lng: startLocation.lng }}
            label={{
              text: '出',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '12px'
            }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 20,
              fillColor: '#22c55e',
              fillOpacity: 1,
              strokeColor: 'white',
              strokeWeight: 3,
            }}
            title={startLocation.name}
          />
        )}

        {/* カスタムマーカー */}
        {spots.map((spot, index) => (
          <Marker
            key={spot.id}
            position={{ lat: spot.location.lat, lng: spot.location.lng }}
            label={{
              text: (index + 1).toString(),
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: selectedMarker?.id === spot.id ? 25 : 22,
              fillColor: selectedMarker?.id === spot.id ? '#16a34a' : '#ea580c',
              fillOpacity: 1,
              strokeColor: 'white',
              strokeWeight: 3,
            }}
            onClick={() => {
              if (onMarkerClick) {
                onMarkerClick(spot); // ルート画面ではアクションシートモーダルを開く
              } else {
                setSelectedMarker(spot); // 他の画面では従来のInfoWindowを表示
              }
            }}
            title={spot.name}
          />
        ))}

        {/* 到着地マーカー */}
        {endLocation && (
          <Marker
            position={{ lat: endLocation.lat, lng: endLocation.lng }}
            label={{
              text: '着',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '12px'
            }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 20,
              fillColor: '#ef4444',
              fillOpacity: 1,
              strokeColor: 'white',
              strokeWeight: 3,
            }}
            title={endLocation.name}
          />
        )}

        {/* 現在地マーカー */}
        {showCurrentLocation && currentLocation && (
          <>
            <Marker
              position={currentLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 2,
              }}
              title="現在地"
            />
            {/* 現在地の波紋アニメーション */}
            <Marker
              position={currentLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 16,
                fillColor: '#4285F4',
                fillOpacity: 0.2,
                strokeColor: '#4285F4',
                strokeWeight: 1,
                strokeOpacity: 0.4
              }}
            />
          </>
        )}

        {/* インフォウィンドウ（onMarkerClickが設定されていない場合のみ表示） */}
        {!onMarkerClick && selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.location.lat, lng: selectedMarker.location.lng }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-4" style={{ width: '280px', maxWidth: '280px' }}>
              <img 
                src={selectedMarker.images[0]} 
                alt={selectedMarker.name} 
                className="w-full h-24 object-cover rounded-lg mb-3" 
              />
              <h3 className="font-bold text-base mb-2">{selectedMarker.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{selectedMarker.description}</p>
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                <span>⭐ {selectedMarker.rating}</span>
                <span>⏱️ {selectedMarker.duration}</span>
              </div>
              
              {(onSpotSelect || onSpotRemove) && (
                <div className="flex gap-2">
                  {onSpotSelect && (
                    <button 
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg text-sm font-medium hover:from-orange-700 hover:to-red-700 transition-all"
                      onClick={() => {
                        onSpotSelect(selectedMarker);
                        setSelectedMarker(null);
                      }}
                    >
                      このスポットを選ぶ
                    </button>
                  )}
                  {onSpotRemove && (
                    <button 
                      className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-all border border-red-200"
                      onClick={() => {
                        onSpotRemove(selectedMarker);
                        setSelectedMarker(null);
                      }}
                    >
                      削除
                    </button>
                  )}
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMapComponent>
      
      {/* 情報パネル - ルート表示時は非表示（地図を見やすくするため） */}
      {!showRoute && (
        <div className="absolute top-4 left-4 space-y-2">
          {spots.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-700">
                {spots.length}箇所のスポット
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* 現在地ボタン */}
      {showRoute && (
        <button
          onClick={handleShowCurrentLocation}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:bg-white transition-colors"
          title="現在地から開始"
        >
          <Navigation2 className={`w-5 h-5 ${showCurrentLocation ? 'text-blue-600' : 'text-gray-600'}`} />
        </button>
      )}
      
      {/* ローディング表示 */}
      {isCalculatingRoute && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">ルートを計算中...</p>
          </div>
        </div>
      )}
    </div>
  );
}