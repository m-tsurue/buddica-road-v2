import { useCallback, useState, useRef } from 'react';
import { Spot } from '@/lib/mock-data';
import { Location } from '@/contexts/SpotSelectionContext';

interface RouteInfo {
  distance: string;
  duration: string;
  route: google.maps.DirectionsRoute | null;
}

export function useGoogleMaps() {
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  // Directions APIを使用してルートを計算
  const calculateRoute = useCallback(async (
    map: google.maps.Map,
    spots: Spot[],
    startFromCurrentLocation: boolean = false
  ): Promise<RouteInfo | null> => {
    if (!window.google || spots.length === 0) return null;

    setIsCalculatingRoute(true);

    try {
      // DirectionsServiceの初期化
      if (!directionsServiceRef.current) {
        directionsServiceRef.current = new google.maps.DirectionsService();
      }

      // DirectionsRendererの初期化
      if (!directionsRendererRef.current) {
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true, // 独自のマーカーを使用するため
          polylineOptions: {
            strokeColor: '#ea580c',
            strokeWeight: 5,
            strokeOpacity: 0.8
          }
        });
      }

      let origin: google.maps.LatLngLiteral | string;
      let destination: google.maps.LatLngLiteral;
      let waypoints: google.maps.DirectionsWaypoint[] = [];

      if (startFromCurrentLocation) {
        // 現在地から開始
        origin = await getCurrentLocation();
        destination = { lat: spots[spots.length - 1].location.lat, lng: spots[spots.length - 1].location.lng };
        
        // 全てのスポットを経由地として追加
        waypoints = spots.slice(0, -1).map(spot => ({
          location: { lat: spot.location.lat, lng: spot.location.lng },
          stopover: true
        }));
      } else {
        // 最初のスポットから開始
        origin = { lat: spots[0].location.lat, lng: spots[0].location.lng };
        destination = { lat: spots[spots.length - 1].location.lat, lng: spots[spots.length - 1].location.lng };
        
        // 中間のスポットを経由地として追加
        if (spots.length > 2) {
          waypoints = spots.slice(1, -1).map(spot => ({
            location: { lat: spot.location.lat, lng: spot.location.lng },
            stopover: true
          }));
        }
      }

      const request: google.maps.DirectionsRequest = {
        origin,
        destination,
        waypoints,
        optimizeWaypoints: false, // 順序は保持
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: google.maps.TrafficModel.BEST_GUESS
        },
        unitSystem: google.maps.UnitSystem.METRIC,
        region: 'JP'
      };

      const result = await directionsServiceRef.current.route(request);
      
      if (result.routes && result.routes.length > 0) {
        const route = result.routes[0];
        
        // ルートを地図に描画
        directionsRendererRef.current.setDirections(result);

        // 距離と時間を計算
        let totalDistance = 0;
        let totalDuration = 0;

        route.legs.forEach(leg => {
          totalDistance += leg.distance?.value || 0;
          totalDuration += leg.duration?.value || 0;
        });

        const info: RouteInfo = {
          distance: `${(totalDistance / 1000).toFixed(1)}km`,
          duration: formatDuration(totalDuration),
          route
        };

        setRouteInfo(info);
        return info;
      }

      return null;
    } catch (error) {
      console.error('ルート計算エラー:', error);
      return null;
    } finally {
      setIsCalculatingRoute(false);
    }
  }, []);

  // ルートをクリア
  const clearRoute = useCallback(() => {
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }
    setRouteInfo(null);
  }, []);

  // 現在地を取得
  const getCurrentLocation = (): Promise<google.maps.LatLngLiteral> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('現在地取得エラー:', error);
          // エラー時は東京駅をデフォルトとして返す
          resolve({ lat: 35.6812, lng: 139.7671 });
        }
      );
    });
  };

  // 時間をフォーマット
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}時間${minutes}分`;
    }
    return `${minutes}分`;
  };

  // 出発地・到着地を考慮したルート計算
  const calculateRouteWithLocations = useCallback(async (
    map: google.maps.Map,
    spots: Spot[],
    startLocation: Location | null,
    endLocation: Location | null,
    startFromCurrentLocation: boolean = false
  ): Promise<RouteInfo | null> => {
    if (!window.google) return null;

    setIsCalculatingRoute(true);

    try {
      // DirectionsServiceの初期化
      if (!directionsServiceRef.current) {
        directionsServiceRef.current = new google.maps.DirectionsService();
      }

      // DirectionsRendererの初期化
      if (!directionsRendererRef.current) {
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true, // 独自のマーカーを使用するため
          polylineOptions: {
            strokeColor: '#ea580c',
            strokeWeight: 5,
            strokeOpacity: 0.8
          }
        });
      }

      let origin: google.maps.LatLngLiteral | string;
      let destination: google.maps.LatLngLiteral;
      let waypoints: google.maps.DirectionsWaypoint[] = [];

      if (startFromCurrentLocation) {
        // 現在地から開始
        origin = await getCurrentLocation();
      } else if (startLocation) {
        // 設定された出発地から開始
        origin = { lat: startLocation.lat, lng: startLocation.lng };
      } else if (spots.length > 0) {
        // スポットがある場合は最初のスポットから開始
        origin = { lat: spots[0].location.lat, lng: spots[0].location.lng };
      } else {
        return null;
      }

      // 到着地の設定
      if (endLocation) {
        destination = { lat: endLocation.lat, lng: endLocation.lng };
      } else if (spots.length > 0) {
        destination = { lat: spots[spots.length - 1].location.lat, lng: spots[spots.length - 1].location.lng };
      } else {
        return null;
      }

      // 経由地の設定
      if (spots.length > 0) {
        // 出発地が設定されている場合、全てのスポットが経由地
        if (startLocation) {
          waypoints = spots.map(spot => ({
            location: { lat: spot.location.lat, lng: spot.location.lng },
            stopover: true
          }));
        } else {
          // 出発地が未設定の場合、最初のスポット以外が経由地
          waypoints = spots.slice(1).map(spot => ({
            location: { lat: spot.location.lat, lng: spot.location.lng },
            stopover: true
          }));
        }
      }

      const request: google.maps.DirectionsRequest = {
        origin,
        destination,
        waypoints,
        optimizeWaypoints: false,
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: google.maps.TrafficModel.BEST_GUESS
        },
        unitSystem: google.maps.UnitSystem.METRIC,
        region: 'JP'
      };

      const result = await directionsServiceRef.current.route(request);
      
      if (result.routes && result.routes.length > 0) {
        const route = result.routes[0];
        
        // ルートを地図に描画
        directionsRendererRef.current.setDirections(result);

        // 距離と時間を計算
        let totalDistance = 0;
        let totalDuration = 0;

        route.legs.forEach(leg => {
          totalDistance += leg.distance?.value || 0;
          totalDuration += leg.duration?.value || 0;
        });

        const info: RouteInfo = {
          distance: `${(totalDistance / 1000).toFixed(1)}km`,
          duration: formatDuration(totalDuration),
          route
        };

        setRouteInfo(info);
        return info;
      }

      return null;
    } catch (error) {
      console.error('ルート計算エラー:', error);
      return null;
    } finally {
      setIsCalculatingRoute(false);
    }
  }, []);

  return {
    calculateRoute,
    calculateRouteWithLocations,
    clearRoute,
    isCalculatingRoute,
    routeInfo,
    getCurrentLocation
  };
}